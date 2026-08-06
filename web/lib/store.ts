"use client";

import { create } from "zustand";
import type { PathKey, Pillar } from "./content";

export type DrawerTab = "whatsapp" | "call" | "details";

type State = {
  /* §10.2 conversation drawer — one global slide-over used by every CTA */
  drawerOpen: boolean;
  drawerTab: DrawerTab;
  /** Page context sent with the WhatsApp message, e.g. "Nidhi NBFC software". */
  context: string;
  openDrawer: (tab?: DrawerTab, context?: string) => void;
  closeDrawer: () => void;
  setTab: (t: DrawerTab) => void;

  /* §7.3 self-identification — re-orders and re-labels sections below */
  path: PathKey | null;
  setPath: (p: PathKey | null) => void;

  /* §7.4 loop stage currently lit — shared between the 3D scene and the copy panel */
  stage: Pillar;
  setStage: (s: Pillar) => void;
};

const PATH_KEY = "blinksai.path";

export const useSite = create<State>((set) => ({
  drawerOpen: false,
  drawerTab: "whatsapp",
  context: "",
  openDrawer: (tab = "whatsapp", context = "") =>
    set({ drawerOpen: true, drawerTab: tab, context }),
  closeDrawer: () => set({ drawerOpen: false }),
  setTab: (t) => set({ drawerTab: t }),

  path: null,
  setPath: (p) => {
    try {
      if (p) localStorage.setItem(PATH_KEY, p);
      else localStorage.removeItem(PATH_KEY);
    } catch {
      /* private mode — personalisation is a nice-to-have, never a blocker */
    }
    set({ path: p });
  },

  stage: "build",
  setStage: (s) => set({ stage: s }),
}));

/** §10.5 light personalisation: remember the choice for return visits. */
export function restorePath() {
  try {
    const v = localStorage.getItem(PATH_KEY) as PathKey | null;
    if (v) useSite.setState({ path: v });
  } catch {
    /* ignore */
  }
}
