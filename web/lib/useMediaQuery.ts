"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media queries read through `useSyncExternalStore` rather than
 * `useState` + `useEffect`.
 *
 * The effect version renders once with a wrong guess and then immediately renders
 * again — which for `prefers-reduced-motion` means a visitor who asked for no motion
 * gets one frame of motion anyway. This reads the real value on the first client
 * render and returns the server fallback during SSR.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => serverValue, [serverValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** PRD §9 rule 4 — honoured everywhere, decided in one place. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
