"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

/**
 * A short amber trail that lags the pointer.
 *
 * Lifted from the reference site, which uses the same idea as its only real use of its
 * accent colour. Kept honest about cost: pure DOM transforms on a handful of fixed
 * elements, one rAF loop, no canvas, no library. It never intercepts a pointer event.
 *
 * Skipped entirely on touch (no pointer to trail) and under reduced motion.
 */
const DOTS = 7;

export default function CursorTrail() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = wrap.current;
    if (!root) return;

    const dots = Array.from(root.children) as HTMLElement[];
    const pos = dots.map(() => ({ x: -100, y: -100 }));
    const target = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const tick = () => {
      let px = target.x;
      let py = target.y;
      for (let i = 0; i < dots.length; i++) {
        const p = pos[i];
        // Each dot eases toward the one ahead of it — that lag is the whole effect.
        p.x += (px - p.x) * (0.34 - i * 0.03);
        p.y += (py - p.y) * (0.34 - i * 0.03);
        dots[i].style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
        px = p.x;
        py = p.y;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[150] hidden [@media(pointer:fine)]:block"
    >
      {Array.from({ length: DOTS }).map((_, i) => (
        <span
          key={i}
          /* Plain amber, not mix-blend-difference: differencing #FFB224 against a white
             band inverts it to blue, so the trail would change colour between bands. */
          className="fixed left-0 top-0 rounded-full bg-signal"
          style={{
            width: `${10 - i}px`,
            height: `${10 - i}px`,
            opacity: 1 - i / DOTS,
          }}
        />
      ))}
    </div>
  );
}
