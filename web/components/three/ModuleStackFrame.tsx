"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";
import { useRef, useState } from "react";
import { useInView, useTier } from "@/lib/capability";
import { C } from "./palette";

const StackView = dynamic(() => import("./stacks").then((m) => m.StackView), { ssr: false });
const StackCanvasImpl = dynamic(() => import("./stacks").then((m) => m.StackCanvas), {
  ssr: false,
});

const ACCENTS = [C.signal, C.violet, C.mint];
const CHIP = ["bg-signal", "bg-violet", "bg-mint"] as const;

/**
 * Mount this ONCE per page that renders any <ModuleStackFrame>. It is the single shared
 * WebGL context every stack draws into — see the note in stacks.tsx for why per-card
 * canvases are not an option.
 */
export function ModuleStackCanvas() {
  const tier = useTier();
  if (tier !== "full" && tier !== "lite") return null;
  return <StackCanvasImpl />;
}

/**
 * A platform's module stack: reserved box, CSS module grid underneath, 3D on top once
 * the capability gate allows it.
 *
 * The tile count is the platform's real module-group count (PRD §9 rule 1 — every lit
 * element maps to something real), so the object is readable as information whether it
 * renders as WebGL or as flat chips.
 */
export default function ModuleStackFrame({
  count,
  accentIndex = 0,
  label,
  className,
  minTier = "lite",
  showLabel = true,
}: {
  count: number;
  accentIndex?: number;
  label?: string;
  className?: string;
  /** "full" keeps the 3D off phones — used where several stacks share a screen. */
  minTier?: "lite" | "full";
  /** Off when the caller already prints a caption below the frame. */
  showLabel?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, "120px");
  const tier = useTier();
  const [hovered, setHovered] = useState(false);
  /* The 3D only takes over once it has actually drawn — see FirstFrame in stacks.tsx. */
  const [painted, setPainted] = useState(false);

  const allowed = minTier === "full" ? tier === "full" : tier === "full" || tier === "lite";
  const live = allowed && inView;
  const color = ACCENTS[accentIndex % ACCENTS.length];

  return (
    <div
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={clsx("relative overflow-hidden border border-line bg-ink/60", className)}
    >
      {/* Always present: same information, flat. Fades out when the 3D takes over. */}
      <div
        aria-hidden
        className={clsx(
          "absolute inset-0 grid place-items-center transition-opacity duration-700",
          live && painted ? "opacity-0" : "opacity-100",
        )}
      >
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${Math.min(3, count)}, minmax(0,1fr))` }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              className={clsx("size-5 opacity-70", CHIP[accentIndex % 3])}
              style={{ animation: `blink ${1.4 + i * 0.12}s var(--ease-reveal) ${i * 90}ms infinite` }}
            />
          ))}
        </div>
      </div>

      {/* The tracked region. The shared canvas scissors itself to this box. */}
      <div ref={box} className="absolute inset-0" />
      {live && (
        <StackView
          track={box}
          count={count}
          color={color}
          hovered={hovered}
          onPaint={() => setPainted(true)}
        />
      )}

      {showLabel && (
        <span className="pointer-events-none absolute bottom-2 left-3 z-[31] label text-mute">
          {label ?? `${count} module groups`}
        </span>
      )}
    </div>
  );
}
