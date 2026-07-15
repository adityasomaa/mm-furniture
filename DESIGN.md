# DESIGN.md — MM Furniture Globalindo

## Palette: the logo brown and white, nothing else

The client's instruction was explicit: **brown from the logo, and white. That is the
whole palette.** Also: nothing harsh, nothing garish.

The brown is sampled pixel-wise from the monogram in `mm-furniture-logo-horizontal.png`:
`#5c3a31` → `oklch(0.386 0.051 35)`. Every other colour on the site is that same hue (35)
walked through lightness at low chroma. There is no second hue anywhere.

| Role | Token | OKLCH | sRGB | Use |
|---|---|---|---|---|
| Espresso | `--color-espresso` | `oklch(0.24 0.03 35)` | `#2c1a15` | Dark sections, curtain, footer |
| Bark | `--color-bark` | `oklch(0.32 0.042 35)` | `#462b24` | Body text on light |
| Brand | `--color-brand` | `oklch(0.386 0.051 35)` | `#5c3a31` | **The logo brown.** Headings, CTAs |
| Clay | `--color-clay` | `oklch(0.50 0.048 35)` | `#7c5a51` | Secondary text |
| Sand | `--color-sand` | `oklch(0.66 0.038 35)` | `#a88a83` | Text on dark, decorative |
| Linen | `--color-linen` | `oklch(0.86 0.018 35)` | `#dccdc9` | Hairlines, soft fills |
| Shell | `--color-shell` | `oklch(0.945 0.008 35)` | `#f2ebe9` | Alternating band |
| Paper | `--color-paper` | `oklch(0.985 0.003 35)` | `#fcf9f9` | The "white" |

### Why it does not read as harsh

Three deliberate moves, all of which cost contrast and none of which cost legibility:

1. **One hue.** Nothing can clash when there is nothing to clash with.
2. **Low chroma throughout** (0.003 to 0.051). The brand brown is the most saturated
   thing on the site and it is still only 0.051. That is what stops it going garish.
3. **No black, no white.** Text is `bark`, not `#000`. Ground is `paper`, not `#fff`.
   The hard edge between pure extremes is most of what "harsh" actually means.

**But softness is exactly how a palette drifts under AA without anyone noticing**, so
`scripts/check-contrast.mjs` gates every shipped pairing at WCAG AA and **fails the
build**, not warns. 17/17 currently pass. Body text sits at 12.34:1; the tightest
non-decorative pairing is 5.20:1.

## Typography

**Urbanist**, weights 300–600 only.

Selection: the brief asked for lighter type and more modern. The previous build used
Archivo Expanded at weight 800, a crate-stencil voice that was wide, heavy and
industrial — the opposite of all three. Urbanist is a low-contrast geometric sans with
rounded terminals and open counters. The rounded terminals matter twice: they read as
modern, and they agree with the global corner radius, so type and geometry come from one
idea rather than two.

**Display type is set at weight 400 and wins on size and whitespace, never on weight.**
The scale tops out at 5.5rem. That is the rule that keeps it from shouting.

## Geometry

Nothing sharp. Radius tokens run `--radius-xs` (0.5rem) through `--radius-2xl`
(2.75rem); buttons and chips are `rounded-full`. If an element has a border or a fill, it
has a radius.

## Glassmorphism

Used where something genuinely floats above moving content: the header once scrolled, the
cookie panel, the enquiry sheet, the catalogue dropdown, the custom select popup. Not a
decorative default. There is a `@supports not (backdrop-filter)` fallback that goes solid,
because without it those panels would be unreadable transparent boxes.

## Imagery

Every one of the 240 catalogue photographs is a studio cutout on a white cyclorama. There
is **no interior/lifestyle photography at all**.

Two consequences:

1. **The backdrop is keyed out at build time** (`scripts/lib-cutout.mjs`), so furniture
   stands on the site's warm ground instead of inside a white box. The key flood-fills
   inward from the border rather than thresholding globally, because a global threshold
   deletes white upholstery. A second tight-tolerance pass removes backdrop pockets
   enclosed by the subject, which the flood cannot reach.
2. **The hero is graphics, not photos of rooms.** The brief asked for a slider of
   interiors. Dressing it with stock photography of somebody else's house would imply
   those were MM projects. Instead the hero is a composed set (arc, horizon, contact
   shadow) with MM's own pieces standing on it. It can take real project photography the
   day it exists, without touching the layout.

## Motion

- Curtain page transitions. Cover → swap route → force scroll to top → reveal. Every
  visible change happens behind the curtain. Slow on purpose (780/820ms).
- Lenis smooth scroll on **desktop only**. Never on touch: hijacking momentum scroll
  fights the OS, breaks rubber-band, and desynchronises from the iOS address bar.
- Transform and opacity only. Everything behind `prefers-reduced-motion`.

## Bans

- No colour outside the hue-35 ramp.
- No weight above 600. No display type above 400.
- No sharp corners.
- No fabricated credentials: no year founded, no project counts, no certifications, no
  prices. See `[UNVERIFIED]` in PRODUCT.md.
- No stock photography presented as MM's work.
- No em dashes in copy.
