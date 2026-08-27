import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CtaBand, FaqList } from "@/components/cta-band";
import { SectionHeading } from "@/components/ui";
import { JsonLd, faqSchema } from "@/lib/schema";
import { property } from "@/lib/property";

export const metadata: Metadata = {
  title: "Frequently Asked Questions About Leasing",
  description:
    "Answers on unit sizes, rental rates, lease duration, parking, service charge, fit-out, handover and site visits at Alam Business Center, Fifth Street, Kampala.",
  alternates: { canonical: "/faq" },
};

const groups = [
  {
    title: "The building",
    faqs: [
      {
        question: "Where is Alam Business Center?",
        answer:
          "Plot 86-90, Fifth Street, Industrial Area, Central Division, Kampala. The site is in Kampala's established commercial district, minutes from the CBD and connected to the Jinja Road corridor.",
      },
      {
        question: "How much space is available in Phase One?",
        answer:
          "4,940 m² of lettable area: 2,390 m² on the ground floor and 2,550 m² on the first floor. The second floor is given over to leisure, hospitality and office use with areas available on application.",
      },
      {
        question: "How many units are there and what size are they?",
        answer:
          "Eight showroom units. On the ground floor: Units 1 and 4 at 570 m², Units 2 and 3 at 625 m². On the first floor: Units 5 and 8 at 615 m², Units 6 and 7 at 660 m².",
      },
      {
        question: "What is the floor-to-floor height?",
        answer:
          "6 metres, on a 6-metre structural grid. That gives enough clear height for vehicle display, double-height retail fit-outs and mezzanine sales areas subject to approval.",
      },
      {
        question: "Is there parking?",
        answer:
          "Yes - 31 on-plot parking bays inside the secure forecourt, with a separate vehicle entrance and exit, perimeter fencing and two guardhouses.",
      },
    ],
  },
  {
    title: "Leasing and terms",
    faqs: [
      {
        question: "What are the rental rates?",
        answer:
          "Rental rates are shared directly with prospective tenants rather than published. Register your interest and the monthly rate for every unit, full floor and combination is shown across the site immediately.",
      },
      {
        question: "Can I lease more than one unit?",
        answer:
          "Yes. Adjacent units on the same floor can be combined into a single tenancy, a full floor can be taken by one occupier, and the whole building is available to a single tenant.",
      },
      {
        question: "What is included and what is extra?",
        answer:
          "Rent is quoted per square metre per month, exclusive of service charge, VAT and utilities. The service charge, deposit and minimum lease duration are confirmed in the written proposal.",
      },
      {
        question: "How long is the minimum lease?",
        answer:
          "Lease duration is agreed case by case and confirmed in the proposal. Tell us the term you have in mind when you register and the leasing team will respond to it directly.",
      },
      {
        question: "Can I fit out the space myself?",
        answer:
          "Yes. Units are handed over as flexible shells with terrazzo floors, glazing and services provision, ready for tenant fit-out. Fit-out proposals are agreed with the landlord before works start.",
      },
    ],
  },
  {
    title: "Viewings and next steps",
    faqs: [
      {
        question: "Can I visit the site?",
        answer: `Yes. Viewings run ${property.viewingHours.toLowerCase()} Book a site visit online and the leasing team will confirm the slot or propose an alternative.`,
      },
      {
        question: "How quickly will someone respond to my enquiry?",
        answer:
          "Enquiries reach the leasing team as soon as they are submitted, and we aim to respond within one working day.",
      },
      {
        question: "Can I reserve a unit?",
        answer:
          "Units can be reserved once terms are agreed in principle. Reserved units are marked on this site so other enquirers can see current availability.",
      },
      {
        question: "Do you work with property agents?",
        answer:
          "Yes. Agents and corporate leasing consultants are welcome to register interest on behalf of a client - note the client's requirements in the additional requirements field.",
      },
    ],
  },
];

const all = groups.flatMap((group) => group.faqs);

export default function FaqPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-x py-14 lg:py-20">
          <Breadcrumbs trail={[{ name: "FAQ", href: "/faq" }]} tone="light" />
          <div className="mt-6">
            <SectionHeading
              as="h1"
              eyebrow="Answers"
              title="Frequently asked questions"
              intro="The questions prospective tenants ask most often about the building, the terms and the leasing process."
              tone="light"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <div className="space-y-16">
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className="font-display text-3xl text-ink">{group.title}</h2>
                <div className="mt-6">
                  <FaqList faqs={group.faqs} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={faqSchema(all)} />
    </>
  );
}
