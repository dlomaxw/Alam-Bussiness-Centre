import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/ui";
import { property } from "@/lib/property";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Alam Business Center collects, uses, stores and protects the personal information submitted through leasing enquiries and site-visit requests.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: "What we collect",
    body: [
      "When you register your interest, request lease terms, book a site visit or send an enquiry, we collect the details you enter: your name, company name, email address, phone and WhatsApp numbers, preferred contact method, business category, the floor or unit you are interested in, the area you need, your expected occupation date, lease duration and any additional requirements you write.",
      "We also record technical information with each enquiry: the page you submitted from, the referring page, campaign parameters in the link you arrived through, your browser user-agent, and a one-way hashed form of your IP address used for spam and rate limiting. The hash cannot be reversed to recover your IP address.",
    ],
  },
  {
    title: "Why we use it",
    body: [
      "To respond to your enquiry with availability, rental rates, lease terms, specifications and floor plans.",
      "To arrange and confirm site visits.",
      "To follow up on active leasing discussions and record the progress of your enquiry.",
      "To understand which units and which marketing channels generate interest, so we can improve how the property is presented.",
    ],
  },
  {
    title: "Lawful basis and consent",
    body: [
      "We contact you because you asked us to: every form on this site requires you to tick a consent box before it can be submitted. You can withdraw that consent at any time by replying to any message from us, or by writing to the address below, and we will stop contacting you.",
    ],
  },
  {
    title: "Who can see your details",
    body: [
      "Your enquiry is visible to the Alam Business Center leasing team and the administrators who maintain this website. We do not sell your details and we do not share them with third parties for their own marketing.",
      "Enquiries are stored in a Cloudflare D1 database. Cloudflare processes this data on our behalf as our hosting provider. Where you contact us through WhatsApp, that conversation is also subject to WhatsApp's own privacy terms.",
    ],
  },
  {
    title: "Analytics and cookies",
    body: [
      "This site can be configured to use Google Analytics 4, Google Tag Manager, Meta Pixel and Microsoft Clarity to measure traffic and conversions. Where these are active they set their own cookies and process usage data under their own privacy terms.",
      "The site stores one item in your browser's local storage once you unlock lease terms, so that rates stay visible as you browse, and one item in session storage recording that you have dismissed the interest card. Neither is shared with anyone.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "Enquiry records are kept for as long as the leasing discussion is live, and afterwards for our business records. If you ask us to delete your details we will remove them from the enquiry database.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You can ask us for a copy of the details we hold about you, ask us to correct anything inaccurate, ask us to delete your record, or object to us contacting you. Write to the email address below and we will respond.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-x py-14 lg:py-20">
          <Breadcrumbs trail={[{ name: "Privacy Policy", href: "/privacy-policy" }]} tone="light" />
          <div className="mt-6">
            <SectionHeading
              as="h1"
              eyebrow="Legal"
              title="Privacy policy"
              intro="How we handle the details you send us through this website."
              tone="light"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <div className="max-w-3xl">
            <p className="rounded-xl border border-line bg-paper p-4 text-sm leading-relaxed text-ink/60">
              This policy describes how the website actually handles data. Company registration
              details, the data-protection contact and any statutory wording required in Uganda
              should be confirmed with the landlord&apos;s legal adviser before launch.
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
                <h2 className="font-display text-2xl text-ink">Contact us about your data</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  Email{" "}
                  <a href={`mailto:${property.email}`} className="text-red underline underline-offset-4">
                    {property.email}
                  </a>{" "}
                  or write to {property.name}, {property.street}, {property.locality},{" "}
                  {property.city}, {property.countryName}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
