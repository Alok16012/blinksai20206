"use client";

import * as THREE from "three";
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { C, Halo } from "./lib";

/**
 * The 3D object that sits inside a platform card.
 *
 * It is not decoration: the tile count IS the platform's module-group count from
 * lib/content.ts (PRD §9 rule 1 — every lit element maps to something real). Hovering
 * the card pulls the tiles apart into an exploded view, which is the whole pitch for
 * these products — a deep system made of separable modules, not one monolith.
 *
 * Same visual language as the hero Live Board on purpose: a dark console slab with
 * amber-lit surfaces, so the site reads as one machine rather than a set of effects.
 */

const COLS = 3;

export default function ModuleStack({
  count,
  color = C.signal,
  hovered,
  spin = 0.22,
}: {
  count: number;
  color?: string;
  hovered: boolean;
  spin?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const open = useRef(0);

  const tiles = useMemo(() => {
    const rows = Math.ceil(count / COLS);
    return Array.from({ length: count }, (_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      return {
        i,
        x: (col - (COLS - 1) / 2) * 0.42,
        z: (row - (rows - 1) / 2) * 0.42,
        // Deterministic per-tile offsets — Math.random() would resample every render.
        lift: 0.16 + ((i * 37) % 11) / 40,
        phase: ((i * 53) % 100) / 100,
      };
    });
  }, [count]);

  useFrame((s, dt) => {
    const g = group.current;
    if (!g) return;

    open.current += ((hovered ? 1 : 0) - open.current) * Math.min(1, dt * 5);
    g.rotation.y += dt * spin;
    g.position.y = Math.sin(s.clock.elapsedTime * 0.9) * 0.03;
    g.rotation.x = -0.02 + open.current * 0.06;
  });

  return (
    <group ref={group}>
      {/* Base slab — the platform itself */}
      <RoundedBox args={[1.55, 0.12, 1.55]} radius={0.045} smoothness={4} position={[0, -0.16, 0]}>
        <meshPhysicalMaterial
          color="#0d1424"
          roughness={0.32}
          metalness={0.85}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
        />
      </RoundedBox>

      {/* Lit front lip, matching the hero board */}
      <mesh position={[0, -0.19, 0.78]}>
        <planeGeometry args={[1.2, 0.014]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>

      {tiles.map((t) => (
        <Tile key={t.i} tile={t} color={color} open={open} />
      ))}

      <Halo
        color={color}
        scale={2.6}
        opacity={0.16}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.24, 0]}
      />
    </group>
  );
}

function Tile({
  tile,
  color,
  open,
}: {
  tile: { i: number; x: number; z: number; lift: number; phase: number };
  color: string;
  open: React.RefObject<number>;
}) {
  const ref = useRef<THREE.Group>(null);
  const face = useRef<THREE.Mesh>(null);

  useFrame((s) => {
    const g = ref.current;
    if (!g) return;
    const o = open.current;
    g.position.set(tile.x * (1 + o * 0.28), -0.04 + o * tile.lift, tile.z * (1 + o * 0.28));
    g.rotation.y = o * (tile.phase - 0.5) * 0.7;

    if (face.current) {
      // Tiles light in sequence, like modules coming online.
      const t = (s.clock.elapsedTime * 0.5 + tile.phase) % 1;
      const pulse = Math.pow(Math.max(0, 1 - Math.abs(t - 0.5) * 3), 2);
      const m = face.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.5 + pulse * 2.6 + o * 0.8;
    }
  });

  return (
    <group ref={ref}>
      <RoundedBox args={[0.34, 0.07, 0.34]} radius={0.018} smoothness={3}>
        <meshStandardMaterial color="#151d33" roughness={0.35} metalness={0.7} />
      </RoundedBox>
      <mesh ref={face} position={[0, 0.037, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.26, 0.26]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Lighting rig shared by every card view, so all eight objects match. */
export function StackLights({ color }: { color: string }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 3]} intensity={0.7} color="#cfe0ff" />
      <pointLight position={[-1.5, 1.6, 1.5]} intensity={5} distance={8} color={color} />
      <pointLight position={[2, 1.2, -1]} intensity={3} distance={8} color={C.violet} />
    </>
  );
}

/** Small helper so cards can opt into the accent cycle the rest of the site uses. */
export function accentFor(index: number) {
  return [C.signal, C.violet, C.mint][index % 3];
}

export function useHover(): [boolean, { onPointerEnter: () => void; onPointerLeave: () => void }] {
  const [hovered, setHovered] = useState(false);
  return [
    hovered,
    { onPointerEnter: () => setHovered(true), onPointerLeave: () => setHovered(false) },
  ];
}
