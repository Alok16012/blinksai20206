"use client";

import Link from "next/link";
import clsx from "clsx";
import { useRef, useState } from "react";
import { platforms } from "@/lib/content";
import { SectionHead, Reveal, Tilt } from "@/components/ui";
import PlatformMedia, { PlatformMediaCanvas } from "@/components/site/PlatformMedia";

/**
 * §7.5 — the crown jewels. Horizontal rail on desktop, 3 + "see all" on mobile.
 * Each card carries a real module count, because that is what separates a ₹2L
 * project conversation from a ₹15L platform conversation.
 *
 * The section sets no background of its own — the band comes from the wrapper.
 */
export default function Platforms() {
  const rail = useRef<HTMLUListElement>(null);
  const [showAll, setShowAll] = useState(false);

  const nudge = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.7), behavior: "smooth" });
  };

  const mobileList = showAll ? platforms : platforms.slice(0, 3);

  return (
    <section id="platforms" className="relative scroll-mt-24 py-24 lg:py-36">
      <PlatformMediaCanvas />
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            t="Week 2"
            eyebrow="Platforms"
            title={[
              "Eight products",
              <span key="l1">
                that already run <span className="text-accent">real businesses</span>.
              </span>,
            ]}
            lead="Not a portfolio. Licensed products, configured for you in weeks — with the module maps and deployment times published up front."
          />
          <div className="hidden gap-2 lg:flex">
            <RailButton dir={-1} onClick={() => nudge(-1)} />
            <RailButton dir={1} onClick={() => nudge(1)} />
          </div>
        </div>
      </div>

      {/* Desktop rail. The inline padding keeps the first card flush with container-site:
          2.5rem of gutter from lg, then centred against the 96rem measure from xl. */}
      <ul
        ref={rail}
        className="mt-14 hidden gap-5 overflow-x-auto px-10 pb-6 [scrollbar-width:none] lg:flex xl:px-[max(4rem,calc((100vw-96rem)/2+4rem))] [&::-webkit-scrollbar]:hidden"
      >
        {platforms.map((p, i) => (
          <li key={p.slug} className="w-[21rem] shrink-0">
            <Reveal delay={Math.min(i, 4) * 60} className="h-full">
              <Card p={p} index={i} />
            </Reveal>
          </li>
        ))}
        <li className="grid w-[16rem] shrink-0 place-items-center">
          <Link
            href="/platforms"
            className="flex size-32 flex-col items-center justify-center gap-2 rounded-full border border-line text-center text-mute transition-colors hover:border-signal hover:text-accent"
          >
            <span className="text-d4">→</span>
            <span className="label">See all 8</span>
          </Link>
        </li>
      </ul>

      {/* Mobile stack */}
      <div className="container-site mt-12 lg:hidden">
        <ul className="space-y-5">
          {mobileList.map((p, i) => (
            <li key={p.slug}>
              <Card p={p} index={i} />
            </li>
          ))}
        </ul>
        {!showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="label mt-6 flex min-h-12 w-full items-center justify-center border border-line text-paper transition-colors hover:border-signal hover:text-accent"
          >
            See all 8 platforms
          </button>
        )}
      </div>
    </section>
  );
}

function Card({ p, index }: { p: (typeof platforms)[number]; index: number }) {
  return (
    <Tilt className="h-full" strength={7}>
      <Link
        href={`/platforms/${p.slug}`}
        className="group relative flex h-full flex-col border border-line bg-deck p-6 transition-colors duration-300 hover:border-signal"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label text-mute">{p.industry}</p>
            <h3 className="mt-3 text-d4">{p.product}</h3>
            <p className="mt-1 font-mono text-[0.6875rem] text-mute">built from {p.name}</p>
          </div>
          <span
            className={clsx(
              "label shrink-0 border px-2 py-1",
              p.status === "live" ? "border-mint text-mint" : "border-line text-mute",
            )}
          >
            {p.status === "live" ? "live" : "wip"}
          </span>
        </div>

        {/* Screenshot once one is cleared; until then the 3D module stack. */}
        <PlatformMedia p={p} index={index} className="mt-6" minTier="full" />

        <div className="mt-6 border border-line bg-ink p-4">
          <p className="font-display text-d2 font-bold text-accent">{p.number}</p>
          <p className="label mt-2 text-mute">{p.numberLabel}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {p.modules.slice(0, 4).map((m) => (
              <li
                key={m}
                className="border border-line bg-deck px-2 py-1 font-mono text-[0.625rem] text-mute"
              >
                {m}
              </li>
            ))}
            {p.modules.length > 4 && (
              <li className="px-2 py-1 font-mono text-[0.625rem] text-mute">
                +{p.modules.length - 4}
              </li>
            )}
          </ul>
        </div>

        <p className="mt-6 mb-6 text-small text-mute">{p.headline}</p>

        {/* mb-6 above + mt-auto here: the rule never butts against the copy, and the
            footer still sits on the floor of the tallest card in the rail. */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-5">
          <span className="font-mono text-[0.6875rem] text-mute">live in {p.deploy}</span>
          <span className="text-accent transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </Link>
    </Tilt>
  );
}

function RailButton({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 1 ? "Next platforms" : "Previous platforms"}
      className="grid size-12 place-items-center rounded-full border border-line text-mute transition-colors hover:border-signal hover:text-accent"
    >
      {dir === 1 ? "→" : "←"}
    </button>
  );
}
