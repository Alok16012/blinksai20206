"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSite, type DrawerTab } from "@/lib/store";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { useBooted } from "@/lib/boot";

/* ── Reveal: 28px rise + fade ─────────────────────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span" | "p";
}) {
  const ref = useRef<HTMLElement | null>(null);
  /* Held until the boot overlay clears — otherwise this fires and finishes behind it,
     and the entrance is over before anyone can see it. See lib/boot.ts. */
  const booted = useBooted();

  useEffect(() => {
    const el = ref.current;
    if (!el || !booted) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [booted]);

  const El = Tag as unknown as React.ComponentType<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
  }>;
  return (
    <El ref={ref} className={clsx("reveal", className)} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </El>
  );
}

/* ── Display headline: each line wipes up from a clipped baseline ─────────── */

export function Lines({
  lines,
  className,
  delay = 0,
  as: Tag = "h2",
}: {
  /**
   * One entry per line — the clip only works on block-level lines.
   *
   * Deliberately a named prop rather than `children`. React key-validates any array
   * passed as children, so every caller would have to hand-key each entry and a missed
   * one is a console warning at runtime. As a prop the array is opaque to that check and
   * the keys below are the only ones that matter.
   */
  lines: ReactNode[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const booted = useBooted();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !booted) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.querySelectorAll<HTMLElement>(".line").forEach((l) => l.classList.add("in"));
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, booted]);

  const El = Tag as unknown as React.ComponentType<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    children?: ReactNode;
  }>;

  return (
    <El ref={ref} className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={clsx("line", reduced && "in")}
          style={{ ["--d" as string]: `${delay + i * 90}ms` }}
        >
          <span style={{ animationDelay: `${delay + i * 90}ms` }}>{line}</span>
        </span>
      ))}
    </El>
  );
}

/* ── Eyebrow: mono, uppercase, time-labelled ──────────────────────────────── */

export function Eyebrow({
  t,
  children,
  accent = "signal",
  className,
}: {
  t?: string;
  children: ReactNode;
  accent?: "signal" | "violet" | "mint";
  className?: string;
}) {
  const dot = { signal: "bg-signal", violet: "bg-violet", mint: "bg-mint" }[accent];
  return (
    <p className={clsx("label flex items-center gap-2.5 text-mute", className)}>
      <span className={clsx("size-1.5 rounded-full blink", dot)} />
      {t && <span className="text-paper">{t}</span>}
      {t && <span className="opacity-40">/</span>}
      <span>{children}</span>
    </p>
  );
}

/* ── Buttons ──────────────────────────────────────────────────────────────── */

/* Square, not pill. The reference uses bare text links; we keep a filled control for
   the primary action because this page has to convert, but the geometry stays hard. */
const base =
  "group inline-flex items-center justify-center gap-2.5 font-mono text-[0.75rem] uppercase tracking-[0.1em] font-medium min-h-12 px-6 transition-colors duration-200";

export function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className,
  drawer,
  context,
}: {
  children: ReactNode;
  variant?: "primary" | "ghost" | "quiet";
  href?: string;
  onClick?: () => void;
  className?: string;
  drawer?: DrawerTab;
  context?: string;
}) {
  const open = useSite((s) => s.openDrawer);
  const styles = {
    primary: "bg-signal text-carbon hover:bg-paper",
    ghost: "border border-line text-paper hover:border-signal hover:text-accent",
    quiet: "!px-0 !min-h-0 text-mute underline underline-offset-[6px] hover:text-paper",
  }[variant];

  const cls = clsx(base, styles, className);
  const inner = (
    <>
      {children}
      <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </>
  );

  if (drawer) {
    return (
      <button className={cls} onClick={() => open(drawer, context)}>
        {inner}
      </button>
    );
  }
  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}

/* ── Counter ──────────────────────────────────────────────────────────────── */

export function Counter({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const done = useRef(false);
  const reduced = usePrefersReducedMotion();
  const booted = useBooted();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !booted) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return;
      done.current = true;
      const start = performance.now();
      const dur = 1400;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        setN(Math.round(value * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value, reduced, booted]);

  return (
    <span ref={ref} className={className}>
      {reduced ? value : n}
      {suffix}
    </span>
  );
}

/** Big number slab — the reference runs these enormous. */
export function Stat({
  value,
  suffix = "",
  label,
  className,
}: {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="font-display text-stat font-bold text-paper">
        <Counter value={value} suffix={suffix} />
      </p>
      <p className="label mt-3 text-mute">{label}</p>
    </div>
  );
}

/* ── Section heading ──────────────────────────────────────────────────────── */

export function SectionHead({
  t,
  eyebrow,
  title,
  lead,
  accent = "signal",
  className,
}: {
  t?: string;
  eyebrow: string;
  /** One entry per display line. */
  title: ReactNode[];
  lead?: ReactNode;
  accent?: "signal" | "violet" | "mint";
  className?: string;
}) {
  return (
    <div className={clsx("max-w-4xl", className)}>
      <Reveal>
        <Eyebrow t={t} accent={accent}>
          {eyebrow}
        </Eyebrow>
      </Reveal>
      <Lines as="h2" className="mt-6 text-d2 font-bold" delay={80} lines={title} />
      {lead && (
        <Reveal delay={220}>
          <p className="mt-6 max-w-2xl text-lead text-mute">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ── 3D tilt wrapper ──────────────────────────────────────────────────────── */

export function Tilt({
  children,
  className,
  strength = 6,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${-py * strength}deg) rotateY(${px * strength}deg) translateZ(18px)`;
    el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div className={clsx("tilt-scene", className)} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={ref} className="tilt-card h-full">
        {children}
      </div>
    </div>
  );
}
