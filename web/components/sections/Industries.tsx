"use client";

import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { industries, platforms } from "@/lib/content";
import { SectionHead, Reveal } from "@/components/ui";

/** §7.7 — "he understands *my* business" is the fastest trust shortcut in Indian SMB sales. */
export default function Industries() {
  const [active, setActive] = useState<string | null>(null);
  const match = platforms.filter((p) =>
    active ? p.industry.toLowerCase().includes(active.split("-")[0]) : false,
  );

  return (
    <section id="industries" className="relative scroll-mt-24 py-24 lg:py-36">
      <div className="container-site">
        <SectionHead
          eyebrow="Industries"
          title={[
            "Pick your world.",
            <span key="l1">
              We&apos;ve <span className="text-accent">already shipped in it.</span>
            </span>,
          ]}
          lead="Six industries in production, one in development. Selecting one filters the platforms and case studies below."
        />

        {/* Flush instrument grid: the hairlines are the container's, never the tile's, so the
            cells butt against each other with a single shared rule and no gaps. */}
        <ul className="mt-16 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind, i) => {
            const on = active === ind.slug;
            return (
              <Reveal
                as="li"
                key={ind.slug}
                delay={Math.min(i, 6) * 50}
                className="border-b border-r border-line"
              >
                <button
                  onClick={() => setActive(on ? null : ind.slug)}
                  aria-pressed={on}
                  className={clsx(
                    "group flex h-full w-full flex-col items-start p-6 text-left transition-colors duration-300 lg:p-7",
                    on ? "bg-signal text-carbon" : "hover:bg-deck",
                  )}
                >
                  <span
                    className={clsx(
                      "label flex items-center gap-2",
                      on ? "text-carbon/70" : "text-mute",
                    )}
                  >
                    <span
                      className={clsx(
                        "size-1.5 rounded-full",
                        on ? "bg-carbon" : "bg-mute/50 group-hover:bg-signal",
                      )}
                    />
                    {on ? "selected" : "filter"}
                  </span>

                  <span className="mt-8 font-display font-bold uppercase text-d4">{ind.name}</span>
                  <span
                    className={clsx(
                      "mt-3 text-small",
                      on ? "text-carbon/75" : "text-mute",
                    )}
                  >
                    {ind.pain}
                  </span>
                </button>
              </Reveal>
            );
          })}

          <Reveal as="li" delay={350} className="border-b border-r border-line">
            <Link
              href="/contact"
              className="group flex h-full w-full flex-col items-start p-6 transition-colors hover:bg-deck lg:p-7"
            >
              <span className="label flex items-center gap-2 text-mute">
                <span className="size-1.5 rounded-full bg-mute/50 group-hover:bg-signal" />
                anything else
              </span>
              <span className="mt-8 font-display font-bold uppercase text-d4 text-mute group-hover:text-paper">
                Not listed?
              </span>
              <span className="mt-3 text-small text-mute">
                Tell us the workflow. Half our platforms started that way.
              </span>
            </Link>
          </Reveal>
        </ul>

        {active && (
          <div className="border-b border-l border-r border-line bg-deck p-6 lg:p-8">
            <p className="label text-accent">
              {industries.find((i) => i.slug === active)?.name} — what we&apos;d put in front of you
            </p>
            <ul className="mt-5 flex flex-wrap gap-px">
              {(match.length ? match : platforms.slice(0, 3)).map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/platforms/${p.slug}`}
                    className="inline-flex items-center gap-3 border border-line bg-ink px-4 py-3 text-small transition-colors hover:border-signal hover:text-accent"
                  >
                    {p.product}
                    <span className="font-mono text-[0.625rem] text-mute">
                      {p.number} {p.numberLabel}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
