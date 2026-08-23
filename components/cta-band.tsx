import Link from "next/link";

import {
  BrochureLink,
  RegisterInterestButton,
  WhatsAppLink,
} from "@/components/actions";
import { GENERAL_WHATSAPP_MESSAGE } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/ui";

export function CtaBand({
  eyebrow = "Next step",
  title = "Speak to the leasing team",
  intro = "Register your interest, book a site visit, or send a WhatsApp message and we will come back with availability, lease terms and floor plans.",
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  return (
    <section className="bg-ink text-white">
      <div className="container-x py-16 lg:py-24">
        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
          <SectionHeading eyebrow={eyebrow} title={title} intro={intro} tone="light" />
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <RegisterInterestButton label="Register Your Interest" />
            <Link
              href="/book-a-site-visit"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Book a Site Visit
            </Link>
            <WhatsAppLink
              message={GENERAL_WHATSAPP_MESSAGE}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Enquire on WhatsApp
            </WhatsAppLink>
            <BrochureLink variant="ghost" className="text-sm">
              Download the Presentation
            </BrochureLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqList({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((faq) => (
        <details key={faq.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left">
            <h3 className="font-display text-xl leading-snug text-ink group-open:text-red">
              {faq.question}
            </h3>
            <span
              aria-hidden
              className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-ink/60 transition-transform group-open:rotate-45"
            >
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none">
                <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink/70">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
