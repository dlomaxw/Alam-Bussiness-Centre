import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  BrochureLink,
  RegisterInterestButton,
  WhatsAppLink,
} from "@/components/actions";
import { unitWhatsappMessage } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CtaBand } from "@/components/cta-band";
import { LeadForm } from "@/components/lead-form";
import { PriceTag } from "@/components/price-tag";
import { UnitCard } from "@/components/unit-card";
import { UnitViewBeacon } from "@/components/lead-dialog";
import { ButtonLink, SectionHeading, StatusPill } from "@/components/ui";
import { JsonLd, unitListingSchema } from "@/lib/schema";
import { floors, formatArea, getUnit, property, units } from "@/lib/property";

type Params = { params: Promise<{ floor: string; unit: string }> };

export function generateStaticParams() {
  return units.map((unit) => ({ floor: unit.floor, unit: unit.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { floor, unit: slug } = await params;
  const unit = getUnit(floor, slug);
  if (!unit) return {};

  const title = `${unit.name}, ${unit.floorName} - ${unit.area} m² ${unit.headline} for Rent in Kampala`;

  return {
    title,
    description: unit.summary,
    alternates: { canonical: `/available-spaces/${unit.floor}/${unit.slug}` },
    openGraph: {
      title,
      description: unit.summary,
      images: [{ url: unit.image, alt: unit.imageAlt }],
    },
  };
}

export default async function UnitPage({ params }: Params) {
  const { floor: floorSlug, unit: slug } = await params;
  const unit = getUnit(floorSlug, slug);
  if (!unit) notFound();

  const floor = floors[unit.floor];
  const related = units.filter((item) => item.slug !== unit.slug).slice(0, 3);
  const whatsapp = unitWhatsappMessage(unit.name, unit.floorName, unit.area);

  const specifications = [
    { label: "Unit", value: unit.name },
    { label: "Floor", value: unit.floorName },
    { label: "Area", value: formatArea(unit.area) },
    { label: "Availability", value: unit.status },
    { label: "Floor-to-floor height", value: "6 metres" },
    { label: "Structural grid", value: "6 metres" },
    {
      label: "Floor finish",
      value: unit.floor === "ground-floor" ? "Terrazzo" : "Terrazzo, porcelain tiles to offices",
    },
    {
      label: "Access",
      value:
        unit.floor === "ground-floor"
          ? "Level access from the internal forecourt"
          : "Two staircases and two service lifts from the shared lobby",
    },
    { label: "Parking", value: "31 on-plot bays, separate entrance and exit" },
    { label: "Service lift", value: "Two service lifts serving all floors" },
    { label: "Glazing", value: "Full-height curtain-wall glazing" },
    { label: "Utilities", value: "Three-phase power, water and drainage provision" },
  ];

  return (
    <>
      <section className="bg-white">
        <div className="container-x pt-8 pb-4">
          <Breadcrumbs
            trail={[
              { name: "Available Spaces", href: "/available-spaces" },
              { name: floor.name, href: `/available-spaces/${floor.slug}` },
              { name: unit.name, href: `/available-spaces/${unit.floor}/${unit.slug}` },
            ]}
          />
        </div>

        <div className="container-x pb-16 lg:pb-24">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
            <div>
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
                <Image
                  src={unit.image}
                  alt={unit.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <StatusPill status={unit.status} />
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink/45">
                Illustrative fit-out concept. Final layouts, areas, services and approvals depend on
                the selected unit and tenant requirements.
              </p>
            </div>

            <div>
              <UnitViewBeacon slug={unit.slug} />
              <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-ink/45 uppercase">
                {unit.floorName} · {formatArea(unit.area)}
              </p>
              <h1 className="font-display mt-3 text-4xl leading-tight text-ink lg:text-5xl">
                {unit.name}
              </h1>
              <p className="mt-2 text-lg text-ink/80">{unit.headline}</p>
              <p className="mt-5 text-base leading-relaxed text-ink/70">{unit.summary}</p>

              <div className="mt-7 rounded-2xl border border-line bg-paper p-5">
                <p className="text-xs tracking-wide text-ink/55">Monthly rent</p>
                <div className="mt-2">
                  <PriceTag
                    slug={unit.slug}
                    unitName={`${unit.name}, ${unit.floorName}`}
                    size="lg"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <RegisterInterestButton
                  label="Register Interest"
                  unit={unit.slug}
                  floor={unit.floor}
                  title={`Register interest in ${unit.name}`}
                  description={`Tell us about your business and we will send availability, lease terms and specifications for ${unit.name}.`}
                />
                <ButtonLink href="/book-a-site-visit" variant="outline">
                  Book a Site Visit
                </ButtonLink>
                <WhatsAppLink
                  message={whatsapp}
                  unit={unit.slug}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
                >
                  WhatsApp about {unit.name}
                </WhatsAppLink>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <BrochureLink className="text-red underline underline-offset-4">
                  Download the unit sheet
                </BrochureLink>
                <Link
                  href="#floor-plan"
                  className="text-ink/60 underline underline-offset-4 hover:text-ink"
                >
                  Request a floor plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-x py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading eyebrow="Specifications" title="Unit specifications" />
              <dl className="mt-8 divide-y divide-line border-y border-line">
                {specifications.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-6 py-3.5">
                    <dt className="text-sm text-ink/55">{spec.label}</dt>
                    <dd className="text-right text-sm font-medium text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <SectionHeading eyebrow="Suitable for" title="Business uses" />
              <ul className="mt-8 space-y-3">
                {unit.uses.map((use) => (
                  <li
                    key={use}
                    className="flex items-start gap-3 rounded-xl border border-line bg-white p-4 text-sm text-ink/75"
                  >
                    <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                    {use}
                  </li>
                ))}
              </ul>

              <h3 className="font-display mt-10 text-2xl text-ink">Unit features</h3>
              <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {unit.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="floor-plan" className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Enquire"
                title={`Request terms and the floor plan for ${unit.name}`}
                intro="Send your details and the leasing team will reply with the floor-plan extract, lease terms, service charge and available handover dates. Rental rates appear on this page as soon as you submit."
              />
              <div className="mt-8 rounded-2xl border border-line bg-paper p-5">
                <p className="text-sm leading-relaxed text-ink/70">
                  Prefer to talk? Call{" "}
                  <a href={`tel:${property.phone}`} className="font-medium text-ink">
                    {property.phoneDisplay}
                  </a>{" "}
                  or message the leasing team on WhatsApp. Viewing hours are {property.viewingHours}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_30px_60px_-50px_rgba(11,11,11,0.6)] sm:p-8">
              <LeadForm
                source="Unit Enquiry"
                defaultUnit={unit.slug}
                defaultFloor={unit.floor}
                submitLabel="Send enquiry and show the rate"
                title={`Enquire about ${unit.name}`}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-x py-16 lg:py-24">
          <SectionHeading eyebrow="Also available" title="Related units" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <UnitCard key={item.slug} unit={item} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={unitListingSchema(unit)} />
    </>
  );
}
