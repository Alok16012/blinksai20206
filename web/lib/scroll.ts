"use client";

import type Lenis from "lenis";

/**
 * One shared handle on the Lenis instance.
 *
 * Native `window.scrollTo({ behavior: "smooth" })` fights Lenis's rAF loop and produces
 * a visible stutter, so anything that programmatically scrolls goes through here and
 * falls back to the native call only when smooth scrolling is off (reduced motion).
 */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function scrollToY(y: number) {
  if (instance) instance.scrollTo(y, { duration: 1.1 });
  else window.scrollTo({ top: y, behavior: "smooth" });
}
