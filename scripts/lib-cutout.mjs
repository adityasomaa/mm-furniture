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
 * After the mask is settled the edge is finished in three steps, each of which fixes
 * something the previous one exposed:
 *
 *  - erode: pull the mask in a couple of pixels to drop JPEG's intermediate ring.
 *  - bleed: replace the RGB hidden under alpha 0 with the nearest subject colour, so a
 *    browser downscaling the plate cannot average white backdrop into the silhouette.
 *    This was the actual cause of the halo; the erode alone did not fix it.
 *  - feather: blur the alpha slightly, or the cut aliases into a jagged line.
 *
 * The plate is then trimmed to the subject and re-centred (see `reframe`).
 */
export async function cutout(src, { edgeTol = 12, minPocket = 400, feather = 0.8, erode = 2 } = {}) {
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

  // Grow the background inward before cutting.
  //
  // JPEG leaves a ring of intermediate pixels where the subject meets the backdrop: not
  // white enough for the flood to claim, not subject either. Left in, they survive as a
  // pale outline that is invisible on a white plate but reads as a halo the moment the
  // piece stands on a warm ground, which is exactly what the hero does.
  //
  // Depth is measured, not guessed: at 1px a residual fringe still overshot the
  // background by ~20-30 luminance at the silhouette. See the erode sweep in the commit
  // that introduced this. A couple of pixels at ~1000px costs nothing real off the piece.
  let grown = Uint8Array.from(bg);
  for (let pass = 0; pass < erode; pass++) {
    const next = Uint8Array.from(grown);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (grown[i]) continue;
        const touchesBg =
          (x > 0 && grown[i - 1]) ||
          (x < w - 1 && grown[i + 1]) ||
          (y > 0 && grown[i - w]) ||
          (y < h - 1 && grown[i + w]);
        if (touchesBg) next[i] = 1;
      }
    }
    grown = next;
  }

  const alpha = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) alpha[i] = grown[i] ? 0 : 255;

  // Bleed the subject's colour outward underneath the transparency.
  //
  // A cut-out stores RGB even where alpha is 0, and here that RGB is still the white
  // backdrop. Nothing shows it at 1:1, but the moment a browser scales the image down it
  // resamples RGB and alpha as separate channels, so pixels just outside the silhouette
  // average white into the edge and the piece picks up a pale outline. The file itself
  // looks perfect when inspected; the halo only exists on screen, which is what made it
  // confusing to chase.
  //
  // Replacing the hidden RGB with the nearest subject colour means any interpolation at
  // the edge pulls in more subject instead of more backdrop. Standard practice for
  // textures with alpha, and it costs nothing at runtime.
  bleedEdges(raw, grown, w, h, 4);

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

  const cut = await sharp(raw, { raw: { width: w, height: h, channels: 3 } })
    .joinChannel(soft, { raw: { width: w, height: h, channels: 1 } })
    .png()
    .toBuffer();

  const png = await reframe(cut, bg, w, h);

  // Dimensions of the REFRAMED canvas, not the original. The caller sizes the derivative
  // ladder off this, and the reframe changes it (the canvas is the subject's longest side
  // divided by SUBJECT_FILL, so it can be larger or smaller than the source frame).
  // Returning `w` here would build the ladder against a width that no longer exists.
  const out = await sharp(png).metadata();

  return { png, keptRatio: kept / (w * h), width: out.width, height: out.height };
}

/**
 * Dilates subject colour into the transparent region, `passes` pixels deep.
 *
 * Mutates `raw` in place. Only touches pixels that are already background, so the
 * visible subject is untouched: this changes only what sits underneath alpha 0, which is
 * invisible until a resampler mixes it in.
 */
function bleedEdges(raw, bgMask, w, h, passes) {
  let frontier = Uint8Array.from(bgMask); // 1 = still background, needs a colour
  for (let pass = 0; pass < passes; pass++) {
    const filled = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (!frontier[i]) continue;
        // Average the colour of any neighbour that already carries subject colour.
        let r = 0;
        let g = 0;
        let b = 0;
        let n = 0;
        const take = (j) => {
          if (frontier[j]) return;
          r += raw[j * 3];
          g += raw[j * 3 + 1];
          b += raw[j * 3 + 2];
          n++;
        };
        if (x > 0) take(i - 1);
        if (x < w - 1) take(i + 1);
        if (y > 0) take(i - w);
        if (y < h - 1) take(i + w);
        if (n === 0) continue;
        filled.push([i, (r / n) | 0, (g / n) | 0, (b / n) | 0]);
      }
    }
    if (filled.length === 0) break;
    for (const [i, r, g, b] of filled) {
      raw[i * 3] = r;
      raw[i * 3 + 1] = g;
      raw[i * 3 + 2] = b;
      frontier[i] = 0; // now carries colour, can seed the next pass
    }
  }
}

/**
 * Trims to the subject and re-centres it on a square canvas.
 *
 * The originals are framed inconsistently: one sofa sits low and left with a wide margin,
 * the next is cropped tight and off-centre. Nobody notices that while each photo is
 * boxed in its own white rectangle, because the rectangle hides the drift. Cutting the
 * backdrop away removes the box and exposes it, and a grid of subjects each floating at
 * a different size and offset reads as untidy.
 *
 * Only possible *because* of the key: alpha gives an exact bounding box for the
 * furniture, which the original photo never did.
 *
 * SUBJECT_FILL is the fraction of the canvas the longest side occupies. Uniform across
 * every plate, so a chair and a five-seat sofa are presented at the same visual weight.
 */
const SUBJECT_FILL = 0.86;

async function reframe(png, bg, w, h) {
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (bg[y * w + x]) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  // Nothing survived the key: hand back the original rather than crop to nothing.
  if (maxX < 0 || maxY < 0) return png;

  const sw = maxX - minX + 1;
  const sh = maxY - minY + 1;
  const subject = await sharp(png).extract({ left: minX, top: minY, width: sw, height: sh }).toBuffer();

  // Square canvas sized off the subject's longest side, so the scale factor is the same
  // for every plate and nothing is ever enlarged past its native pixels.
  const canvas = Math.round(Math.max(sw, sh) / SUBJECT_FILL);
  const fitted = await sharp(subject)
    .resize(Math.round(canvas * SUBJECT_FILL), Math.round(canvas * SUBJECT_FILL), {
      fit: 'inside',
      withoutEnlargement: true,
      kernel: 'lanczos3',
    })
    .toBuffer();
  const fittedMeta = await sharp(fitted).metadata();

  return sharp({
    create: { width: canvas, height: canvas, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      {
        input: fitted,
        left: Math.round((canvas - fittedMeta.width) / 2),
        top: Math.round((canvas - fittedMeta.height) / 2),
      },
    ])
    .png()
    .toBuffer();
}
