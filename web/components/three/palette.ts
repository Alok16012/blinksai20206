/**
 * Scene colours — deliberately in their own module with ZERO imports.
 *
 * These used to live in `./lib`, which imports three.js and @react-three/fiber. Any
 * non-3D component that wanted a hex value therefore dragged the entire renderer into
 * the first-load bundle: the homepage went from 193 KB to 427 KB gzipped because one
 * card wrapper read a colour from there.
 *
 * Keep this file dependency-free. Anything that needs three.js belongs in `./lib`.
 */
export const C = {
  /* Matches the .band-dark surface exactly — the canvases paint an opaque background and
     sit inside a forced-dark inset, so any mismatch shows as a seam around the frame. */
  ink: "#111111",
  deck: "#1a1a1e",
  deck2: "#232329",
  signal: "#ffb224",
  violet: "#7a5cff",
  mint: "#5fd3a6",
  paper: "#edf1f7",
  mute: "#8b94ac",
} as const;
