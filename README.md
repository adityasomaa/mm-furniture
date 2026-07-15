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
| Language | TypeScript 7 |
| Styling | Tailwind CSS v4.3 (CSS-first `@theme`, OKLCH tokens) |
| Fonts | Archivo variable, self-hosted via `next/font` |
| Images | Build-time AVIF + WebP ladder, served as static `<picture>` |
| Hosting | Vercel |

Every page is statically generated. There is no database, no CMS, and no runtime image
optimisation.

## Why some choices look unusual

- **Two root layouts, not `/[locale]`.** Indonesian lives at `/`, English at `/en`,
  because the legacy WordPress URLs (`/catalog/sofa`, `/about`) are already indexed and
  a redirect hop would waste that. Route groups `(id)` and `(en)` each own a root layout
  so `<html lang>` is correct per locale.
- **`CatalogImage` instead of `next/image`.** All 241 photos are static and known at
  build time. `scripts/derive-images.mjs` pre-renders a 400/800/1400 ladder in AVIF and
  WebP; the component ships a plain `<picture>` with a real srcset. This is faster than
  a runtime optimiser and spends no Vercel image-transformation quota.
- **`ItemList` schema, not `Product`.** The source catalogue has no SKUs, names, or
  prices. Emitting `Product` with invented offers would be fabricating commercial terms.
- **Palette derived from the logo.** Petrol `#1f3236` and rosewood `#5c3a31` were sampled
  out of the company's own wordmark. See `DESIGN.md`.

## Context files

| File | What it is |
|---|---|
| `PRODUCT.md` | Verified company facts, users, tone, anti-references. Marks what is `[UNVERIFIED]` and must never be stated as fact. |
| `DESIGN.md` | Aesthetic lane, palette with OKLCH values, type system, bans. |

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
text/background pairing drops below AA. It is a gate, not a warning.

## Asset migration (one-off, already done)

```bash
npm run assets:fetch     # pull originals off the legacy WP install -> .cache/raw
npm run assets:derive    # build the AVIF/WebP ladder -> public/catalog
```

`.cache/raw` is gitignored (~90MB of unoptimised JPEG). The derived files in
`public/catalog` are committed, so a clean checkout builds without touching the old host.
`fetch-assets.mjs` de-duplicates via a perceptual hash: the legacy site reused 7 photos
across category pages, so 248 URLs resolve to 241 distinct photographs.

## SEO

- Per-page Metadata API, reciprocal hreflang (`id-ID`, `en`, `x-default`) on every route
- `sitemap.ts` emits one entry per page carrying the full hreflang cluster
- Connected JSON-LD `@graph`: `Organization` + `FurnitureStore`, two `LocalBusiness` /
  `Place` nodes, `WebSite`, `BreadcrumbList`, `FAQPage`, `CollectionPage` + `ItemList`
- Local SEO for Kuta / Badung / Denpasar / Bali with real coordinates
- 301s from legacy WordPress paths (`/feed`, `/blog`, `/wp-admin`, `/xmlrpc.php`)

## GEO (generative engine optimisation)

- `/llms.txt` generated from `site.ts`, so it cannot drift from the rendered pages
- AI crawlers allowed on purpose in `robots.ts` (GPTBot, ClaudeBot, PerplexityBot,
  OAI-SearchBot, Google-Extended). A supplier gains from being the cited source
- FAQ answers written to survive being quoted standalone, and rendered in native
  `<details>` so the text is in the DOM whether or not it is expanded
- An explicit "Notes for answer engines" block that states what the company does *not*
  publish (prices, lead times, founding year), so a model declines instead of guessing
