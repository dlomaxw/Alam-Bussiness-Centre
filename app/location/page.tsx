import type { Metadata } from "next";
import Image from "next/image";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CtaBand } from "@/components/cta-band";
import { MapLink } from "@/components/map-link";
import { SectionHeading } from "@/components/ui";
import { property } from "@/lib/property";

export const metadata: Metadata = {
  title: "Location & Access | Fifth Street, Industrial Area, Kampala",
  description:
    "Alam Business Centre is at Plot 86-90, Fifth Street, Industrial Area, Central Division, Kampala - minutes from the CBD with direct access to the Jinja Road corridor.",
  alternates: { canonical: "/location" },
};

const connections = [
  { place: "Kampala CBD", detail: "Direct access through Industrial Area to the city centre." },
  { place: "Jinja Road corridor", detail: "Connects the site to eastern Uganda and the regional freight route." },
  { place: "Nakawa", detail: "Adjacent commercial and industrial district." },
  { place: "Port Bell Road", detail: "Onward access towards Luzira and the lakeside industrial belt." },
  { place: "Entebbe Road", detail: "Route to Entebbe International Airport via the southern bypass." },
  { place: "Kampala Northern Bypass", detail: "Avoids the city centre for goods vehicles." },
];

const access = [
  "Separate vehicle entrance and exit onto Fifth Street",
  "31 on-plot parking bays inside the secure forecourt",
  "Level access into ground-floor units for vehicles and deliveries",
  "Two guardhouses controlling arrival and departure",
  "Perimeter fencing to the full site boundary",
  "Goods handled through two service lifts",
];

export default function LocationPage() {
  const query = encodeURIComponent(
    `${property.street}, ${property.locality}, ${property.city}, ${property.countryName}`,
  );

  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-x py-14 lg:py-20">
          <Breadcrumbs trail={[{ name: "Location", href: "/location" }]} tone="light" />
          <div className="mt-6">
            <SectionHeading
              as="h1"
              eyebrow="Industrial Area, Central Division"
              title="Location and access"
              intro="Fifth Street sits in the heart of Kampala's established commercial and distribution district, with quick access to the CBD and the Jinja Road corridor."
              tone="light"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div className="overflow-hidden rounded-2xl border border-line">
              <iframe
                title={`Map showing ${property.name} on Fifth Street, Industrial Area, Kampala`}
                src={`https://www.google.com/maps?q=${query}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[420px] w-full border-0"
              />
            </div>

            <div>
              <SectionHeading eyebrow="The address" title="Plot 86-90, Fifth Street" />
              <address className="mt-6 text-base leading-relaxed text-ink/70 not-italic">
                {property.street}
                <br />
                {property.locality}
                <br />
                {property.city}, {property.countryName}
              </address>

              <div className="mt-6">
                <MapLink query={query} />
              </div>

              <h3 className="font-display mt-10 text-2xl text-ink">Site access</h3>
              <ul className="mt-4 space-y-2.5">
                {access.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-x py-16 lg:py-24">
          <SectionHeading
            eyebrow="Connections"
            title="What the site connects to"
            intro="Industrial Area is Kampala's most established commercial address, and Fifth Street carries steady trade traffic throughout the working day."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {connections.map((connection) => (
              <div key={connection.place} className="rounded-2xl border border-line bg-white p-6">
                <h3 className="font-display text-xl text-ink">{connection.place}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{connection.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <div className="relative aspect-21/9 overflow-hidden rounded-2xl">
            <Image
              src="/images/exterior-frontage-gatehouse.webp"
              alt="The Alam Business Centre frontage and gatehouse seen from Fifth Street"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-4 text-sm text-ink/55">
            Viewing hours: {property.viewingHours} Site visits are arranged with the leasing team in
            advance.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
