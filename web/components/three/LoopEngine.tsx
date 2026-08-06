"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, RoundedBox, Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { C, Halo, glow } from "./lib";
import { loopStages } from "@/lib/content";
import type { Tier } from "@/lib/capability";

const N = loopStages.length; // 5
const R = 1.85; // ring radius
const STAGE_COLORS = [C.signal, C.violet, C.mint, C.signal, C.mint];

/** Angle of stage i on the ring, with 0 facing the camera. */
const angleOf = (i: number) => (i / N) * Math.PI * 2;

/* ── Billboarded label baked to a canvas — no font fetch, always crisp ───── */

function useLabelTexture(text: string, sub: string, color: string) {
  return useMemo(() => {
    const w = 512;
    const h = 160;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const x = c.getContext("2d")!;
    const mono =
      typeof document !== "undefined"
        ? getComputedStyle(document.documentElement).getPropertyValue("--font-plex-mono").trim() ||
          "ui-monospace"
        : "ui-monospace";

    x.clearRect(0, 0, w, h);
    x.textAlign = "center";
    x.fillStyle = color;
    x.font = `500 52px ${mono}, ui-monospace, monospace`;
    x.letterSpacing = "6px";
    x.fillText(text.toUpperCase(), w / 2, 62);
    x.fillStyle = "rgba(139,148,172,0.9)";
    x.font = `400 30px ${mono}, ui-monospace, monospace`;
    x.letterSpacing = "2px";
    x.fillText(sub, w / 2, 112);

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [text, sub, color]);
}

function StageNode({
  i,
  activeRef,
}: {
  i: number;
  activeRef: React.RefObject<number>;
}) {
  const stage = loopStages[i];
  const color = STAGE_COLORS[i];
  const grp = useRef<THREE.Group>(null);
  const box = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const tex = useLabelTexture(stage.label, stage.t, color);

  const a = angleOf(i);
  const pos: [number, number, number] = [Math.sin(a) * R, 0, Math.cos(a) * R];

  useFrame((_, dt) => {
    // Distance from this node to the (fractional) active index, wrapped.
    const d = Math.abs(((activeRef.current - i + N * 1.5) % N) - N / 2) / (N / 2);
    const lit = Math.pow(Math.max(0, 1 - Math.abs(d - 1) * 2.2), 1.4);
    const k = Math.min(1, dt * 6);

    if (box.current) {
      const m = box.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity += (0.15 + lit * 3.2 - m.emissiveIntensity) * k;
      const s = 1 + lit * 0.28;
      box.current.scale.setScalar(box.current.scale.x + (s - box.current.scale.x) * k);
    }
    if (halo.current) {
      const m = halo.current.material as THREE.MeshBasicMaterial;
      m.opacity += (0.08 + lit * 0.7 - m.opacity) * k;
      halo.current.scale.setScalar(1.4 + lit * 1.4);
    }
    if (grp.current) grp.current.position.y = Math.sin(performance.now() / 1400 + i) * 0.04 + lit * 0.12;
  });

  return (
    <group ref={grp} position={pos} rotation={[0, a, 0]}>
      <RoundedBox ref={box} args={[0.62, 0.34, 0.34]} radius={0.09} smoothness={4}>
        <meshStandardMaterial
          color="#0f1728"
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.8}
          toneMapped={false}
        />
      </RoundedBox>

      {/* Status pip */}
      <mesh position={[0, 0, 0.19]}>
        <circleGeometry args={[0.055, 20]} />
        {glow(color, 2.4)}
      </mesh>

      <mesh ref={halo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.22, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <Billboard position={[0, 0.52, 0]}>
        <mesh>
          <planeGeometry args={[1.15, 0.36]} />
          <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      </Billboard>
    </group>
  );
}

/** Light packets circulating the loop — the thing that makes it read as a *loop*. */
function Packet({ offset, color, speed }: { offset: number; color: string; speed: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    const g = ref.current;
    if (!g) return;
    const a = (s.clock.elapsedTime * speed + offset) * Math.PI * 2;
    g.position.set(Math.sin(a) * R, Math.sin(a * 3) * 0.04, Math.cos(a) * R);
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.055, 14, 14]} />
        {glow(color, 3.4)}
      </mesh>
      <Halo color={color} scale={0.7} opacity={0.8} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  );
}

function Ring({ activeRef }: { activeRef: React.RefObject<number> }) {
  const arc = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);

  useFrame((s, dt) => {
    if (core.current) {
      core.current.rotation.y += dt * 0.35;
      core.current.rotation.x += dt * 0.12;
    }
    if (shell.current) {
      shell.current.rotation.y -= dt * 0.18;
      const p = 1 + Math.sin(s.clock.elapsedTime * 1.6) * 0.03;
      shell.current.scale.setScalar(p);
    }
    if (arc.current) {
      // The lit arc sweeps to wherever the active stage is.
      arc.current.rotation.z = -(activeRef.current / N) * Math.PI * 2;
    }
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Track */}
      <mesh>
        <torusGeometry args={[R, 0.018, 8, 160]} />
        <meshStandardMaterial color="#243156" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Lit arc */}
      <mesh ref={arc}>
        <torusGeometry args={[R, 0.03, 8, 96, Math.PI * 0.45]} />
        {glow(C.signal, 2.2)}
      </mesh>
      {/* Inner guide */}
      <mesh>
        <torusGeometry args={[R * 0.62, 0.006, 6, 120]} />
        <meshBasicMaterial color="#2c3a63" toneMapped={false} />
      </mesh>

      {/* Core */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color="#111a30"
            emissive={C.signal}
            emissiveIntensity={0.55}
            roughness={0.25}
            metalness={0.9}
            flatShading
          />
        </mesh>
        <mesh ref={shell}>
          <icosahedronGeometry args={[0.66, 1]} />
          <meshBasicMaterial color={C.violet} wireframe transparent opacity={0.25} toneMapped={false} />
        </mesh>
        <Halo color={C.signal} scale={2.6} opacity={0.22} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} />
      </group>
    </group>
  );
}

function Scene({ progress, tier }: { progress: React.RefObject<number>; tier: Tier }) {
  const rig = useRef<THREE.Group>(null);
  const active = useRef(0);

  useFrame((_, dt) => {
    const p = progress.current; // 0..1 across the pin
    const target = p * (N - 1);
    active.current += (target - active.current) * Math.min(1, dt * 5);

    if (rig.current) {
      // Rotate the ring so the active stage swings to the front.
      const ry = -(active.current / N) * Math.PI * 2;
      rig.current.rotation.y += (ry - rig.current.rotation.y) * Math.min(1, dt * 5);
      rig.current.rotation.x = -0.42 + Math.sin(performance.now() / 3000) * 0.015;
    }
  });

  return (
    <>
      <color attach="background" args={[C.ink]} />
      <fog attach="fog" args={[C.ink, 6, 16]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 3, 2]} intensity={16} distance={14} color={C.signal} />
      <pointLight position={[-3, -1, 2]} intensity={10} distance={12} color={C.violet} />
      <Environment resolution={64}>
        <Lightformer intensity={2} color="#ffb224" position={[0, 4, 2]} scale={[6, 6, 1]} />
        <Lightformer intensity={1.6} color="#7a5cff" position={[-5, 0, -2]} scale={[6, 6, 1]} />
      </Environment>

      <group ref={rig} position={[0, -0.1, 0]}>
        <Ring activeRef={active} />
        {loopStages.map((_, i) => (
          <StageNode key={i} i={i} activeRef={active} />
        ))}
        {(tier === "full" ? [0, 0.2, 0.4, 0.6, 0.8] : [0, 0.5]).map((o, i) => (
          <Packet key={i} offset={o} color={STAGE_COLORS[i % N]} speed={0.09} />
        ))}
      </group>
    </>
  );
}

function IdleThrottle({ active }: { active: boolean }) {
  const set = useThree((s) => s.set);
  useEffect(() => {
    set({ frameloop: active ? "always" : "never" });
  }, [active, set]);
  return null;
}

export default function LoopEngine({
  progress,
  tier,
  active,
}: {
  progress: React.RefObject<number>;
  tier: Tier;
  active: boolean;
}) {
  return (
    <Canvas
      dpr={tier === "full" ? [1, 2] : [1, 1.5]}
      gl={{ antialias: tier === "full", powerPreference: "high-performance", alpha: false }}
      camera={{ position: [0, 1.5, 5.4], fov: 38 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <IdleThrottle active={active} />
      <Scene progress={progress} tier={tier} />
      {tier === "full" && (
        <EffectComposer>
          <Bloom intensity={0.7} luminanceThreshold={0.5} luminanceSmoothing={0.3} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}
