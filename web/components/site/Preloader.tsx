"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { setBooting } from "@/lib/boot";

/**
 * The blink.
 *
 * The brand mark is a *blink*, so that is the page transition — and it is built as an
 * actual eye, not two sliding panels. Each lid is a block whose inner edge is a curve,
 * so when they part the gap between two opposing curves is an almond: a slit, then an
 * eye, then the whole screen. The amber catchlight strikes along the opening.
 *
 * The curvature is the whole point. Flat panels sliding apart read as a garage door;
 * the curve is what makes it an eye.
 *
 * It runs on first load and on every route change, and takes about a second.
 *
 * Rules it keeps:
 * - **Overlay, never a gate.** The page is server-rendered and mounted underneath the
 *   whole time. Renders `null` on the server and the first client render, so there is
 *   no hydration mismatch and a crawler never sees it.
 * - **It cannot trap anyone.** Every phase is on a timer and the shell goes
 *   `pointer-events: none` the moment the lids start opening.
 * - **`prefers-reduced-motion` skips it** (PRD §9 rule 4). `?boot` overrides, because
 *   an explicit query param is the visitor asking for it.
 */

/** Lids shut, before they part. */
const HOLD_MS = 190;
/** Lids travelling clear of the viewport. Must match `.bl-lid` below. */
const OPEN_MS = 760;

type Phase = "idle" | "shut" | "opening" | "gone";

/**
 * Lids are 72% tall with a 24% vertical corner radius, which is what shapes them.
 * The radius pulls the outer corners back, so each lid reaches 72% of the viewport at
 * the centre but only ~55% at the far edges. Two of them therefore still overlap
 * everywhere when shut (55 + 55 > 100) — without the extra height the curve would open
 * gaps in the corners.
 */
const css = `
.bl-lid {
  position: absolute;
  left: -2%;
  right: -2%;
  height: 72%;
  background: #111111;
  will-change: transform;
}
.bl-lid-top {
  top: 0;
  /* Bottom edge bows down at the centre — an upper eyelid. */
  border-radius: 0 0 50% 50% / 0 0 24% 24%;
}
.bl-lid-bottom {
  bottom: 0;
  border-radius: 50% 50% 0 0 / 24% 24% 0 0;
}

.bl-shell[data-phase="shut"] .bl-lid { transform: translate3d(0, 0, 0); }

/* Parts slowly, accelerates through the middle, settles — the cadence of a real blink. */
.bl-shell[data-phase="opening"] .bl-lid {
  transition: transform ${OPEN_MS}ms cubic-bezier(0.76, 0, 0.24, 1);
}
.bl-shell[data-phase="opening"] .bl-lid-top { transform: translate3d(0, -101%, 0); }
.bl-shell[data-phase="opening"] .bl-lid-bottom { transform: translate3d(0, 101%, 0); }

/* The catchlight: an almond of amber that opens along with the lids, so the light
   travels with the aperture instead of sitting on it as a straight rule. */
.bl-eye {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 78vw;
  height: 2px;
  transform: translate(-50%, -50%) scaleX(0.12);
  border-radius: 50%;
  background: radial-gradient(closest-side, #ffb224, rgba(255,178,36,0.35) 60%, transparent);
  opacity: 0;
  transition:
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
    height 520ms cubic-bezier(0.76, 0, 0.24, 1),
    opacity 300ms linear 340ms;
}
.bl-shell[data-phase="opening"] .bl-eye {
  transform: translate(-50%, -50%) scaleX(1);
  height: 26vh;
  opacity: 0;
}
.bl-shell[data-phase="shut"] .bl-eye { opacity: 0.9; }
`;

export default function Preloader() {
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    let force = false;
    try {
      force = new URLSearchParams(window.location.search).has("boot");
    } catch {
      /* malformed query string — treat as not forced */
    }
    if (reduced && !force) return;

    let live = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => {
      timers.push(setTimeout(() => live && fn(), ms));
    };

    // Hold the entrance animations underneath while the lids are shut, or they play out
    // behind an opaque overlay and finish before anyone sees them. See lib/boot.ts.
    setBooting(true);
    // Queued rather than called here: a synchronous setState in an effect body is a
    // React Compiler lint error in Next 16. A timer callback is not.
    at(0, () => setPhase("shut"));
    at(HOLD_MS, () => {
      setPhase("opening");
      setBooting(false);
    });
    at(HOLD_MS + OPEN_MS + 60, () => setPhase("gone"));

    return () => {
      live = false;
      for (const t of timers) clearTimeout(t);
      // A navigation mid-blink must not leave the page gated behind a stuck flag.
      setBooting(false);
    };
    // Re-running on `pathname` is the point: every navigation blinks.
  }, [reduced, pathname]);

  if (phase === "idle" || phase === "gone") return null;

  return (
    <div
      // Decorative, and everything under it is the real page: hidden from assistive
      // tech, nothing focusable inside, never in the tab order.
      aria-hidden="true"
      data-phase={phase}
      className={`bl-shell fixed inset-0 z-[200] select-none overflow-hidden ${
        phase === "opening" ? "pointer-events-none" : ""
      }`}
    >
      <style>{css}</style>

      {/* The catchlight sits under the lids, so it is only visible through the opening
          they leave — which is what makes it read as light coming through an eye
          rather than a rule drawn on top of a panel. */}
      <div className="bl-eye" />

      {/* The lids carry the background and the shell itself is transparent, so the page
          underneath is painted the whole time. The lids reveal it rather than the
          overlay cross-fading to it — that difference is what reads as opening. */}
      <div className="bl-lid bl-lid-top" />
      <div className="bl-lid bl-lid-bottom" />
    </div>
  );
}
