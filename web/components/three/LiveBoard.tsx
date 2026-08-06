"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Environment, Lightformer, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { C, Halo, glow, useDragRotate } from "./lib";
import { sampleEvents } from "@/lib/content";
import { useSite } from "@/lib/store";
import type { Tier } from "@/lib/capability";

/* ── Board geometry (world units) ────────────────────────────────────────── */

const SLAB_W = 5.4;
const SLAB_D = 3.1;
const FACE_W = 2048;
const FACE_H = 1176;

const LANES = [
  { key: "build" as const, name: "BUILD", color: C.signal, ty: 300, note: "8 platforms" },
  { key: "automate" as const, name: "AUTOMATE", color: C.violet, ty: 520, note: "reply in 4s" },
  { key: "market" as const, name: "MARKET", color: C.mint, ty: 740, note: "ads → whatsapp" },
  { key: "measure" as const, name: "MEASURE", color: C.signal, ty: 960, note: "roas traced" },
];

const RAIL_X0 = 560;
const RAIL_X1 = 1960;

const toWorldX = (tx: number) => (tx / FACE_W - 0.5) * SLAB_W;
const toWorldZ = (ty: number) => (ty / FACE_H - 0.5) * SLAB_D;

/* ── Shared font lookup: next/font generates hashed family names ──────────── */

function fontStack(varName: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

/* ── The console face: rails, lane names, tick marks, legend ─────────────── */

function useFaceTexture() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = FACE_W;
    c.height = FACE_H;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);

  useEffect(() => {
    const draw = () => {
      const c = tex.image as HTMLCanvasElement;
      const x = c.getContext("2d")!;
      const mono = fontStack("--font-plex-mono", "ui-monospace, monospace");
      const disp = fontStack("--font-archivo", "system-ui, sans-serif");

      x.clearRect(0, 0, FACE_W, FACE_H);

      // Base
      const bg = x.createLinearGradient(0, 0, FACE_W, FACE_H);
      bg.addColorStop(0, "#141c33");
      bg.addColorStop(0.55, "#0e1424");
      bg.addColorStop(1, "#161f3a");
      x.fillStyle = bg;
      x.fillRect(0, 0, FACE_W, FACE_H);

      // Micro grid
      x.strokeStyle = "rgba(237,241,247,0.045)";
      x.lineWidth = 2;
      for (let gx = 0; gx <= FACE_W; gx += 64) {
        x.beginPath();
        x.moveTo(gx, 0);
        x.lineTo(gx, FACE_H);
        x.stroke();
      }
      for (let gy = 0; gy <= FACE_H; gy += 64) {
        x.beginPath();
        x.moveTo(0, gy);
        x.lineTo(FACE_W, gy);
        x.stroke();
      }

      // Header
      x.fillStyle = "rgba(237,241,247,0.92)";
      x.font = `700 46px ${disp}`;
      x.fillText("THE BLINKS LOOP", 88, 150);
      x.fillStyle = "rgba(139,148,172,0.85)";
      x.font = `500 26px ${mono}`;
      x.letterSpacing = "3px";
      x.fillText("OPERATIONS BOARD", 88, 196);

      x.textAlign = "right";
      x.fillStyle = "rgba(255,178,36,0.9)";
      x.fillText("● LIVE — SAMPLE FEED", FACE_W - 88, 150);
      x.fillStyle = "rgba(139,148,172,0.6)";
      x.fillText("DRAG TO ROTATE", FACE_W - 88, 196);
      x.textAlign = "left";

      // Divider
      x.strokeStyle = "rgba(237,241,247,0.12)";
      x.lineWidth = 2;
      x.beginPath();
      x.moveTo(88, 232);
      x.lineTo(FACE_W - 88, 232);
      x.stroke();

      // Lanes
      for (const lane of LANES) {
        const y = lane.ty;

        x.fillStyle = lane.color;
        x.font = `500 30px ${mono}`;
        x.letterSpacing = "4px";
        x.fillText(lane.name, 92, y + 10);

        x.fillStyle = "rgba(139,148,172,0.6)";
        x.font = `400 24px ${mono}`;
        x.letterSpacing = "1px";
        x.fillText(lane.note, 92, y + 48);

        // Rail
        x.strokeStyle = "rgba(237,241,247,0.10)";
        x.lineWidth = 6;
        x.lineCap = "round";
        x.beginPath();
        x.moveTo(RAIL_X0, y);
        x.lineTo(RAIL_X1, y);
        x.stroke();

        // Coloured under-glow on the rail
        x.strokeStyle = hexA(lane.color, 0.22);
        x.lineWidth = 14;
        x.beginPath();
        x.moveTo(RAIL_X0, y);
        x.lineTo(RAIL_X1, y);
        x.stroke();

        // Tick marks
        x.fillStyle = "rgba(237,241,247,0.16)";
        for (let i = 0; i <= 14; i++) {
          const tx = RAIL_X0 + ((RAIL_X1 - RAIL_X0) / 14) * i;
          x.fillRect(tx - 1.5, y - 16, 3, 10);
        }

        // Terminal node ring
        x.strokeStyle = hexA(lane.color, 0.55);
        x.lineWidth = 4;
        x.beginPath();
        x.arc(RAIL_X1, y, 18, 0, Math.PI * 2);
        x.stroke();
      }

      // Footer legend
      x.fillStyle = "rgba(139,148,172,0.55)";
      x.font = `400 24px ${mono}`;
      x.letterSpacing = "2px";
      x.fillText("T+0s  LEAD LANDS   ·   T+4s  WHATSAPP   ·   T+38s  AI CALL   ·   T+2m  DEMO BOOKED", 92, 1110);

      x.letterSpacing = "0px";
      tex.needsUpdate = true;
    };

    draw();
    document.fonts?.ready.then(draw).catch(() => {});
  }, [tex]);

  return tex;
}

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/* ── The vertical screen: the streaming event log ────────────────────────── */

const SCR_W = 1024;
const SCR_H = 560;

function EventScreen({ speed }: { speed: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = SCR_W;
    c.height = SCR_H;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);

  const state = useRef({ head: 0, last: 0, acc: 0, scan: 0 });

  const draw = useMemo(() => {
    return () => {
      const c = tex.image as HTMLCanvasElement;
      const x = c.getContext("2d")!;
      const mono = fontStack("--font-plex-mono", "ui-monospace, monospace");
      const { head, scan } = state.current;

      x.clearRect(0, 0, SCR_W, SCR_H);
      const bg = x.createLinearGradient(0, 0, 0, SCR_H);
      bg.addColorStop(0, "#101728");
      bg.addColorStop(1, "#0a0f1c");
      x.fillStyle = bg;
      x.fillRect(0, 0, SCR_W, SCR_H);

      // Header bar
      x.fillStyle = "rgba(255,178,36,0.08)";
      x.fillRect(0, 0, SCR_W, 62);
      x.fillStyle = "#ffb224";
      x.beginPath();
      x.arc(38, 31, 7, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = "rgba(237,241,247,0.9)";
      x.font = `500 22px ${mono}`;
      x.letterSpacing = "3px";
      x.fillText("EVENT STREAM", 62, 39);
      x.textAlign = "right";
      x.fillStyle = "rgba(139,148,172,0.75)";
      x.fillText("SAMPLE", SCR_W - 30, 39);
      x.textAlign = "left";

      const rows = 6;
      const rowH = 78;
      const laneColor: Record<string, string> = {
        build: C.signal,
        automate: C.violet,
        market: C.mint,
        measure: C.signal,
        improve: C.mint,
      };

      for (let i = 0; i < rows; i++) {
        const ev = sampleEvents[(head - i + sampleEvents.length * 4) % sampleEvents.length];
        const y = 96 + i * rowH;
        const fade = 1 - i * 0.14;
        const col = laneColor[ev.lane] ?? C.signal;

        if (i === 0) {
          x.fillStyle = hexA(col, 0.1);
          x.fillRect(0, y - 34, SCR_W, rowH - 8);
          x.fillStyle = col;
          x.fillRect(0, y - 34, 5, rowH - 8);
        }

        x.fillStyle = hexA(col, fade);
        x.beginPath();
        x.arc(46, y - 6, i === 0 ? 8 : 6, 0, Math.PI * 2);
        x.fill();

        x.fillStyle = `rgba(237,241,247,${0.95 * fade})`;
        x.font = `500 27px ${mono}`;
        x.letterSpacing = "0px";
        x.fillText(ev.label, 80, y + 3);

        x.fillStyle = `rgba(139,148,172,${0.8 * fade})`;
        x.font = `400 21px ${mono}`;
        x.fillText(ev.meta, 80, y + 32);

        x.textAlign = "right";
        x.fillStyle = i === 0 ? "#ffb224" : `rgba(139,148,172,${0.85 * fade})`;
        x.font = `500 25px ${mono}`;
        x.fillText(ev.t, SCR_W - 32, y + 3);
        x.textAlign = "left";

        x.strokeStyle = "rgba(237,241,247,0.05)";
        x.lineWidth = 1;
        x.beginPath();
        x.moveTo(24, y + 42);
        x.lineTo(SCR_W - 24, y + 42);
        x.stroke();
      }

      // Scanline
      const sy = scan * SCR_H;
      const g = x.createLinearGradient(0, sy - 60, 0, sy + 60);
      g.addColorStop(0, "rgba(255,178,36,0)");
      g.addColorStop(0.5, "rgba(255,178,36,0.055)");
      g.addColorStop(1, "rgba(255,178,36,0)");
      x.fillStyle = g;
      x.fillRect(0, sy - 60, SCR_W, 120);

      tex.needsUpdate = true;
    };
  }, [tex]);

  useEffect(() => {
    draw();
    document.fonts?.ready.then(draw).catch(() => {});
  }, [draw]);

  useFrame((_, dt) => {
    const s = state.current;
    s.acc += dt * speed;
    s.scan = (s.scan + dt * 0.22) % 1.4;
    if (s.acc > 1.5) {
      s.acc = 0;
      s.head = (s.head + 1) % sampleEvents.length;
      draw();
    } else {
      // Repaint the scanline at ~12fps, not every frame.
      s.last += dt;
      if (s.last > 1 / 12) {
        s.last = 0;
        draw();
      }
    }
  });

  return (
    <group position={[0, 1.24, -1.72]} rotation={[-0.12, 0, 0]}>
      <RoundedBox args={[3.62, 2.04, 0.08]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial
          color={C.deck}
          roughness={0.42}
          metalness={0.65}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[3.42, 1.87]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {/* screen spill onto the slab */}
      <Halo color={C.signal} scale={4.4} opacity={0.07} position={[0, -0.9, 0.06]} />
    </group>
  );
}

/* ── Travelling event pucks ──────────────────────────────────────────────── */

function Puck({
  color,
  z,
  phase,
  speed,
  onArrive,
}: {
  color: string;
  z: number;
  phase: number;
  speed: number;
  onArrive: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const prev = useRef(0);
  const x0 = toWorldX(RAIL_X0);
  const x1 = toWorldX(RAIL_X1);

  useFrame((s) => {
    const g = ref.current;
    if (!g) return;
    const p = ((s.clock.elapsedTime * speed + phase) % 1 + 1) % 1;
    if (p < prev.current) onArrive();
    prev.current = p;
    const eased = p * p * (3 - 2 * p); // ease-in-out so it reads as a "packet"
    g.position.x = x0 + (x1 - x0) * eased;
    g.position.z = z;
    const near = Math.min(1, Math.max(0, 1 - Math.abs(p - 0.5) * 2));
    g.scale.setScalar(0.75 + near * 0.35);
  });

  return (
    <group ref={ref} position={[x0, 0.115, z]}>
      <mesh>
        <sphereGeometry args={[0.045, 16, 16]} />
        {glow(color, 3)}
      </mesh>
      <Halo color={color} scale={0.62} opacity={0.85} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} />
      {/* trailing streak */}
      <mesh position={[-0.16, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.34, 0.05]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ── Terminal node that pulses when a packet lands ───────────────────────── */

function LaneNode({
  color,
  z,
  pulseRef,
}: {
  color: string;
  z: number;
  pulseRef: { current: number };
}) {
  const ref = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    pulseRef.current = Math.max(0, pulseRef.current - dt * 2.2);
    const p = pulseRef.current;
    if (ref.current) {
      const m = ref.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1.4 + p * 5;
      ref.current.scale.y = 1 + p * 0.5;
    }
    if (halo.current) {
      halo.current.scale.setScalar(0.5 + p * 1.6);
      (halo.current.material as THREE.MeshBasicMaterial).opacity = 0.25 + p * 0.6;
    }
  });

  return (
    <group position={[toWorldX(RAIL_X1), 0.13, z]}>
      <mesh ref={ref}>
        <cylinderGeometry args={[0.035, 0.045, 0.16, 18]} />
        {glow(color, 1.4)}
      </mesh>
      <mesh ref={halo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ── Lane hit area — interaction, not decoration (PRD §6) ────────────────── */

function LaneHit({
  lane,
  z,
  onPick,
}: {
  lane: (typeof LANES)[number];
  z: number;
  onPick: (k: string) => void;
}) {
  const [hover, setHover] = useState(false);
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    const m = ref.current?.material as THREE.MeshBasicMaterial | undefined;
    if (m) m.opacity += ((hover ? 0.14 : 0) - m.opacity) * Math.min(1, dt * 10);
  });

  return (
    <mesh
      ref={ref}
      position={[(toWorldX(RAIL_X0) + toWorldX(RAIL_X1)) / 2, 0.101, z]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onPick(lane.key);
      }}
    >
      <planeGeometry args={[toWorldX(RAIL_X1) - toWorldX(RAIL_X0) + 0.3, 0.42]} />
      <meshBasicMaterial color={lane.color} transparent opacity={0} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/* ── The board ───────────────────────────────────────────────────────────── */

function Board({ tier, onPick }: { tier: Tier; onPick: (k: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const face = useFaceTexture();
  useDragRotate(group, { rest: [0.08, -0.3], limit: [0.24, 0.7] });

  // Plain mutable holders rather than refs: these are written by the render loop and
  // read when wiring children, never during React's own render pass.
  const pulses = useMemo(() => LANES.map(() => ({ current: 0 })), []);
  const puckCount = tier === "full" ? 2 : 1;

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      {/* Slab */}
      <RoundedBox args={[SLAB_W, 0.22, SLAB_D]} radius={0.07} smoothness={4} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          color="#0d1424"
          roughness={0.34}
          metalness={0.8}
          clearcoat={0.7}
          clearcoatRoughness={0.25}
        />
      </RoundedBox>

      {/* Console face */}
      <mesh position={[0, 0.112, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[SLAB_W - 0.12, SLAB_D - 0.12]} />
        <meshBasicMaterial map={face} toneMapped={false} transparent />
      </mesh>

      {/* Amber edge light along the front lip */}
      <mesh position={[0, 0.04, SLAB_D / 2 + 0.005]}>
        <planeGeometry args={[SLAB_W - 0.4, 0.02]} />
        <meshBasicMaterial color={C.signal} toneMapped={false} />
      </mesh>

      {LANES.map((lane, i) => {
        const z = toWorldZ(lane.ty);
        return (
          <group key={lane.key}>
            {Array.from({ length: puckCount }).map((_, k) => (
              <Puck
                key={k}
                color={lane.color}
                z={z}
                phase={i * 0.23 + k * 0.5}
                speed={0.16 + i * 0.022}
                onArrive={() => {
                  pulses[i].current = 1;
                }}
              />
            ))}
            <LaneNode color={lane.color} z={z} pulseRef={pulses[i]} />
            <LaneHit lane={lane} z={z} onPick={onPick} />
          </group>
        );
      })}

      <EventScreen speed={1} />

      {/* Legs — grounds the slab so it reads as an object, not a floating plane */}
      {[
        [-SLAB_W / 2 + 0.5, SLAB_D / 2 - 0.35],
        [SLAB_W / 2 - 0.5, SLAB_D / 2 - 0.35],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.42, z]}>
          <cylinderGeometry args={[0.035, 0.055, 0.66, 12]} />
          <meshStandardMaterial color="#131a2e" roughness={0.5} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Environment ─────────────────────────────────────────────────────────── */

function Stage({ tier }: { tier: Tier }) {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(30, 40, C.signal, "#1a2340");
    (g.material as THREE.Material & { opacity: number; transparent: boolean }).opacity = 0.1;
    (g.material as THREE.Material).transparent = true;
    return g;
  }, []);

  return (
    <>
      <color attach="background" args={[C.ink]} />
      <fog attach="fog" args={[C.ink, 7, 20]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 4]} intensity={0.5} color="#cfe0ff" />
      <pointLight position={[-3, 2, 2.4]} intensity={12} distance={12} color={C.violet} />
      <pointLight position={[3.4, 2.2, 2]} intensity={14} distance={12} color={C.signal} />

      <Environment resolution={64}>
        <Lightformer intensity={2} color="#7a5cff" position={[-4, 3, -3]} scale={[8, 8, 1]} />
        <Lightformer intensity={2.4} color="#ffb224" position={[4, 2, -2]} scale={[6, 6, 1]} />
        <Lightformer intensity={1} color="#5fd3a6" position={[0, -3, 2]} scale={[8, 4, 1]} />
      </Environment>

      <primitive object={grid} position={[0, -1.35, 0]} />

      {tier === "full" && (
        <Sparkles count={70} scale={[10, 5, 8]} size={2.2} speed={0.25} opacity={0.4} color={C.signal} />
      )}
    </>
  );
}

/** Pauses the render loop when the canvas leaves the viewport or the tab hides. */
function IdleThrottle({ active }: { active: boolean }) {
  const set = useThree((s) => s.set);
  useEffect(() => {
    set({ frameloop: active ? "always" : "never" });
  }, [active, set]);
  return null;
}

/* ── Exported scene ──────────────────────────────────────────────────────── */

export default function LiveBoard({ tier, active }: { tier: Tier; active: boolean }) {
  const openDrawer = useSite((s) => s.openDrawer);
  const setPath = useSite((s) => s.setPath);

  const onPick = (k: string) => {
    const map: Record<string, string> = {
      build: "the Build stage — platforms and apps",
      automate: "the Automate stage — WhatsApp and AI voice",
      market: "the Market stage — ads and creative",
      measure: "the Measure stage — attribution and ROAS",
    };
    if (k === "build") setPath("build");
    if (k === "automate") setPath("automate");
    if (k === "market") setPath("grow");
    openDrawer("whatsapp", map[k] ?? "");
  };

  return (
    <Canvas
      dpr={tier === "full" ? [1, 2] : [1, 1.5]}
      gl={{ antialias: tier === "full", powerPreference: "high-performance", alpha: false }}
      camera={{ position: [0, 2.15, 6.9], fov: 33 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.62, 0)}
    >
      <IdleThrottle active={active} />
      <Stage tier={tier} />
      <Board tier={tier} onPick={onPick} />
      {tier === "full" && (
        <EffectComposer>
          <Bloom intensity={0.55} luminanceThreshold={0.55} luminanceSmoothing={0.3} mipmapBlur />
          <Vignette eskil={false} offset={0.28} darkness={0.6} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
