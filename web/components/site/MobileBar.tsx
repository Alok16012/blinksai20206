"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { site } from "@/lib/content";
import { useSite } from "@/lib/store";

/**
 * Sticky thumb-zone bar — PRD §8. Always visible on mobile, never on desktop.
 *
 * `band-dark` is forced: the bar floats over whichever band happens to be under the
 * fold, and a control strip that inverted with every band would strobe on scroll.
 */
export default function MobileBar() {
  const openDrawer = useSite((s) => s.openDrawer);
  const drawerOpen = useSite((s) => s.drawerOpen);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={clsx(
        "band-dark fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-ink transition-transform duration-400 sm:hidden",
        show && !drawerOpen ? "translate-y-0" : "translate-y-full",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-2 gap-2 p-2.5">
        <button
          onClick={() => openDrawer("whatsapp", "the homepage")}
          /* Amber is the only CTA fill, and it is square. text-carbon is fixed —
             text-ink would flip to white on amber if this ever sat in a light band. */
          className="label flex min-h-12 items-center justify-center gap-2.5 bg-signal text-carbon transition-colors active:translate-y-px"
        >
          <span className="size-1.5 rounded-full bg-carbon/60" />
          WhatsApp
        </button>
        <a
          href={`tel:${site.phone.replace(/\s/g, "")}`}
          className="label flex min-h-12 items-center justify-center gap-2.5 border border-line text-paper transition-colors hover:border-signal hover:text-accent"
        >
          Call
        </a>
      </div>
    </div>
  );
}
