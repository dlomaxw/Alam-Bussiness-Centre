import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CtaBand } from "@/components/cta-band";
import { RateSummary } from "@/components/price-tag";
import { UnitCatalogue } from "@/components/unit-catalogue";
import { SectionHeading } from "@/components/ui";
import { JsonLd, itemListSchema } from "@/lib/schema";
import { buildingStats } from "@/lib/property";

export const metadata: Metadata = {
  title: "Available Commercial Units for Rent | 570-660 m² Showroom & Office Space",
  description:
    "Compare all eight available units at Alam Business Centre, Fifth Street, Kampala. Showroom, retail, banking and office space from 570 to 660 m², individually or combined.",
  alternates: { canonical: "/available-spaces" },
};

export default function AvailableSpacesPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-x py-14 lg:py-20">
          <Breadcrumbs trail={[{ name: "Available Spaces", href: "/available-spaces" }]} tone="light" />
          <div className="mt-6">
            <SectionHeading
              as="h1"
              eyebrow="Phase One"
              title="Available spaces"
              intro="4,940 m² of lettable area across eight showroom units and a second floor configured to requirement. Filter by floor, size, business type and availability."
              tone="light"
            />
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-8 sm:grid-cols-3 lg:grid-cols-5">
            {buildingStats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-2xl leading-none font-medium lg:text-3xl">
                  {stat.value}
                </dt>
                <dd className="mt-2 text-xs leading-relaxed text-white/55">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-x py-16 lg:py-24">
          <UnitCatalogue />
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionHeading
              eyebrow="Lease terms"
              title="See the rate for every unit"
              intro="Commercial terms are shared directly with prospective tenants. Register your details once and rates appear on every unit card, floor page and combination on this site."
            />
            <RateSummary />
          </div>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={itemListSchema()} />
    </>
  );
}
