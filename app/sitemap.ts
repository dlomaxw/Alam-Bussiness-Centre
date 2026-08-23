import type { MetadataRoute } from "next";

import { SITE_URL, floors, units } from "@/lib/property";
import { seoPages } from "@/lib/seo-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core = [
    { path: "", priority: 1 },
    { path: "/available-spaces", priority: 0.9 },
    { path: "/property-features", priority: 0.7 },
    { path: "/gallery", priority: 0.6 },
    { path: "/location", priority: 0.6 },
    { path: "/book-a-site-visit", priority: 0.8 },
    { path: "/register-your-interest", priority: 0.8 },
    { path: "/faq", priority: 0.5 },
    { path: "/contact", priority: 0.7 },
    { path: "/privacy-policy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
  ];

  return [
    ...core.map((entry) => ({
      url: `${SITE_URL}${entry.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: entry.priority,
    })),
    ...Object.keys(floors).map((floor) => ({
      url: `${SITE_URL}/available-spaces/${floor}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...units.map((unit) => ({
      url: `${SITE_URL}/available-spaces/${unit.floor}/${unit.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...seoPages.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
