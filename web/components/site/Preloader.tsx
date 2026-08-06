"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { setBooting } from "@/lib/boot";

/**
 * The ring.
 *
 * A dark screen, an amber ring struck at the centre, and then the ring rushes outward
 * past the edges — the page opening through the hole it leaves behind. A camera iris,
 * or a portal: you go *through* it rather than watching a panel move.
 *
 * It runs on first load and on every route change, and takes about a second.
 *
 * How the hole is made: `.bl-iris` is a circle of zero size carrying a 100vmax
 * `box-shadow`, so the shadow paints everything *outside* the circle and the circle
 * itself is a hole. Growing the circle grows the hole. Width and height are animated
 * rather than `transform: scale`, because scale would multiply the shadow spread too and
 * a tiny circle would then stop covering the screen.
 *
 * Rules it keeps:
 * - **Overlay, never a gate.** The page is server-rendered and mounted underneath the
 *   whole time. Renders `null` on the server and the first client render, so there is
 *   no hydration mismatch and a crawler never sees it.
 * - **It cannot trap anyone.** Every phase is on a timer and the shell goes
 *   `pointer-events: none` the moment the ring starts moving.
 * - **`prefers-reduced-motion` skips it** (PRD §9 rule 4). `?boot` overrides, because
 *   an explicit query param is the visitor asking for it.
 */

/** Dark, with the ring struck but not yet moving. */
const HOLD_MS = 160;
/** The ring rushing out past the corners. Must match the transitions below. */
const OPEN_MS = 860;

type Phase = "idle" | "shut" | "opening" | "gone";

const css = `
/* The hole. 100vmax of shadow means "everything outside this circle is dark", so the
   circle is a window onto the page, and growing it opens the window. */
.bl-iris {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  margin: 0;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 100vmax #111111;
  will-change: width, height;
}
.bl-shell[data-phase="opening"] .bl-iris {
  width: 260vmax;
  height: 260vmax;
  /* Slow off the mark, then a rush — the acceleration is what makes it read as
     travelling toward you rather than a circle being resized. */
  transition:
    width ${OPEN_MS}ms cubic-bezier(0.66, 0, 0.34, 1),
    height ${OPEN_MS}ms cubic-bezier(0.66, 0, 0.34, 1);
}

/* The ring itself, riding the leading edge of the hole and thinning as it goes. */
.bl-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12rem;
  height: 12rem;
  margin: -6rem 0 0 -6rem;
  border-radius: 50%;
  border: 2px solid #ffb224;
  box-shadow: 0 0 60px rgba(255, 178, 36, 0.55), inset 0 0 40px rgba(255, 178, 36, 0.25);
  transform: scale(0.06);
  opacity: 0;
  will-change: transform, opacity;
}
.bl-shell[data-phase="shut"] .bl-ring {
  opacity: 1;
  transition: opacity 160ms linear;
}
.bl-shell[data-phase="opening"] .bl-ring {
  transform: scale(14);
  opacity: 0;
  border-width: 1px;
  transition:
    transform ${OPEN_MS}ms cubic-bezier(0.66, 0, 0.34, 1),
    border-width ${OPEN_MS}ms linear,
    opacity ${OPEN_MS}ms cubic-bezier(0.5, 0, 1, 1);
}

/* A second ring a beat behind, so the move has depth instead of one lonely circle. */
.bl-ring-trail {
  border-color: rgba(255, 178, 36, 0.35);
  box-shadow: none;
}
.bl-shell[data-phase="opening"] .bl-ring-trail {
  transform: scale(11);
  transition-delay: 90ms;
}
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

    // Hold the entrance animations underneath while the screen is dark, or they play out
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
      // A navigation mid-transition must not leave the page gated behind a stuck flag.
      setBooting(false);
    };
    // Re-running on `pathname` is the point: every navigation plays this.
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

      {/* Order matters: the iris paints the darkness, so the rings must come after it
          to ride on top of the hole's edge rather than be covered by the shadow. */}
      <div className="bl-iris" />
      <div className="bl-ring bl-ring-trail" />
      <div className="bl-ring" />
    </div>
  );
}
