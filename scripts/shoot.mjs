import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';

/**
 * Screenshots a list of routes at desktop and mobile, and reports any console error or
 * failed request it saw on the way.
 *
 * The point is verification, not decoration: a page that 200s can still be missing every
 * image, and the only way to know is to look. Pass routes as arguments.
 *
 *   node scripts/shoot.mjs /catalog /catalog/ruang-makan
 */
const CHROME =
  process.env.CHROME ?? String.raw`.cache\chrome\chrome\win64-150.0.7871.124\chrome-win64\chrome.exe`;
const BASE = process.env.BASE ?? 'http://localhost:3111';
const OUT = '.cache/shots';

const routes = process.argv.slice(2);
if (!routes.length) throw new Error('pass at least one route');

await mkdir(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });

for (const route of routes) {
  for (const [tag, vw, vh] of [
    ['desktop', 1440, 900],
    ['mobile', 390, 844],
  ]) {
    const page = await browser.newPage();
    await page.setViewport({ width: vw, height: vh, deviceScaleFactor: 1 });

    const problems = [];
    page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
    page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) => problems.push(`failed: ${r.url()}`));
    page.on('response', (r) => r.status() >= 400 && problems.push(`${r.status()}: ${r.url()}`));

    await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 });
    // The curtain reveal and the first image decode both land after networkidle.
    await new Promise((r) => setTimeout(r, 1200));

    // Walk the page to the bottom before judging anything. Every plate below the fold is
    // loading="lazy", so on a fresh load it legitimately reports complete=false and
    // naturalWidth=0 — checking here without scrolling flags a healthy catalogue as
    // entirely broken. Scrolling also makes the fullPage screenshot show real images
    // rather than empty boxes.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Now a failure is real: a 200 page full of broken plates looks identical to a
    // healthy one in the status code.
    const broken = await page.$$eval('img', (imgs) =>
      imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
    );

    // A fullPage capture stretches the viewport to the whole document, which breaks two
    // things that are perfectly correct in a real 900px window. Both are capture
    // artifacts, and both hide real content, so neutralise them before shooting.
    //
    //  - The curtain parks at translate-y-full, one viewport below the fold. Fixed
    //    elements keep their viewport slot while the canvas grows, so it paints as an
    //    espresso band across the middle of the shot.
    //  - `.reveal` is a scroll-driven animation (animation-timeline: view()). With the
    //    scrollport as tall as the document, elements resolve to the wrong point on
    //    their timeline and whole sections come out at opacity 0 — verified against a
    //    real viewport, where the same elements compute to opacity 1.
    if (tag === 'desktop') {
      await page.evaluate(() => {
        const c = document.querySelector('[data-curtain]');
        if (c && c.dataset.curtain === 'idle') c.style.display = 'none';

        const style = document.createElement('style');
        style.textContent = '.reveal { animation: none !important; opacity: 1 !important; transform: none !important; }';
        document.head.append(style);
      });
      await new Promise((r) => setTimeout(r, 300));
    }

    const name = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_');
    await page.screenshot({ path: `${OUT}/${name}-${tag}.png`, fullPage: tag === 'desktop' });

    const bad = [...new Set([...problems, ...broken.map((b) => `broken img: ${b}`)])];
    console.log(`${bad.length ? 'FAIL' : 'ok  '}  ${route} (${tag})`);
    for (const b of bad.slice(0, 6)) console.log(`        ${b}`);
    await page.close();
  }
}

await browser.close();
