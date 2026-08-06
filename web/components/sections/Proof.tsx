/* Server component: every interactive part (Reveal, Counter, Stat) is a client leaf,
   so none of this markup or copy needs to ship as JavaScript. */
import Link from "next/link";
import { Counter, Reveal, SectionHead, Stat } from "@/components/ui";

/**
 * §7.8 — replace adjectives with numbers.
 * Content rule: every figure here traces to a named client and a shipped module map.
 * Outcome metrics (ROAS, CPL, revenue delta) are deliberately absent until the client
 * consent forms in PRD §14 are signed — an unverifiable number is removed, not softened.
 */

const cases = [
  {
    client: "Growus Auto",
    industry: "Security & facility",
    problem: "Attendance and inspections across dozens of client sites, collected by phone call.",
    built: "A 27-module HRMS with field inspection, shift rosters, payroll and client-site reporting.",
    number: "27",
    unit: "modules live",
    slug: "hrms-field-inspection",
  },
  {
    client: "Nidhi NBFC Bank",
    industry: "Cooperative finance",
    problem: "Passbooks written by hand, branch cash reconciled at month end, audits painful.",
    built: "Eight core modules with auto-passbook triggers, loans, RD/FD, branch cash and audit trails.",
    number: "8",
    unit: "core modules · auto passbook",
    slug: "nidhi-nbfc-software",
  },
  {
    client: "Sengoleit",
    industry: "Education",
    problem: "A university and its franchise network running on different systems and spreadsheets.",
    built: "One ERP with four separate role portals — admin, franchise, faculty and student.",
    number: "4",
    unit: "role portals",
    slug: "institute-franchise-erp",
  },
];

/* Figures exactly as stated in lib/content.ts — no rounding up, no added "+". */
const band = [
  { value: 8, suffix: "", label: "platforms in production" },
  { value: 42, suffix: "", label: "clients served" },
  { value: 6, suffix: "", label: "industries shipped in" },
  { value: 3, suffix: "", label: "mobile apps" },
];

export default function Proof() {
  return (
    <section id="proof" className="relative scroll-mt-24 py-24 lg:py-36">
      <div className="container-site">
        <SectionHead
          eyebrow="Proof"
          title={[
            "Problem, what we built,",
            <span key="n" className="text-accent">
              the number.
            </span>,
          ]}
          lead="No paragraph-length stories on the homepage. Three real builds, in the format that actually answers a buyer's question."
        />

        {/* Three columns divided by hairlines — the number is the payload, so it runs at
            the same slab size as the results band below it. */}
        <ul className="mt-16 grid border-l border-t border-line lg:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal as="li" key={c.client} delay={i * 80} className="border-b border-r border-line">
              <Link
                href={`/platforms/${c.slug}`}
                className="group flex h-full flex-col p-7 transition-colors hover:bg-deck lg:p-9"
              >
                <p className="label text-mute">{c.industry}</p>
                <h3 className="mt-4 text-d3">{c.client}</h3>

                <dl className="mt-8 space-y-6">
                  <div>
                    <dt className="label text-mute">Problem</dt>
                    <dd className="mt-2 text-small">{c.problem}</dd>
                  </div>
                  <div>
                    <dt className="label text-mute">What we built</dt>
                    <dd className="mt-2 text-small">{c.built}</dd>
                  </div>
                </dl>

                <div className="mt-auto pt-12">
                  <p className="font-display text-stat font-bold text-accent">
                    <Counter value={Number(c.number)} />
                  </p>
                  <p className="label mt-4 text-mute">{c.unit}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        {/* Results band */}
        <div className="grid grid-cols-2 border-l border-line lg:grid-cols-4">
          {band.map((b, i) => (
            <Reveal key={b.label} delay={i * 60} className="border-b border-r border-line">
              <Stat value={b.value} suffix={b.suffix} label={b.label} className="p-7 lg:p-9" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
