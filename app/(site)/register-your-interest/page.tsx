import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadForm } from "@/components/lead-form";
import { RateSummary } from "@/components/price-tag";
import { SectionHeading } from "@/components/ui";
import { buildingStats } from "@/lib/property";

export const metadata: Metadata = {
  title: "Register Your Interest and See Lease Terms",
  description:
    "Register your interest in showroom, retail, office, hospitality or leisure space at Alam Business Center, Fifth Street, Kampala, and receive rental rates, availability and lease terms.",
  alternates: { canonical: "/register-your-interest" },
};

const receive = [
  "The monthly rental rate for every unit, floor and combination",
  "Current availability across Phase One",
  "Unit specifications and the property presentation",
  "Floor-plan extracts for the units you are considering",
  "Service charge, deposit and lease duration in the written proposal",
  "Site-visit options at a time that suits you",
];

export default function RegisterInterestPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-x py-14 lg:py-20">
          <Breadcrumbs
            trail={[{ name: "Register Your Interest", href: "/register-your-interest" }]}
            tone="light"
          />
          <div className="mt-6">
            <SectionHeading
              as="h1"
              eyebrow="Leasing enquiry"
              title="Interested in leasing a space?"
              intro="Register your interest to receive availability, rental terms, unit specifications and site-visit options. It takes under a minute and unlocks rates across the whole site."
              tone="light"
            />
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-8 sm:grid-cols-3 lg:grid-cols-5">
            {buildingStats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-2xl leading-none font-medium">{stat.value}</dt>
                <dd className="mt-2 text-xs leading-relaxed text-white/55">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <SectionHeading eyebrow="What you receive" title="Sent straight back to you" />
              <ul className="mt-8 space-y-3">
                {receive.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <RateSummary />
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_30px_60px_-50px_rgba(11,11,11,0.6)] sm:p-8">
              <LeadForm
                source="Register Interest"
                submitLabel="Register my interest"
                title="Register your interest"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
