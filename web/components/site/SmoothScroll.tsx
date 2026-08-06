"use client";

import { useEffect } from "react";
import { restorePath } from "@/lib/store";
import { setLenis } from "@/lib/scroll";

/**
 * Lenis + ScrollTrigger, wired together so the pinned Blinks Loop (§7.4) stays in
 * sync with smooth scroll.
 *
 * Both libraries are imported dynamically rather than at module scope: together they are
 * ~69KB gzipped, which is more than a third of the entire first-load budget in PRD §8,
 * and neither is needed until after first paint. A visitor who asked for reduced motion
 * never downloads them at all (§9 rule 4).
 */
export default function SmoothScroll() {
  useEffect(() => {
    restorePath();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      // Unmounted (or reduced-motion toggled) while the chunks were in flight.
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.6,
      });

      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.refresh();

      teardown = () => {
        gsap.ticker.remove(raf);
        setLenis(null);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  return null;
}
