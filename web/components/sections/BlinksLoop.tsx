"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Button, Eyebrow, Lines, Reveal } from "@/components/ui";
import { loopStages } from "@/lib/content";
import { useInView, useTier } from "@/lib/capability";
import { scrollToY } from "@/lib/scroll";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/useMediaQuery";

const LoopEngine = dynamic(() => import("@/components/three/LoopEngine"), { ssr: false });

const N = loopStages.length;
const accent = ["text-accent", "text-violet", "text-mint", "text-accent", "text-mint"];
const accentBg = ["bg-signal", "bg-violet", "bg-mint", "bg-signal", "bg-mint"];

export default function BlinksLoop() {
  const wrap = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [i, setI] = useState(0);
  const inView = useInView(stageRef, "200px");
  const tier = useTier();
  const webgl = tier === "full" || tier === "lite";
  const reduced = usePrefersReducedMotion();
  /* The pinned stage is `hidden lg:block`; below that breakpoint it is the swipe deck,
     which needs no ScrollTrigger — so on mobile GSAP is never even fetched. */
  const pinned = useMediaQuery("(min-width: 64rem)");

  useEffect(() => {
    const el = wrap.current;
    if (!el || reduced || !pinned) return;

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
        // Guardrail (PRD §7.4): a fast scroll must never trap the user.
        fastScrollEnd: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          const next = Math.min(N - 1, Math.floor(self.progress * N * 0.999));
          setI((prev) => (prev === next ? prev : next));
        },
      });
      kill = () => st.kill();
    })();

    return () => {
      cancelled = true;
      kill?.();
    };
  }, [reduced, pinned]);

  const stage = loopStages[i];

  return (
    <section id="loop" className="relative">
      {/* ── Desktop: sticky viewport, 5 stages across ~300vh ─────────────── */}
      <div ref={wrap} className={clsx("relative hidden lg:block", reduced ? "" : "h-[420vh]")}>
        <div
          ref={stageRef}
          className={clsx(
            "flex h-screen flex-col justify-center overflow-hidden",
            reduced ? "" : "sticky top-0",
          )}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-50" />
          <div className="container-site relative grid grid-cols-12 items-center gap-12">
            {/* Canvas — square frame, hairline border, no glass */}
            <div className="col-span-6">
              {/* Capped against viewport height so a short laptop screen never clips the
                  copy panel beside it — the sticky stage is overflow-hidden. */}
              <div className="relative mx-auto aspect-square w-full max-w-[min(100%,64vh)] overflow-hidden border border-line bg-deck">
                {webgl && !reduced ? (
                  <LoopEngine progress={progress} tier={tier} active={inView} />
                ) : (
                  <LoopFallback i={i} />
                )}
                <span className="label pointer-events-none absolute bottom-4 left-4 border border-line bg-ink px-3 py-2 text-mute">
                  Scroll to run the loop
                </span>
              </div>
            </div>

            {/* Copy panel */}
            <div className="col-span-6">
              <Eyebrow
                t={stage.t}
                accent={i === 1 ? "violet" : i === 2 || i === 4 ? "mint" : "signal"}
              >
                The Blinks Loop
              </Eyebrow>

              {/* Stage progress: one hard segment per stage, seams 1px apart */}
              <div className="mt-8 flex gap-px">
                {loopStages.map((s, k) => (
                  <button
                    key={s.key}
                    onClick={() => scrollToStage(wrap.current, k)}
                    className="group flex-1 text-left"
                    aria-label={`Go to ${s.label}`}
                  >
                    <span
                      className={clsx(
                        "block h-2 w-full transition-colors duration-500",
                        k === i ? accentBg[k] : "bg-line group-hover:bg-mute/50",
                      )}
                    />
                    <span
                      className={clsx(
                        "label mt-3 block transition-colors duration-300",
                        k === i ? "text-paper" : "text-mute",
                      )}
                    >
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Keyed on the stage so the headline re-wipes on every change. */}
              <div key={stage.key} className="reveal in mt-10">
                <Lines as="h2" className="text-d2 font-bold" lines={[stage.headline]} />
                <p className="mt-6 max-w-xl text-lead text-mute">{stage.body}</p>
                <p className={clsx("mt-6 font-mono text-small", accent[i])}>→ {stage.proof}</p>
                <div className="mt-8">
                  <Button variant="ghost" href={stage.href}>
                    See the {stage.label.toLowerCase()} stage
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: 5 swipeable cards, no pin (PRD §8) ────────────────────── */}
      <div className="lg:hidden">
        <div className="container-site pt-24">
          <Reveal>
            <Eyebrow>The Blinks Loop</Eyebrow>
          </Reveal>
          <Lines as="h2" delay={60} className="mt-6 text-d3 font-bold sm:text-d2" lines={["One system,", "five stages —", "not five vendors."]} />
        </div>
        <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] sm:px-10 [&::-webkit-scrollbar]:hidden">
          {loopStages.map((s, k) => (
            <li key={s.key} className="panel w-[80vw] max-w-sm shrink-0 snap-center p-6">
              <p className={clsx("label", accent[k])}>
                {s.t} / {s.label}
              </p>
              <div className={clsx("mt-3 h-0.5 w-10", accentBg[k])} />
              <h3 className="mt-5 text-d4">{s.headline}</h3>
              <p className="mt-3 text-small text-mute">{s.body}</p>
              <p className={clsx("mt-5 font-mono text-[0.6875rem]", accent[k])}>→ {s.proof}</p>
            </li>
          ))}
        </ul>
        <p className="label px-5 pb-24 text-mute sm:px-10">Swipe →</p>
      </div>
    </section>
  );
}

function scrollToStage(el: HTMLElement | null, k: number) {
  if (!el) return;
  const top = el.offsetTop + (el.offsetHeight - window.innerHeight) * (k / (N - 1)) * 0.98;
  scrollToY(top);
}

/** Tier-3 fallback for the loop: same five stages, CSS only. */
function LoopFallback({ i }: { i: number }) {
  return (
    <div className="grid h-full place-items-center p-8">
      <div className="relative aspect-square w-full max-w-sm">
        {/* True circles — the only curves allowed in the system. */}
        <div className="absolute inset-0 rounded-full border border-line" />
        <div className="absolute inset-[18%] rounded-full border border-dashed border-line" />
        {loopStages.map((s, k) => {
          const a = (k / N) * Math.PI * 2 - Math.PI / 2;
          return (
            <div
              key={s.key}
              className={clsx(
                "absolute -translate-x-1/2 -translate-y-1/2 border px-3 py-2 transition-all duration-500",
                k === i ? "border-signal bg-signal text-carbon" : "border-line bg-deck text-mute",
              )}
              style={{
                left: `${50 + Math.cos(a) * 42}%`,
                top: `${50 + Math.sin(a) * 42}%`,
              }}
            >
              <span className="label">{s.label}</span>
            </div>
          );
        })}
        <div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
      </div>
    </div>
  );
}
