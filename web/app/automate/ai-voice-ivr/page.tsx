import type { Metadata } from "next";
import Link from "next/link";
import { Button, Eyebrow, Lines, Reveal, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "AI voice agents and IVR in Hindi, Marathi and English",
  description:
    "Inbound IVR, missed-call automation and an outbound AI voice agent that qualifies leads and books appointments in Hindi, Marathi or English — under a second to first sound, DND-scrubbed before it dials.",
  alternates: { canonical: "/automate/ai-voice-ivr" },
};

/* PRD §11.2 — what is sold. */
const sold = [
  {
    label: "Inbound IVR",
    body: "A menu that routes to the right person, knows your working hours, and turns voicemail into text you can read instead of a message you never play.",
  },
  {
    label: "Missed-call automation",
    body: "A missed call fires an instant WhatsApp and a callback task. The most common lost lead in an Indian SMB stops being lost.",
  },
  {
    label: "Outbound AI voice agent",
    body: "Speech to text, then a language model, then speech back — in हिंदी, मराठी or English. It qualifies leads, books appointments and runs payment reminders.",
  },
  {
    label: "Recordings and transcripts",
    body: "Every call recorded, transcribed, sentiment-tagged and logged against the lead, so a manager can read a week of calls in ten minutes.",
  },
  {
    label: "Click-to-call",
    body: "A call button on any page, connected to a virtual number so the source of the call is never guesswork.",
  },
];

/* Technical Architecture §5.2 — latency budget. */
const budget = [
  { stage: "Speech to text", target: "≤ 300ms", note: "Indic-tuned models" },
  {
    stage: "First token from the model",
    target: "≤ 400ms",
    note: "conversation policy + your knowledge base",
  },
  { stage: "Text to speech starts", target: "≤ 200ms", note: "Hindi and Marathi voices" },
  { stage: "First sound the caller hears", target: "under 1s", note: "the whole point" },
];

/* PRD §11.2 + Architecture §5.2 — the compliance layer that runs before dialling. */
const gate = [
  {
    t: "Check 1",
    title: "DND / NCPR scrub",
    body: "Every number is checked against the national do-not-call registry before it can enter a dialling queue. No exceptions, no manual override.",
  },
  {
    t: "Check 2",
    title: "Consent lookup",
    body: "We look up the stored consent record — the exact text the person agreed to, when, and from which page. No record, no call.",
  },
  {
    t: "Check 3",
    title: "Calling hours",
    body: "Outbound calls only between 09:00 and 21:00, as TRAI’s TCCCP regulations require. Anything queued outside that window waits.",
  },
  {
    t: "Check 4",
    title: "Frequency cap",
    body: "One call per number per 24 hours. Persistence is not a strategy; it is how a complaint gets filed.",
  },
];

const humanRules = [
  "Recording disclosure is played at the start of every call",
  "Barge-in is on — you can interrupt it mid-sentence, like a person",
  "“Connect me to a person” always works, on every branch of every flow",
  "SMS from the same system runs on a DLT-registered header",
];

/** Bands are applied here, alternating from a dark header down to a dark close. */
export default function AiVoiceIvrPage() {
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
                "A voice agent",
                "that answers in",
                <span key="langs" className="text-accent">
                  <span className="font-deva">हिंदी</span>,{" "}
                  <span className="font-deva">मराठी</span> or English.
                </span>,
              ]} />

            <Reveal delay={280}>
              <p className="mt-10 max-w-2xl text-lead text-mute">
                It picks up on the first ring, qualifies the caller, books the slot and writes the
                whole thing into the CRM. You do not have to believe the description — put your
                number in and let it call you.
              </p>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="call" context="AI voice and IVR" className="w-full sm:w-auto">
                  Let it call me
                </Button>
                <Button
                  variant="ghost"
                  drawer="details"
                  context="AI voice and IVR"
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
              accent="violet"
              title={["Inbound, missed-call and outbound —", "one number, one log"]}
              lead="Most businesses buy an IVR and stop there. The value is in what happens to the calls nobody answered."
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

      {/* ── Latency budget ───────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <SectionHead
              eyebrow="Latency budget"
              title={[
                "If it pauses, the caller talks over it.",
                <span key="nopause" className="text-accent">
                  So it does not pause.
                </span>,
              ]}
              lead="This is the number that separates a voice agent people finish a conversation with from one they hang up on. It is budgeted per stage, and measured in production."
            />

            <div className="mt-14 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <caption className="sr-only">
                  Per-stage latency budget for the AI voice agent
                </caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="label py-4 pr-4 font-medium text-mute">
                      Stage
                    </th>
                    <th scope="col" className="label py-4 pr-4 font-medium text-mute">
                      Budget
                    </th>
                    <th scope="col" className="label py-4 font-medium text-mute">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {budget.map((b) => (
                    <tr key={b.stage} className="border-b border-line">
                      <td className="py-5 pr-4 text-small">{b.stage}</td>
                      <td className="py-5 pr-4 font-mono text-small text-accent">{b.target}</td>
                      <td className="py-5 text-small text-mute">{b.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {humanRules.map((r, i) => (
                <Reveal as="li" key={r} delay={i * 50}>
                  <span className="flex items-start gap-3 text-small">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-violet" />
                    {r}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* ── Compliance gate ──────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <div className="grid gap-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHead
                  eyebrow="Before it dials"
                  accent="mint"
                  title={[
                    "Four checks run",
                    <span key="before" className="text-accent">
                      before a single call goes out.
                    </span>,
                  ]}
                  lead="Non-compliance here is a business risk, not a technical detail. A TRAI complaint can take the number your whole company answers on, so the gate sits in front of the dialler, not in a policy document."
                />
              </div>

              <ol className="lg:col-span-7">
                {gate.map((g, i) => (
                  <Reveal as="li" key={g.title} delay={i * 60}>
                    <div className="flex flex-col gap-2 border-b border-line py-6 sm:flex-row sm:gap-8">
                      <span className="label shrink-0 whitespace-nowrap pt-1 text-accent sm:w-24">
                        {g.t}
                      </span>
                      <div>
                        <h3 className="text-d4">{g.title}</h3>
                        <p className="mt-2 text-small text-mute">{g.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
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
                "Do not read about it.",
                <span key="decide">
                  Let it call you and decide in{" "}
                  <span className="text-accent">ninety seconds</span>.
                </span>,
              ]} />
            <Reveal delay={200}>
              <p className="mt-7 text-lead text-mute">
                Your consent is captured first, and it is one call per number per 24 hours.
                Interrupt it mid-sentence — that is the part worth testing.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="call" context="AI voice and IVR" className="w-full sm:w-auto">
                  Let it call me
                </Button>
                <Button
                  variant="ghost"
                  drawer="details"
                  context="AI voice and IVR"
                  className="w-full sm:w-auto"
                >
                  Get a fixed quote
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
