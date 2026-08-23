import type { Metadata } from "next";
import Image from "next/image";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadForm } from "@/components/lead-form";
import { SectionHeading } from "@/components/ui";
import { property } from "@/lib/property";

export const metadata: Metadata = {
  title: "Book a Site Visit | View Commercial Space on Fifth Street, Kampala",
  description:
    "Arrange a viewing of the available showroom, retail and office units at Alam Business Centre, Fifth Street, Industrial Area, Kampala. Choose a date and the leasing team will confirm.",
  alternates: { canonical: "/book-a-site-visit" },
};

const steps = [
  { title: "Send your request", body: "Tell us the date, time and which units you want to see." },
  { title: "We confirm", body: "A member of the leasing team confirms the slot or proposes an alternative." },
  { title: "Visit the building", body: "You are walked through the units, the forecourt, parking and service access." },
  { title: "Terms and next steps", body: "We follow up with lease terms, the floor plan and a written proposal." },
];

export default function BookSiteVisitPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-x py-14 lg:py-20">
          <Breadcrumbs
            trail={[{ name: "Book a Site Visit", href: "/book-a-site-visit" }]}
            tone="light"
          />
          <div className="mt-6">
            <SectionHeading
              as="h1"
              eyebrow="Viewings"
              title="Book a site visit"
              intro="See the frontage, the floor plates and the service access in person. Viewings run during working hours and take around 30 minutes."
              tone="light"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <SectionHeading eyebrow="How it works" title="From request to viewing" />
              <ol className="mt-8 space-y-6">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red text-sm font-medium text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-xl text-ink">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink/60">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-10 rounded-2xl border border-line bg-paper p-5">
                <p className="text-sm leading-relaxed text-ink/70">
                  <strong className="font-medium text-ink">Viewing hours.</strong>{" "}
                  {property.viewingHours} Outside these hours, ask and we will do our best to
                  accommodate.
                </p>
              </div>

              <div className="relative mt-8 aspect-3/2 overflow-hidden rounded-2xl">
                <Image
                  src="/images/exterior-corner-entrance.webp"
                  alt="The controlled vehicle entrance and guardhouse at Alam Business Centre"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_30px_60px_-50px_rgba(11,11,11,0.6)] sm:p-8">
              <LeadForm
                source="Site Visit"
                submitLabel="Request this site visit"
                title="Request a viewing"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
