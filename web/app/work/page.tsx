import type { Metadata } from "next";
import { stats } from "@/lib/content";
import { Button, Counter, Eyebrow, Reveal } from "@/components/ui";
import WorkFilters, { type WorkCase } from "./WorkFilters";

/**
 * /work — PRD §5 IA.
 *
 * Content governance (PRD §14): no client logo, quote or outcome number goes public
 * without written consent on file. Three builds are documented from shipped module
 * maps and already stated elsewhere on the site; nothing else is invented to fill the
 * grid, and outcome metrics (ROAS, CPL, revenue delta) are deliberately absent until
 * the consent forms are signed. The empty-state copy says so out loud.
 *
 * These three mirror components/sections/Proof.tsx exactly. They live here rather than
 * in lib/content.ts because Proof.tsx owns the same local shape today — both should
 * move to the CMS `caseStudy` type in PRD §10.1 in one go, not piecemeal.
 */

const cases: WorkCase[] = [
  {
    client: "Growus Auto",
    industry: "Security & facility",
    service: "Build",
    problem:
      "Attendance and inspections across dozens of client sites, collected by phone call.",
    built:
      "A 27-module HRMS with field inspection, shift rosters, payroll and client-site reporting.",
    number: "27",
    unit: "modules live",
    slug: "hrms-field-inspection",
  },
  {
    client: "Nidhi NBFC Bank",
    industry: "Cooperative finance",
    service: "Build",
    problem:
      "Passbooks written by hand, branch cash reconciled at month end, audits painful.",
    built:
      "Eight core modules with auto-passbook triggers, loans, RD/FD, branch cash and audit trails.",
    number: "8",
    unit: "core modules · auto passbook",
    slug: "nidhi-nbfc-software",
  },
  {
    client: "Sengoleit",
    industry: "Education",
    service: "Build",
    problem:
      "A university and its franchise network running on different systems and spreadsheets.",
    built: "One ERP with four separate role portals — admin, franchise, faculty and student.",
    number: "4",
    unit: "role portals",
    slug: "institute-franchise-erp",
  },
];

/* The full service vocabulary, not just the ones with a published write-up — a chip
   that returns nothing is honest signal, not a broken filter. */
const serviceOptions = ["Build", "Automate", "Grow"];

export const metadata: Metadata = {
  title: "Work — problem, what we built, the number",
  description:
    "Documented BlinksAI builds in the format that answers a buyer's question: the problem, what we built, and the number. Three case studies published; more go up as client consent is signed.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "BlinksAI work — problem, what we built, the number",
    description:
      "Three documented builds: a 27-module HRMS, an 8-module nidhi banking platform, and a four-portal institute ERP.",
    type: "website",
    locale: "en_IN",
  },
};

export default function WorkIndex() {
  return (
    <>
      <div className="band-dark">
      <section className="relative overflow-hidden pb-24 pt-32 sm:pt-36 lg:pb-32 lg:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-60" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full opacity-30 blur-[130px]"
          style={{
            background:
              "radial-gradient(50% 55% at 45% 45%, rgba(255,178,36,.36), transparent 70%)",
          }}
        />

        <div className="container-site relative">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow t="Shipped">Work</Eyebrow>
            </Reveal>
            <Reveal delay={70}>
              <h1 className="mt-5 text-[clamp(2.125rem,5.2vw,4.25rem)] leading-[1.0] tracking-[-0.03em] [text-wrap:balance]">
                Problem, what we built,{" "}
                <span className="text-accent">the number.</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 text-lead text-mute">
                Three builds, documented in the only format that answers a buyer&apos;s real
                question. No paragraph-length stories, no stock photography, no
                &ldquo;strategic partnership&rdquo; language — just what was broken, what we
                shipped, and the one number that proves it shipped.
              </p>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <dl className="panel mt-10 grid grid-cols-2 gap-6 p-7 lg:grid-cols-4 lg:p-8">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="label mt-2.5 text-mute">{s.label}</dt>
                  <dd className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-none tracking-tight">
                    <Counter value={s.value} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
      </div>

      <div className="band-light">
      {/* ── Consent note — PRD §14, stated before the grid, not buried under it ── */}
      <section className="relative pb-4 pt-24 lg:pt-32">
        <div className="container-site">
          <Reveal>
            <div className="border border-dashed border-line bg-deck p-6 lg:p-7">
              <p className="label flex items-center gap-2.5 text-mute">
                <span aria-hidden className="size-1.5 rounded-full bg-mute" />
                Why only three
              </p>
              <p className="mt-4 max-w-3xl text-small text-mute">
                {stats[0].value}
                {stats[0].suffix} projects have shipped. Three are written up here, because we
                publish a client&apos;s name, logo or numbers only when written consent is on
                file. Outcome metrics — ROAS, cost per lead, revenue delta — are missing on
                purpose for the same reason: an unverifiable number is removed, not softened.
                More case studies go live as consent is signed.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative py-12 lg:py-16">
        <div className="container-site">
          <WorkFilters cases={cases} serviceOptions={serviceOptions} />
        </div>
      </section>
      </div>

      <div className="band-dark">
      <section className="relative py-24 lg:py-36">
        <div className="container-site">
          <div className="panel flex flex-col gap-6 p-7 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div className="max-w-xl">
              <Eyebrow t="T+0">Next step</Eyebrow>
              <h2 className="mt-4 text-[clamp(1.5rem,3.2vw,2.125rem)] leading-[1.1] tracking-[-0.02em]">
                Want the one from your industry?
              </h2>
              <p className="mt-4 text-body text-mute">
                Some of the most useful work we&apos;ve done can&apos;t be published yet. Ask on
                a 20-minute call and we&apos;ll walk you through what we shipped in your
                category — screens, module maps and what it cost.
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto">
              <Button drawer="details" context="case studies" className="w-full sm:w-auto">
                Ask for a walkthrough
              </Button>
              <Button variant="ghost" href="/platforms" className="w-full sm:w-auto">
                See the platforms
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
