"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { setBooting } from "@/lib/boot";

/**
 * The blink.
 *
 * The brand mark is a *blink* — an eye with a smile beneath it — so that is the page
 * transition: two lids close, a hairline amber slit strikes the seam, and the lids part
 * again on the new page. It runs on first load and on every route change, and the whole
 * thing takes about a second.
 *
 * Rules it keeps:
 * - **Overlay, never a gate.** The page is server-rendered and mounted underneath the
 *   whole time. This renders `null` on the server and on the first client render, so
 *   there is no hydration mismatch and a crawler never sees it.
 * - **It cannot trap anyone.** Every phase is on a timer and the shell goes
 *   `pointer-events: none` the moment the lids start opening.
 * - **`prefers-reduced-motion` skips it entirely** (PRD §9 rule 4) — a full-screen wipe
 *   is exactly what that preference exists to suppress. `?boot` overrides it, because
 *   an explicit query param is the visitor asking for it.
 *
 * The console read-out that used to live here is gone. At a one-second budget a
 * scrolling roster and a progress bar are a flash of noise — they need three seconds to
 * read as anything, and one second is the brief.
 */

/** Lids shut, before the slit strikes. */
const HOLD_MS = 170;
/** Lids travelling off the top and bottom edges. Must match `.bl-lid` below. */
const OPEN_MS = 720;

type Phase = "idle" | "shut" | "opening" | "gone";

const css = `
.bl-lid {
  position: absolute;
  left: 0;
  right: 0;
  height: 50.5%; /* overlap, so no hairline of the page shows through the seam */
  background: #111111;
  will-change: transform;
}
.bl-lid-top { top: 0; }
.bl-lid-bottom { bottom: 0; }

.bl-shell[data-phase="shut"] .bl-lid { transform: translate3d(0, 0, 0); }

/* Eased so the lids part, accelerate through the middle, then settle. */
.bl-shell[data-phase="opening"] .bl-lid {
  transition: transform ${OPEN_MS}ms cubic-bezier(0.76, 0, 0.24, 1);
}
.bl-shell[data-phase="opening"] .bl-lid-top { transform: translate3d(0, -100%, 0); }
.bl-shell[data-phase="opening"] .bl-lid-bottom { transform: translate3d(0, 100%, 0); }

.bl-slit {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  transform: translateY(-50%) scaleX(0);
  background: linear-gradient(90deg, transparent, #ffb224, transparent);
  opacity: 0;
  transition:
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 200ms linear;
}
.bl-shell[data-phase="opening"] .bl-slit {
  transform: translateY(-50%) scaleX(1);
  opacity: 1;
}

.bl-mark { transition: opacity 200ms linear, transform 320ms cubic-bezier(0.22, 1, 0.36, 1); }
.bl-shell[data-phase="opening"] .bl-mark { opacity: 0; transform: scale(1.04); }
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

      {/* The lids carry the background and the shell itself is transparent, so the page
          underneath is painted the whole time — the lids reveal it rather than the
          overlay cross-fading to it. That difference is what reads as *opening*. */}
      <div className="bl-lid bl-lid-top" />
      <div className="bl-lid bl-lid-bottom" />
      <div className="bl-slit" />

      <div className="bl-mark pointer-events-none absolute inset-0 grid place-items-center">
        <Image
          src="/blinksai-wordmark.png"
          alt=""
          width={340}
          height={152}
          priority
          sizes="(min-width: 640px) 220px, 48vw"
          draggable={false}
          className="h-auto w-[min(48vw,13.75rem)]"
        />
      </div>
    </div>
  );
}
