import type { MetadataRoute } from "next";

/** PRD §12 — everything is indexable; the sitemap is the entry point. */
const SITE = "https://blinksai.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
