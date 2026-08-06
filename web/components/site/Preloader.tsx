"use client";

import Image from "next/image";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { industries, platforms, site } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { setBooting } from "@/lib/boot";

/**
 * Boot screen — the ops console coming up before the shift starts.
 *
 * Three rules shape every decision below, in this order:
 *
 * 1. **It is an overlay, never a gate.** The real page is server-rendered and mounted
 *    underneath the whole time. This renders `null` on the server and on the first
 *    client render, then decides in an effect — so there is no hydration mismatch, and
 *    a crawler, a screen reader or a visitor with JS off sees the page and never this.
 * 2. **It cannot trap anyone.** Hard cap at 2000ms whatever has loaded, plus dismissal
 *    on the first key, pointer or wheel event. The progress read-out is wired to two
 *    real signals (`document.readyState` and `document.fonts.ready`) — it never counts
 *    up a percentage of something that is not actually loading.
 * 3. **Once per session.** `sessionStorage` key `blinksai.booted`, written the moment
 *    it is shown, so route changes and a second page in the same tab go straight in.
 *
 * `prefers-reduced-motion` skips it entirely (PRD §9 rule 4) — a full-screen wipe is
 * exactly the kind of motion that rule exists to suppress, so there is no "static
 * version" to fall back to.
 */

const SESSION_KEY = "blinksai.booted";
/** Never longer than this, no matter what is still in flight. */
const HARD_CAP_MS = 2000;
/** Must outlast the aperture below: 260ms delay + 1150ms travel, plus a little slack
 *  so the lids are fully off-screen before the overlay unmounts. */
const EXIT_MS = 1550;

/**
 * Fallback for browsers where `sessionStorage` throws (private mode, cookies blocked).
 * Module scope survives client-side navigation, so it still means "once per page load"
 * rather than "on every route change".
 */
let shownThisLoad = false;

/** The roster the console brings up: seven industries, then the eight platforms. */
const roster: { name: string; tag: string }[] = [
  ...industries.map((i) => ({ name: i.name, tag: "industry" })),
  // `status` is the real field from lib/content.ts — Blinks Agri says "in development"
  // here for the same reason it does everywhere else on the site.
  ...platforms.map((p) => ({ name: p.product, tag: p.status })),
];

/**
 * Elapsed-time device (PRD §6), and every line is true of this business: the site is a
 * lead engine, the automation layer is WhatsApp Cloud API answering in ~4s, and Week 5
 * is when campaigns get pointed at the system — the same T+ marks as `loopStages`.
 */
const bootLines: { t: string; line: string }[] = [
  { t: "T+0s", line: "lead engine online" },
  { t: "T+4s", line: "whatsapp channel ready" },
  { t: "Week 5", line: "campaigns pointed at it" },
];

/**
 * Scoped stylesheet rather than globals.css: the wipe and the vertical lane exist only
 * here, and rendering the <style> inside the overlay means it leaves with it. The lane
 * is the existing "lane travel" move (see `.marquee-track`) turned onto the Y axis —
 * the only new keyframe on the site.
 */
const css = `
/* The exit is an aperture, not a wipe.
   The brand mark is a *blink* — an eye with a smile under it — so the boot screen
   leaves the way an eye opens: content dims, a thin amber slit strikes across the
   centre, then the two halves part and the world behind is simply there. */
.bl-shell {
  pointer-events: auto;
}
.bl-shell[data-exit="true"] {
  pointer-events: none;
}

/* The two lids. They cover the screen, then retract to the top and bottom edges. */
.bl-lid {
  position: absolute;
  left: 0;
  right: 0;
  height: 50.5%; /* slight overlap so no hairline of the page shows through the seam */
  background: var(--surface);
  will-change: transform;
  transition: transform 1150ms cubic-bezier(0.76, 0, 0.24, 1) 260ms;
}
.bl-lid-top { top: 0; }
.bl-lid-bottom { bottom: 0; }
.bl-shell[data-exit="true"] .bl-lid-top { transform: translate3d(0, -100%, 0); }
.bl-shell[data-exit="true"] .bl-lid-bottom { transform: translate3d(0, 100%, 0); }

/* The slit: a hairline that strikes out across the seam just before the lids part. */
.bl-slit {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  transform: translateY(-50%) scaleX(0);
  background: linear-gradient(90deg, transparent, var(--color-signal), transparent);
  opacity: 0;
  transition:
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 260ms linear 900ms;
}
.bl-shell[data-exit="true"] .bl-slit {
  transform: translateY(-50%) scaleX(1);
  opacity: 1;
}

.bl-inner {
  transition:
    transform 420ms var(--ease-reveal),
    opacity 260ms linear;
}
.bl-shell[data-exit="true"] .bl-inner {
  transform: translate3d(0, -1.25rem, 0);
  opacity: 0;
}
.bl-dots {
  /* --line comes off the .band-dark on the shell, so the dot floor tracks the token. */
  background-image: radial-gradient(var(--line) 1px, transparent 1.5px);
  background-size: 26px 26px;
  background-position: center center;
  -webkit-mask-image: radial-gradient(ellipse 62% 56% at 50% 46%, #000 8%, transparent 72%);
  mask-image: radial-gradient(ellipse 62% 56% at 50% 46%, #000 8%, transparent 72%);
}
.bl-lane {
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 26%, #000 74%, transparent);
  mask-image: linear-gradient(to bottom, transparent, #000 26%, #000 74%, transparent);
}
@keyframes bl-lane-travel {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, -50%, 0); }
}
.bl-lane-track {
  animation: bl-lane-travel 10s linear infinite;
}
`;

type Phase = "idle" | "boot" | "exit" | "gone";

function Signal({ ok, name }: { ok: boolean; name: string }) {
  return (
    <span className={clsx("flex items-center gap-2", ok ? "text-mint" : "text-mute")}>
      <span className={clsx("size-1 rounded-full", ok ? "bg-mint" : "bg-mute/40")} />
      {name}
    </span>
  );
}

export default function Preloader() {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [docReady, setDocReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  /* ── Decide, once ───────────────────────────────────────────────────────── */
  useEffect(() => {
    let force = false;
    try {
      force = new URLSearchParams(window.location.search).has("boot");
    } catch {
      /* malformed query string — treat as not forced */
    }
    // An explicit ?boot is the visitor asking for it, so it outranks the preference.
    if (reduced && !force) return;

    let seen: boolean;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) !== null;
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      seen = shownThisLoad;
    }
    shownThisLoad = true;
    if (seen && !force) return;

    // Claimed synchronously, before any IntersectionObserver callback can fire, so no
    // entrance animation starts underneath the overlay. See lib/boot.ts.
    setBooting(true);

    // Queued, not called here: a synchronous setState in an effect body is a React
    // Compiler lint error in Next 16. A microtask callback is not.
    queueMicrotask(() => setPhase((p) => (p === "idle" ? "boot" : p)));
  }, [reduced]);

  /* ── Real signals, the hard cap, and every escape hatch ─────────────────── */
  useEffect(() => {
    if (phase !== "boot") return;

    // Everything below is re-created per run, so a StrictMode double-invoke re-attaches
    // cleanly instead of leaving the overlay up with no listeners.
    let live = true;
    const got = { doc: false, fonts: false };

    const leave = () => {
      if (!live) return;
      live = false;
      // Released here rather than on unmount: the entrance should run *with* the wipe,
      // not after it, so the page is already moving as the overlay clears.
      setBooting(false);
      setPhase("exit");
    };

    const mark = (key: "doc" | "fonts") => {
      if (!live || got[key]) return;
      got[key] = true;
      if (key === "doc") setDocReady(true);
      else setFontsReady(true);
      if (got.doc && got.fonts) leave();
    };

    const onLoad = () => mark("doc");
    if (document.readyState === "complete") queueMicrotask(onLoad);
    else window.addEventListener("load", onLoad, { once: true });

    // Typed as optional on purpose — `document.fonts` is missing on old WebViews, and a
    // signal that can never resolve would lean the whole thing on the timeout.
    const fonts: FontFaceSet | undefined = document.fonts;
    if (fonts) {
      void fonts.ready.then(
        () => mark("fonts"),
        () => mark("fonts"),
      );
    } else {
      queueMicrotask(() => mark("fonts"));
    }

    const cap = window.setTimeout(leave, HARD_CAP_MS);
    window.addEventListener("keydown", leave);
    window.addEventListener("pointerdown", leave);
    window.addEventListener("wheel", leave, { passive: true });

    return () => {
      live = false;
      window.clearTimeout(cap);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("keydown", leave);
      window.removeEventListener("pointerdown", leave);
      window.removeEventListener("wheel", leave);
    };
  }, [phase]);

  /* ── Unmount when the wipe has finished ─────────────────────────────────── */
  useEffect(() => {
    if (phase !== "exit") return;
    const t = window.setTimeout(() => setPhase("gone"), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // `reduced` is checked here as well as in the effect: `useSyncExternalStore` reports
  // the server value for the hydration render, so the effect can fire once before the
  // real preference lands. Guarding the render means it is still never seen.
  // No `reduced` check here on purpose: every skip path above returns before `phase`
  // leaves "idle", so the phase alone already says whether this screen is showing.
  // Keeping a second copy of that rule is how the two get out of step.
  if (phase === "idle" || phase === "gone") return null;

  const done = (docReady ? 1 : 0) + (fontsReady ? 1 : 0);

  return (
    <div
      // Decorative and duplicated by the page underneath: hidden from assistive tech,
      // and there is nothing focusable inside it, so it never enters the tab order.
      aria-hidden="true"
      data-exit={phase === "exit"}
      // `band-dark` is forced: the boot screen is always near-black, whatever band the
      // page happens to open on underneath it.
      className="band-dark bl-shell noise fixed inset-0 z-[200] overflow-hidden select-none"
    >
      <style>{css}</style>

      {/* The lids carry the background; the shell behind them is transparent, so the
          moment they part the page underneath is already painted and simply appears. */}
      <div className="bl-lid bl-lid-top" />
      <div className="bl-lid bl-lid-bottom" />
      <div className="bl-slit" />

      <div className="bl-dots pointer-events-none absolute inset-0" />

      <div className="bl-inner container-site relative flex h-full flex-col py-7 sm:py-9">
        {/* Top rail — the two facts the console can state without a client's consent */}
        <div className="label flex items-center justify-between gap-4 border-b border-line pb-4 text-mute">
          <span className="flex items-center gap-2.5">
            <span className="blink size-1.5 rounded-full bg-signal" />
            <span className="text-paper/80">{site.category}</span>
          </span>
          <span>{site.city}</span>
        </div>

        {/* Wordmark + the roster lane */}
        <div className="flex flex-1 flex-col items-center justify-center gap-7 py-6 sm:flex-row sm:gap-14">
          <Image
            src="/blinksai-wordmark.png"
            alt=""
            width={340}
            height={152}
            sizes="(min-width: 640px) 340px, 68vw"
            /* This is the largest thing painted on a cold load, so it *is* the LCP
               element. `priority` (not just loading="eager") is what preloads it and
               what stops Next warning — LCP is a PRD §8 budget, not a nicety. */
            priority
            draggable={false}
            className="h-auto w-[min(68vw,21.25rem)]"
          />

          <div className="bl-lane relative h-32 w-full max-w-[17rem] overflow-hidden border-l border-line pl-4 sm:h-40 sm:w-[17rem]">
            <div className="bl-lane-track">
              {/* Two identical copies — the -50% travel is what makes the loop seamless */}
              {[0, 1].map((copy) => (
                <div key={copy}>
                  {roster.map((r) => (
                    <div
                      key={`${copy}-${r.name}`}
                      className="label flex items-baseline justify-between gap-5 py-2"
                    >
                      <span className="text-paper/70">{r.name}</span>
                      <span className="text-mute/50">{r.tag}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom rail — boot read-out, then the two signals actually being waited on */}
        <div className="hairline grid gap-6 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <ul className="space-y-1.5">
            {bootLines.map((b, i) => (
              <li
                key={b.t}
                className="reveal in label flex items-baseline gap-3"
                style={{ animationDelay: `${140 + i * 110}ms` }}
              >
                <span className="w-16 shrink-0 text-paper/80">{b.t}</span>
                <span className="text-mute">{b.line}</span>
              </li>
            ))}
          </ul>

          <div className="w-full sm:w-56">
            <div className="label flex items-baseline justify-between text-mute">
              <span>boot</span>
              <span className="tabular-nums text-paper/80">{done} / 2</span>
            </div>
            {/* Square bar — the only curves on this screen are the true circles below. */}
            <div className="relative mt-2.5 h-1 w-full overflow-hidden bg-line">
              <div
                className="absolute inset-y-0 left-0 bg-mint transition-[width] duration-500 [transition-timing-function:var(--ease-reveal)]"
                style={{ width: `${(done / 2) * 100}%` }}
              />
            </div>
            <div className="label mt-2.5 flex items-center gap-5">
              <Signal ok={docReady} name="document" />
              <Signal ok={fontsReady} name="fonts" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
