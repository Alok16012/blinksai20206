import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The indicator sits bottom-left, exactly where the sticky mobile CTA bar lives
  // (PRD §8 thumb zone), so it hides the thing that most needs reviewing.
  devIndicators: false,

  // Dev only. Next blocks cross-origin requests to dev assets by default, so opening the
  // dev server on a LAN address (to check the site on a phone) serves the HTML but
  // blocks every /_next chunk. The page then renders as un-hydrated SSR output: nav and
  // copy present, but nothing animates, no 3D, and every `.reveal` stuck at opacity 0 —
  // which looks exactly like a broken build rather than a blocked request.
  //
  // The private ranges below cover a normal home/office network. This has no effect on
  // `next build` or production.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*", "*.local"],

  // The digital marketing proposal deck is a self-contained static file in `public/`,
  // not a React route — it is a sales artefact sent to a prospect over WhatsApp, and it
  // is kept verbatim rather than rebuilt. The rewrite is only so the link that gets
  // pasted into a chat reads `/proposal` instead of `/proposal.html`.
  async rewrites() {
    return [{ source: "/proposal", destination: "/proposal.html" }];
  },
};

export default nextConfig;
