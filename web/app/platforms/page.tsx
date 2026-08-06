import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { platforms, pricing } from "@/lib/content";
import { Button, Eyebrow, Reveal, Tilt } from "@/components/ui";
import PlatformMedia, { PlatformMediaCanvas } from "@/components/site/PlatformMedia";

/**
 * /platforms — PRD §5 IA, §7.5 "the crown jewels".
 *
 * The argument this page has to win is Growth-Strategy §3: these are *products*
 * (named, priced, repeatable), not a portfolio of past work. Every card therefore
 * leads with a module map, a deployment time and a pricing model — the three things
 * a buyer needs to tell a ₹15L licence apart from a ₹2L project.
 *
 * Card markup is local on purpose: components/sections/Platforms.tsx owns the
 * homepage rail and stays untouched.
 */

const liveCount = platforms.filter((p) => p.status === "live").length;

export const metadata: Metadata = {
  title: `${platforms.length} ready platforms — configure, don't rebuild`,
  description: `${platforms.length} business platforms built by BlinksAI and running in production — HRMS and field inspection, nidhi/NBFC banking, institute and franchise ERP, education CRM, real-estate CRM, travel CRM, employee management and agri distribution. Module maps, deployment times and pricing models published up front.`,
  alternates: { canonical: "/platforms" },
  openGraph: {
    title: `BlinksAI platforms — ${liveCount} products already running real businesses`,
    description:
      "Licensed products, configured for you in weeks. Module maps, deployment times and pricing models published up front.",
    type: "website",
    locale: "en_IN",
  },
};

const facts = [
  { value: String(platforms.length), label: "products" },
  { value: String(liveCount), label: "running in production" },
  { value: "1–3 wks", label: "typical configuration" },
];

export default function PlatformsIndex() {
  return (
    <>
      <PlatformMediaCanvas />
      <div className="band-dark">
      <section className="relative overflow-hidden pb-24 pt-32 sm:pt-36 lg:pb-32 lg:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-60" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[56rem] -translate-x-1/2 rounded-full opacity-35 blur-[130px]"
          style={{
            background:
              "radial-gradient(50% 55% at 60% 45%, rgba(255,178,36,.40), transparent 70%)",
          }}
        />

        <div className="container-site relative">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow t="Week 2">Platforms</Eyebrow>
            </Reveal>
            <Reveal delay={70}>
              <h1 className="mt-5 text-[clamp(2.125rem,5.2vw,4.25rem)] leading-[1.0] tracking-[-0.03em] [text-wrap:balance]">
                {platforms.length} products.{" "}
                <span className="text-accent">Not a portfolio.</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 text-lead text-mute">
                Every one of these started as one client&apos;s build. Each is now a named,
                priced, repeatable product with its own module map — so a new client
                configures a system that already works instead of paying to discover the
                same requirements again. That is the whole difference between hiring an
                agency and licensing software: most projects start at 70% built, not zero.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-5 text-body text-mute">
                Setup and subscription are split, and the band is published:{" "}
                <span className="text-paper">{pricing[0].band}</span>. Custom modules
                outside a platform&apos;s map are quoted separately.
              </p>
            </Reveal>
          </div>

          <Reveal delay={260}>
            <dl className="panel mt-10 grid grid-cols-3 gap-4 p-6 sm:max-w-2xl sm:gap-8">
              {facts.map((f) => (
                <div key={f.label} className="flex flex-col-reverse">
                  <dt className="label mt-2.5 text-mute">{f.label}</dt>
                  <dd className="font-display text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-none tracking-tight text-accent">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {platforms.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={Math.min(i, 5) * 70} className="h-full">
                <PlatformCard p={p} index={i} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      </div>

      <div className="band-light">
      <section className="relative py-24 lg:py-36">
        <div className="container-site">
          <div className="panel flex flex-col gap-6 p-7 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div className="max-w-xl">
              <Eyebrow t="T+0">Next step</Eyebrow>
              <h2 className="mt-4 text-[clamp(1.5rem,3.2vw,2.125rem)] leading-[1.1] tracking-[-0.02em]">
                Nothing here fits your workflow?
              </h2>
              <p className="mt-4 text-body text-mute">
                Half of these platforms started as a client saying exactly that. Tell us the
                workflow on a 20-minute call — we&apos;ll tell you which platform gets you 70%
                of the way, or that you need a custom build, or that we&apos;re the wrong fit.
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto">
              <Button drawer="details" context="platforms" className="w-full sm:w-auto">
                Book a walkthrough
              </Button>
              <Button variant="ghost" href="/build" className="w-full sm:w-auto">
                See custom builds
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

/* ── Card ─────────────────────────────────────────────────────────────────── */

function PlatformCard({ p, index }: { p: (typeof platforms)[number]; index: number }) {
  const shown = p.modules.slice(0, 4);
  const rest = p.modules.length - shown.length;

  return (
    <Tilt className="h-full" strength={6}>
      <Link
        href={`/platforms/${p.slug}`}
        className="group relative flex h-full flex-col overflow-hidden border border-line bg-deck p-6 transition-colors duration-400 hover:border-signal hover:bg-deck"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(255,178,36,.09), transparent 65%)",
          }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="label text-mute">{p.industry}</p>
            <h2 className="mt-2 font-display text-[1.25rem] font-bold tracking-tight">
              {p.product}
            </h2>
            <p className="mt-0.5 font-mono text-[0.6875rem] text-mute">built from {p.name}</p>
          </div>
          <span
            className={clsx(
              "label shrink-0 rounded-full border px-2.5 py-1",
              p.status === "live"
                ? "border-mint/30 bg-mint/10 text-mint"
                : "border-line bg-deck-2 text-mute",
            )}
          >
            {p.status === "live" ? "live" : "wip"}
          </span>
        </div>

        {/* Screenshot once one is cleared; until then the 3D module stack. */}
        <PlatformMedia p={p} index={index} className="mt-5" minTier="full" />

        <div className="relative mt-5 border border-line bg-ink p-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[2rem] font-bold leading-none text-accent">
              {p.number}
            </span>
            <span className="label text-mute">{p.numberLabel}</span>
          </div>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {shown.map((m) => (
              <li
                key={m}
                className="border border-line bg-deck px-2 py-1 font-mono text-[0.625rem] text-mute"
              >
                {m}
              </li>
            ))}
            {rest > 0 && (
              <li className="px-2 py-1 font-mono text-[0.625rem] text-mute">
                +{rest} more
              </li>
            )}
          </ul>
        </div>

        <p className="relative mt-5 text-small text-paper/85">{p.headline}</p>

        <dl className="relative mt-5 space-y-2 border-t border-line pt-5 font-mono text-[0.6875rem] text-mute">
          <div className="flex gap-2">
            <dt className="shrink-0">for</dt>
            <dd className="text-paper/70">{p.for}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0">live in</dt>
            <dd className="text-paper/70">{p.deploy}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0">model</dt>
            <dd className="text-paper/70">{p.model}</dd>
          </div>
        </dl>

        <div className="relative mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="label text-accent">See the module map</span>
          <span className="text-accent transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </Link>
    </Tilt>
  );
}
