import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { notFound } from "next/navigation";
import { SITE_URL, platforms, process, type Platform } from "@/lib/content";
import { Button, Eyebrow, Reveal, Tilt } from "@/components/ui";
import ModuleStackFrame, { ModuleStackCanvas } from "@/components/three/ModuleStackFrame";

/**
 * /platforms/{slug} — PRD §7.5.
 *
 * Required on every one of these pages: what it does · the module map · who it's for ·
 * deployment time · pricing model · "Book a walkthrough".
 *
 * Honesty rule (PRD §7.8 / §16 assumptions): product screenshots are an *assumption to
 * confirm* — they can only ship once each client clears a data-masked capture. Until
 * then this page renders a labelled empty slot, never a mockup dressed as a product.
 * Copy below is assembled from facts in lib/content.ts only.
 *
 * The slot is now a drop-in: put `{slug}.webp` in web/public/platforms/ and set `shot` /
 * `shotAlt` (and optionally `gallery`) on the platform in lib/content.ts. The empty state
 * and the image share one box, so the switch never moves anything on the page. The
 * owner-facing instructions, including the masking checklist, are in
 * web/public/platforms/README.md.
 */

/* Canonical origin comes from lib/content — see SITE_URL there. */

/** Same accent the platform gets in the rail, derived from its position in the list. */
function stackAccent(slug: string) {
  return Math.max(0, platforms.findIndex((x) => x.slug === slug)) % 3;
}

export function generateStaticParams() {
  return platforms.map((p) => ({ slug: p.slug }));
}

function find(slug: string): Platform | undefined {
  return platforms.find((p) => p.slug === slug);
}

function describe(p: Platform): string {
  const base = `${p.headline}. ${p.product} is the licensed version of ${p.name} — ${p.modules.length} module groups for ${p.for}.`;
  return p.status === "live"
    ? `${base} Configured and live in ${p.deploy}. Pricing: ${p.model}.`
    : `${base} Currently in development — we will tell you what is ready before you commit.`;
}

export async function generateMetadata({
  params,
}: PageProps<"/platforms/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = find(slug);
  if (!p) return { title: "Platform not found", robots: { index: false, follow: false } };

  return {
    title: `${p.product} — ${p.industry}`,
    description: describe(p),
    alternates: { canonical: `/platforms/${p.slug}` },
    openGraph: {
      title: `${p.product} — ${p.headline}`,
      description: describe(p),
      type: "website",
      locale: "en_IN",
      url: `${SITE_URL}/platforms/${p.slug}`,
    },
  };
}

/* ── Screenshot frame ─────────────────────────────────────────────────────── */

/**
 * A monitor bolted to the console: 16:10 glass, hairline bezel, mono caption strip.
 * The empty state and the image occupy the *identical* box, so dropping a file into
 * web/public/platforms/ changes the picture and shifts nothing (CLS budget, PRD §8).
 *
 * `width`/`height` are the export size the README asks for (1600×1000); the aspect box
 * plus `sizes` do the rest. No `src` renders the honest empty state — never a mockup.
 */
function Shot({
  p,
  src,
  alt,
  caption,
  sizes,
  className,
}: {
  p: Platform;
  src?: string;
  alt?: string;
  caption: string;
  sizes: string;
  className?: string;
}) {
  return (
    <figure
      className={clsx(
        "relative overflow-hidden border border-line bg-ink",
        !src && "border-dashed",
        className,
      )}
    >
      <div className="relative aspect-[16/10] shadow-[inset_0_0_0_1px_rgba(237,241,247,0.04),inset_0_-40px_80px_-40px_rgba(10,14,26,0.9)]">
        {src ? (
          <Image
            src={src}
            alt={alt ?? `${p.product} screen`}
            width={1600}
            height={1000}
            sizes={sizes}
            className="size-full object-cover object-top"
          />
        ) : (
          <>
            {/* No cleared capture yet, so the slot shows the module map in 3D instead —
                one tile per real module group. It is labelled as such, because a 3D
                object must never be mistaken for a screenshot of the product. */}
            <ModuleStackFrame
              count={p.modules.length}
              accentIndex={stackAccent(p.slug)}
              showLabel={false}
              className="absolute inset-0 rounded-none border-0 bg-transparent"
            />
            <p className="pointer-events-none absolute inset-x-0 bottom-3 z-[31] label flex items-center justify-center gap-2.5 text-center text-mute">
              <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-signal/60" />
              3D module map · screenshot not published yet
            </p>
          </>
        )}
      </div>
      <figcaption className="flex items-center gap-2.5 border-t border-line bg-deck/60 px-4 py-2.5 font-mono text-[0.6875rem] text-mute">
        <span
          aria-hidden
          className={clsx("size-1.5 shrink-0 rounded-full", src ? "bg-mint" : "bg-mute/50")}
        />
        <span className="truncate">
          {p.name} · {caption}
        </span>
      </figcaption>
    </figure>
  );
}

export default async function PlatformPage({ params }: PageProps<"/platforms/[slug]">) {
  const { slug } = await params;
  const p = find(slug);
  if (!p) notFound();

  const live = p.status === "live";
  const others = platforms.filter((x) => x.slug !== p.slug).slice(0, 3);
  const gallery = p.gallery ?? [];

  /* Schema — PRD §12: SoftwareApplication for each platform, plus BreadcrumbList.
     No price is asserted: only the model, because the number genuinely moves with scope. */
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.product,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Android, iOS",
    description: describe(p),
    url: `${SITE_URL}/platforms/${p.slug}`,
    featureList: p.modules,
    inLanguage: "en-IN",
    provider: {
      "@type": "Organization",
      name: "BlinksAI",
      url: SITE_URL,
    },
    audience: {
      "@type": "BusinessAudience",
      audienceType: p.for,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      description: p.model,
      availability: live ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      seller: { "@type": "Organization", name: "BlinksAI" },
    },
  };

  const crumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Platforms", item: `${SITE_URL}/platforms` },
      {
        "@type": "ListItem",
        position: 3,
        name: p.product,
        item: `${SITE_URL}/platforms/${p.slug}`,
      },
    ],
  };

  const spec = [
    { k: "Who it's for", v: p.for },
    { k: "Deployment time", v: live ? p.deploy : "not scheduled yet" },
    { k: "Pricing model", v: live ? p.model : "not priced yet" },
    { k: "Status", v: live ? "live in production" : "in development" },
  ];

  return (
    <>
      <ModuleStackCanvas />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="band-dark">
      <section className="relative overflow-hidden pb-24 pt-32 sm:pt-36 lg:pb-28 lg:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-60" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full opacity-30 blur-[130px]"
          style={{
            background:
              "radial-gradient(50% 55% at 55% 45%, rgba(255,178,36,.38), transparent 70%)",
          }}
        />

        <div className="container-site relative">
          <nav aria-label="Breadcrumb">
            <ol className="label flex flex-wrap items-center gap-2 text-mute">
              <li>
                <Link href="/" className="inline-block py-1.5 transition-colors hover:text-paper">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-mute/40">
                /
              </li>
              <li>
                <Link
                  href="/platforms"
                  className="inline-block py-1.5 transition-colors hover:text-paper"
                >
                  Platforms
                </Link>
              </li>
              <li aria-hidden className="text-mute/40">
                /
              </li>
              <li aria-current="page" className="py-1.5 text-paper">
                {p.product}
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Reveal>
                <Eyebrow t={live ? "Week 2" : "In build"} accent={live ? "mint" : "signal"}>
                  {live ? "Live in production" : "In development"}
                </Eyebrow>
              </Reveal>

              <Reveal delay={70}>
                <h1 className="mt-5 text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.02] tracking-[-0.03em] [text-wrap:balance]">
                  {p.headline}
                </h1>
              </Reveal>

              <Reveal delay={140}>
                <p className="mt-6 max-w-xl text-lead text-mute">
                  <span className="text-paper">{p.product}</span> is the licensed version of{" "}
                  {p.name} — the {p.industry} system we built, shipped and{" "}
                  {live ? "still run in production" : "are still building"}. You get the same
                  codebase, configured for your roles, branches and data.
                </p>
              </Reveal>

              <Reveal delay={200}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    drawer="details"
                    context={`${p.product} walkthrough`}
                    className="w-full sm:w-auto"
                  >
                    Book a walkthrough
                  </Button>
                  <Button
                    variant="ghost"
                    drawer="whatsapp"
                    context={p.product}
                    className="w-full sm:w-auto"
                  >
                    Ask on WhatsApp
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* Headline number */}
            <div className="lg:col-span-5">
              <Reveal delay={120}>
                <Tilt strength={6}>
                  <div className="panel noise relative overflow-hidden p-7 lg:p-8">
                    <p className="label text-mute">Headline number</p>
                    <p className="mt-4 flex items-baseline gap-3">
                      <span className="font-display text-[clamp(3rem,9vw,4.75rem)] font-bold leading-none tracking-[-0.03em] text-accent">
                        {p.number}
                      </span>
                      <span className="label text-mute">{p.numberLabel}</span>
                    </p>
                    <dl className="mt-7 space-y-3 border-t border-line pt-6 font-mono text-[0.6875rem]">
                      <div className="flex justify-between gap-4">
                        <dt className="text-mute">built from</dt>
                        <dd className="text-right text-paper/80">{p.name}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-mute">industry</dt>
                        <dd className="text-right text-paper/80">{p.industry}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-mute">module groups</dt>
                        <dd className="text-right text-paper/80">{p.modules.length}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-mute">status</dt>
                        <dd
                          className={clsx("text-right", live ? "text-mint" : "text-paper/80")}
                        >
                          {p.status}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </Tilt>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      </div>

      <div className="band-light">
      {/* ── Spec strip ───────────────────────────────────────────────────── */}
      <section className="relative pb-4 pt-24 lg:pt-32">
        <div className="container-site">
          <dl className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {spec.map((s, i) => (
              <Reveal key={s.k} delay={i * 60} className="h-full bg-deck/60 p-6">
                <dt className="label text-mute">{s.k}</dt>
                <dd className="mt-2.5 text-small text-paper/85">{s.v}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ── What it does + module map ────────────────────────────────────── */}
      <section className="relative py-24 lg:py-36">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <Reveal>
                <Eyebrow t="T+0">What it does</Eyebrow>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-5 text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.05] tracking-[-0.025em]">
                  Configure it. Don&apos;t{" "}
                  <span className="text-accent">rebuild it.</span>
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-5 text-body text-mute">
                  {p.headline}. The module groups on the right are what ships as standard —
                  they are the ones already running for {p.name}, not a wishlist. Setup covers
                  configuration, data migration and training; anything outside the map is a
                  custom module, scoped and quoted separately before work starts.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <p className="mt-4 text-body text-mute">
                  {live
                    ? `Typical go-live is ${p.deploy} from a signed scope, because the software already exists — the weeks go into your data, your roles and your people, not into discovering requirements again.`
                    : "This one is still in development, so there is no deployment date or price to quote yet. Ask us what is ready and we will show you the build, not a brochure."}
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-8">
                  <Button variant="ghost" href="/#pricing">
                    How licences are priced
                  </Button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={100}>
                <p className="label text-mute">
                  Module map · {p.modules.length} groups
                </p>
              </Reveal>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {p.modules.map((m, i) => (
                  <Reveal as="li" key={m} delay={Math.min(i, 6) * 60}>
                    <div className="flex h-full items-start gap-3 border border-line bg-deck p-4">
                      <span
                        aria-hidden
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-signal"
                      />
                      <span className="text-small text-paper/85">{m}</span>
                    </div>
                  </Reveal>
                ))}
              </ul>

              {/* Screenshot slot — same box whether or not a capture exists, see file header */}
              <Reveal delay={200}>
                <Shot
                  p={p}
                  src={p.shot}
                  alt={p.shotAlt}
                  caption={p.shot ? "product screen" : "not published yet"}
                  sizes="(min-width: 1024px) 700px, 92vw"
                  className="mt-6"
                />
              </Reveal>

              {!p.shot && (
                <Reveal delay={240}>
                  <div className="mt-4">
                    <p className="max-w-lg text-small text-mute">
                      We won&apos;t put a mockup here and call it a product. Real screens of{" "}
                      {p.name} go up as each client signs off on a data-masked capture. Until
                      then, ask for a walkthrough and we&apos;ll share the live system on a
                      call.
                    </p>
                    <div className="mt-5">
                      <Button
                        variant="ghost"
                        drawer="details"
                        context={`${p.product} screen-share`}
                      >
                        See the live system
                      </Button>
                    </div>
                  </div>
                </Reveal>
              )}

              {gallery.length > 0 && (
                <>
                  <Reveal delay={240}>
                    <p className="label mt-8 text-mute">
                      {p.shot ? "More screens" : "Screens"} · {gallery.length}
                    </p>
                  </Reveal>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {gallery.map((src, i) => (
                      <Reveal as="li" key={src} delay={Math.min(i, 4) * 60}>
                        <Shot
                          p={p}
                          src={src}
                          alt={`${p.product} — additional screen ${i + 1}`}
                          caption={`screen ${i + (p.shot ? 2 : 1)}`}
                          sizes="(min-width: 1024px) 340px, (min-width: 640px) 44vw, 92vw"
                        />
                      </Reveal>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it gets deployed (§7.9, elapsed-time labels) ─────────────── */}
      <section className="relative py-24 lg:py-36">
        <div className="container-site">
          <Reveal>
            <Eyebrow t="T+0 → live">How it gets deployed</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-5 max-w-2xl text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.05] tracking-[-0.025em]">
              The same five steps, every time.
            </h2>
          </Reveal>

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((s, i) => (
              <Reveal as="li" key={s.t} delay={i * 70}>
                <div className="flex h-full flex-col border border-line bg-deck p-5">
                  <span className="label text-accent">{s.t}</span>
                  <span className="mt-3 font-display text-[1rem] font-bold tracking-tight">
                    {s.title}
                  </span>
                  <span className="mt-2 text-small text-mute">{s.body}</span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      </div>

      <div className="band-dark">
      {/* ── CTA + other platforms ────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-36">
        <div className="container-site">
          <div className="panel flex flex-col gap-6 p-7 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div className="max-w-xl">
              <Eyebrow t="20 min">Walkthrough</Eyebrow>
              <h2 className="mt-4 text-[clamp(1.5rem,3.2vw,2.125rem)] leading-[1.1] tracking-[-0.02em]">
                See {p.product} running before you decide.
              </h2>
              <p className="mt-4 text-body text-mute">
                Twenty minutes, free, on your screen. We walk the module map against your
                actual workflow and tell you which parts you&apos;d use, which you wouldn&apos;t,
                and what it would cost — or that it isn&apos;t the right fit.
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto">
              <Button
                drawer="details"
                context={`${p.product} walkthrough`}
                className="w-full sm:w-auto"
              >
                Book a walkthrough
              </Button>
              <Button
                variant="ghost"
                drawer="call"
                context={p.product}
                className="w-full sm:w-auto"
              >
                Call me instead
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <p className="label text-mute">Other platforms</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/platforms/${o.slug}`}
                    className="group flex h-full flex-col border border-line bg-deck p-5 transition-colors hover:border-signal hover:bg-deck"
                  >
                    <span className="label text-mute">{o.industry}</span>
                    <span className="mt-2 font-display text-[1.0625rem] font-bold tracking-tight">
                      {o.product}
                    </span>
                    <span className="mt-2 font-mono text-[0.6875rem] text-mute">
                      {o.number} {o.numberLabel}
                    </span>
                    <span className="mt-4 text-accent transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button variant="ghost" href="/platforms">
                All {platforms.length} platforms
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
