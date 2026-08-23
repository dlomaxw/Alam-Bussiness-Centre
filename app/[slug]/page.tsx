import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RegisterInterestButton } from "@/components/actions";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CtaBand, FaqList } from "@/components/cta-band";
import { RateSummary } from "@/components/price-tag";
import { UnitCard } from "@/components/unit-card";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { JsonLd, faqSchema } from "@/lib/schema";
import { getSeoPage, seoPages, unitsForPage } from "@/lib/seo-pages";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return seoPages.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      images: [{ url: page.image, alt: page.imageAlt }],
    },
  };
}

export default async function SeoLandingPage({ params }: Params) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) notFound();

  const related = unitsForPage(page);
  const others = seoPages.filter((item) => item.slug !== page.slug).slice(0, 5);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image
          src={page.image}
          alt={page.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/85 to-ink" />
        <div className="container-x relative py-16 lg:py-24">
          <Breadcrumbs trail={[{ name: page.h1, href: `/${page.slug}` }]} tone="light" />
          <div className="mt-6">
            <SectionHeading
              as="h1"
              eyebrow={page.eyebrow}
              title={page.h1}
              tone="light"
            />
            <div className="mt-6 max-w-2xl space-y-4">
              {page.intro.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-white/75 text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <RegisterInterestButton label="Request Lease Terms" source="Pricing Request" />
            <ButtonLink href="/available-spaces" variant="ghost">
              View Available Units
            </ButtonLink>
            <ButtonLink href="/book-a-site-visit" variant="ghost">
              Book a Site Visit
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div className="space-y-14">
              {page.sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="font-display text-3xl leading-tight text-ink">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-relaxed text-ink/70">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.bullets ? (
                    <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-3 text-sm leading-relaxed text-ink/70"
                        >
                          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <RateSummary />
              <div className="mt-6 rounded-2xl border border-line p-6">
                <h2 className="font-display text-xl text-ink">Related pages</h2>
                <ul className="mt-4 space-y-2.5">
                  {others.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/${item.slug}`}
                        className="text-sm text-ink/70 underline underline-offset-4 hover:text-red"
                      >
                        {item.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-paper">
          <div className="container-x py-16 lg:py-24">
            <SectionHeading
              eyebrow="Best suited"
              title="Units that fit this requirement"
              intro="Every unit can be leased on its own or combined with the one next door."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((unit) => (
                <UnitCard key={unit.slug} unit={unit} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-paper">
          <div className="container-x py-16 lg:py-24">
            <SectionHeading
              eyebrow="Second floor"
              title="Area available on application"
              intro="This use is accommodated on the second floor, where the area is configured to the operator rather than fixed in advance."
            />
            <div className="mt-8">
              <ButtonLink href="/available-spaces/second-floor" variant="dark">
                Explore the second floor
              </ButtonLink>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <SectionHeading eyebrow="Questions" title="Frequently asked" />
          <div className="mt-10">
            <FaqList faqs={page.faqs} />
          </div>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={faqSchema(page.faqs)} />
    </>
  );
}
