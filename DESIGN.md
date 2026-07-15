# DESIGN.md — MM Furniture Globalindo

## Aesthetic lane

**Export trade, not furniture showroom.**

The named reference: *a stencilled shipping mark on a plywood export crate, standing on a
Denpasar workshop floor next to fresh-planed timber.*

MM's differentiator is the word **export**. Every other furniture site sells "the home".
This one sells a workshop that can hold a spec and fill a container. So the surface
borrows from shipping and trade documentation: stencil marks, stamped labelling, plain
declarative type.

### Identity preservation

The existing logo is not a placeholder and it is not bad. Sampled from
`mm-furniture-logo-horizontal.png`, it commits to two colors:

- **Wordmark petrol** `#1f3236` → `oklch(0.303 0.026 212)`
- **Monogram rosewood** `#5c3a31` → `oklch(0.386 0.051 35)`

Hue 212 against hue 35 is a near-complementary pair the company already owns. An earlier
draft of this file proposed an invented indigo palette; it was wrong, because the logo
would have read as a foreign object on its own site. **The palette below is derived from
the mark, not imposed on it.** Identity preservation wins over a greenfield color idea.

The logo's brown is too dark to carry an accent on a dark surface, so the accent is that
same hue lifted in lightness into copper. Same family, usable contrast.

### Category-reflex check

- **First-order reflex** (furniture → cream background, thin serif, linen sofa): rejected.
- **Second-order reflex** (furniture-that's-not-cream → editorial-typographic monochrome,
  italic display serif, mono metadata, ruled columns): also rejected. That lane is
  explicitly saturated, and it is the wrong register for a workshop.
- **What we ship instead:** indigo-committed, wide industrial grotesk, photography-led,
  trade-document plainness.

## Typography

### Selection procedure (run, not skipped)

1. **Three brand-voice words:** hand-planed · sun-warmed · matter-of-fact.
2. **Reflex picks, rejected:** Playfair Display, Cormorant, Inter. All three sit on the
   reflex-reject list. Rejecting them.
3. **The brand as a physical object:** not a magazine spread. A stencil sprayed on a
   plywood export crate, and the timber grading tag stapled to it. That points to a wide
   grotesk with signage presence, not a serif.
4. **Cross-check:** "premium" did not resolve to a serif; "Indonesian" did not resolve to
   a script. The pick diverges from the reflex. Passes.

### The family

**Archivo** (Google Fonts, variable: `wght` 100–900, `wdth` 62–125) — used as a
superfamily, one typeface, committed contrast.

- **Display** — Archivo at `wdth: 125` (expanded), weight 700–800, tight tracking.
  Reads as stamped signage. This is the crate stencil.
- **Body** — Archivo at `wdth: 100`, weight 400–500.
- **Labels** — Archivo at `wdth: 100`, weight 600, uppercase, `+0.14em` tracking, small.
  Trade-document labelling. Short labels only, never body copy.

One family chosen deliberately beats a timid display+body pair. The width axis carries
the hierarchy that a second family would otherwise carry. No monospace: MM is a workshop,
not a dev tool, and mono here would be costume.

### Scale

Fluid `clamp()`, ratio ≥1.3 between steps. Body capped at 68ch.

## Color

**Strategy: Committed.** Petrol carries roughly 40% of the surface (hero, section bands,
footer). It is not an accent hedged with neutrals.

All values OKLCH. No `#000`, no `#fff`. Every neutral is tinted toward petrol (hue 212)
or copper (hue ~60) so the page reads as one material.

| Role | Token | OKLCH | Use |
|---|---|---|---|
| Petrol ink | `--color-ink` | `oklch(0.26 0.028 212)` | Dominant surface, hero, footer |
| Petrol deep | `--color-ink-deep` | `oklch(0.19 0.024 212)` | Recessed panels, overlays |
| Petrol raised | `--color-ink-raised` | `oklch(0.33 0.028 211)` | Panels on ink |
| Petrol hairline | `--color-ink-hair` | `oklch(0.42 0.026 211)` | 1px rules on ink |
| Copper | `--color-copper` | `oklch(0.70 0.115 45)` | The single accent. CTAs, rules, marks |
| Copper deep | `--color-copper-deep` | `oklch(0.50 0.10 40)` | Accent text on bone, hover |
| Copper wash | `--color-copper-wash` | `oklch(0.93 0.028 55)` | Rare tint block |
| Bone | `--color-bone` | `oklch(0.965 0.006 75)` | Catalogue ground |
| Bone shade | `--color-bone-shade` | `oklch(0.932 0.009 72)` | Alternating bands |
| Bone hairline | `--color-bone-hair` | `oklch(0.87 0.011 65)` | 1px rules on bone |
| Graphite | `--color-graphite` | `oklch(0.30 0.014 212)` | Body text on bone |
| Muted | `--color-muted` | `oklch(0.51 0.014 212)` | Secondary text on bone |
| Muted on ink | `--color-muted-on-ink` | `oklch(0.74 0.018 212)` | Secondary text on ink |

Chroma stays low near the lightness extremes (bone at 0.006, ink-deep at 0.024) so nothing
goes garish.

**Division of labour:** petrol carries narrative and identity; bone carries the catalogue,
because 248 photographs of timber need a neutral ground and would fight a colored one.
Copper is the only accent and stays under 10% of any view.

**Contrast floor:** every text pairing shipped here clears WCAG AA (4.5:1 body, 3:1 large).
Verified in `scripts/check-contrast.mjs`, which fails the build rather than warning.

## Theme

**Scene sentence:** an importer in Rotterdam opening a supplier link at 9am on a bright
monitor, deciding in ten seconds whether this workshop is real; and a Denpasar buyer
thumbing the catalog outdoors, in tropical daylight, on a mid-range Android.

That forces it: **light-dominant, with petrol as the committed brand surface.** Not a dark
site. Tropical daylight and a bone catalogue win; petrol bands carry identity between them.

## Layout

- Asymmetric. Left-aligned. No centered icon-title-subtitle stacks.
- The catalog grid is `repeat(auto-fit, minmax(260px, 1fr))` — breakpoint-free.
- Photos vary in span and aspect. A uniform grid of identical tiles is the slop signal
  this site most needs to avoid, since it is 248 photos of furniture.
- Spacing varies deliberately: `clamp()` section rhythm, tight groupings inside.

## Motion

- One orchestrated reveal per section on scroll, `ease-out-quart`-ish cubic-bezier.
- Transform and opacity only. Never layout properties.
- Everything behind `prefers-reduced-motion`.

## Bans (project-specific, on top of the shared list)

- No colored `<div>` where a photo belongs. 248 real photos exist.
- No fabricated credentials. No "20+ years", no "500 projects", no fake certification
  badges. See `[UNVERIFIED]` in PRODUCT.md.
- No "curated", "timeless", "elegance", "passion".
- No em dashes in copy.
- No identical card grids. No gradient text. No side-stripe borders. No glassmorphism.
