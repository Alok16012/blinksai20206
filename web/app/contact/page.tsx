import type { Metadata } from "next";
import { Button, Eyebrow, Lines, Reveal, SectionHead } from "@/components/ui";
import { process, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to BlinksAI — ${site.email}, ${site.phone}, ${site.city}. Twenty minutes, free, and we tell you if we are the wrong fit. Outside working hours the automation answers in about four seconds.`,
  alternates: { canonical: "/contact" },
};

/* Only the outbound window is a published fact (TRAI TCCCP, PRD §11.2). Staffed hours
   are not settled yet, so they are marked rather than invented — same treatment as the
   placeholder phone number in lib/content.ts. */
const hours = [
  { label: "Humans", value: "Working hours confirmed on the first reply" },
  { label: "Automation", value: "24 / 7 — WhatsApp replies in about 4 seconds" },
  { label: "Outbound calls", value: "09:00–21:00 IST only, DND-scrubbed (TRAI)" },
];

/**
 * Route pages own their bands: alternating from dark under the nav and closing dark
 * because the footer is dark. Nothing inside a section sets its own background.
 */
export default function ContactPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative overflow-hidden pb-24 pt-32 sm:pt-36 lg:pb-32 lg:pt-44">
          <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-60" />
          <div className="container-site relative">
            <Reveal>
              <Eyebrow t="T+0">Contact</Eyebrow>
            </Reveal>

            <Lines as="h1" delay={60} className="mt-8 max-w-5xl text-d1 font-bold" lines={[
                "Talk to us.",
                <span key="l2" className="text-accent">
                  Twenty minutes, free.
                </span>,
              ]} />

            <Reveal delay={220}>
              <p className="mt-10 max-w-2xl text-lead text-mute">
                Bring the problem, not a specification — and we will tell you honestly if we are the
                wrong fit. Whatever you send here reaches a person, and a templated WhatsApp goes out
                within five seconds, because that is the same system we sell.
              </p>
            </Reveal>

            <Reveal delay={280}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="details" context="the contact page" className="w-full sm:w-auto">
                  Start a conversation
                </Button>
                <Button
                  variant="ghost"
                  drawer="call"
                  context="the contact page"
                  className="w-full sm:w-auto"
                >
                  Let the AI call me
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ── Channels ─────────────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <SectionHead
              eyebrow="Direct lines"
              title={[
                "Four ways in.",
                <span key="l2" className="text-accent">
                  All of them go to the same place.
                </span>,
              ]}
              lead="There is no contact form that disappears into an inbox. Every enquiry becomes one lead record with an owner attached, whichever door it came through."
            />

            {/* Flush instrument grid — hairlines belong to the container, not the cells. */}
            <ul className="mt-16 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
              <Reveal as="li" className="border-b border-r border-line">
                <div className="flex h-full flex-col items-start p-7 lg:p-8">
                  <span className="label text-mute">WhatsApp</span>
                  <span className="mt-8 font-display text-d4 font-bold uppercase">
                    Fastest, day or night
                  </span>
                  <span className="mt-3 text-small text-mute">
                    Replies in about four seconds, in English,{" "}
                    <span className="font-deva">हिंदी</span> or{" "}
                    <span className="font-deva">मराठी</span>.
                  </span>
                  <span className="mt-auto block pt-8">
                    <Button variant="ghost" drawer="whatsapp" context="the contact page">
                      Open the chat
                    </Button>
                  </span>
                </div>
              </Reveal>

              <Reveal as="li" delay={60} className="border-b border-r border-line">
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="flex h-full flex-col items-start p-7 transition-colors hover:bg-deck lg:p-8"
                >
                  <span className="label text-mute">Phone</span>
                  <span className="mt-8 font-display text-d4 font-bold uppercase">{site.phone}</span>
                  <span className="mt-3 text-small text-mute">
                    Miss us and the callback is automatic — the WhatsApp reply goes out either way.
                  </span>
                </a>
              </Reveal>

              <Reveal as="li" delay={120} className="border-b border-r border-line">
                <a
                  href={`mailto:${site.email}`}
                  className="flex h-full flex-col items-start p-7 transition-colors hover:bg-deck lg:p-8"
                >
                  <span className="label text-mute">Email</span>
                  <span className="mt-8 break-all font-display text-d4 font-bold uppercase">
                    {site.email}
                  </span>
                  <span className="mt-3 text-small text-mute">
                    Best for scopes, documents and anything with an attachment.
                  </span>
                </a>
              </Reveal>

              <Reveal as="li" delay={180} className="border-b border-r border-line">
                <div className="flex h-full flex-col items-start p-7 lg:p-8">
                  <span className="label text-mute">Where we are</span>
                  <span className="mt-8 font-display text-d4 font-bold uppercase">{site.city}</span>
                  <span className="mt-3 text-small text-mute">
                    Clients across six industries and several states. Discovery runs remotely; onsite
                    training where it is needed.
                  </span>
                </div>
              </Reveal>
            </ul>

            <div className="grid border-l border-line sm:grid-cols-3">
              {hours.map((h, i) => (
                <Reveal key={h.label} delay={i * 60} className="border-b border-r border-line p-7">
                  <p className="label text-mute">{h.label}</p>
                  <p className="mt-3 text-small">{h.value}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── What happens next ────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <div className="grid gap-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHead
                  eyebrow="What happens next"
                  title={[
                    "No proposal deck.",
                    <span key="l2" className="text-accent">
                      A scope and a price.
                    </span>,
                  ]}
                  lead="You will not be handed off between three people or chased for a month. The first call is a diagnosis, and it is genuinely fine for it to end with us saying no."
                />
              </div>

              <ol className="border-t border-line lg:col-span-7">
                {process.slice(0, 3).map((step, i) => (
                  <Reveal as="li" key={step.t} delay={i * 60}>
                    <div className="flex flex-col gap-2 border-b border-line py-7 sm:flex-row sm:gap-10">
                      <span className="label shrink-0 whitespace-nowrap text-accent sm:w-28">
                        {step.t}
                      </span>
                      <div>
                        <h3 className="text-d4 font-bold">{step.title}</h3>
                        <p className="mt-2 text-small text-mute">{step.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>

            <Reveal>
              <p className="mt-12 max-w-3xl font-mono text-[0.6875rem] leading-relaxed text-mute">
                Your details are used to answer your enquiry and nothing else. Consent is recorded
                with the exact text you agreed to, and you can ask us to delete it at any time.
              </p>
            </Reveal>
          </div>
        </section>
      </div>

      <div className="band-light">
        <CtaBand />
      </div>
    </>
  );
}

/* Local CTA band — one per page so nothing new lands in components/. */
function CtaBand() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container-site">
        <div className="border-t-2 border-t-signal border-x border-b border-line bg-deck p-8 lg:p-16">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow t="T+0">Next step</Eyebrow>
            </Reveal>
            <Lines as="h2" delay={60} className="mt-6 text-d2 font-bold" lines={["Tell us what is broken.", "We will tell you what it costs to fix."]} />
            <Reveal delay={220}>
              <p className="mt-8 text-lead text-mute">
                Twenty minutes, free. A written scope, a fixed price and a timeline follow within two
                days.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="details" context="the contact page" className="w-full sm:w-auto">
                  Start a conversation
                </Button>
                <Button
                  variant="ghost"
                  drawer="whatsapp"
                  context="the contact page"
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
