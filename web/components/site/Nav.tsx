"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { megaMenu, site } from "@/lib/content";
import { useSite } from "@/lib/store";

const accentText = { signal: "text-accent", violet: "text-violet", mint: "text-mint" } as const;

const LINKS = [
  { label: "Work", href: "/work" },
  { label: "Platforms", href: "/platforms" },
  { label: "Industries", href: "/#industries" },
  { label: "Company", href: "/about" },
];

/**
 * The header is pinned to the dark band regardless of what it floats over — the page
 * alternates near-black and white, and a header that inverted with every band would
 * strobe on the way down. `band-dark` forces its tokens; it is transparent over the dark
 * hero and goes solid on scroll.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openDrawer = useSite((s) => s.openDrawer);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobile]);

  const hold = (open: boolean) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (open) setMega(true);
    else closeTimer.current = setTimeout(() => setMega(false), 160);
  };

  return (
    <header
      className={clsx(
        "band-dark fixed inset-x-0 top-0 z-[90] transition-colors duration-300",
        scrolled ? "border-b border-line bg-[#111]" : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="container-site flex h-16 items-center justify-between gap-8 lg:h-20">
        <Link href="/" aria-label="BlinksAI home" className="shrink-0">
          <Image
            src="/blinksai-wordmark.png"
            alt="BlinksAI"
            width={340}
            height={152}
            priority
            sizes="96px"
            className="h-7 w-auto lg:h-8"
          />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.slice(0, 2).map((l) => (
            <li key={l.label}>
              <NavLink {...l} />
            </li>
          ))}
          <li onMouseEnter={() => hold(true)} onMouseLeave={() => hold(false)}>
            <button
              className={clsx(
                "label flex items-center gap-2 transition-colors",
                mega ? "text-paper" : "text-mute hover:text-paper",
              )}
              aria-expanded={mega}
              onClick={() => setMega((v) => !v)}
            >
              Services
              <span aria-hidden className={clsx("transition-transform", mega && "rotate-180")}>
                ▾
              </span>
            </button>
          </li>
          {LINKS.slice(2).map((l) => (
            <li key={l.label}>
              <NavLink {...l} />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openDrawer("whatsapp", "the homepage")}
            className="label hidden min-h-10 items-center gap-2.5 bg-signal px-5 text-carbon transition-colors hover:bg-paper sm:inline-flex"
          >
            Talk to us
            <span aria-hidden>→</span>
          </button>
          <button
            className="label flex min-h-10 items-center gap-2.5 text-paper lg:hidden"
            onClick={() => setMobile((v) => !v)}
            aria-expanded={mobile}
          >
            {mobile ? "Close" : "Menu"}
            <span className="relative block h-2.5 w-4" aria-hidden>
              <span
                className={clsx(
                  "absolute inset-x-0 top-0 h-px bg-current transition-all duration-300",
                  mobile && "top-1 rotate-45",
                )}
              />
              <span
                className={clsx(
                  "absolute inset-x-0 bottom-0 h-px bg-current transition-all duration-300",
                  mobile && "bottom-1.5 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mega-menu — teaches the Blinks Loop before the user scrolls (PRD §7.1) */}
      <div
        onMouseEnter={() => hold(true)}
        onMouseLeave={() => hold(false)}
        className={clsx(
          "band-dark absolute inset-x-0 top-full hidden border-b border-line bg-[#111] transition-all duration-300 lg:block",
          mega
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div className="container-site grid grid-cols-3 divide-x divide-[color:var(--color-line)]">
          {megaMenu.map((col) => (
            <div key={col.pillar} className="px-8 py-10 first:pl-0 last:pr-0">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className={clsx("text-d4 font-bold", accentText[col.accent])}>{col.pillar}</h3>
                <span className="label text-mute">{col.stat}</span>
              </div>
              <p className="mt-3 text-small text-mute">{col.blurb}</p>
              <ul className="mt-6">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      onClick={() => setMega(false)}
                      className="group flex items-baseline justify-between gap-4 border-t border-line py-3 transition-colors hover:text-accent"
                    >
                      <span className="text-[0.9375rem]">{l.label}</span>
                      <span className="font-mono text-[0.6875rem] text-mute">{l.note}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={clsx(
          "band-dark fixed inset-0 top-16 z-[80] overflow-y-auto bg-[#111] transition-all duration-300 lg:hidden",
          mobile ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <div className="container-site pb-32 pt-6">
          <ul className="border-t border-line">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setMobile(false)}
                  className="flex min-h-14 items-center justify-between border-b border-line"
                >
                  <span className="font-display text-d3 font-bold">{l.label}</span>
                  <span aria-hidden className="text-accent">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {megaMenu.map((col) => (
            <div key={col.pillar} className="mt-10">
              <div className="flex items-baseline justify-between">
                <h3 className={clsx("text-d4 font-bold", accentText[col.accent])}>{col.pillar}</h3>
                <span className="label text-mute">{col.stat}</span>
              </div>
              <ul className="mt-3 border-t border-line">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      onClick={() => setMobile(false)}
                      className="flex min-h-12 items-center justify-between border-b border-line"
                    >
                      <span className="text-[0.9375rem]">{l.label}</span>
                      <span className="font-mono text-[0.6875rem] text-mute">{l.note}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button
            onClick={() => {
              setMobile(false);
              openDrawer("whatsapp", "the homepage");
            }}
            className="label mt-10 flex min-h-14 w-full items-center justify-center gap-2.5 bg-signal text-carbon"
          >
            Talk to us <span aria-hidden>→</span>
          </button>
          <p className="label mt-6 text-center text-mute">{site.city}</p>
        </div>
      </div>
    </header>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="label text-mute transition-colors hover:text-paper">
      {label}
    </Link>
  );
}
