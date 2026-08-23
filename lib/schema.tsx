import { SITE_URL, floors, property, units, type Unit } from "@/lib/property";

/**
 * Structured data. Prices are deliberately omitted from every Offer: the rate
 * is gated behind the enquiry form, so publishing it in JSON-LD would hand it
 * to anyone reading the page source.
 */

const address = {
  "@type": "PostalAddress",
  streetAddress: property.street,
  addressLocality: property.city,
  addressRegion: property.region,
  addressCountry: property.country,
};

const geo = {
  "@type": "GeoCoordinates",
  latitude: property.latitude,
  longitude: property.longitude,
};

export function organisationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organisation`,
    name: property.name,
    description:
      "Premium showroom, retail, office, hospitality and leisure space for rent on Fifth Street, Industrial Area, Kampala.",
    url: SITE_URL,
    telephone: property.phone,
    email: property.email,
    image: `${SITE_URL}/images/exterior-street-dusk.webp`,
    logo: `${SITE_URL}/images/exterior-street-dusk.webp`,
    address,
    geo,
    areaServed: "Kampala, Uganda",
    openingHours: "Mo-Fr 09:00-17:00, Sa 09:00-13:00",
  };
}

export function placeSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": `${SITE_URL}/#place`,
    name: property.name,
    address,
    geo,
    photo: `${SITE_URL}/images/exterior-aerial-dusk.webp`,
    maximumAttendeeCapacity: undefined,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "On-plot parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Service lifts", value: true },
      { "@type": "LocationFeatureSpecification", name: "24-hour security", value: true },
      { "@type": "LocationFeatureSpecification", name: "Full-height glazed frontage", value: true },
    ],
  };
}

export function unitListingSchema(unit: Unit) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${SITE_URL}/available-spaces/${unit.floor}/${unit.slug}#listing`,
    name: `${unit.name}, ${unit.floorName} - ${unit.area} m² at ${property.name}`,
    description: unit.summary,
    url: `${SITE_URL}/available-spaces/${unit.floor}/${unit.slug}`,
    datePosted: "2026-01-01",
    image: {
      "@type": "ImageObject",
      contentUrl: `${SITE_URL}${unit.image}`,
      caption: unit.imageAlt,
    },
    about: {
      "@type": "Place",
      name: `${property.name} - ${unit.name}`,
      address,
      geo,
      floorSize: {
        "@type": "QuantitativeValue",
        value: unit.area,
        unitCode: "MTK",
      },
      floorLevel: unit.floorName,
    },
    offers: {
      "@type": "Offer",
      availability:
        unit.status === "Let"
          ? "https://schema.org/SoldOut"
          : unit.status === "Reserved"
            ? "https://schema.org/LimitedAvailability"
            : "https://schema.org/InStock",
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      availabilityStarts: "2026-01-01",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        // Lease terms are released on application - see lib/server/pricing.ts
        description: "Lease terms on application",
      },
      seller: {
        "@type": "Organization",
        name: property.name,
        telephone: property.phone,
        email: property.email,
      },
    },
  };
}

export function breadcrumbSchema(trail: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.href}`,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function itemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Available units at ${property.name}`,
    numberOfItems: units.length,
    itemListElement: units.map((unit, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${unit.name} - ${unit.area} m², ${floors[unit.floor].name}`,
      url: `${SITE_URL}/available-spaces/${unit.floor}/${unit.slug}`,
    })),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
