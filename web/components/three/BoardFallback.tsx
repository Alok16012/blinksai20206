"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { sampleEvents } from "@/lib/content";

const laneColor: Record<string, string> = {
  build: "text-accent",
  automate: "text-violet",
  market: "text-mint",
  measure: "text-accent",
  improve: "text-mint",
};
const laneDot: Record<string, string> = {
  build: "bg-signal",
  automate: "bg-violet",
  market: "bg-mint",
  measure: "bg-signal",
  improve: "bg-mint",
};

/**
 * Tier-3 fallback (PRD §6): identical content, no WebGL. Also the always-rendered
 * text alternative for the canvas, so the hero is never an empty box for a crawler,
 * a screen reader, or a device that fails the capability gate.
 */
export default function BoardFallback({ animate = true }: { animate?: boolean }) {
  const [head, setHead] = useState(4);

  useEffect(() => {
    if (!animate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setHead((h) => (h + 1) % sampleEvents.length), 1800);
    return () => clearInterval(id);
  }, [animate]);

  const rows = Array.from({ length: 5 }, (_, i) => {
    const ev = sampleEvents[(head - i + sampleEvents.length * 4) % sampleEvents.length];
    return { ...ev, i };
  });

  return (
    <div className="panel noise relative h-full w-full overflow-hidden p-5 sm:p-6">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <p className="label flex items-center gap-2 text-paper/85">
          <span className="size-2 rounded-full bg-signal blink" />
          Event stream
        </p>
        <p className="label text-mute">Sample</p>
      </div>

      <ul className="mt-4 space-y-1">
        {rows.map((ev) => (
          <li
            key={`${ev.label}-${ev.i}`}
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 transition-all duration-500",
              ev.i === 0 ? "bg-signal/[0.07] ring-1 ring-signal/20" : "opacity-[var(--o)]",
            )}
            style={{ ["--o" as string]: `${1 - ev.i * 0.16}` }}
          >
            <span className={clsx("size-2 shrink-0 rounded-full", laneDot[ev.lane])} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-small font-medium text-paper">{ev.label}</span>
              <span className="block truncate font-mono text-[0.6875rem] text-mute">{ev.meta}</span>
            </span>
            <span
              className={clsx(
                "shrink-0 font-mono text-[0.6875rem]",
                ev.i === 0 ? laneColor[ev.lane] : "text-mute",
              )}
            >
              {ev.t}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid grid-cols-4 gap-2 border-t border-line pt-4">
        {(["Build", "Automate", "Market", "Measure"] as const).map((l, i) => (
          <div key={l} className="text-center">
            <div
              className={clsx(
                "mx-auto mb-2 h-0.5 w-full rounded-full",
                ["bg-signal/60", "bg-violet/60", "bg-mint/60", "bg-signal/40"][i],
              )}
            />
            <span className="label text-mute">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
