"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Button, Eyebrow, Lines, Reveal, Stat } from "@/components/ui";
import { useInView, useTier } from "@/lib/capability";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { stats } from "@/lib/content";

const Globe = dynamic(() => import("@/components/three/Globe"), { ssr: false });

/**
 * §7.2 — the hero, rebuilt against the reference the owner supplied.
 *
 * The shape of it: the section is ~260vh tall and its inner stage is sticky, so the hero
 * holds still while the page scrolls past it. That scroll drives two things at once —
 * a camera dive into the globe (see Globe.tsx) and a white curtain that rises to meet
 * the band below. The dark hero doesn't cut to white; it *becomes* it.
 *
 * Everything degrades: reduced motion or a failed capability check drops the pin and the
 * canvas entirely and renders a plain dark hero with the same copy.
 */
export default function Hero() {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  const inView = useInView(stage, "200px");
  const tier = useTier();
  const reduced = usePrefersReducedMotion();
  const webgl = (tier === "full" || tier === "lite") && !reduced;
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el || reduced || !webgl) return;

    let cancelled = false;
    let kill: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        fastScrollEnd: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          // Driven straight from the scroll handler rather than React state: this runs
          // on every scroll frame and a re-render per frame would be wasteful.
          if (curtain.current) {
            const c = Math.max(0, (self.progress - 0.55) / 0.45);
            curtain.current.style.opacity = String(c);
          }
        },
      });
      setPinned(true);
      kill = () => st.kill();
    })();

    return () => {
      cancelled = true;
      kill?.();
    };
  }, [reduced, webgl]);

  return (
    <section className="relative">
      <div ref={wrap} className={clsx("relative", pinned && "h-[260vh]")}>
        <div
          ref={stage}
          className={clsx(
            "flex h-svh flex-col justify-center overflow-hidden pt-16 lg:pt-20",
            pinned && "sticky top-0",
          )}
        >
          {/* The globe is pushed right and bled off the edge, the way the reference
              frames it — centred it competes with the headline instead of sitting
              behind it. On phones it drops lower so the copy keeps the top half. */}
          {webgl && (
            <div
              aria-hidden
              className="absolute -right-[38%] top-[18%] h-[85vw] w-[85vw] sm:-right-[22%] sm:top-1/2 sm:h-[78vh] sm:w-[78vh] sm:-translate-y-1/2 lg:-right-[10%] lg:h-[92vh] lg:w-[92vh]"
            >
              <Globe progress={progress} tier={tier} active={inView} />
            </div>
          )}

          {/* Scrim: the limb is bright, and white display type over amber is unreadable.
              This darkens the left half only, so the globe still reads on the right. */}
          {webgl && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{
                background:
                  "linear-gradient(100deg, #111 0%, rgba(17,17,17,0.92) 34%, rgba(17,17,17,0.45) 56%, transparent 74%)",
              }}
            />
          )}

          {/* Falls back to the flat control-room floor when there is no canvas. */}
          {!webgl && (
            <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-70" />
          )}

          {/* Copy renders before and above the canvas, always (PRD §9 rule 2). */}
          <div className="container-site pointer-events-none relative z-[2] max-w-full">
            <Reveal>
              <Eyebrow>Build · Automate · Grow</Eyebrow>
            </Reveal>

            <Lines
              as="h1"
              delay={60}
              className="mt-7 max-w-[16ch] text-d2 font-bold sm:text-d1"
              lines={[
                "We build",
                "the software.",
                <span key="fill" className="text-accent">
                  Then we fill it
                </span>,
                "with customers.",
              ]}
            />

            <Reveal delay={200}>
              <p className="mt-8 max-w-md text-lead text-mute">
                Software, automation and marketing from one team.{" "}
                <span className="text-paper">8 platforms shipped, 42 clients, 6 industries</span> —
                from the first line of code to the first customer.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="pointer-events-auto mt-8 flex flex-col gap-3 sm:flex-row">
                <Button drawer="details" context="a growth plan">
                  Get a growth plan
                </Button>
                <Button variant="ghost" href="/work">
                  See our work
                </Button>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <p className="mt-8 flex items-start gap-2.5 font-mono text-[0.75rem] text-mute">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-mint" />
                {webgl
                  ? "Drag the globe ⟲ · every arc is a lead landing in Akurdi"
                  : "Replies on WhatsApp in ~4 seconds — including at 11 PM"}
              </p>
            </Reveal>
          </div>

          {/* The handoff. Rises with the dive so the dark hero becomes the white band
              below rather than cutting to it. */}
          <div
            ref={curtain}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[3] opacity-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.65) 55%, #ffffff 100%)",
            }}
          />
        </div>
      </div>

      {/* Trust strip — stat slabs, split by hairlines */}
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
