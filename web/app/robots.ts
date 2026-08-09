import type { MetadataRoute } from "next";

/** PRD §12 — everything is indexable; the sitemap is the entry point. */
import { SITE_URL } from "@/lib/content";

const SITE = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
