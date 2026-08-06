import type { Metadata } from "next";
import { Archivo, Inter_Tight, IBM_Plex_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import CursorTrail from "@/components/site/CursorTrail";
import DrawerHost from "@/components/site/DrawerHost";
import MobileBar from "@/components/site/MobileBar";
import Preloader from "@/components/site/Preloader";
import SmoothScroll from "@/components/site/SmoothScroll";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});
const notoDeva = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-deva",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blinksai.com"),
  title: {
    default: "BlinksAI — We build the software. Then we fill it with customers.",
    template: "%s · BlinksAI",
  },
  description: site.sub,
  keywords: [
    "nidhi software",
    "HRMS for security agency",
    "institute franchise management software",
    "whatsapp automation India",
    "AI calling software Hindi",
  ],
  openGraph: {
    title: "BlinksAI — Growth Engineering",
    description: site.sub,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/blinksai-mark-512.png",
        width: 512,
        height: 512,
        alt: "BlinksAI",
      },
    ],
  },
  /* The icons live in `public/`, not as `app/icon.*` file conventions, so they have to
     be declared. `app/favicon.ico` is still emitted — Next unshifts it ahead of this
     list rather than being replaced by it. */
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  robots: { index: true, follow: true },
};

/* Schema — PRD §12. Organization + LocalBusiness so answer engines can cite facts. */
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BlinksAI",
  description: site.sub,
  url: "https://blinksai.com",
  logo: "https://blinksai.com/blinksai-mark-512.png",
  areaServed: "IN",
  founder: { "@type": "Person", name: site.founder },
  knowsAbout: [
    "Custom software development",
    "WhatsApp automation",
    "AI voice agents",
    "Performance marketing",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${archivo.variable} ${interTight.variable} ${plexMono.variable} ${notoDeva.variable} antialiased`}
    >
      <head>
        {/* `.reveal` starts at opacity 0 and `.line > span` starts pushed below a clipped
            baseline — both are released by an IntersectionObserver. Without JS neither
            observer runs, so every headline and revealed section would be invisible,
            including to a crawler that does not execute scripts. */}
        <noscript>
          <style>{`.reveal{opacity:1!important}.line>span{transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="bg-[#111] text-white">
        <Preloader />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-signal focus:text-carbon focus:px-4 focus:py-2 focus:font-medium"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <CursorTrail />
        <DrawerHost />
        <MobileBar />
      </body>
    </html>
  );
}
