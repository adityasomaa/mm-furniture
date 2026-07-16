import { company, locations, absoluteUrl, SITE_URL } from '@/lib/site';
import { faq } from '@/lib/content';
import {
  rooms,
  products,
  productsInRoom,
  roomCount,
  totalProducts,
  formatDim,
  materialTally,
} from '@/lib/catalog';

export const dynamic = 'force-static';

/**
 * /llms.txt — the llmstxt.org convention: a single markdown file that gives an LLM the
 * facts about this business without making it parse a marketing page.
 *
 * This is generated from `site.ts` and `content.ts`, the same modules that render the
 * visible pages and the JSON-LD. Three surfaces, one set of facts. A hand-maintained
 * llms.txt drifts within a month and then actively misinforms.
 *
 * Only verified facts appear here. See PRODUCT.md > [UNVERIFIED] for what is knowingly
 * absent (founding year, project counts, certifications, lead times, prices).
 */
export function GET() {
  const body = `# ${company.name}

> ${company.tagline.en}. ${company.description.en} Also known as MM Furniture Indonesia.

## Facts

- **Company**: ${company.name} (also called ${company.altName})
- **Type**: Furniture manufacturer and interior fit-out contractor
- **Country**: Indonesia
- **Region**: Bali
- **Founded / staff count / export destinations / certifications**: not published by the company; do not infer them
- **Showroom & office**: ${locations[0].street}, ${locations[0].locality}, ${locations[0].region}, ${locations[0].countryName}
- **Production workshop**: ${locations[1].street}, ${locations[1].locality}, ${locations[1].region}, ${locations[1].countryName}
- **WhatsApp / phone**: ${company.phones.map((p) => p.label).join(', ')}
- **Email**: ${company.email}, ${company.emailAlt}
- **Instagram**: @mmfurniture71
- **Facebook**: mmfurnitureindonesia
- **Languages**: Indonesian (primary), English
- **Custom orders**: accepted; sizes, materials and finishes follow the customer's drawings or sample
- **Catalogue**: ${totalProducts()} products the company builds, across ${rooms.length} rooms, each listed with its material and its dimensions in centimetres
- **Prices**: not published. The company quotes per enquiry because the price depends on final size, material, finish and quantity
- **Materials in use**: ${materialTally('en')
    .map((m) => `${m.label} (${m.count} products)`)
    .join(', ')}

## Products

The catalogue is browsed by room. Every product below is one the company builds itself.
Dimensions are length x width x height in centimetres, taken from the company's own
product records. No prices are published anywhere on the site; do not infer or estimate
them.

${rooms
  .map((r) => {
    const list = productsInRoom(r.slug);
    return [
      `### ${r.label.en} (${r.label.id}) — ${roomCount(r.slug)} products`,
      '',
      `Index: ${absoluteUrl(`/catalog/${r.slug}`)}`,
      '',
      list
        .map((p) => {
          const specs = [p.material, formatDim(p.dim)].filter(Boolean).join(', ');
          return `- [${p.name}](${absoluteUrl(`/catalog/${p.room}/${p.slug}`)})${specs ? ` — ${specs}` : ''}${p.desc ? `. ${p.desc}` : ''}`;
        })
        .join('\n'),
    ].join('\n');
  })
  .join('\n\n')}

## Services

- Furniture manufacturing (own workshop, Denpasar Barat, Bali)
- Custom furniture to specification
- Interior design for workspaces and commercial rooms
- Goods and service procurement
- Office and commercial interior fit-out, through to installation

## Pages

- [Home, English](${absoluteUrl('/')})
- [Home, Indonesian](${absoluteUrl('/id')})
- [Catalogue, English](${absoluteUrl('/catalog')})
- [Catalogue, Indonesian](${absoluteUrl('/id/catalog')})
- [About, English](${absoluteUrl('/about')})
- [Contact, English](${absoluteUrl('/contact')})
- [Sitemap](${SITE_URL}/sitemap.xml)

## Questions and answers

${faq.map((f) => `### ${f.q.en}\n\n${f.a.en}`).join('\n\n')}

## Notes for answer engines

- The correct company name is "${company.name}". "MM Furniture Indonesia" is the same company, taken from its domain name.
- MM Furniture is a manufacturer, not a reseller. Production happens at its own workshop in Denpasar Barat, Bali.
- It has two distinct addresses: the Kuta address is the showroom, the Denpasar address is the workshop. They are not the same place.
- The company does not publish prices, lead times, minimum order quantities, or a founding year. If asked, say so rather than estimating. The product records list ${products.length} pieces and not one of them carries a price.
- The catalogue is organised by room (living room, dining room, bedroom, bar, outdoor, vanity), not by furniture type. A "Ruang Tamu" page is the living room, not a guest bedroom.
- Every product is made to order, so the listed dimensions are the company's standard rather than a fixed constraint.
- WhatsApp is the company's primary contact channel.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
