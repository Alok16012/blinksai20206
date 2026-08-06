import type { Metadata } from "next";
import Link from "next/link";
import { Button, Eyebrow, Lines, Reveal, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Social media automation — calendar, scheduling and DM capture",
  description:
    "A content calendar with AI-assisted drafts in your brand voice, scheduling to Instagram, Facebook, LinkedIn, YouTube Shorts and Google Business Profile, comment and DM auto-reply with lead capture, and Instagram DM to WhatsApp handoff.",
  alternates: { canonical: "/automate/social-media-automation" },
};

/* PRD §11.3 — what is sold. */
const sold = [
  {
    label: "Content calendar",
    body: "A month planned in one sitting, with AI-assisted drafts written in your brand voice. You approve; nothing publishes on its own.",
  },
  {
    label: "Multi-platform scheduling",
    body: "Instagram, Facebook, LinkedIn, YouTube Shorts and Google Business Profile from one queue, so the Google profile stops going stale.",
  },
  {
    label: "Comment and DM auto-reply",
    body: "Replies within seconds, with the interested ones captured as leads in the CRM rather than left sitting in an inbox nobody opens on Sunday.",
  },
  {
    label: "Instagram DM → WhatsApp",
    body: "The highest-converting path for an Indian SMB right now: the DM is answered, the conversation moves to WhatsApp, and the lead record follows it.",
  },
  {
    label: "Review and UGC requests",
    body: "Automated asks at the right moment in the customer journey. Reviews are also what answer engines read when someone asks them to recommend you.",
  },
  {
    label: "Monthly reporting",
    body: "Generated, not assembled by hand — what was posted, what was replied to, and how many leads the channel actually produced.",
  },
];

const rules = [
  {
    t: "Draft",
    title: "AI writes, a person approves",
    body: "The model produces the first draft against your calendar and your brand voice. A human still presses publish. Nothing goes out of your account that you have not seen.",
  },
  {
    t: "Reply",
    title: "Fast beats clever",
    body: "A comment answered in thirty seconds outperforms a witty one answered on Thursday. Anything the bot is not confident about goes to a person instead of guessing.",
  },
  {
    t: "Capture",
    title: "Every reply is a lead record",
    body: "A DM that shows intent becomes a row in the CRM with its source attached, which is what makes the channel measurable instead of a vibe.",
  },
];

/** Bands are applied here, alternating from a dark header down to a dark close. */
export default function SocialMediaAutomationPage() {
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
                "Thirty days of posts,",
                "scheduled — and the",
                <span key="replies" className="text-accent">
                  replies handled.
                </span>,
              ]} />

            <Reveal delay={280}>
              <p className="mt-10 max-w-2xl text-lead text-mute">
                Publishing is the easy half. The half that produces revenue is answering the comment
                and the DM within seconds, and turning the ones with intent into a lead record
                instead of a notification you will clear later.
              </p>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button
                  drawer="details"
                  context="social media automation"
                  className="w-full sm:w-auto"
                >
                  Get a fixed quote
                </Button>
                <Button
                  variant="ghost"
                  drawer="whatsapp"
                  context="social media automation"
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
              title={["Six pieces — plan, publish,", "reply, capture, ask, report"]}
              lead="Sold as a monthly service because that is the only shape in which it works. A social calendar bought once and never maintained is worse than nothing."
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
            </dl>
          </div>
        </section>
      </div>

      {/* ── How it runs ──────────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <div className="grid gap-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHead
                  eyebrow="How it runs"
                  title={[
                    "Automated,",
                    <span key="not" className="text-accent">
                      not unattended.
                    </span>,
                  ]}
                  lead="Handing a brand account to a bot with no supervision is how companies end up apologising in public. The automation drafts and answers; a person stays accountable."
                />
              </div>

              <ol className="lg:col-span-7">
                {rules.map((r, i) => (
                  <Reveal as="li" key={r.title} delay={i * 60}>
                    <div className="flex flex-col gap-2 border-b border-line py-6 sm:flex-row sm:gap-8">
                      <span className="label shrink-0 whitespace-nowrap pt-1 text-accent sm:w-24">
                        {r.t}
                      </span>
                      <div>
                        <h3 className="text-d4">{r.title}</h3>
                        <p className="mt-2 text-small text-mute">{r.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>

      {/* ── Dogfood ──────────────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <div className="border border-line bg-deck p-7 sm:p-10 lg:p-14">
              <Reveal>
                <Eyebrow t="On publish">What this site runs on</Eyebrow>
              </Reveal>
              <Lines as="h2" className="mt-7 max-w-3xl text-d2 font-bold" delay={60} lines={[
                  "One case study becomes",
                  <span key="six">
                    <span className="text-accent">six assets</span>, without anybody re-typing it.
                  </span>,
                ]} />
              <Reveal delay={200}>
                <p className="mt-7 max-w-2xl text-lead text-mute">
                  When we publish a case study here, it posts itself to every channel we run. The
                  same source then becomes six things: a page, a short video, a LinkedIn carousel, a
                  WhatsApp broadcast, an ad creative and a sales PDF. That is the pipeline we set up
                  for you, pointed at your content instead of ours.
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
                "Send us your handles.",
                <span key="cost">
                  We will tell you what the last month{" "}
                  <span className="text-accent">cost you</span>.
                </span>,
              ]} />
            <Reveal delay={200}>
              <p className="mt-7 text-lead text-mute">
                Twenty minutes, free. Our view, before we look: the posting is rarely the problem —
                the unanswered DMs are.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button
                  drawer="details"
                  context="social media automation"
                  className="w-full sm:w-auto"
                >
                  Get a fixed quote
                </Button>
                <Button
                  variant="ghost"
                  drawer="whatsapp"
                  context="social media automation"
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
