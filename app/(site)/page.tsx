import Image from "next/image";
import Link from "next/link";

import {
  BrochureLink,
  RegisterInterestButton,
  WhatsAppLink,
} from "@/components/actions";
import { GENERAL_WHATSAPP_MESSAGE } from "@/lib/whatsapp";
import { CtaBand, FaqList } from "@/components/cta-band";
import { RateSummary } from "@/components/price-tag";
import { UnitCatalogue } from "@/components/unit-catalogue";
import { ButtonLink, Eyebrow, SectionHeading } from "@/components/ui";
import { JsonLd, faqSchema, itemListSchema } from "@/lib/schema";
import {
  CONCEPT_DISCLAIMER,
  buildingStats,
  floors,
  property,
  secondFloorConcepts,
} from "@/lib/property";
import { resolvedUnits } from "@/lib/server/units";

const introPoints = [
  "77.1-metre glazed frontage to Fifth Street",
  "Full-height curtain-wall glazing",
  "Bronze and champagne composite cladding",
  "Showroom visibility from Fifth Street",
  "Controlled entrance and exit",
  "Internal customer parking",
  "Two service lifts",
  "Flexible commercial spaces",
  "Leisure and hospitality opportunities",
  "Close access to Kampala CBD and Jinja Road",
];

const audiences = [
  { title: "Showrooms and dealerships", body: "Vehicle, motorcycle, machinery and equipment display with level access and 6 m headroom." },
  { title: "Retail and supermarkets", body: "Anchor retail with trolley-friendly access, parking at the door and passing traffic on Fifth Street." },
  { title: "Banking and fintech", body: "Secure, glazed floors that carry a public banking hall and back-office in a single tenancy." },
  { title: "Corporate offices", body: "Daylit floor plates for regional headquarters, professional practices and representative offices." },
  { title: "Restaurants and cafés", body: "Second-floor hospitality with panoramic glazing, servicing routes and extended trading hours." },
  { title: "Gyms, spas and studios", body: "Leisure and wellness space with the depth for wet areas, studios and treatment suites." },
];

const homeFaqs = [
  {
    question: "Where exactly is Alam Business Center?",
    answer:
      "Plot 86-90, Fifth Street, Industrial Area, Central Division, Kampala. It sits inside Kampala's established Industrial Area with quick access to the CBD and the Jinja Road corridor.",
  },
  {
    question: "How much space is available?",
    answer:
      "Phase One offers 4,940 m² of lettable area: 2,390 m² on the ground floor and 2,550 m² on the first floor, split into eight units of 570-660 m². The second floor is configured to tenant requirements.",
  },
  {
    question: "Can I lease more than one unit?",
    answer:
      "Yes. Units can be leased individually, in adjacent pairs, as a full floor, or as the entire building. Adjacent units on the same floor can be combined into a single tenancy.",
  },
  {
    question: "What are the rental rates?",
    answer:
      "Rental rates and lease terms are released once you register your details with the leasing team. Registering takes under a minute and unlocks the rate for every unit, full floors and the whole building.",
  },
  {
    question: "Is there parking?",
    answer:
      "There are 31 on-plot parking bays with a separate vehicle entrance and exit, perimeter fencing and two guardhouses.",
  },
];

export const revalidate = 300;

export default async function HomePage() {
  const units = await resolvedUnits();

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image
          src="/images/exterior-street-dusk.webp"
          alt="Alam Business Center on Fifth Street, Industrial Area, Kampala, lit at dusk behind palm trees and street parking"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/60 to-ink"
        />

        <div className="container-x relative py-20 lg:py-32">
          <div className="max-w-3xl">
            <Eyebrow tone="light">
              {property.street}, {property.city}
            </Eyebrow>
            <h1 className="font-display mt-6 text-4xl leading-[1.05] font-medium text-balance sm:text-5xl lg:text-6xl">
              Premium Commercial Space on Fifth Street
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 text-pretty">
              Secure a highly visible showroom, retail, office, hospitality or leisure space in
              Kampala&apos;s established Industrial Area.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/available-spaces">View Available Units</ButtonLink>
              <RegisterInterestButton variant="ghost" label="Register Your Interest" />
              <ButtonLink href="/book-a-site-visit" variant="ghost">
                Book a Site Visit
              </ButtonLink>
              <BrochureLink variant="ghost" className="text-sm">
                Download Property Presentation
              </BrochureLink>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-10 sm:grid-cols-3 lg:grid-cols-5">
            {buildingStats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-3xl leading-none font-medium lg:text-4xl">
                  {stat.value}
                </dt>
                <dd className="mt-2 text-xs leading-relaxed tracking-wide text-white/55">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-white">
        <div className="container-x py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="The development"
                title="A premium commercial destination in Industrial Area"
                intro="Alam Business Center puts showroom-grade frontage, corporate floors and leisure space behind a single 77.1-metre glazed elevation, with controlled access, on-plot parking and service lifts throughout."
              />
              <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {introPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/property-features" variant="dark">
                  Property specifications
                </ButtonLink>
                <ButtonLink href="/gallery" variant="outline">
                  View the gallery
                </ButtonLink>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
                <Image
                  src="/images/atrium-reception.webp"
                  alt="Double-height reception atrium at Alam Business Center with a timber feature wall and terrazzo floors"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src="/images/exterior-corner-entrance.webp"
                    alt="Corner elevation and controlled vehicle entrance at Alam Business Center"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src="/images/exterior-aerial-dusk.webp"
                    alt="Aerial view of Alam Business Center showing the full Fifth Street frontage and on-plot parking"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available units */}
      <section id="units" className="bg-paper">
        <div className="container-x py-20 lg:py-28">
          <SectionHeading
            eyebrow="Available now"
            title="Eight showroom units across two floors"
            intro="Filter by floor, size and intended use. Every unit can be leased on its own, paired with the unit next door, or taken as part of a full floor."
          />
          <div className="mt-10">
            <UnitCatalogue units={units} />
          </div>
        </div>
      </section>

      {/* Floors */}
      <section className="bg-white">
        <div className="container-x py-20 lg:py-28">
          <SectionHeading
            eyebrow="Explore by floor"
            title="Ground, first and second floors"
            intro="Each floor has its own character: street-level showrooms, daylit first-floor showroom and office space, and a second floor given over to leisure, hospitality and headquarters."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {Object.values(floors).map((floor) => (
              <Link
                key={floor.slug}
                href={`/available-spaces/${floor.slug}`}
                className="group overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(11,11,11,0.5)]"
              >
                <div className="relative aspect-16/10 overflow-hidden">
                  <Image
                    src={floor.image}
                    alt={floor.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-ink/45 uppercase">
                    {floor.area}
                  </p>
                  <h3 className="font-display mt-2 text-2xl text-ink group-hover:text-red">
                    {floor.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/60">
                    {floor.intro}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lease terms gate */}
      <section className="bg-paper">
        <div className="container-x py-20 lg:py-28">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionHeading
              eyebrow="Lease terms"
              title="Rental rates are released on request"
              intro="We publish full specifications openly and share commercial terms directly with prospective tenants. Register once and the rate for every unit, full floor and the whole building is visible across the site."
            />
            <RateSummary />
          </div>
        </div>
      </section>

      {/* Second floor concepts */}
      <section className="bg-ink text-white">
        <div className="container-x py-20 lg:py-28">
          <SectionHeading
            eyebrow="Second floor"
            title="Leisure, hospitality and headquarters space"
            intro="Areas on the second floor are available on application and configured to the operator. These are illustrative fit-out concepts for the kinds of business the floor suits."
            tone="light"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {secondFloorConcepts.slice(0, 6).map((concept) => (
              <article
                key={concept.slug}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={concept.image}
                    alt={concept.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl">{concept.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{concept.summary}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-white/45">
            {CONCEPT_DISCLAIMER}
          </p>
          <div className="mt-8">
            <ButtonLink href="/available-spaces/second-floor" variant="ghost">
              Explore the second floor
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Suitable uses */}
      <section className="bg-white">
        <div className="container-x py-20 lg:py-28">
          <SectionHeading
            eyebrow="Who it suits"
            title="Built for businesses that need to be seen"
            intro="Fifth Street carries steady commercial traffic, and the glazed frontage puts your brand in front of it. These are the occupiers the building is designed around."
          />
          <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((audience) => (
              <div key={audience.title}>
                <span aria-hidden className="block h-px w-10 bg-red" />
                <h3 className="font-display mt-4 text-xl text-ink">{audience.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{audience.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-paper">
        <div className="container-x py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
              <Image
                src="/images/exterior-frontage-gatehouse.webp"
                alt="Street view of the Alam Business Center frontage, gatehouse and controlled entrance on Fifth Street"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div>
              <SectionHeading
                eyebrow="Location"
                title="Fifth Street, Industrial Area"
                intro="Kampala's Industrial Area is the city's established commercial and distribution district. The site sits minutes from the CBD and connects directly to the Jinja Road corridor for regional traffic."
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/location" variant="dark">
                  Location and access
                </ButtonLink>
                <WhatsAppLink
                  message={GENERAL_WHATSAPP_MESSAGE}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
                >
                  Enquire on WhatsApp
                </WhatsAppLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="container-x py-20 lg:py-28">
          <SectionHeading eyebrow="Questions" title="Frequently asked" />
          <div className="mt-10">
            <FaqList faqs={homeFaqs} />
          </div>
          <div className="mt-8">
            <ButtonLink href="/faq" variant="outline">
              All frequently asked questions
            </ButtonLink>
          </div>
        </div>
      </section>

      <CtaBand />

      <JsonLd data={[itemListSchema(), faqSchema(homeFaqs)]} />
    </>
  );
}
