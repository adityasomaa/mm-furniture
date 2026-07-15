// Verifies every text/background pairing the site actually ships against WCAG 2.1.
// Exits non-zero on failure so `npm run build` refuses to ship an unreadable palette,
// rather than printing a warning nobody reads.
//
// This matters more now than it did with the old high-contrast palette: the brief asked
// for softer, less harsh colour, and "soft" is exactly how a palette drifts under AA
// without anyone noticing. Softness is allowed to cost contrast right up to the floor
// and not one step past it.
//
// Tokens are duplicated from globals.css on purpose: this script is the independent
// check. If it imported the same source it was verifying, it would only ever agree
// with itself.

const TOKENS = {
  espresso: [0.24, 0.03, 35],
  bark: [0.32, 0.042, 35],
  brand: [0.386, 0.051, 35],
  clay: [0.5, 0.048, 35],
  sand: [0.66, 0.038, 35],
  linen: [0.86, 0.018, 35],
  shell: [0.945, 0.008, 35],
  paper: [0.985, 0.003, 35],
};

const lin2srgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

function oklchToRgb(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.max(0, Math.min(1, lin2srgb(v))));
}

const channel = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

function ratio(fg, bg) {
  const a = luminance(oklchToRgb(...TOKENS[fg]));
  const b = luminance(oklchToRgb(...TOKENS[bg]));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum, what it is]
// 4.5 = body text. 3.0 = large text (>=24px or >=19px bold) and UI borders.
const PAIRS = [
  ['bark', 'paper', 4.5, 'body copy on paper'],
  ['bark', 'shell', 4.5, 'body copy on shell'],
  ['bark', 'linen', 4.5, 'body copy on linen'],
  ['brand', 'paper', 4.5, 'headings / accent on paper'],
  ['brand', 'shell', 4.5, 'headings / accent on shell'],
  ['clay', 'paper', 4.5, 'secondary copy on paper'],
  ['clay', 'shell', 4.5, 'secondary copy on shell'],
  ['paper', 'espresso', 4.5, 'body copy on espresso'],
  ['paper', 'brand', 4.5, 'CTA label on brand'],
  ['linen', 'espresso', 4.5, 'secondary copy on espresso'],
  ['linen', 'brand', 4.5, 'secondary copy on brand'],
  ['sand', 'espresso', 4.5, 'muted copy on espresso'],
  ['shell', 'brand', 4.5, 'copy on brand'],
  ['espresso', 'linen', 4.5, 'copy on linen chip'],
  ['espresso', 'sand', 4.5, 'copy on sand chip'],
  // Large-text and non-text pairings ride the 3:1 floor.
  ['sand', 'brand', 3.0, 'muted on brand (large only)'],
  ['clay', 'linen', 3.0, 'label on linen (large only)'],
];

let failed = 0;
for (const [fg, bg, min, what] of PAIRS) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${fg} on ${bg}  — ${what}`,
  );
}

console.log(`\n${PAIRS.length - failed}/${PAIRS.length} pairings pass.`);
if (failed) {
  console.error(`\n${failed} contrast failure(s). Fix the tokens in globals.css and DESIGN.md.`);
  process.exit(1);
}
