"use client";

import clsx from "clsx";
import { paths } from "@/lib/content";
import { useSite } from "@/lib/store";
import { Eyebrow, Lines, Reveal } from "@/components/ui";

/* Selection is shown by a hard accent bar across the top of the cell plus a raised
   surface — no ring, no glow, no shadow. */
const bar = { signal: "bg-signal", violet: "bg-violet", mint: "bg-mint" } as const;
const text = { signal: "text-accent", violet: "text-violet", mint: "text-mint" } as const;

/**
 * PRD §6 structural device: elapsed time, never 01/02/03. Each label is the moment
 * that path pays off, taken from the matching `loopStages` entry in lib/content.ts —
 * build ships in week 2, automation replies at T+4s, marketing starts week 5.
 */
const when: Record<string, string> = {
  build: "Week 2",
  grow: "Week 5",
  automate: "T+4s",
  all: "T+0",
};

/**
 * §7.3 — the single highest-leverage interaction on the site. Clicking a card never
 * navigates: it re-labels and re-orders what follows and is remembered on return.
 */
export default function PathSelector() {
  const path = useSite((s) => s.path);
  const setPath = useSite((s) => s.setPath);

  return (
    <section id="paths" className="relative scroll-mt-24 py-24 lg:py-36">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <Eyebrow t="T+8s">Which one are you?</Eyebrow>
            </Reveal>
            <Lines as="h2" delay={80} className="mt-6 text-d1 font-bold" lines={["I need…"]} />
          </div>
          {path && (
            <button
              onClick={() => setPath(null)}
              className="label text-mute underline underline-offset-[6px] transition-colors hover:text-paper"
            >
              Clear selection
            </button>
          )}
        </div>

        {/* One instrument, four cells. The grid bed is line-coloured and the 1px gaps
            let it through, so the tiles share seams instead of floating apart. */}
        <ul className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {paths.map((p, i) => {
            const on = path === p.key;
            return (
              /* The surface lives on the <li>, not on the revealed child — a fading
                 child would let the line-coloured bed flash through the whole cell. */
              <li key={p.key} className="bg-ink">
                <Reveal className="h-full" delay={i * 70}>
                  <button
                    onClick={() => setPath(on ? null : p.key)}
                    aria-pressed={on}
                    className={clsx(
                      "group relative flex h-full w-full flex-col items-start p-6 text-left transition-colors duration-300 lg:p-8",
                      on ? "bg-deck-2" : "hover:bg-deck",
                    )}
                  >
                    <span
                      aria-hidden
                      className={clsx(
                        "absolute inset-x-0 top-0 h-1 transition-opacity duration-300",
                        bar[p.accent],
                        on ? "opacity-100" : "opacity-0",
                      )}
                    />

                    <span
                      className={clsx(
                        "label flex items-center gap-2",
                        on ? text[p.accent] : "text-mute",
                      )}
                    >
                      <span
                        className={clsx(
                          "size-1.5 rounded-full transition-colors",
                          on ? "bg-current" : "bg-mute/50",
                        )}
                      />
                      {on ? "selected" : when[p.key]}
                    </span>

                    {/* Sized so the longest label ("MY FOLLOW‑UP AUTOMATED", 22 chars)
                        still lands on two lines in a quarter-width cell, and min-h
                        reserves those two lines so all four titles share a baseline
                        however short the label is. */}
                    <span className="mt-8 block min-h-[2.1em] font-display text-[clamp(1.25rem,1.8vw,1.625rem)] font-bold uppercase leading-[1.05] [font-stretch:125%]">
                      {p.need}
                    </span>
                    <span className="mt-4 block text-small text-mute">{p.detail}</span>

                    <span className="mt-auto block pt-10">
                      <span
                        className={clsx(
                          "block font-mono text-[0.6875rem] transition-colors",
                          on ? text[p.accent] : "text-mute",
                        )}
                      >
                        {p.services}
                      </span>
                    </span>
                  </button>
                </Reveal>
              </li>
            );
          })}
        </ul>

        {path && (
          <p className="mt-8 flex items-center gap-2.5 font-mono text-[0.75rem] text-mute">
            <span className="size-1.5 rounded-full bg-signal blink" />
            Page re-ordered for “{paths.find((p) => p.key === path)?.need}”. We&apos;ll remember it
            next time.
          </p>
        )}
      </div>
    </section>
  );
}
