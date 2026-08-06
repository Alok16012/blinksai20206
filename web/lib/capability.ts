"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Capability gate — Architecture doc §2.
 *
 *   reduced-motion | saveData | deviceMemory < 4 | no WebGL2  → "poster"
 *   mobile                                                    → "lite"   (40% particles, 30fps)
 *   otherwise                                                 → "full"   (interactive + bloom)
 *
 * Exposed through `useSyncExternalStore` so the first client render already knows the
 * answer. Server-rendered HTML always reports "unknown", which is what keeps the canvas
 * out of the SSR output entirely — copy renders first, the scene hydrates after (PRD §9
 * rule 2).
 */
export type Tier = "unknown" | "poster" | "lite" | "full";

/* WebGL2 support cannot change during a session, so probe once and keep it. */
let webgl2: boolean | null = null;
function hasWebGL2() {
  if (webgl2 === null) {
    try {
      webgl2 = !!document.createElement("canvas").getContext("webgl2");
    } catch {
      webgl2 = false;
    }
  }
  return webgl2;
}

function detect(): Tier {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "poster";

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return "poster";
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return "poster";
  if (!hasWebGL2()) return "poster";

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return coarse || window.innerWidth < 1024 ? "lite" : "full";
}

/* One shared subscription — a page with two canvases should not add two resize listeners. */
const listeners = new Set<() => void>();
let cached: Tier | null = null;

function invalidate() {
  const next = detect();
  if (next === cached) return; // resize fires constantly; only wake React on a real change
  cached = next;
  for (const l of listeners) l();
}

function subscribe(onChange: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("resize", invalidate, { passive: true });
    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", invalidate);
  }
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      window.removeEventListener("resize", invalidate);
      window
        .matchMedia("(prefers-reduced-motion: reduce)")
        .removeEventListener("change", invalidate);
    }
  };
}

function getSnapshot(): Tier {
  if (cached === null) cached = detect();
  return cached;
}

const getServerSnapshot = (): Tier => "unknown";

export function useTier(): Tier {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * True while the element is in (or near) the viewport — used to stop canvases rendering
 * when nobody is looking at them.
 *
 * Backed by an IntersectionObserver, plus a direct rect check on the next frame and on
 * every visibility change. The observer alone is not enough: browsers do not deliver
 * IntersectionObserver callbacks while `document.hidden` is true, so a page opened in a
 * background tab would come back to a frozen, never-rendered canvas.
 */
export function useInView<T extends Element>(
  ref: React.RefObject<T | null>,
  rootMargin = "200px",
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const margin = Number.parseInt(rootMargin, 10) || 0;
    // Runs in a rAF / event callback, never synchronously in the effect body.
    const check = () => {
      const r = el.getBoundingClientRect();
      setInView(r.bottom > -margin && r.top < window.innerHeight + margin);
    };

    const raf = requestAnimationFrame(check);
    document.addEventListener("visibilitychange", check);

    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", check);
      io.disconnect();
    };
  }, [ref, rootMargin]);

  return inView;
}
