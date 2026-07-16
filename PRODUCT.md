# PRODUCT.md — MM Furniture Globalindo

> Sourced from the legacy WordPress site (mmfurnitureindonesia.com, scraped 2026-07-15),
> not invented. Facts below are verbatim or directly derived. Anything unverified is
> marked `[UNVERIFIED]` and must not be stated as fact in copy.

## Register

**brand** — This is a marketing and catalog surface. A visitor's impression *is* the
deliverable. Design serves persuasion and credibility, not task completion.

## Product purpose

MM Furniture Globalindo manufactures and exports furniture from Bali, and delivers
integrated interior fit-out (design, procurement, installation) for offices and
commercial spaces. They run their own workshop in Denpasar Barat and a showroom on
Sunset Road, Kuta.

The positioning is a genuine tension, and it is the whole brand:
**export-grade construction at a domestic price.** Tagline: *"Export Quality, Affordable Price."*

## Users

1. **Overseas buyers / importers** — evaluating whether a Bali workshop can hold spec,
   hit a container deadline, and finish to export standard. They need evidence, not adjectives.
2. **Bali commercial clients** — villa, hotel, café, and office owners needing a fit-out
   partner. They need scope clarity and proof of delivery.
3. **Indonesian retail buyers** — browsing the catalog for a sofa, bed, or desk. They need
   photos, category browsing, and a WhatsApp button.

Buyers 1 and 3 are why the site is bilingual. The English surface is a trade surface;
the Indonesian surface is a retail surface. Same catalog, different intent.

## Verified facts

- **Legal / trading name:** MM Furniture Globalindo (also "MM Furniture Indonesia")
- **Showroom & office:** Jl. Sunset Road 71, Kuta, Badung, Bali, Indonesia
- **Workshop:** Jl. Pulau Ayu Dalam 15, Denpasar Barat, Denpasar, Bali, Indonesia
- **Email:** info@mmfurniture.com, mmfurniture71@gmail.com
- **Phone / WhatsApp:** +62 878-6165-4856, +62 878-6134-0445
- **Instagram:** @mmfurniture71 · **Facebook:** mmfurnitureindonesia
- **Services:** interior design, goods & service procurement, office/commercial fit-out
- **Custom orders:** accepted
- **Stated values:** professional expertise, reliable timelines, detailed project evaluation,
  aesthetic + functional quality, sustainability, mutually beneficial partnership

### The catalogue (owner's own database, supplied 2026-07-16)

Supersedes the seven invented type-categories the first build used to organise 240
anonymous scraped photos. Source: `Template_Pemetaan_Katalog_Furniture.xlsx`, parsed by
`scripts/extract-catalog.py` into `src/data/products.json`.

- **227 products**, each with a name, room, material, description, and 767 photographs
  between them.
- **6 rooms**, the owner's own Kategori column: Ruang Tamu (45), Ruang Makan (96),
  Kamar Tidur (62), Bar (16), Outdoor (6), Vanity (2).
- **Dimensions:** length × width × height in cm, present on 221 of 227.
- **Materials:** stated per product. Teak (208), Cushion (42), Rattan (38), Iron (12),
  Suar wood (10), woven cord (8), glass (6), leather (4), mendong grass (3), unspecified
  wood (3), marble (2), resin (2), parasol canvas (2).

Owner decisions on the two ambiguous points, taken 2026-07-16: 18 rows with a blank
Kategori resolve as Buffet → Ruang Makan and Partisi → Ruang Tamu; the catalogue browses
by room rather than by furniture type.

## `[UNVERIFIED]` — do not put in copy as fact

Year founded · employee count · number of projects delivered · countries exported to ·
certifications (FSC/SVLK) · lead times · MOQ · **prices** · client names.

Neither the legacy site nor the owner's database names any of these. Inventing them
would be fabricating credentials for a real business. Where the design wants a number,
either omit the section or use one derived from the database (product counts per room,
material tallies).

Price deserves its own note, because it is the one a catalogue is expected to answer.
The spreadsheet has a Harga column and it is **blank on all 227 rows**. The site
therefore states no price anywhere, and says plainly on every product page why not. Do
not fill this from a marketplace listing, a competitor, or arithmetic.

Timber species has moved off this list: it was unverifiable when all we had were
photographs, but the owner now states the material for every product. Use `p.material`
verbatim; do not generalise one product's timber to the catalogue.

## Tone

Matter-of-fact, workshop-floor, unembarrassed about price. This company competes on
being *good and reachable*, not on being precious. Copy should sound like a foreman who
knows his joinery, not like a luxury brand consultant.

Write plainly. No "timeless elegance", no "curated living", no "crafted with passion".

## Anti-references

- **Every beige furniture site.** Cream background, thin serif wordmark, a linen sofa on
  a white cyclorama, the word "curated". This is the category reflex and it is invisible.
- **Editorial-magazine affectation.** Italic display serif, drop caps, mono metadata,
  ruled columns. Wrong register for a workshop that ships containers.
- **Luxury cosplay.** MM competes on price. Pretending otherwise is a lie the pricing
  will immediately expose.
- **The old site itself.** WordPress + Elementor + WooCommerce with zero published
  products, an image dump per category, no structured data, no real metadata.

## Strategic principles

1. **Photography is the product.** 248 real workshop photos exist. They carry the site.
   Never a colored `<div>` where a photo belongs.
2. **Evidence over adjectives.** Two real addresses and a workshop are more persuasive
   than "premium quality". Show the workshop; don't claim excellence.
3. **The contact is the conversion.** WhatsApp is how business actually happens in Bali.
   It should never be more than one thumb-reach away.
4. **Bilingual is not decoration.** ID and EN are different audiences with different
   intent. Both fully indexed, correctly hreflang'd.
