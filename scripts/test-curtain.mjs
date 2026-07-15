// Dev-only behavioural check for the curtain transition. Not part of the build.
//
// The curtain's whole job is that the user never sees the route swap or the scroll
// reset. That is invisible in a static screenshot, so this drives a real navigation and
// asserts the sequence.
import puppeteer from 'puppeteer-core';

// Point CHROME at any Chrome/Chromium binary. Default is the Chrome for Testing that
// `npx @puppeteer/browsers install chrome@stable --path .cache/chrome` drops here.
const CHROME =
  process.env.CHROME ?? String.raw`.cache\chrome\chrome\win64-150.0.7871.124\chrome-win64\chrome.exe`;
const BASE = process.env.BASE ?? 'http://localhost:3210';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

/**
 * Reads the curtain's real on-screen position.
 *
 * Deliberately getBoundingClientRect, not getComputedStyle().transform. Tailwind v4
 * emits the `translate` property rather than `transform`, so reading `transform` returns
 * "none" and parses to an identity matrix — which reports ty=0 for every phase and makes
 * a broken curtain look like a covering one. Geometry cannot lie.
 */
const curtain = () =>
  page.evaluate(() => {
    const c = document.querySelector('[data-curtain]');
    if (!c) return { phase: 'MISSING', top: null, covers: false };
    const r = c.getBoundingClientRect();
    return {
      phase: c.getAttribute('data-curtain'),
      top: Math.round(r.top),
      // Covering means it actually spans the viewport, not that a class name says so.
      covers: r.top <= 1 && r.bottom >= window.innerHeight - 1,
    };
  });

const fails = [];
const check = (name, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!ok) fails.push(name);
};

await page.goto(BASE + '/', { waitUntil: 'load' });

// 1. Intro curtain covers on first paint.
await new Promise((r) => setTimeout(r, 250));
const a = await curtain();
check('intro curtain covers the page', a.phase === 'intro' && a.covers, `phase=${a.phase} top=${a.top} covers=${a.covers}`);
await page.screenshot({ path: '.cache/curtain-1-intro.png' });

// 2. It reveals and parks off-screen.
await new Promise((r) => setTimeout(r, 3200));
const b = await curtain();
check('curtain reveals and parks off-screen', b.phase === 'idle' && !b.covers, `phase=${b.phase} top=${b.top} covers=${b.covers}`);

// 3. Scroll away, then navigate.
await page.evaluate(() => window.scrollTo(0, 1500));
await new Promise((r) => setTimeout(r, 700));
const scrolledY = await page.evaluate(() => window.scrollY);
check('page scrolled before navigating', scrolledY > 400, `scrollY=${scrolledY}`);

const urlBefore = page.url();
await page.evaluate(() => {
  const link = [...document.querySelectorAll('header a')].find(
    (el) => el.getAttribute('href') === '/about',
  );
  link.click();
});

// 4. The load-bearing invariant: the curtain must be FULLY covering before the route
//    swaps. Sampling at one arbitrary instant cannot show that (the close takes 780ms,
//    so an early sample catches it mid-travel and proves nothing). Poll instead and
//    compare the two moments.
// Sampled inside the page on rAF rather than over CDP. A round-trip per sample is
// ~20-40ms, which is the same order as the race being measured, so an out-of-process
// poll cannot resolve it. This records both moments against one clock, in one frame
// loop, and reports them afterwards.
const race = await page.evaluate((before) => {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const out = { coveredAt: null, swappedAt: null, sawMidTravel: false };
    const tick = () => {
      const c = document.querySelector('[data-curtain]');
      const r = c.getBoundingClientRect();
      if (r.top > 1 && r.top < window.innerHeight - 1) out.sawMidTravel = true;
      if (out.coveredAt === null && r.top <= 1 && r.bottom >= window.innerHeight - 1) {
        out.coveredAt = Math.round(performance.now() - t0);
      }
      if (out.swappedAt === null && location.pathname !== before) {
        out.swappedAt = Math.round(performance.now() - t0);
      }
      if ((out.coveredAt !== null && out.swappedAt !== null) || performance.now() - t0 > 2500) {
        resolve(out);
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, new URL(urlBefore).pathname);

const { coveredAt, swappedAt, sawMidTravel } = race;
await page.screenshot({ path: '.cache/curtain-2-mid.png' });

check('curtain animates rather than snapping', sawMidTravel, 'observed mid-travel positions');
check('curtain fully covered the page', coveredAt !== null, `at +${coveredAt}ms`);
check(
  'route swapped only AFTER the curtain covered',
  coveredAt !== null && swappedAt !== null && coveredAt <= swappedAt,
  `covered +${coveredAt}ms, swapped +${swappedAt}ms`,
);

// 5. Landed, revealed, at the top.
await new Promise((r) => setTimeout(r, 2800));
const d = await curtain();
const finalY = await page.evaluate(() => window.scrollY);
check('navigated to /about', page.url().endsWith('/about'), page.url());
check('new page starts at the top', finalY === 0, `scrollY=${finalY}`);
check('curtain returned to idle', d.phase === 'idle', `phase=${d.phase}`);
await page.screenshot({ path: '.cache/curtain-3-done.png' });

await browser.close();
console.log(`\n${fails.length === 0 ? 'ALL PASS' : fails.length + ' FAILED: ' + fails.join(', ')}`);
process.exit(fails.length ? 1 : 0);
