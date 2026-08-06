"use client";

import Image from "next/image";
import clsx from "clsx";
import ModuleStackFrame, { ModuleStackCanvas } from "@/components/three/ModuleStackFrame";
import type { Platform } from "@/lib/content";

export { ModuleStackCanvas as PlatformMediaCanvas };

/**
 * The picture on a platform card — one component, two states, identical box.
 *
 * With a cleared screenshot it shows the real product. Without one it shows the 3D
 * module stack, whose tile count is the platform's real module-group count. Neither
 * state is a mockup pretending to be a product (PRD §16 + §14 content governance), and
 * because the frame reserves the same 16:10 box either way, dropping a file into
 * web/public/platforms/ swaps the picture and shifts nothing (CLS budget, PRD §8).
 *
 * The "capture pending" state used to be signalled by a dashed border. In the hard-edge
 * system there is one border treatment — a solid hairline — so the state is carried by
 * the mono caption strip instead: an amber dot and the word "pending" where a cleared
 * shot gets a mint dot and its alt text.
 *
 * Any page using this must render <PlatformMediaCanvas /> exactly once — it is the
 * single shared WebGL context every stack on the page draws into.
 */
export default function PlatformMedia({
  p,
  index = 0,
  sizes = "(min-width: 1024px) 360px, 92vw",
  minTier = "lite",
  className,
}: {
  p: Platform;
  index?: number;
  sizes?: string;
  minTier?: "lite" | "full";
  className?: string;
}) {
  const caption = p.shot
    ? (p.shotAlt ?? `${p.product} screen`)
    : `${p.modules.length} module groups · capture pending`;

  return (
    <figure className={clsx("relative overflow-hidden border border-line bg-ink", className)}>
      <div className="relative aspect-[16/10]">
        {p.shot ? (
          <Image
            src={p.shot}
            alt={p.shotAlt ?? `${p.product} screen`}
            width={1600}
            height={1000}
            sizes={sizes}
            className="size-full object-cover object-top"
          />
        ) : (
          <ModuleStackFrame
            count={p.modules.length}
            accentIndex={index}
            minTier={minTier}
            showLabel={false}
            /* `rounded-none` is load-bearing: ModuleStackFrame is shared with the 3D
               pages and carries its own radius, which has to be squared off here. */
            className="absolute inset-0 rounded-none border-0 bg-transparent"
          />
        )}
      </div>

      <figcaption className="label flex items-center gap-2 border-t border-line bg-deck px-3 py-2 text-[0.625rem] text-mute">
        <span
          aria-hidden
          className={clsx("size-1.5 shrink-0 rounded-full", p.shot ? "bg-mint" : "bg-signal")}
        />
        <span className="truncate">{caption}</span>
      </figcaption>
    </figure>
  );
}
