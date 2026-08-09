"use client";

import Script from "next/script";
import { useEffect } from "react";
import { GOOGLE_ADS_ID, reportConversion } from "@/lib/gtag";

/**
 * Google Ads tag + automatic conversion tracking.
 *
 * Every WhatsApp and phone link on the site is caught by one delegated
 * listener rather than an onClick on each control. The site adds those
 * links in a dozen places — the drawer, the mobile bar, the footer,
 * platform pages — and any per-button approach guarantees that the next
 * one added is the one that silently stops counting.
 *
 * `afterInteractive` keeps the tag off the critical path; the hero and
 * the 3D scene matter more to a first-time visitor than a beacon that
 * only needs to fire on a click.
 */
export default function Analytics() {
  useEffect(() => {
    /* Capture phase: a WhatsApp link that opens in a new tab, or a React
       handler that calls preventDefault, would otherwise never reach a
       bubbling listener. We only report — navigation is left alone. */
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";

      if (href.startsWith("tel:")) {
        reportConversion("phoneClick");
        return;
      }
      if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
        reportConversion("whatsappClick");
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <>
      <Script
        id="gtag-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}
