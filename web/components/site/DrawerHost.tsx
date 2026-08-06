"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSite } from "@/lib/store";

const ConversationDrawer = dynamic(() => import("./ConversationDrawer"), { ssr: false });

/**
 * The conversation drawer (§10.2) is on every page but visible on none of them until a
 * CTA is pressed, so its forms, tabs and validation have no business in the first-load
 * budget (PRD §8).
 *
 * It is fetched during the first idle moment instead of on click: by the time anyone has
 * read a headline and reached for a button the chunk is already mounted, so the open is
 * still instant. If a click somehow lands first, `drawerOpen` forces the mount.
 */
export default function DrawerHost() {
  const drawerOpen = useSite((s) => s.drawerOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(() => setMounted(true), { timeout: 2500 })
        : window.setTimeout(() => setMounted(true), 1200);

    return () => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle as number);
      else clearTimeout(idle as number);
    };
  }, [mounted]);

  if (!mounted && !drawerOpen) return null;
  return <ConversationDrawer />;
}
