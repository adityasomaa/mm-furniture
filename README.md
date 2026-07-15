# mm-furniture

Website for **MM Furniture Globalindo** — furniture manufacturer and interior fit-out
contractor in Bali, Indonesia. Replaces a WordPress + WooCommerce + Elementor install.

**Production:** https://mm-furniture.vercel.app
**Replaces:** https://mmfurnitureindonesia.com

## Stack

| | |
|---|---|
| Framework | Next.js 16.2 (App Router, RSC) |
| UI | React 19.2 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS v4.3 (CSS-first `@theme`, OKLCH tokens) |
| Fonts | Urbanist variable, self-hosted via `next/font` |
| Scroll | Lenis (desktop only) |
| Images | Build-time cutout + AVIF/WebP ladder, served as static `<picture>` |
| Analytics | Vercel Web Analytics, gated behind consent |
| Hosting | Vercel |

Every page is statically generated. No database, no CMS, no runtime image optimisation.

## Why some choices look unusual

- **Two root layouts, not `/[locale]`.** Indonesian lives at `/`, English at `/en`,
  because the legacy WordPress URLs (`/catalog/sofa`, `/about`) are already indexed and a
  redirect hop would waste that. Route groups `(id)` and `(en)` each own a root layout so
  `<html lang>` is correct per locale.
- **Chrome mounts from the layout, never from a page.** The curtain holds state across
  the exact moment the route swaps. Inside the page tree it would unmount mid-transition
  and take the curtain down with it, revealing the swap it exists to hide.
- **`CatalogImage` instead of `next/image`.** All 240 photos are static and known at
  build time. `scripts/derive-images.mjs` pre-renders a 512/800/1080 ladder in AVIF and
  WebP; the component ships plain `<picture>` with a real srcset. Faster than a runtime
  optimiser and spends no Vercel transformation quota.
- **The studio backdrop is keyed out at build time.** See below.
- **`ItemList` schema, not `Product`.** The source catalogue has no SKUs, names, or
  prices. Emitting `Product` with invented offers would be fabricating commercial terms.
- **The enquiry form has no backend.** It composes a WhatsApp message and hands off to
  wa.me. This is a static site with no mail service; a form that silently discarded
  enquiries would be worse than no form. WhatsApp is the company's actual channel.

## The image pipeline

Every one of MM's photographs is a product shot on a white cyclorama. Dropped onto the
site's warm paper, each one reads as a white rectangle floating on beige.

`scripts/lib-cutout.mjs` keys the backdrop out, in two passes:

1. **Flood fill inward from the border** at a loose tolerance. Deliberately *not* "delete
   every near-white pixel": many of these sofas have white or cream upholstery and a
   global threshold punches holes straight through the cushions. Requiring a pixel to be
   reachable from the frame edge protects anything the subject encloses.
2. **Then remove enclosed pockets** at a much tighter tolerance. The gap inside a chair's
   backrest is unreachable from the border, so pass 1 leaves it opaque white. Safe to
   take because the backdrop is near-pure white (250+) while upholstery sits ~215-235.

The alpha is feathered before joining, or the cut edge aliases into a jagged line.

Source originals are **1024–1080px square**. That is a hard ceiling on detail: no
derivative is rendered above it, because upscaling adds bytes and invents nothing. Image
quality is won on encode settings (AVIF q72 4:4:4, WebP q88), not on fake pixels.

## Context files

| File | What it is |
|---|---|
| `PRODUCT.md` | Verified company facts, users, tone, anti-references. Marks what is `[UNVERIFIED]` and must never be stated as fact. |
| `DESIGN.md` | Palette with OKLCH values, type system, geometry, bans. |

`src/lib/site.ts` is the single source of truth for company facts. The visible copy, the
JSON-LD, and `/llms.txt` all read from it, so the three can never disagree.

## Commands

```bash
npm run dev              # dev server
npm run build            # contrast gate, then next build
npm run typecheck        # tsc --noEmit
npm run lint             # eslint
npm run check:contrast   # WCAG AA gate over every shipped text pairing
```

`npm run build` runs `scripts/check-contrast.mjs` first and **fails** the build if any
text/background pairing drops below AA. It is a gate, not a warning. This matters more
than usual here: the palette is deliberately soft and low-contrast, and soft is exactly
how a palette drifts under AA without anyone noticing.

## Asset migration (one-off, already done)

```bash
npm run assets:fetch     # pull originals off the legacy WP install -> .cache/raw
npm run assets:derive    # cutout + AVIF/WebP ladder -> public/catalog
```

`.cache/raw` is gitignored (~90MB of unoptimised JPEG). The derived files in
`public/catalog` are committed, so a clean checkout builds without touching the old host.
`fetch-assets.mjs` de-duplicates via a perceptual hash and rejects brand assets: the
legacy site reused 7 photos across category pages, and dropped its own logo card into all
seven galleries as if it were a product.

## SEO

- Per-page Metadata API, reciprocal hreflang (`id-ID`, `en`, `x-default`) on every route
- `sitemap.ts` emits one entry per page carrying the full hreflang cluster
- Connected schema.org `@graph`: `Organization` + `FurnitureStore`, two `LocalBusiness` /
  `Place` nodes, `WebSite`, `BreadcrumbList`, `FAQPage`, `CollectionPage`, `BlogPosting`
- Local SEO for Kuta / Badung / Denpasar / Bali with real coordinates
- 301s from the legacy WordPress paths (`/feed`, `/blog`, `/wp-admin`, `/xmlrpc.php`)

## GEO (generative engine optimisation)

- `/llms.txt` generated from `site.ts`, so it cannot drift from the rendered pages
- AI crawlers allowed on purpose in `robots.ts` (GPTBot, ClaudeBot, PerplexityBot,
  OAI-SearchBot, Google-Extended). A supplier gains from being the cited source
- FAQ answers written to survive being quoted standalone, and rendered in native
  `<details>` so the text is in the DOM whether or not it is expanded
- An explicit "Notes for answer engines" block stating what the company does *not*
  publish (prices, lead times, founding year), so a model declines instead of guessing

## Privacy posture

The cookie banner gates something real: Vercel Web Analytics mounts only after an
explicit accept and is never loaded on decline. A banner that appears, gets clicked, and
changes nothing trains people that the choice is fake. The only thing always stored is
the consent answer itself, in localStorage.
