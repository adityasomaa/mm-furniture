// Verifies every text/background pairing the site actually ships against WCAG 2.1.
// Exits non-zero on failure so `npm run build` refuses to ship an unreadable palette,
// rather than printing a warning nobody reads.
//
// Tokens are duplicated from globals.css on purpose: this script is the independent
// check. If it imported the same source it was verifying, it would only ever agree
// with itself.

const TOKENS = {
  ink: [0.26, 0.028, 212],
  'ink-deep': [0.19, 0.024, 212],
  'ink-raised': [0.33, 0.028, 211],
  'ink-hair': [0.42, 0.026, 211],
  copper: [0.7, 0.115, 45],
  'copper-deep': [0.5, 0.1, 40],
  bone: [0.965, 0.006, 75],
  'bone-shade': [0.932, 0.009, 72],
  graphite: [0.3, 0.014, 212],
  muted: [0.51, 0.014, 212],
  'muted-on-ink': [0.74, 0.018, 212],
};

const lin2srgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

function oklchToRgb(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.max(0, Math.min(1, lin2srgb(v))));
}

// WCAG relative luminance wants linear-light channels back again.
const channel = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

function luminance([r, g, b]) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(fg, bg) {
  const a = luminance(oklchToRgb(...TOKENS[fg]));
  const b = luminance(oklchToRgb(...TOKENS[bg]));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum, what it is]
const PAIRS = [
  ['graphite', 'bone', 4.5, 'body copy on bone'],
  ['graphite', 'bone-shade', 4.5, 'body copy on bone-shade'],
  ['muted', 'bone', 4.5, 'secondary copy on bone'],
  ['muted', 'bone-shade', 4.5, 'secondary copy on bone-shade'],
  ['ink', 'bone', 4.5, 'headings on bone'],
  ['ink', 'bone-shade', 4.5, 'headings on bone-shade'],
  ['copper-deep', 'bone', 4.5, 'accent label on bone'],
  ['copper-deep', 'bone-shade', 4.5, 'accent label on bone-shade'],
  ['bone', 'ink', 4.5, 'headings on ink'],
  ['muted-on-ink', 'ink', 4.5, 'secondary copy on ink'],
  ['muted-on-ink', 'ink-deep', 4.5, 'footer copy on ink-deep'],
  ['bone', 'ink-deep', 4.5, 'footer headings on ink-deep'],
  ['copper', 'ink', 4.5, 'accent label on ink'],
  ['copper', 'ink-deep', 4.5, 'accent label on ink-deep'],
  ['ink-deep', 'copper', 4.5, 'CTA text on copper'],
  ['ink', 'copper', 4.5, 'CTA text on copper (alt)'],
  ['copper', 'ink-raised', 3.0, 'accent on raised panel (large only)'],
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
