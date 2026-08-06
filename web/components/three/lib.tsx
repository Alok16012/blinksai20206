"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export { C } from "./palette";

/**
 * Pointer-drag rotation with spring-back. Written by hand rather than pulled from a
 * controls library so the axis limits stay tight — the board should feel like a
 * physical object on a desk, not a free-orbiting model viewer.
 */
export function useDragRotate(
  ref: React.RefObject<THREE.Group | null>,
  opts: { rest?: [number, number]; limit?: [number, number]; enabled?: boolean } = {},
) {
  const { rest = [0.06, -0.34], limit = [0.28, 0.72], enabled = true } = opts;
  const [restX, restY] = rest;
  const [limX, limY] = limit;
  const gl = useThree((s) => s.gl);
  const drag = useRef({ active: false, x: 0, y: 0, rx: restX, ry: restY });
  const target = useRef({ x: restX, y: restY });
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const el = gl.domElement;
    const d = drag.current;

    const down = (e: PointerEvent) => {
      d.active = true;
      d.x = e.clientX;
      d.y = e.clientY;
      d.rx = target.current.x;
      d.ry = target.current.y;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.current.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!d.active) return;
      target.current.y = clamp(d.ry + (e.clientX - d.x) * 0.006, restY - limY, restY + limY);
      target.current.x = clamp(d.rx + (e.clientY - d.y) * 0.004, restX - limX, restX + limX);
    };
    const up = (e: PointerEvent) => {
      d.active = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
      el.style.cursor = "grab";
    };

    el.style.cursor = "grab";
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.style.cursor = "";
    };
  }, [gl, enabled, restX, restY, limX, limY]);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const k = 1 - Math.pow(0.0015, dt);
    // Idle: drift gently toward the pointer so the board feels awake, not frozen.
    const idleY = drag.current.active ? 0 : pointer.current.x * 0.12;
    const idleX = drag.current.active ? 0 : pointer.current.y * 0.05;
    g.rotation.y += (target.current.y + idleY - g.rotation.y) * k;
    g.rotation.x += (target.current.x + idleX - g.rotation.x) * k;
  });
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

/** Soft additive halo used behind emissive parts — cheaper than more bloom passes. */
export function Halo({
  color,
  scale = 1,
  opacity = 0.5,
  ...props
}: { color: string; scale?: number; opacity?: number } & React.ComponentProps<"mesh">) {
  const tex = useMemo(() => radialTexture(), []);
  return (
    <mesh scale={scale} {...props}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={tex}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

let _radial: THREE.CanvasTexture | null = null;
function radialTexture() {
  if (_radial) return _radial;
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  _radial = new THREE.CanvasTexture(c);
  return _radial;
}

/** Emissive material tuned once so every lit part of the scene reads the same. */
export function glow(color: string, intensity = 2.2) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={intensity}
      roughness={0.35}
      metalness={0}
      toneMapped={false}
    />
  );
}
