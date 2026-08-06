import type { Metadata } from "next";
import Link from "next/link";
import { Button, Eyebrow, Lines, Reveal, SectionHead } from "@/components/ui";
import { automations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Automate — WhatsApp, AI voice, social and workflow automation",
  description:
    "Official WhatsApp Cloud API, AI voice agents in Hindi, Marathi and English, social automation and workflow glue. Every enquiry answered in seconds, every hour of the day, built consent-first.",
  alternates: { canonical: "/automate" },
};

const accentDot = {
  signal: "bg-signal",
  violet: "bg-violet",
  mint: "bg-mint",
} as const;

/* The 5-second promise — Technical Architecture §4.4. */
const promise = [
  {
    t: "T+0s",
    title: "The form returns instantly",
    body: "The page validates, de-duplicates and answers in one round trip. Everything slow is pushed onto a queue. That is the difference between a form that feels fast and one that feels broken.",
  },
  {
    t: "T+4s",
    title: "A templated WhatsApp arrives",
    body: "The enquiry is scored, the language is picked, and the message goes out with the page you were reading named in the first line.",
  },
  {
    t: "D1 · D3 · D7",
    title: "Follow-up runs itself",
    body: "Three scheduled touches, then the lead moves to nurture rather than being forgotten. Every touch is written to one database, which is what makes attribution possible later.",
  },
];

const compliance = [
  "Explicit opt-in captured before the first message, with the exact text shown stored against the record",
  "DND and NCPR scrubbing before any outbound call",
  "Calling hours held to 09:00–21:00, per TRAI rules",
  "A clear opt-out on every channel, honoured immediately",
];

/** Bands are applied here, alternating from a dark header down to a dark close. */
export default function AutomatePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative overflow-hidden pt-32 pb-24 sm:pt-36 lg:pt-44 lg:pb-32">
          <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-70" />

          <div className="container-site relative">
            <Reveal>
              <Eyebrow t="T+4s" accent="violet">
                Automate
              </Eyebrow>
            </Reveal>

            <Lines as="h1" delay={60} className="mt-8 max-w-5xl text-d1 font-bold sm:text-d0" lines={[
                "It answers",
                <span key="before" className="text-accent">
                  before you wake up.
                </span>,
              ]} />

            <Reveal delay={240}>
              <p className="mt-10 max-w-2xl text-lead text-mute">
                WhatsApp Cloud API, AI voice agents in Hindi and Marathi, social replies and the
                workflow glue between them. Every enquiry gets a reply in seconds, at every hour of
                the day — and every one of them is logged against a lead record you can audit.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="whatsapp" context="the automate page" className="w-full sm:w-auto">
                  Try it on WhatsApp
                </Button>
                <Button
                  variant="ghost"
                  drawer="call"
                  context="the automate page"
                  className="w-full sm:w-auto"
                >
                  Let the AI call you
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ── The four services ────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <SectionHead
              eyebrow="Four services"
              accent="violet"
              title={["Pick the one that is costing", "you the most right now"]}
              lead="They are sold separately and they run together. Most clients start with WhatsApp, because that is where the enquiries already are."
            />

            <ul className="mt-14 grid border-l border-t border-line sm:grid-cols-2">
              {automations.map((a, i) => (
                <Reveal
                  as="li"
                  key={a.key}
                  delay={i * 70}
                  className="border-b border-r border-line"
                >
                  <Link
                    href={a.href}
                    className="group flex h-full flex-col p-7 transition-colors hover:bg-deck lg:p-9"
                  >
                    <span className="label flex items-center gap-2.5 text-mute">
                      <span aria-hidden className={`size-1.5 rounded-full ${accentDot[a.accent]}`} />
                      {a.key}
                    </span>
                    <h3 className="mt-6 text-d3">{a.title}</h3>
                    <p className="mt-4 text-small text-mute">{a.line}</p>
                    <span className="mt-auto flex items-center gap-2 pt-10 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-accent">
                      Read the detail
                      <span
                        aria-hidden
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* ── The 5-second promise ─────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <div className="grid gap-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHead
                  eyebrow="Dogfood"
                  title={[
                    "This website runs on",
                    <span key="thing" className="text-accent">
                      the thing we are selling you.
                    </span>,
                  ]}
                  lead="Fill in any form here and watch what happens. The message you receive is not a demo of the product — it is the product, pointed at us."
                />
              </div>

              <ol className="lg:col-span-7">
                {promise.map((p, i) => (
                  <Reveal as="li" key={p.t} delay={i * 60}>
                    <div className="flex flex-col gap-2 border-b border-line py-6 sm:flex-row sm:gap-8">
                      <span className="label shrink-0 whitespace-nowrap pt-1 text-accent sm:w-28">
                        {p.t}
                      </span>
                      <div>
                        <h3 className="text-d4">{p.title}</h3>
                        <p className="mt-2 text-small text-mute">{p.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>

      {/* ── Compliance ───────────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <div className="border border-line bg-deck p-7 sm:p-10 lg:p-14">
              <Reveal>
                <Eyebrow accent="mint">Consent-first, not compliance-later</Eyebrow>
              </Reveal>
              <Lines as="h2" className="mt-7 max-w-3xl text-d2 font-bold" delay={60} lines={[
                  "Shortcuts here get your",
                  <span key="blocked">
                    number <span className="text-accent">blocked</span>. So we do not take them.
                  </span>,
                ]} />
              <Reveal delay={200}>
                <p className="mt-7 max-w-2xl text-lead text-mute">
                  WhatsApp policy, TRAI TCCCP and the India DPDP Act are architecture decisions, not
                  paperwork you attach at the end. A single complaint can cost you the number your
                  whole business answers on.
                </p>
              </Reveal>
              <ul className="mt-10 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
                {compliance.map((c, i) => (
                  <Reveal as="li" key={c} delay={i * 50}>
                    <span className="flex items-start gap-3 text-small">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-mint" />
                      {c}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div className="band-dark">
        <CtaBand />
      </div>
    </>
  );
}

/* Local CTA band — one per page so nothing new lands in components/. */
function CtaBand() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-60" />
      <div className="container-site relative">
        <div className="panel noise relative overflow-hidden p-7 sm:p-10 lg:p-14">
          <div className="relative max-w-3xl">
            <Reveal>
              <Eyebrow t="T+0">Next step</Eyebrow>
            </Reveal>
            <Lines as="h2" className="mt-7 text-d2 font-bold" delay={60} lines={[
                "Count the enquiries you got",
                <span key="after">
                  after 7 PM last week.{" "}
                  <span className="text-accent">That is the number.</span>
                </span>,
              ]} />
            <Reveal delay={200}>
              <p className="mt-7 text-lead text-mute">
                Twenty minutes, free. We will map what happens to an enquiry today and what it would
                cost to have it answered in four seconds instead.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="details" context="the automate page" className="w-full sm:w-auto">
                  Get a fixed quote
                </Button>
                <Button
                  variant="ghost"
                  drawer="whatsapp"
                  context="the automate page"
                  className="w-full sm:w-auto"
                >
                  Ask on WhatsApp
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
