import type { Metadata } from "next";

import {
  BrochureLink,
  EmailLink,
  PhoneLink,
  WhatsAppLink,
} from "@/components/actions";
import { GENERAL_WHATSAPP_MESSAGE } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadForm } from "@/components/lead-form";
import { SectionHeading } from "@/components/ui";
import { property } from "@/lib/property";

export const metadata: Metadata = {
  title: "Contact the Leasing Team, Fifth Street Kampala",
  description:
    "Speak to the leasing team at Alam Business Center, Plot 86-90 Fifth Street, Industrial Area, Kampala. Call, email or message on WhatsApp for availability and lease terms.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-x py-14 lg:py-20">
          <Breadcrumbs trail={[{ name: "Contact", href: "/contact" }]} tone="light" />
          <div className="mt-6">
            <SectionHeading
              as="h1"
              eyebrow="Leasing team"
              title="Contact us"
              intro="Call, email or message on WhatsApp. We answer leasing enquiries during working hours and respond to messages the same day where we can."
              tone="light"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <div className="grid gap-4">
                <ContactCard label="Call the leasing team">
                  <PhoneLink className="font-display text-2xl text-ink hover:text-red">
                    {property.phoneDisplay}
                  </PhoneLink>
                </ContactCard>

                <ContactCard label="WhatsApp">
                  <WhatsAppLink
                    message={GENERAL_WHATSAPP_MESSAGE}
                    className="font-display text-2xl text-ink hover:text-red"
                  >
                    Message us on WhatsApp
                  </WhatsAppLink>
                </ContactCard>

                <ContactCard label="Email">
                  <EmailLink
                    subject="Leasing enquiry - Alam Business Center"
                    className="font-display text-2xl break-words text-ink hover:text-red"
                  >
                    {property.email}
                  </EmailLink>
                </ContactCard>

                <ContactCard label="Visit">
                  <address className="text-base leading-relaxed text-ink/75 not-italic">
                    {property.street}
                    <br />
                    {property.locality}, {property.city}
                    <br />
                    {property.countryName}
                  </address>
                </ContactCard>

                <ContactCard label="Viewing hours">
                  <p className="text-base leading-relaxed text-ink/75">{property.viewingHours}</p>
                </ContactCard>
              </div>

              <div className="mt-6">
                <BrochureLink variant="outline" className="text-sm">
                  Download the property presentation
                </BrochureLink>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_30px_60px_-50px_rgba(11,11,11,0.6)] sm:p-8">
              <LeadForm
                source="Contact Form"
                submitLabel="Send my enquiry"
                title="Send a message"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-ink/45 uppercase">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
