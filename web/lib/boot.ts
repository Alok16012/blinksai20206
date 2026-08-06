"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the boot overlay is still covering the page.
 *
 * This exists because IntersectionObserver does not care what is painted on top of an
 * element. While the Preloader sat over the page, every above-the-fold `Reveal`, every
 * `Lines` headline and every `Counter` observed itself as "in view", animated, and
 * finished — all behind an opaque black overlay. The overlay then lifted onto a page
 * that had already settled, so the entrance animation was never actually seen.
 *
 * Entrance animations subscribe here and hold until the overlay is gone.
 *
 * Fail-safe by construction: the default is "not booting", so if the Preloader never
 * mounts (reduced motion, a repeat visit, an exception) nothing is gated. And arming
 * `setBooting(true)` also arms a hard timer that clears it no matter what — a stuck
 * flag would otherwise leave the whole page invisible, which is far worse than a
 * missed animation.
 */

/** Longer than the Preloader's own 2000ms cap plus its exit, and never load-bearing. */
const FAILSAFE_MS = 3200;

let booting = false;
let failsafe: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function setBooting(next: boolean) {
  if (booting === next) return;
  booting = next;
  if (failsafe) {
    clearTimeout(failsafe);
    failsafe = null;
  }
  if (next) {
    failsafe = setTimeout(() => {
      booting = false;
      failsafe = null;
      emit();
    }, FAILSAFE_MS);
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

const getSnapshot = () => booting;
/* Server render is never "booting" — the HTML must be complete for crawlers. */
const getServerSnapshot = () => false;

/** True once the boot overlay is gone (or was never shown). */
export function useBooted(): boolean {
  return !useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
