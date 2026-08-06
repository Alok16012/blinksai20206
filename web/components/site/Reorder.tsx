"use client";

import { type ReactNode } from "react";
import { useSite } from "@/lib/store";
import type { PathKey } from "@/lib/content";

export type SlotKey =
  | "loop"
  | "platforms"
  | "automation"
  | "industries"
  | "proof"
  | "process"
  | "pricing"
  | "calculator"
  | "social"
  | "faq";

/**
 * §7.3 — clicking a "what do you need?" card re-orders the sections below.
 *
 * The re-order is done with CSS `order`, not by re-rendering the tree: every section
 * stays in the server-rendered HTML in its canonical order, so crawlers and screen
 * readers see the full page regardless of what the visitor picked.
 */
const ORDERS: Record<PathKey | "default", SlotKey[]> = {
  default: [
    "loop",
    "platforms",
    "automation",
    "industries",
    "proof",
    "process",
    "pricing",
    "calculator",
    "social",
    "faq",
  ],
  // "I need a system built" → lead with the products, then how they get built.
  build: [
    "platforms",
    "proof",
    "loop",
    "process",
    "industries",
    "pricing",
    "automation",
    "calculator",
    "social",
    "faq",
  ],
  // "I need more customers" → lead with the numbers and the calculator.
  grow: [
    "proof",
    "calculator",
    "loop",
    "industries",
    "automation",
    "pricing",
    "platforms",
    "process",
    "social",
    "faq",
  ],
  // "I need my follow-up automated" → lead with the live demo.
  automate: [
    "automation",
    "calculator",
    "loop",
    "proof",
    "industries",
    "pricing",
    "platforms",
    "process",
    "social",
    "faq",
  ],
  all: [
    "loop",
    "platforms",
    "automation",
    "proof",
    "industries",
    "process",
    "pricing",
    "calculator",
    "social",
    "faq",
  ],
};

export default function Reorder({ items }: { items: { key: SlotKey; node: ReactNode }[] }) {
  const path = useSite((s) => s.path);
  const order = ORDERS[path ?? "default"];

  return (
    <div className="flex flex-col">
      {items.map((item) => {
        const i = order.indexOf(item.key);
        const pos = i === -1 ? 99 : i;
        return (
          <div
            key={item.key}
            style={{ order: pos }}
            /* Bands alternate by POSITION, not by section, so re-ordering never
               produces two dark bands back to back. Sections themselves are
               band-agnostic — they only use the semantic tokens. */
            className={pos % 2 === 0 ? "band-dark" : "band-light"}
          >
            {item.node}
          </div>
        );
      })}
    </div>
  );
}
