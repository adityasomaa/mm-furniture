import { company, locations, waLink, type Locale } from '@/lib/site';
import { contact, ui } from '@/lib/content';
import { Section, Kicker } from '@/components/Shell';
import { Monogram } from '@/components/Wordmark';

export function ContactPage({ locale }: { locale: Locale }) {
  const msg =
    locale === 'id'
      ? 'Halo MM Furniture, saya ingin bertanya mengenai furnitur dan interior.'
      : 'Hello MM Furniture, I would like to ask about furniture and interiors.';

  return (
    <>
      <Section tone="dark">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
          <div>
            <Kicker onDark>{company.tagline[locale]}</Kicker>
            <h1 className="mt-6 text-display text-paper">{contact.title[locale]}</h1>
          </div>
          <p className="prose-body text-lede text-sand">{contact.lede[locale]}</p>
        </div>

        <div className="mt-14 grid gap-2.5 sm:grid-cols-2">
          {company.phones.map((p, i) => (
            <a
              key={p.e164}
              href={waLink(p.wa, msg)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between gap-4 px-6 py-6 transition-colors duration-200 ${
                i === 0
                  ? 'bg-brand text-espresso hover:bg-paper'
                  : 'border border-linen text-paper hover:border-brand hover:text-brand'
              }`}
            >
              <span className="tag">WhatsApp</span>
              <span className="text-lg sm:text-xl">{p.label}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-20">
          <div>
            <Kicker>{contact.visitLabel[locale]}</Kicker>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {locations.map((loc) => (
              <a
                key={loc.id}
                href={loc.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden border border-linen bg-shell p-7 transition-colors duration-300 hover:border-brand/50 sm:p-9"
              >
                <Monogram className="absolute -right-6 -top-6 h-32 w-32 text-brand opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.12]" />
                <span className="tag text-brand">{loc.role[locale]}</span>
                <address className="mt-4 text-head not-italic leading-tight text-espresso">
                  {loc.street}
                </address>
                <p className="mt-2 text-[0.97rem] leading-relaxed text-clay">
                  {loc.locality}
                  <br />
                  {loc.region}, {loc.countryName}
                </p>
                <span className="tag mt-7 inline-flex items-center gap-2 text-espresso transition-colors duration-200 group-hover:text-brand">
                  {ui.openInMaps[locale]}
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="shell">
        <div className="grid gap-12 sm:grid-cols-3">
          <div>
            <p className="tag text-brand">{contact.phoneLabel[locale]}</p>
            <ul className="mt-4 space-y-2">
              {company.phones.map((p) => (
                <li key={p.e164}>
                  <a href={`tel:${p.e164}`} className="text-lg text-espresso transition-colors hover:text-brand">
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="tag text-brand">{contact.emailLabel[locale]}</p>
            <ul className="mt-4 space-y-2">
              {[company.email, company.emailAlt].map((e) => (
                <li key={e}>
                  <a href={`mailto:${e}`} className="text-lg text-espresso transition-colors hover:text-brand">
                    {e}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="tag text-brand">{contact.socialLabel[locale]}</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={company.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-espresso transition-colors hover:text-brand"
                >
                  @mmfurniture71
                </a>
              </li>
              <li>
                <a
                  href={company.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-espresso transition-colors hover:text-brand"
                >
                  mmfurnitureindonesia
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
