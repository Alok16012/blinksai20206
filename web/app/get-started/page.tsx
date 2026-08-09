import type { Metadata } from "next";
import Link from "next/link";
import { site, stats } from "@/lib/content";
import { resolveVariant } from "@/lib/landing";
import { Eyebrow, Lines, Reveal, Stat } from "@/components/ui";
import LeadForm from "./LeadForm";

/**
 * /get-started — the page paid traffic lands on.
 *
 * Different job from the marketing site. A visitor here arrived from a
 * specific search with a specific problem and no patience: the headline
 * repeats their search back to them (see lib/landing.ts), the form is
 * above the fold, and there is exactly one thing to do on the page.
 *
 * Variant comes from `?for=` on the ad's final URL. An unknown or missing
 * value falls back to the general software variant rather than 404ing —
 * a broken ad URL should still sell something.
 *
 * noindex on purpose: this duplicates the product pages, and letting
 * Google index both splits the organic ranking between them.
 */

export const metadata: Metadata = {
  title: "Get a fixed quote",
  robots: { index: false, follow: true },
};

const PROOF = [
  { k: "8", v: "platforms already live" },
  { k: "42", v: "clients" },
  { k: "6", v: "industries" },
  { k: "~4s", v: "first WhatsApp reply" },
];

const STEPS = [
  {
    t: "Today",
    h: "You tell us what you run",
    b: "Three fields, or a WhatsApp message. We reply with a straight answer — including 'this is not for you' when that is the honest one.",
  },
  {
    t: "Day 1–2",
    h: "A 20-minute call, free",
    b: "We walk your actual process, not a demo script. You see the real screens of the platform closest to your business.",
  },
  {
    t: "Day 2–3",
    h: "Fixed quote, written scope",
    b: "One price, and a document listing what is in and what is out. No hourly billing, no discovery invoice before you have decided anything.",
  },
];

const FAQ = [
  {
    q: "What does it actually cost?",
    a: "Platform licence starts at ₹1.5 lakh setup plus a monthly fee. Custom builds start at ₹4 lakh, billed against milestones. Growth retainers start at ₹40,000/month. We do not discount — if the budget is tight we cut scope instead, and tell you what you are losing.",
  },
  {
    q: "How fast can we be live?",
    a: "A ready platform is configured and live in about two weeks. A custom build depends on scope, and we tell you the honest number before you commit, not after.",
  },
  {
    q: "Who actually does the work?",
    a: "The same team that answers this form. We are based in Nashik and we do not subcontract the build. You will talk to the people writing the code.",
  },
  {
    q: "What if we already have software?",
    a: "Then the question is whether replacing it beats fixing it. Sometimes it does not, and we will say so. We migrate data from Excel, Tally exports and most existing systems.",
  },
];

export default async function GetStartedPage({
  searchParams,
}: PageProps<"/get-started">) {
  const params = await searchParams;
  const raw = params.for;
  const key = Array.isArray(raw) ? raw[0] : raw;
  const v = resolveVariant(key);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── Above the fold ─────────────────────────────────────────── */}
      <section className="band-dark noise relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-24">
          <div>
            <Reveal>
              <Eyebrow t={`Live in ${v.deploy}`}>Fixed price, written scope</Eyebrow>
            </Reveal>

            <Lines
              as="h1"
              className="mt-6 text-d1 font-bold"
              delay={60}
              lines={v.h1.split(" ").reduce<string[][]>((acc, word, i, arr) => {
                /* Break the headline near the middle on a word boundary so
                   the clipped line-rise has real lines to animate. */
                const half = Math.ceil(arr.length / 2);
                (acc[i < half ? 0 : 1] ??= []).push(word);
                return acc;
              }, []).map((words) => words.join(" "))}
            />

            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-lead text-mute">{v.sub}</p>
            </Reveal>

            {/* Proof immediately under the promise — a claim with nothing
                behind it is why paid visitors bounce on the first screen. */}
            <Reveal delay={280}>
              <ul className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                {PROOF.map((p) => (
                  <li key={p.v}>
                    <p className="font-display text-d3 font-bold text-paper">{p.k}</p>
                    <p className="label mt-1.5 text-mute">{p.v}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-10 border-t border-line pt-7">
                <p className="label text-mute">What you get</p>
                <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {v.gets.map((g) => (
                    <li key={g} className="flex items-start gap-3 text-paper">
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 bg-signal"
                      />
                      <span className="text-[0.9375rem] leading-snug">{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Sticky so the form is reachable at any scroll depth on desktop.
              On mobile it sits inline and MobileBar covers the thumb zone. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <LeadForm context={v.context} />
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section className="band-light border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <Reveal>
            <Eyebrow>From here to a quote</Eyebrow>
          </Reveal>
          <Lines
            as="h2"
            className="mt-6 max-w-3xl text-d2 font-bold"
            lines={["Three days, and", "nothing to pay yet"]}
          />

          <ol className="mt-12 grid gap-px border border-line bg-line md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.h} className="bg-[color:var(--surface)] p-6 sm:p-8">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-accent">
                  {s.t}
                </p>
                <p className="mt-4 font-display text-d4 font-bold uppercase">
                  <span className="text-mute">{String(i + 1).padStart(2, "0")} </span>
                  {s.h}
                </p>
                <p className="mt-3 text-mute">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── The objection ──────────────────────────────────────────── */}
      <section className="band-dark border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <Eyebrow accent="mint">The thing you are actually thinking</Eyebrow>
              <p className="mt-6 font-display text-d3 font-bold uppercase">
                &ldquo;{v.objection.q}&rdquo;
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-lead text-paper">{v.objection.a}</p>
              <div className="mt-8 grid grid-cols-2 gap-8 border-t border-line pt-8 sm:grid-cols-4">
                {stats.slice(0, 4).map((s) => (
                  <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section className="band-light border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <Reveal>
            <Eyebrow>Before you ask</Eyebrow>
          </Reveal>
          <Lines as="h2" className="mt-6 text-d2 font-bold" lines={["Straight answers"]} />

          <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2">
            {FAQ.map((f) => (
              <div key={f.q} className="bg-[color:var(--surface)] p-6 sm:p-8">
                <h3 className="text-d4 font-bold">{f.q}</h3>
                <p className="mt-3 text-mute">{f.a}</p>
              </div>
            ))}
          </div>

          {v.more && (
            <Reveal delay={140}>
              <p className="mt-10 text-mute">
                Want the full detail first?{" "}
                <Link
                  href={v.more}
                  className="text-accent underline underline-offset-[6px] hover:text-ink"
                >
                  See the product page
                </Link>
                .
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────── */}
      <section className="band-dark noise">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 lg:py-28">
          <Lines
            as="h2"
            className="text-d2 font-bold"
            lines={["Ask one question.", "See what happens."]}
          />
          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-xl text-lead text-mute">
              Message us on WhatsApp and time the reply. That four seconds is the
              product — everything else on this page is just describing it.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                  `Hi BlinksAI — I'm looking at ${v.context}.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="label flex min-h-13 w-full items-center justify-center gap-2 bg-signal px-8 text-carbon transition-colors hover:bg-paper hover:text-ink sm:w-auto"
              >
                Message on WhatsApp
              </a>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="label flex min-h-13 w-full items-center justify-center border border-line px-8 text-paper transition-colors hover:border-signal hover:text-accent sm:w-auto"
              >
                {site.phone}
              </a>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-8 font-mono text-[0.6875rem] text-mute">
              {site.city} · 09:00–21:00 IST · Hindi or English
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
