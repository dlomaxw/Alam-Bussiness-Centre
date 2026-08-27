import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CtaBand } from "@/components/cta-band";
import { RateSummary } from "@/components/price-tag";
import { RegisterInterestButton } from "@/components/actions";
import { UnitCard } from "@/components/unit-card";
import { ButtonLink, SectionHeading } from "@/components/ui";
import {
  CONCEPT_DISCLAIMER,
  floors,
  isFloorSlug,
  secondFloorConcepts,
} from "@/lib/property";
import { resolvedUnitsByFloor } from "@/lib/server/units";

type Params = { params: Promise<{ floor: string }> };

export function generateStaticParams() {
  return Object.keys(floors).map((floor) => ({ floor }));
}

const seo: Record<string, { title: string; description: string }> = {
  "ground-floor": {
    title: "Ground Floor Showroom Space for Rent | 2,390 m², Fifth Street Kampala",
    description:
      "Four ground-floor showroom units of 570-625 m² at Alam Business Center, with level vehicle access, 6 m headroom, terrazzo floors and parking at the door on Fifth Street, Kampala.",
  },
  "first-floor": {
    title: "First Floor Showroom & Office Space for Rent | 2,550 m² in Kampala",
    description:
      "Four first-floor units of 615-660 m² at Alam Business Center, served by two service lifts, with full-height glazing, flexible partitioning and combinable floor plates.",
  },
  "second-floor": {
    title: "Second Floor Leisure, Hospitality & Office Space in Kampala",
    description:
      "Restaurant, gym, spa, studio, nightclub and headquarters opportunities on the second floor of Alam Business Center. Areas available on application and configured to the operator.",
  },
};

export const revalidate = 300;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { floor } = await params;
  if (!isFloorSlug(floor)) return {};
  return {
    title: seo[floor].title,
    description: seo[floor].description,
    alternates: { canonical: `/available-spaces/${floor}` },
    openGraph: {
      title: seo[floor].title,
      description: seo[floor].description,
      images: [{ url: floors[floor].image, alt: floors[floor].imageAlt }],
    },
  };
}

export default async function FloorPage({ params }: Params) {
  const { floor: slug } = await params;
  if (!isFloorSlug(slug)) notFound();

  const floor = floors[slug];
  const units = await resolvedUnitsByFloor(slug);
  const isSecond = slug === "second-floor";

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image
          src={floor.image}
          alt={floor.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/85 to-ink" />
        <div className="container-x relative py-16 lg:py-24">
          <Breadcrumbs
            trail={[
              { name: "Available Spaces", href: "/available-spaces" },
              { name: floor.name, href: `/available-spaces/${floor.slug}` },
            ]}
            tone="light"
          />
          <div className="mt-6">
            <SectionHeading
              as="h1"
              eyebrow={floor.area}
              title={floor.name}
              intro={floor.intro}
              tone="light"
            />
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <RegisterInterestButton
              label={`Register interest in the ${floor.shortName.toLowerCase()} floor`}
              floor={floor.slug}
            />
            <ButtonLink href="/book-a-site-visit" variant="ghost">
              Book a Site Visit
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <SectionHeading
            eyebrow="Floor features"
            title={`What the ${floor.shortName.toLowerCase()} floor offers`}
          />
          <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {floor.sellingPoints.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {isSecond ? (
        <section className="bg-paper">
          <div className="container-x py-16 lg:py-24">
            <SectionHeading
              eyebrow="Area available on application"
              title="Second-floor opportunities"
              intro="The second floor is let as a configured space rather than fixed units. These concepts show the uses the floor is designed to carry."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {secondFloorConcepts.map((concept) => (
                <article
                  key={concept.slug}
                  className="overflow-hidden rounded-2xl border border-line bg-white"
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
                    <h3 className="font-display text-xl text-ink">{concept.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">{concept.summary}</p>
                    <div className="mt-4">
                      <RegisterInterestButton
                        variant="outline"
                        className="w-full px-4 py-2.5 text-sm"
                        label="Enquire about this use"
                        floor="second-floor"
                        title={`${concept.name} on the second floor`}
                        description="Tell us about the operation you are planning and the leasing team will come back with the area, services and terms available."
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-8 max-w-3xl rounded-xl border border-line bg-white p-4 text-xs leading-relaxed text-ink/55">
              {CONCEPT_DISCLAIMER}
            </p>
          </div>
        </section>
      ) : (
        <section className="bg-paper">
          <div className="container-x py-16 lg:py-24">
            <SectionHeading
              eyebrow={`${units.length} units`}
              title={`Units on the ${floor.shortName.toLowerCase()} floor`}
              intro="Each unit can be leased on its own or combined with the unit next door."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {units.map((unit, index) => (
                <UnitCard key={unit.slug} unit={unit} priority={index < 3} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionHeading
              eyebrow="Lease terms"
              title={`Rates for the ${floor.shortName.toLowerCase()} floor`}
              intro="Register your details to see the monthly rate for this floor, its individual units and any combination of them."
            />
            <RateSummary />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
