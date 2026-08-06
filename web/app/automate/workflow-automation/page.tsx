import type { Metadata } from "next";
import Link from "next/link";
import { Button, Eyebrow, Lines, Reveal, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Workflow automation — the glue between your tools",
  description:
    "Lead routing by industry and value, quotation generation, invoice and payment reminders, onboarding checklists and internal alerts. We automate the boring half of your business.",
  alternates: { canonical: "/automate/workflow-automation" },
};

/* PRD §11.4 — what is sold. */
const sold = [
  {
    label: "Lead routing",
    body: "By industry, by value, by territory — to the right owner within seconds of arrival, with an escalation path when nobody picks it up.",
  },
  {
    label: "Quotation generation",
    body: "A proposal built from your own rate card and sent as a PDF, so the quote goes out the same day instead of the same week.",
  },
  {
    label: "Invoices and reminders",
    body: "Payment reminders that go out on schedule and stop the moment the money lands. Nobody has to be the person who chases.",
  },
  {
    label: "Onboarding checklists",
    body: "Every new client gets the same sequence of steps, documents and confirmations — because the delivery you can repeat is the delivery you can scale.",
  },
  {
    label: "Internal alerts",
    body: "A high-value lead, a stalled deal, a failed payment — surfaced where the team already is, not buried in a report nobody opens.",
  },
];

/* Technical Architecture §4.3 — lead lifecycle. */
const lifecycle = [
  {
    t: "T+0s",
    title: "New",
    body: "A form, a WhatsApp message or a phone call creates one lead record, with its source, campaign and page context attached.",
  },
  {
    t: "T+4s",
    title: "Contacted",
    body: "An automated WhatsApp goes out in under five seconds. This transition is the single biggest difference between a lead that converts and one that goes cold.",
  },
  {
    t: "T+1m",
    title: "Qualified or nurture",
    body: "Budget, industry and timeline are established. No reply after three touches and the lead moves to nurture instead of being quietly dropped.",
  },
  {
    t: "T+2m",
    title: "Booked",
    body: "A calendar slot is taken and confirmed, with reminders before the meeting so the no-show rate stops being a mystery.",
  },
  {
    t: "T+3d",
    title: "Won",
    body: "The deal closes, and the win is uploaded back to Meta and Google as an offline conversion so the ads learn from real buyers.",
  },
];

/** Bands are applied here, alternating from a dark header down to a dark close. */
export default function WorkflowAutomationPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative overflow-hidden pt-32 pb-24 sm:pt-36 lg:pt-44 lg:pb-32">
          <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-70" />

          <div className="container-site relative">
            <Reveal>
              <Link
                href="/automate"
                className="label inline-flex items-center gap-2 text-mute transition-colors hover:text-paper"
              >
                <span aria-hidden>←</span>
                Automate
              </Link>
            </Reveal>

            <Lines as="h1" delay={60} className="mt-8 max-w-5xl text-d1 font-bold" lines={[
                "We automate",
                <span key="boring" className="text-accent">
                  the boring half
                </span>,
                <span key="biz" className="text-accent">
                  of your business.
                </span>,
              ]} />

            <Reveal delay={280}>
              <p className="mt-10 max-w-2xl text-lead text-mute">
                The work that has no owner and no glory: routing the enquiry, producing the quote,
                chasing the payment, running the onboarding checklist, telling somebody a deal has
                gone quiet. It is where the day disappears, and it is the easiest part to hand over.
              </p>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="details" context="workflow automation" className="w-full sm:w-auto">
                  Get a fixed quote
                </Button>
                <Button
                  variant="ghost"
                  drawer="whatsapp"
                  context="workflow automation"
                  className="w-full sm:w-auto"
                >
                  Ask on WhatsApp
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ── What is sold ─────────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <SectionHead
              eyebrow="What you get"
              accent="mint"
              title={["Five jobs that currently rely", "on somebody remembering"]}
              lead="None of these are hard. All of them are forgotten under pressure, which is exactly when they matter most."
            />

            <dl className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
              {sold.map((s, i) => (
                <Reveal
                  key={s.label}
                  delay={Math.min(i, 5) * 45}
                  className="border-b border-r border-line p-7 lg:p-8"
                >
                  <dt className="label text-mute">{s.label}</dt>
                  <dd className="mt-4 text-small">{s.body}</dd>
                </Reveal>
              ))}
              <div className="hidden border-b border-r border-line sm:block" aria-hidden />
            </dl>
          </div>
        </section>
      </div>

      {/* ── Lifecycle ────────────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <div className="grid gap-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHead
                  eyebrow="The lifecycle we wire up"
                  title={[
                    "One lead record.",
                    <span key="touch" className="text-accent">
                      Every touch written to it.
                    </span>,
                  ]}
                  lead="Each transition fires three things: a CRM update, an internal alert, and — when a deal is won — an offline conversion upload to Meta and Google. That one decision is what makes attribution and reporting possible later."
                />
              </div>

              <ol className="lg:col-span-7">
                {lifecycle.map((s, i) => (
                  <Reveal as="li" key={s.title} delay={i * 60}>
                    <div className="flex flex-col gap-2 border-b border-line py-6 sm:flex-row sm:gap-8">
                      <span className="label shrink-0 whitespace-nowrap pt-1 text-accent sm:w-24">
                        {s.t}
                      </span>
                      <div>
                        <h3 className="text-d4">{s.title}</h3>
                        <p className="mt-2 text-small text-mute">{s.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>

      {/* ── Why visual ───────────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <div className="border border-line bg-deck p-7 sm:p-10 lg:p-14">
              <Reveal>
                <Eyebrow accent="mint">Why it is a visual workflow, not code</Eyebrow>
              </Reveal>
              <Lines as="h2" className="mt-7 max-w-3xl text-d2 font-bold" delay={60} lines={[
                  "Your follow-up logic will change every week.",
                  <span key="us">
                    It should not need <span className="text-accent">us</span> to change it.
                  </span>,
                ]} />
              <Reveal delay={200}>
                <p className="mt-7 max-w-3xl text-lead text-mute">
                  Automation buried inside application code means a developer ticket for every tweak,
                  and tweaks are the whole point — sales learns something new every week. We build
                  these as visual workflows your own team can read and edit. We run our own business
                  on exactly this, which is the only reason we are willing to recommend it.
                </p>
              </Reveal>
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
                "Name the three things your",
                <span key="start">
                  team keeps forgetting.{" "}
                  <span className="text-accent">We will start there.</span>
                </span>,
              ]} />
            <Reveal delay={200}>
              <p className="mt-7 text-lead text-mute">
                Twenty minutes, free. You get a map of what happens to an enquiry today, and where
                the manual steps are costing you.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="details" context="workflow automation" className="w-full sm:w-auto">
                  Get a fixed quote
                </Button>
                <Button
                  variant="ghost"
                  drawer="whatsapp"
                  context="workflow automation"
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
