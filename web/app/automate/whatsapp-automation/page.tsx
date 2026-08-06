import type { Metadata } from "next";
import Link from "next/link";
import { Button, Eyebrow, Lines, Reveal, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "WhatsApp automation on the official Cloud API",
  description:
    "Official WhatsApp Business Cloud API setup, green tick application, chat flows, broadcasts, click-to-WhatsApp attribution, Day 0/1/3/7 follow-up and live agent handover — built opt-in first.",
  alternates: { canonical: "/automate/whatsapp-automation" },
};

/* PRD §11.1 — what is sold. */
const sold = [
  {
    label: "Cloud API setup",
    body: "Official WhatsApp Business Cloud API, hosted by Meta, with the green tick application handled for you. No reseller sitting between you and the platform.",
  },
  {
    label: "Chat flows",
    body: "Enquiry → qualification → catalogue → booking → payment link, in the language the customer wrote to you in.",
  },
  {
    label: "Broadcasts",
    body: "Campaign sends with a managed template library, so the message that goes to ten thousand people is the one that got approved.",
  },
  {
    label: "Click-to-WhatsApp ads",
    body: "Meta ads that open a chat, with the ad set and creative attributed to the conversation and, later, to the deal.",
  },
  {
    label: "Follow-up sequences",
    body: "Automated Day 0, Day 1, Day 3 and Day 7 touches, then a move to nurture instead of silence.",
  },
  {
    label: "Live agent handover",
    body: "A shared team inbox. The bot stops the moment a human picks up, and the whole thread is already there.",
  },
  {
    label: "CRM sync and reporting",
    body: "Tags, owner, stage and every message written back against one lead record — so reporting is a query, not a screenshot.",
  },
];

/* PRD §11.1 — compliance, in the spec rather than discovered later. */
const compliance = [
  {
    t: "Before message 1",
    title: "Explicit opt-in",
    body: "Nobody is messaged who did not ask to be. The exact consent text shown, the timestamp and the IP are stored — that record is the evidence if a complaint ever arrives.",
  },
  {
    t: "24–48h",
    title: "Template approval",
    body: "Meta reviews every marketing and utility template. We write and submit them, and we plan campaign dates around the review window instead of hoping.",
  },
  {
    t: "24h window",
    title: "The customer service window",
    body: "Once a customer messages you, free-form replies are allowed for 24 hours. Outside it, only approved templates — which cost money per conversation. Flows are designed to respect that, because ignoring it is both expensive and how numbers get blocked.",
  },
  {
    t: "Any time",
    title: "Clear opt-out",
    body: "One reply stops the sequence, and it is honoured across every channel we run for you, not just WhatsApp.",
  },
];

/** Bands are applied here, alternating from a dark header down to a dark close. */
export default function WhatsAppAutomationPage() {
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
                "WhatsApp that answers",
                "in four seconds,",
                <span key="night" className="text-accent">
                  at eleven at night.
                </span>,
              ]} />

            <Reveal delay={280}>
              <p className="mt-10 max-w-2xl text-lead text-mute">
                On the official Meta Cloud API — not a browser plugin, not somebody’s phone in a
                cupboard. Enquiries get qualified, booked and followed up automatically, and a human
                can take the thread over at any point without the customer noticing a seam.
              </p>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="whatsapp" context="WhatsApp automation" className="w-full sm:w-auto">
                  Try it on WhatsApp
                </Button>
                <Button
                  variant="ghost"
                  drawer="details"
                  context="WhatsApp automation"
                  className="w-full sm:w-auto"
                >
                  Get a fixed quote
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
              title={["Seven pieces, switched", "on in the same week"]}
              lead="You can buy the whole thing or start with the chat flow and the follow-up sequence, which is where almost all of the recovered revenue is."
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
              <div className="hidden border-b border-r border-line lg:block" aria-hidden />
              <div className="hidden border-b border-r border-line sm:block" aria-hidden />
            </dl>
          </div>
        </section>
      </div>

      {/* ── Compliance ───────────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <div className="grid gap-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHead
                  eyebrow="Compliance"
                  title={[
                    "The rules that decide",
                    <span key="survives" className="text-accent">
                      whether your number survives.
                    </span>,
                  ]}
                  lead="These are not footnotes. Every one of them changes how the flow has to be designed, which is why they belong on the product page and not in a contract annexure."
                />
              </div>

              <ol className="lg:col-span-7">
                {compliance.map((c, i) => (
                  <Reveal as="li" key={c.title} delay={i * 60}>
                    <div className="flex flex-col gap-2 border-b border-line py-6 sm:flex-row sm:gap-8">
                      <span className="label shrink-0 whitespace-nowrap pt-1 text-accent sm:w-28">
                        {c.t}
                      </span>
                      <div>
                        <h3 className="text-d4">{c.title}</h3>
                        <p className="mt-2 text-small text-mute">{c.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>

            <Reveal>
              <p className="mt-10 max-w-3xl font-mono text-[0.6875rem] leading-relaxed text-mute">
                Pricing note: Meta bills WhatsApp per conversation, not per message. Flow design
                changes what you pay, so we design for it rather than around it.
              </p>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ── Dogfood ──────────────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <div className="border border-line bg-deck p-7 sm:p-10 lg:p-14">
              <Reveal>
                <Eyebrow t="T+4s" accent="mint">
                  What this site runs on
                </Eyebrow>
              </Reveal>
              <Lines as="h2" className="mt-7 max-w-3xl text-d2 font-bold" delay={60} lines={[
                  "Every form on blinksai.com",
                  <span key="fires">
                    triggers a templated WhatsApp{" "}
                    <span className="text-accent">within five seconds</span>.
                  </span>,
                ]} />
              <Reveal delay={200}>
                <p className="mt-7 max-w-2xl text-lead text-mute">
                  The page you were reading is embedded in the first line of that message, so the
                  conversation starts with context instead of “how can I help you”. That is the exact
                  system being sold here — you can test it before you talk to anyone.
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
                "Message us and judge the",
                <span key="reply">
                  product by <span className="text-accent">the reply</span>.
                </span>,
              ]} />
            <Reveal delay={200}>
              <p className="mt-7 text-lead text-mute">
                Twenty minutes, free, if you would rather talk. We will map your current enquiry flow
                and tell you which part is leaking.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="details" context="WhatsApp automation" className="w-full sm:w-auto">
                  Get a fixed quote
                </Button>
                <Button
                  variant="ghost"
                  drawer="whatsapp"
                  context="WhatsApp automation"
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
