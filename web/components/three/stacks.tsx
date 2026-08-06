"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { View, Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import ModuleStack, { StackLights } from "./ModuleStack";
import { C } from "./lib";

/**
 * Many module stacks, ONE WebGL context.
 *
 * The obvious implementation — a <Canvas> inside each card — does not survive contact
 * with a browser: six of them exhausted the context pool and every canvas came back as
 * a broken-image icon. Browsers cap simultaneous WebGL contexts (commonly 8–16) and
 * silently kill the oldest.
 *
 * So there is exactly one canvas, fixed over the page and fully transparent, and each
 * card contributes a <View> that scissors a region of it to the card's own box. Add a
 * ninth platform and the context count is still one.
 *
 * The canvas is `pointer-events: none` and paints nothing outside the tracked regions,
 * so it never intercepts a click or covers a paragraph.
 */

export function StackCanvas() {
  // No SSR guard needed here: the only caller loads this through
  // `dynamic(..., { ssr: false })` and additionally gates on a tier that is "unknown"
  // on the server, so this never renders outside the browser.
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      <View.Port />
    </Canvas>
  );
}

/**
 * Fires once the view has actually rendered a frame.
 *
 * Mounting a canvas is not the same as painting one: requestAnimationFrame is paused
 * while the document is hidden, so a card opened in a background tab has a live canvas
 * that has drawn nothing. The CSS fallback has to stay up until this fires, or that card
 * is just an empty box until the tab is focused.
 */
function FirstFrame({ onPaint }: { onPaint: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    onPaint();
  });
  return null;
}

export function StackView({
  track,
  count,
  color = C.signal,
  hovered,
  onPaint,
}: {
  track: React.RefObject<HTMLElement | null>;
  count: number;
  color?: string;
  hovered: boolean;
  onPaint?: () => void;
}) {
  return (
    <View track={track as React.RefObject<HTMLElement>}>
      {/* Each view needs its own camera — the shared <Canvas> deliberately declares none,
          and R3F's default (fov 75 at z=5) frames this object far too small and head-on.
          At fov 34 from [0, 1.45, 2.5] the slab sits with roughly a third of the frame as
          margin, so the exploded state on hover never clips. */}
      <PerspectiveCamera
        makeDefault
        fov={34}
        position={[0, 1.45, 2.5]}
        onUpdate={(cam) => cam.lookAt(0, -0.05, 0)}
      />
      {onPaint && <FirstFrame onPaint={onPaint} />}
      <StackLights color={color} />
      <Environment resolution={32}>
        <Lightformer intensity={2} color={color} position={[0, 3, 2]} scale={[5, 5, 1]} />
        <Lightformer intensity={1.2} color={C.violet} position={[-4, 1, -2]} scale={[5, 5, 1]} />
      </Environment>
      <ModuleStack count={count} color={color} hovered={hovered} />
    </View>
  );
}

/** Convenience so a caller can hold a ref without importing three types. */
export function useTrack<T extends HTMLElement>() {
  return useRef<T>(null);
}
