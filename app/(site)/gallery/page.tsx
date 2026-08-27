import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CtaBand } from "@/components/cta-band";
import { Gallery, type GalleryImage } from "@/components/gallery";
import { SectionHeading } from "@/components/ui";
import { CONCEPT_DISCLAIMER } from "@/lib/property";

export const metadata: Metadata = {
  title: "Gallery | 3D Renders of the Development",
  description:
    "Exterior and interior 3D renders of Alam Business Center on Fifth Street, Kampala - showroom, retail, banking, office, restaurant, gym, spa and events fit-out concepts.",
  alternates: { canonical: "/gallery" },
};

const images: GalleryImage[] = [
  {
    src: "/images/exterior-street-dusk.webp",
    alt: "Alam Business Center street elevation at dusk with lit interiors and palm trees along Fifth Street",
    caption: "Fifth Street elevation at dusk",
    group: "Exterior",
  },
  {
    src: "/images/exterior-aerial-dusk.webp",
    alt: "Aerial view of Alam Business Center at dusk showing the full frontage, forecourt and gatehouse",
    caption: "Aerial view of the frontage",
    group: "Exterior",
  },
  {
    src: "/images/exterior-corner-entrance.webp",
    alt: "Corner elevation of Alam Business Center with the controlled vehicle entrance and guardhouse",
    caption: "Corner elevation and entrance",
    group: "Exterior",
  },
  {
    src: "/images/exterior-frontage-gatehouse.webp",
    alt: "Long view of the Alam Business Center frontage with composite cladding and full-height glazing",
    caption: "77.1 metre glazed frontage",
    group: "Exterior",
  },
  {
    src: "/images/atrium-reception.webp",
    alt: "Double-height reception atrium with timber feature wall, terrazzo floors and a first-floor gallery",
    caption: "Reception atrium",
    group: "Common areas",
  },
  {
    src: "/images/interior-showroom-corridor.webp",
    alt: "Internal showroom corridor with display bays, terrazzo floors and full-height glazing",
    caption: "Showroom corridor",
    group: "Common areas",
  },
  {
    src: "/images/interior-showroom-dusk.webp",
    alt: "Open showroom floor at dusk with display plinths and a fully glazed elevation",
    caption: "Open showroom floor at dusk",
    group: "Common areas",
  },
  {
    src: "/images/interior-facade-display.webp",
    alt: "Facade and glazing display within a showroom unit at Alam Business Center",
    caption: "Display bays against the facade",
    group: "Common areas",
  },
  {
    src: "/images/interior-showroom-meeting-suite.webp",
    alt: "Glazed meeting suite within an open showroom floor",
    caption: "Glazed meeting suite",
    group: "Common areas",
  },
  {
    src: "/images/unit-1-dealership.webp",
    alt: "Unit 1 fitted as a car and motorcycle dealership with vehicles behind full-height glazing",
    caption: "Unit 1 - dealership concept",
    group: "Ground floor",
  },
  {
    src: "/images/unit-2-electronics.webp",
    alt: "Unit 2 fitted as an electronics and home-appliance showroom",
    caption: "Unit 2 - electronics concept",
    group: "Ground floor",
  },
  {
    src: "/images/unit-3-supermarket.webp",
    alt: "Unit 3 fitted as a supermarket with produce displays, aisles and checkout lanes",
    caption: "Unit 3 - supermarket concept",
    group: "Ground floor",
  },
  {
    src: "/images/unit-4-finishes-showroom.webp",
    alt: "Unit 4 fitted as a building-finishes showroom with window and door displays",
    caption: "Unit 4 - finishes showroom concept",
    group: "Ground floor",
  },
  {
    src: "/images/unit-5-furniture.webp",
    alt: "Unit 5 fitted as a furniture and interior-design showroom with staged room sets",
    caption: "Unit 5 - furniture concept",
    group: "First floor",
  },
  {
    src: "/images/unit-6-appliances.webp",
    alt: "Unit 6 fitted as a home-appliance and kitchen showroom",
    caption: "Unit 6 - appliance concept",
    group: "First floor",
  },
  {
    src: "/images/unit-7-bank.webp",
    alt: "Unit 7 fitted as a bank branch with a teller line and waiting lounge",
    caption: "Unit 7 - banking concept",
    group: "First floor",
  },
  {
    src: "/images/unit-8-offices.webp",
    alt: "Unit 8 fitted as a corporate office with reception, open-plan desking and a glazed boardroom",
    caption: "Unit 8 - office concept",
    group: "First floor",
  },
  {
    src: "/images/concept-restaurant.webp",
    alt: "Second-floor restaurant and bar concept with open kitchen and panoramic glazing",
    caption: "Restaurant and bar concept",
    group: "Second floor",
  },
  {
    src: "/images/concept-gym.webp",
    alt: "Second-floor gym concept with cardio equipment, free weights, sauna and steam rooms",
    caption: "Gym, sauna and steam concept",
    group: "Second floor",
  },
  {
    src: "/images/concept-spa.webp",
    alt: "Second-floor wellness spa concept with treatment suites and a hydrotherapy pool",
    caption: "Wellness spa concept",
    group: "Second floor",
  },
  {
    src: "/images/concept-yoga.webp",
    alt: "Second-floor yoga studio concept with timber flooring and panoramic glazing",
    caption: "Yoga studio concept",
    group: "Second floor",
  },
  {
    src: "/images/concept-nightclub.webp",
    alt: "Second-floor nightclub and events lounge concept with bar, dance floor and lighting rig",
    caption: "Nightclub and events concept",
    group: "Second floor",
  },
];

export default function GalleryPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-x py-14 lg:py-20">
          <Breadcrumbs trail={[{ name: "Gallery", href: "/gallery" }]} tone="light" />
          <div className="mt-6">
            <SectionHeading
              as="h1"
              eyebrow="Renders"
              title="Gallery"
              intro="Exterior renders of the completed building, and illustrative fit-out concepts showing how each unit and the second floor can be used."
              tone="light"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-16 lg:py-24">
          <Gallery images={images} />
          <p className="mt-10 max-w-3xl rounded-xl border border-line bg-paper p-4 text-xs leading-relaxed text-ink/55">
            {CONCEPT_DISCLAIMER}
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
