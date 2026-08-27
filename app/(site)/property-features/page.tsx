import type { Metadata } from "next";
import Image from "next/image";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CtaBand } from "@/components/cta-band";
import { SectionHeading } from "@/components/ui";
import { buildingSpecs, floors } from "@/lib/property";

export const metadata: Metadata = {
  title: "Property Specifications, Fifth Street Kampala",
  description:
    "Full specifications for Alam Business Center: 4,940 m² lettable area, 6 m floor-to-floor height, 77.1 m frontage, 31 parking bays, two service lifts, terrazzo and porcelain finishes.",
  alternates: { canonical: "/property-features" },
};

const systems = [
  {
    title: "Structure and envelope",
    points: [
      "6 metre structural grid throughout",
      "6 metre floor-to-floor height on the ground and first floors",
      "Full-height curtain-wall glazing to the principal elevations",
      "Bronze and champagne composite cladding",
      "Approximately 77.1 metres of frontage to Fifth Street",
    ],
  },
  {
    title: "Access and circulation",
    points: [
      "Separate vehicle entrance and exit",
      "31 on-plot parking bays within the secure forecourt",
      "Level vehicle access into ground-floor units",
      "Two staircases serving all floors",
      "Two service lifts for goods and deliveries",
    ],
  },
  {
    title: "Finishes",
    points: [
      "Terrazzo to the ground floor and circulation",
      "Porcelain tiles within office and facility areas",
      "Shared washroom facilities on each floor",
      "Flexible partitioning for tenant fit-out",
      "Provision for tenant signage on the frontage",
    ],
  },
  {
    title: "Security and services",
    points: [
      "Perimeter fencing to the full site boundary",
      "Two guardhouses controlling entry and exit",
      "Three-phase power provision to units",
      "Water and drainage provision for retail and hospitality fit-outs",
      "Managed common areas and forecourt",
    ],
  },
];

export default function PropertyFeaturesPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-x py-14 lg:py-20">
          <Breadcrumbs
            trail={[{ name: "Property Specifications", href: "/property-features" }]}
            tone="light"
          />
          <div className="mt-6">
            <SectionHeading
              as="h1"
              eyebrow="The building"
              title="Property specifications"
              intro="Everything a fit-out team needs to size up the building: areas, heights, grid, access, finishes and services across Phase One."
              tone="light"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <SectionHeading eyebrow="At a glance" title="Development summary" />
              <dl className="mt-8 divide-y divide-line border-y border-line">
                {buildingSpecs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-6 py-3.5">
                    <dt className="text-sm text-ink/55">{spec.label}</dt>
                    <dd className="max-w-[55%] text-right text-sm font-medium text-ink">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="grid gap-4">
              <div className="relative aspect-3/2 overflow-hidden rounded-2xl">
                <Image
                  src="/images/exterior-aerial-dusk.webp"
                  alt="Aerial view of Alam Business Center showing the roof, frontage, forecourt parking and gatehouse"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-3/2 overflow-hidden rounded-2xl">
                <Image
                  src="/images/interior-showroom-corridor.webp"
                  alt="Internal showroom corridor at Alam Business Center with terrazzo floors and full-height glazing"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-x py-16 lg:py-24">
          <SectionHeading eyebrow="Systems" title="Specification by discipline" />
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {systems.map((system) => (
              <div key={system.title} className="rounded-2xl border border-line bg-white p-6">
                <h3 className="font-display text-2xl text-ink">{system.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {system.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <SectionHeading eyebrow="By floor" title="Floor-by-floor breakdown" />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {Object.values(floors).map((floor) => (
              <div key={floor.slug} className="rounded-2xl border border-line p-6">
                <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-red uppercase">
                  {floor.area}
                </p>
                <h3 className="font-display mt-2 text-2xl text-ink">{floor.name}</h3>
                <ul className="mt-4 space-y-2">
                  {floor.sellingPoints.slice(0, 6).map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink/65">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/25" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
