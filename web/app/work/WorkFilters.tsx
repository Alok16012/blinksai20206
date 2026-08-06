"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Counter, Reveal, Tilt } from "@/components/ui";

/**
 * Client-side filter chips for /work (PRD §5: "all case studies, filter by industry +
 * service"). State only — every fact rendered here is passed in from the server page.
 *
 * A filter with no matches is a real answer, not a bug: case studies publish as consent
 * is signed (PRD §14), so the empty state says exactly that instead of hiding the chip.
 */

export type WorkCase = {
  client: string;
  industry: string;
  service: string;
  problem: string;
  built: string;
  number: string;
  unit: string;
  slug: string;
};

export default function WorkFilters({
  cases,
  serviceOptions,
}: {
  cases: WorkCase[];
  serviceOptions: string[];
}) {
  const [industry, setIndustry] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);

  const industryOptions = useMemo(
    () => Array.from(new Set(cases.map((c) => c.industry))),
    [cases],
  );

  const shown = cases.filter(
    (c) => (!industry || c.industry === industry) && (!service || c.service === service),
  );

  const filtered = industry !== null || service !== null;

  return (
    <div>
      <div className="flex flex-col gap-6">
        <ChipRow
          id="filter-industry"
          legend="Industry"
          options={industryOptions}
          active={industry}
          count={(o) => cases.filter((c) => c.industry === o).length}
          onPick={setIndustry}
        />
        <ChipRow
          id="filter-service"
          legend="Service"
          options={serviceOptions}
          active={service}
          count={(o) => cases.filter((c) => c.service === o).length}
          onPick={setService}
        />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <p className="font-mono text-[0.6875rem] text-mute" aria-live="polite">
          showing {shown.length} of {cases.length} documented builds
        </p>
        {filtered && (
          <button
            onClick={() => {
              setIndustry(null);
              setService(null);
            }}
            className="label min-h-12 rounded-full border border-line px-4 text-mute transition-colors hover:border-signal/50 hover:text-paper"
          >
            Clear filters
          </button>
        )}
      </div>

      {shown.length > 0 ? (
        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {shown.map((c, i) => (
            <Reveal as="li" key={c.client} delay={i * 80} className="h-full">
              <Tilt className="h-full" strength={6}>
                <article className="flex h-full flex-col border border-line bg-deck p-6 transition-colors hover:border-signal hover:bg-deck">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-[1.125rem] font-bold tracking-tight">
                      {c.client}
                    </h3>
                    <span className="label shrink-0 text-mute">{c.service}</span>
                  </div>
                  <p className="mt-1.5 font-mono text-[0.6875rem] text-mute">{c.industry}</p>

                  <dl className="mt-5 space-y-4">
                    <div>
                      <dt className="label text-mute">Problem</dt>
                      <dd className="mt-1.5 text-small text-paper/85">{c.problem}</dd>
                    </div>
                    <div>
                      <dt className="label text-mute">What we built</dt>
                      <dd className="mt-1.5 text-small text-paper/85">{c.built}</dd>
                    </div>
                  </dl>

                  <div className="mt-auto flex items-baseline gap-2.5 pt-6">
                    <span className="font-display text-[2.75rem] font-bold leading-none text-accent">
                      <Counter value={Number(c.number)} />
                    </span>
                    <span className="label text-mute">{c.unit}</span>
                  </div>

                  <Link
                    href={`/platforms/${c.slug}`}
                    className="group mt-6 inline-flex min-h-12 items-center gap-2 border-t border-line pt-5 text-small text-accent"
                  >
                    See the platform
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </article>
              </Tilt>
            </Reveal>
          ))}
        </ul>
      ) : (
        <div className="mt-8 border border-dashed border-line bg-deck p-7">
          <p className="label flex items-center gap-2.5 text-mute">
            <span aria-hidden className="size-1.5 rounded-full bg-mute" />
            Nothing published under that filter yet
          </p>
          <p className="mt-4 max-w-lg text-small text-mute">
            We publish a client&apos;s name, logo or numbers only once written consent is on
            file — so this list grows slower than the work does. Ask us on a call and
            we&apos;ll walk you through what we&apos;ve shipped in your category.
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Chips ────────────────────────────────────────────────────────────────── */

function ChipRow({
  id,
  legend,
  options,
  active,
  count,
  onPick,
}: {
  id: string;
  legend: string;
  options: string[];
  active: string | null;
  count: (option: string) => number;
  onPick: (value: string | null) => void;
}) {
  return (
    <div role="group" aria-labelledby={id}>
      <p id={id} className="label text-mute">
        {legend}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        <li>
          <Chip on={active === null} onClick={() => onPick(null)}>
            All
          </Chip>
        </li>
        {options.map((o) => (
          <li key={o}>
            <Chip on={active === o} onClick={() => onPick(active === o ? null : o)}>
              {o}
              <span className="font-mono text-[0.625rem] text-mute">{count(o)}</span>
            </Chip>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={clsx(
        "inline-flex min-h-12 items-center gap-2 rounded-full border px-4 text-[0.9375rem] transition-colors duration-300",
        on
          ? "border-signal/50 bg-signal/[0.08] text-accent"
          : "border-line bg-deck text-paper hover:border-mute/30 hover:bg-deck",
      )}
    >
      {children}
    </button>
  );
}
