import sharp from 'sharp';

/**
 * Keys the studio backdrop out of a catalogue plate, leaving the furniture on alpha.
 *
 * Why this exists: every one of MM's 240 photographs is a product shot on a white
 * cyclorama. Placed on the site's warm paper, each one reads as a white rectangle
 * floating on beige, which is exactly what the hero looked like before this.
 *
 * Two passes, because one is not enough and the obvious one is actively wrong:
 *
 *  1. Flood fill inward from the border at a loose tolerance. Crucially NOT "delete
 *     every near-white pixel": a lot of these sofas have white or cream upholstery and
 *     a global threshold punches holes straight through the cushions. Requiring a pixel
 *     to be reachable from the frame edge protects anything enclosed by the subject.
 *
 *  2. Then remove enclosed pockets of backdrop: the gap inside a chair's backrest is
 *     unreachable from the border, so pass 1 leaves it opaque white.
 *
 *     This pass is where the first attempt drew blood. At a "near-white" tolerance it
 *     bit ragged chunks out of white cushions. Measuring the actual pixels settled it:
 *     a real enclosed pocket is EXACTLY 255 and enormous (39k px in one chair), while
 *     blown cushion highlights are 245-254 and scattered in clumps of a few dozen. So
 *     the pass takes only exact-255 neutral pixels, and only in connected components
 *     above a size floor. Both conditions, not either.
 *
 * The alpha is then blurred slightly. Without it the cut edge aliases into a hard
 * jagged line against a coloured background.
 */
export async function cutout(src, { edgeTol = 12, minPocket = 400, feather = 0.8 } = {}) {
  const { data: raw, info } = await sharp(src)
    .rotate()
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;

  // Bright AND neutral. The saturation guard stops it eating pale timber, which can be
  // bright but is never neutral.
  const neutral = (i, tol) => {
    const r = raw[i * 3];
    const g = raw[i * 3 + 1];
    const b = raw[i * 3 + 2];
    return (
      r > 255 - tol && g > 255 - tol && b > 255 - tol && Math.max(r, g, b) - Math.min(r, g, b) < 10
    );
  };

  const bg = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);

  while (stack.length) {
    const i = stack.pop();
    if (bg[i] || !neutral(i, edgeTol)) continue;
    bg[i] = 1;
    const x = i % w;
    const y = (i / w) | 0;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - w);
    if (y < h - 1) stack.push(i + w);
  }

  // Pass 2: enclosed pockets. Exact-255 neutral only, and only in components big enough
  // to be backdrop rather than a specular highlight on upholstery.
  const seen = new Uint8Array(w * h);
  const isPure = (i) => !bg[i] && !seen[i] && neutral(i, 1);

  for (let start = 0; start < w * h; start++) {
    if (!isPure(start)) continue;

    const comp = [];
    const q = [start];
    seen[start] = 1;
    while (q.length) {
      const i = q.pop();
      comp.push(i);
      const x = i % w;
      const y = (i / w) | 0;
      const push = (j) => {
        if (isPure(j)) {
          seen[j] = 1;
          q.push(j);
        }
      };
      if (x > 0) push(i - 1);
      if (x < w - 1) push(i + 1);
      if (y > 0) push(i - w);
      if (y < h - 1) push(i + w);
    }

    if (comp.length >= minPocket) {
      for (const i of comp) bg[i] = 1;
    }
  }

  const alpha = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) alpha[i] = bg[i] ? 0 : 255;

  // `toColourspace('b-w')` is load-bearing: sharp promotes a 1-channel raw input to
  // 3-channel sRGB through the pipeline, and joinChannel would then read 3x the bytes
  // it expects and produce garbage alpha.
  const soft = await sharp(alpha, { raw: { width: w, height: h, channels: 1 } })
    .blur(feather)
    .toColourspace('b-w')
    .raw()
    .toBuffer();

  let kept = 0;
  for (let i = 0; i < w * h; i++) if (!bg[i]) kept++;

  const png = await sharp(raw, { raw: { width: w, height: h, channels: 3 } })
    .joinChannel(soft, { raw: { width: w, height: h, channels: 1 } })
    .png()
    .toBuffer();

  return { png, keptRatio: kept / (w * h), width: w, height: h };
}
