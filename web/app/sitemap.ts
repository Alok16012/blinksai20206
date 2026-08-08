import type { MetadataRoute } from "next";
import { automations, platforms } from "@/lib/content";

/**
 * PRD §12 — XML sitemap for every indexable route.
 *
 * Origin is kept in step with `metadataBase` in app/layout.tsx. Platform and
 * automation URLs are derived from lib/content.ts so a new entry there is
 * indexed without touching this file.
 */
const SITE = "https://blinksai.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const platformPages: MetadataRoute.Sitemap = platforms.map((p) => ({
    url: `${SITE}/platforms/${p.slug}`,
    lastModified,
    changeFrequency: "monthly",
    // A product still in development has less to say to a crawler than a live one.
    priority: p.status === "live" ? 0.8 : 0.5,
  }));

  const automationPages: MetadataRoute.Sitemap = automations.map((a) => ({
    url: `${SITE}${a.href}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: SITE, lastModified, changeFrequency: "weekly", priority: 1 },

    /* Build — the crown jewels (PRD §7.5) */
    { url: `${SITE}/platforms`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...platformPages,
    { url: `${SITE}/build`, lastModified, changeFrequency: "monthly", priority: 0.8 },

    /* Proof */
    { url: `${SITE}/work`, lastModified, changeFrequency: "weekly", priority: 0.9 },

    /* Grow + Automate */
    { url: `${SITE}/grow`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/automate`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...automationPages,

    /* Company */
    { url: `${SITE}/about`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE}/contact`, lastModified, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
