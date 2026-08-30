"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { C } from "./palette";
import type { Tier } from "@/lib/capability";

/**
 * The hero globe.
 *
 * Built after actually measuring the reference (unitedcarriers.com): a dark sphere of
 * dots, a fresnel atmosphere lit warm on one limb and cool on the other, glowing arcs
 * between real pins, a starfield behind it — and, the part that matters, a camera that
 * is *scrubbed by scroll* so the page dives into the globe and hands off to the white
 * band below.
 *
 * It carries information (PRD §9 rule 1): every arc runs from a city BlinksAI actually
 * lists to the hub in Akurdi, and each one is a lead arriving. Nothing here is a
 * floating sphere for decoration.
 */

/* Real coordinates. The hub is Akurdi — where the company is. */
const HUB = { name: "Akurdi", lat: 18.65, lng: 73.76 };
const CITIES = [
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
];

const R = 1;

function toVec3(lat: number, lng: number, radius = R) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/* ── Dot shell ────────────────────────────────────────────────────────────── */

function Dots({ count = 5200 }: { count?: number }) {
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    // Fibonacci sphere — even coverage without the pole clustering a lat/lng grid gives.
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = golden * i;
      pos.set([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  return (
    <points geometry={geo}>
      <pointsMaterial
        size={0.008}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ── Atmosphere: fresnel rim, warm on one limb, cool on the other ─────────── */

const atmoVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const atmoFrag = /* glsl */ `
  uniform vec3 warm;
  uniform vec3 cool;
  uniform float power;
  uniform float strength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = pow(1.0 - abs(dot(vNormal, vView)), power);
    // Blend warm→cool across the vertical axis so the limb reads amber up top and
    // violet underneath, the way the reference lights its globe.
    float t = smoothstep(-0.65, 0.65, vNormal.y);
    vec3 col = mix(cool, warm, t);
    gl_FragColor = vec4(col, f * strength);
  }
`;

function Atmosphere() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmoVert,
        fragmentShader: atmoFrag,
        uniforms: {
          warm: { value: new THREE.Color(C.signal) },
          cool: { value: new THREE.Color(C.violet) },
          power: { value: 4.2 },
          strength: { value: 0.85 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );
  return (
    <mesh scale={1.13} material={mat}>
      <sphereGeometry args={[R, 64, 64]} />
    </mesh>
  );
}

/* ── Arcs: a lead travelling from a city to the hub ───────────────────────── */

function Arc({ from, delay }: { from: { lat: number; lng: number }; delay: number }) {
  const line = useRef<THREE.Line>(null);
  const head = useRef<THREE.Mesh>(null);

  const { curve, geo } = useMemo(() => {
    const a = toVec3(from.lat, from.lng, R * 1.005);
    const b = toVec3(HUB.lat, HUB.lng, R * 1.005);
    // Lift the control point off the surface so the arc bows into space.
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const lift = 1 + a.distanceTo(b) * 0.42;
    // Antipodal endpoints sum to the zero vector, and normalising that yields NaN.
    // Our pins are all within India so it cannot happen today, but a future city list
    // should not be able to poison the whole geometry.
    if (mid.lengthSq() < 1e-8) mid.copy(a).cross(new THREE.Vector3(0, 1, 0));
    mid.normalize().multiplyScalar(R * lift);
    const c = new THREE.QuadraticBezierCurve3(a, mid, b);
    const g = new THREE.BufferGeometry().setFromPoints(c.getPoints(72));
    return { curve: c, geo: g };
  }, [from]);

  useFrame((s) => {
    const t = ((s.clock.elapsedTime * 0.28 + delay) % 1 + 1) % 1;
    if (head.current) {
      head.current.position.copy(curve.getPoint(t));
      const near = Math.sin(t * Math.PI);
      head.current.scale.setScalar(0.55 + near * 0.9);
    }
    if (line.current) {
      const m = line.current.material as THREE.LineBasicMaterial;
      m.opacity = 0.16 + Math.sin(t * Math.PI) * 0.4;
    }
  });

  return (
    <group>
      {/* @ts-expect-error — three's Line is a valid R3F intrinsic, typed loosely here */}
      <line ref={line} geometry={geo}>
        <lineBasicMaterial color={C.signal} transparent opacity={0.3} depthWrite={false} />
      </line>
      <mesh ref={head}>
        <sphereGeometry args={[0.012, 10, 10]} />
        <meshBasicMaterial color={C.signal} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ── Pins ─────────────────────────────────────────────────────────────────── */

function Pin({ lat, lng, hub = false }: { lat: number; lng: number; hub?: boolean }) {
  const p = useMemo(() => toVec3(lat, lng, R * 1.012), [lat, lng]);
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const pulse = 1 + Math.sin(s.clock.elapsedTime * 2 + p.x * 4) * 0.25;
    ref.current.scale.setScalar(hub ? pulse * 1.5 : pulse);
  });
  return (
    <mesh ref={ref} position={p}>
      <sphereGeometry args={[0.015, 12, 12]} />
      <meshBasicMaterial color={hub ? C.signal : C.mint} toneMapped={false} />
    </mesh>
  );
}

/* ── Starfield ────────────────────────────────────────────────────────────── */

/**
 * Deterministic PRNG (mulberry32). Seeded rather than `Math.random()` so the starfield
 * is identical across renders and hot reloads — a field that resamples every reload
 * shimmers distractingly.
 */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Stars({ count = 900 }: { count?: number }) {
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rand = rng(1337);
    for (let i = 0; i < count; i++) {
      // Uniform on a sphere: cos(phi) must be sampled evenly in [-1, 1]. The previous
      // version fed acos() a value that ranged to -3, which returns NaN — half the
      // positions were NaN and three could not compute a bounding sphere.
      const cosPhi = rand() * 2 - 1;
      const phi = Math.acos(cosPhi);
      const theta = rand() * Math.PI * 2;
      const r = 9 + rand() * 7;
      const s = Math.sin(phi);
      pos.set([r * s * Math.cos(theta), r * cosPhi, r * s * Math.sin(theta)], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  return (
    <points geometry={geo}>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

/* ── Rig: spin, drag, and the scroll-scrubbed dive ────────────────────────── */

function Rig({ progress, tier }: { progress: React.RefObject<number>; tier: Tier }) {
  const world = useRef<THREE.Group>(null);
  const drag = useRef({ on: false, x: 0, y: 0, ry: 0, rx: 0 });
  const target = useRef({ ry: 0, rx: 0.12 });
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    const el = gl.domElement;
    const d = drag.current;
    const down = (e: PointerEvent) => {
      d.on = true;
      d.x = e.clientX;
      d.y = e.clientY;
      d.ry = target.current.ry;
      d.rx = target.current.rx;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!d.on) return;
      target.current.ry = d.ry + (e.clientX - d.x) * 0.005;
      target.current.rx = Math.max(-0.6, Math.min(0.6, d.rx + (e.clientY - d.y) * 0.003));
    };
    const up = (e: PointerEvent) => {
      d.on = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
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
  }, [gl]);

  useFrame((_, dt) => {
    const g = world.current;
    if (!g) return;

    if (!drag.current.on) target.current.ry += dt * 0.045; // idle drift
    const k = Math.min(1, dt * 5);
    g.rotation.y += (target.current.ry - g.rotation.y) * k;
    g.rotation.x += (target.current.rx - g.rotation.x) * k;

    // The dive. progress 0 → 1 across the pin: camera travels from outside the globe
    // to just inside its shell, which is what makes the atmosphere swallow the frame.
    const p = progress.current;
    const eased = p * p;
    camera.position.z = 3.15 - eased * 2.35;
    camera.position.y = 0.1 - eased * 0.1;
    camera.lookAt(0, 0, 0);
  });

  const arcs = tier === "full" ? CITIES : CITIES.slice(0, 3);

  return (
    <group ref={world}>
      <Dots count={tier === "full" ? 5200 : 2400} />
      <Atmosphere />
      {/* The body: near-black so the dots and the limb do the drawing. */}
      <mesh>
        <sphereGeometry args={[R * 0.995, 48, 48]} />
        <meshBasicMaterial color="#080810" />
      </mesh>
      {arcs.map((c, i) => (
        <Arc key={c.name} from={c} delay={i / arcs.length} />
      ))}
      {CITIES.map((c) => (
        <Pin key={c.name} lat={c.lat} lng={c.lng} />
      ))}
      <Pin lat={HUB.lat} lng={HUB.lng} hub />
    </group>
  );
}

function Pause({ active }: { active: boolean }) {
  const set = useThree((s) => s.set);
  useEffect(() => {
    set({ frameloop: active ? "always" : "never" });
  }, [active, set]);
  return null;
}

export default function Globe({
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
      gl={{ antialias: tier === "full", alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.1, 3.15], fov: 42 }}
      style={{ background: "transparent" }}
    >
      <Pause active={active} />
      <Stars count={tier === "full" ? 900 : 400} />
      <Rig progress={progress} tier={tier} />
    </Canvas>
  );
}
