"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { Button, Eyebrow, Lines, Reveal, Stat } from "@/components/ui";
import BoardFallback from "@/components/three/BoardFallback";
import { useInView, useTier } from "@/lib/capability";
import { stats } from "@/lib/content";

const LiveBoard = dynamic(() => import("@/components/three/LiveBoard"), { ssr: false });

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, "300px");
  const tier = useTier();
  const webgl = tier === "full" || tier === "lite";

  return (
    /* The band is owned by app/page.tsx — this section only uses tokens. Near-full
       height: the copy block grows to fill, the stat slabs sit on the bottom edge. */
    <section className="relative flex min-h-svh flex-col overflow-hidden pt-28 sm:pt-32 lg:pt-40">
      {/* Control-room floor. Flat — no glow, no glass. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-70" />

      <div className="container-site relative flex flex-1 flex-col justify-center pb-16 lg:pb-24">
        {/* Copy renders before the canvas, always (PRD §9 rule 2) */}
        <Reveal>
          <Eyebrow>Build · Automate · Grow</Eyebrow>
        </Reveal>

        {/* One array entry per line — each wipes up from its own clipped baseline.
            Caps and 0.9 leading come from the base layer; don't type them in caps. */}
        <Lines as="h1" delay={60} className="mt-8 text-d1 font-bold sm:text-d0" lines={[
            "We build",
            "the software.",
            <span key="fill" className="text-accent">
              Then we fill it
            </span>,
            "with customers.",
          ]} />

        <div className="mt-12 grid gap-x-10 gap-y-12 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal delay={180}>
              <p className="max-w-lg text-lead text-mute">
                Software, automation and marketing from one team.{" "}
                <span className="text-paper">8 platforms shipped, 42 clients, 6 industries</span> —
                from the first line of code to the first customer.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button drawer="details" context="a growth plan">
                  Get a growth plan
                </Button>
                <Button variant="ghost" href="/work">
                  See our work
                </Button>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <p className="mt-8 flex items-start gap-2.5 font-mono text-[0.75rem] text-mute">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-mint" />
                Replies on WhatsApp in ~4 seconds — including at 11 PM
              </p>
            </Reveal>
          </div>

          {/* The Live Board — square frame, hairline border */}
          <div className="lg:col-span-8">
            <div
              ref={ref}
              className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-deck sm:aspect-[16/10]"
            >
              {webgl ? (
                <LiveBoard tier={tier} active={inView} />
              ) : (
                <div className="absolute inset-0 p-3 sm:p-4">
                  <BoardFallback />
                </div>
              )}

              {/* Text alternative for the canvas — WCAG 2.1 AA (PRD §12) */}
              {webgl && (
                <p className="sr-only">
                  Live operations board, sample feed: lead captured in Nashik at T plus 0 seconds,
                  WhatsApp sent at T plus 4 seconds, AI voice call answered in Marathi at T plus 38
                  seconds, demo booked at T plus 2 minutes. Four lanes: build, automate, market,
                  measure.
                </p>
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-4">
                <span className="label border border-line bg-ink px-3 py-2 text-mute">
                  {webgl ? "Drag to rotate ⟲ · click a lane" : "Live board"}
                </span>
                <span className="label border border-line bg-ink px-3 py-2 text-mute">
                  Sample feed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip — stat slabs on the band's bottom edge, split by hairlines */}
      <div className="relative border-t border-line">
        <div className="container-site">
          <ul className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <li
                key={s.label}
                className={clsx(
                  "border-line py-10 lg:py-14",
                  i % 2 === 1 && "border-l pl-5 sm:pl-8",
                  i >= 2 && "border-t lg:border-t-0",
                  i > 0 && "lg:border-l lg:pl-8",
                )}
              >
                <Reveal delay={i * 70}>
                  <Stat value={s.value} suffix={s.suffix} label={s.label} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
