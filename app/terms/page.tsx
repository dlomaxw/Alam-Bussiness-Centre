import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/ui";
import { property } from "@/lib/property";

export const metadata: Metadata = {
  title: "Terms and Conditions | Alam Business Centre",
  description:
    "Terms governing the use of the Alam Business Centre website, the status of published areas, renders and rental rates, and the basis on which enquiries are handled.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    title: "About this website",
    body: [
      `This website is published to market available commercial space at ${property.name}, ${property.street}, ${property.locality}, ${property.city}. By using it you accept these terms.`,
    ],
  },
  {
    title: "Areas and specifications",
    body: [
      "Areas, dimensions, heights, unit counts and specifications published on this site are taken from the official property presentation and are given in good faith. They are approximate, may be measured on different bases, and are subject to survey and final measurement.",
      "Nothing on this site forms part of any offer or contract. Any lease is governed solely by the written agreement signed by the parties.",
    ],
  },
  {
    title: "Visuals and fit-out concepts",
    body: [
      "Interior images on this site are illustrative fit-out concepts produced to show the kinds of business each unit and the second floor can accommodate. They do not represent the condition in which a unit is handed over.",
      "Final layouts, areas, services and approvals depend on the selected unit and tenant requirements. Exterior renders show the design intent and may differ from the completed building.",
    ],
  },
  {
    title: "Rental rates and lease terms",
    body: [
      "Rental rates released through this site are indicative, quoted per square metre per month, exclusive of service charge, VAT and utilities, and are subject to contract. They may be varied or withdrawn at any time before a lease is signed.",
      "Availability shown on this site is updated by the leasing team and may change between updates. A unit shown as available is not reserved for you until confirmed in writing.",
    ],
  },
  {
    title: "Enquiries",
    body: [
      "By submitting an enquiry you confirm the details you provide are accurate and that you are authorised to make the enquiry on behalf of any company you name. Enquiries are handled as described in the privacy policy.",
      "We may decline to respond to enquiries that are automated, abusive or submitted in bad faith, and we apply rate limiting and spam protection to the forms on this site.",
    ],
  },
  {
    title: "Third-party content",
    body: [
      "This site embeds a map from Google and links to WhatsApp. Those services are operated by third parties under their own terms, and we are not responsible for their content or availability.",
    ],
  },
  {
    title: "Liability",
    body: [
      "We take care to keep this site accurate and available, but we do not warrant that it will be uninterrupted or error-free. To the extent permitted by law, we are not liable for loss arising from reliance on information published here in place of professional advice or the signed lease documents.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-x py-14 lg:py-20">
          <Breadcrumbs trail={[{ name: "Terms and Conditions", href: "/terms" }]} tone="light" />
          <div className="mt-6">
            <SectionHeading
              as="h1"
              eyebrow="Legal"
              title="Terms and conditions"
              intro="The basis on which information is published here and enquiries are handled."
              tone="light"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <div className="max-w-3xl">
            <p className="rounded-xl border border-line bg-paper p-4 text-sm leading-relaxed text-ink/60">
              These terms describe how the site operates. Company registration details, governing
              law and any statutory wording required in Uganda should be confirmed with the
              landlord&apos;s legal adviser before launch.
            </p>

            <div className="mt-10 space-y-10">
              {sections.map((section) => (
                <div key={section.title}>
                  <h2 className="font-display text-2xl text-ink">{section.title}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="mt-3 text-sm leading-relaxed text-ink/70">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}

              <div>
                <h2 className="font-display text-2xl text-ink">Contact</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  Questions about these terms:{" "}
                  <a href={`mailto:${property.email}`} className="text-red underline underline-offset-4">
                    {property.email}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
