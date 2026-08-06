import type { Metadata } from "next";
import { Button, Eyebrow, Lines, Reveal, SectionHead, Stat } from "@/components/ui";
import { site, stats } from "@/lib/content";

export const metadata: Metadata = {
  title: "About — a growth engineering company",
  description:
    "BlinksAI builds the system, automates it, and fills it with customers. Eight platforms in production across six industries, 42 clients, one team and one invoice. Based in Nashik, Maharashtra.",
  alternates: { canonical: "/about" },
};

/* Growth Strategy §1 — the honest diagnosis, told from the buyer's side. */
const shift = [
  { project: "Starts at zero, every time", product: "Starts at “here, watch it run”" },
  { project: "Six to twelve weeks of selling", product: "Two to three weeks to live" },
  { project: "You compare vendors on price", product: "You compare them on fit" },
  { project: "You carry the delivery risk", product: "Client number one already paid it" },
];

/* Growth Strategy §2 — what to stop and start saying. */
const stopped = [
  "“IT solutions”",
  "“One-stop shop”",
  "“Cutting-edge technology”",
  "“We are passionate”",
  "“Custom software development company”",
];

const started = [
  "“8 platforms already running in 6 industries”",
  "“Live in 2 weeks, not 6 months”",
  "“Your enquiries answered in 4 seconds, in Marathi, at 11 PM”",
  "“We’re the only ones who also bring the customers”",
];

const refusals = [
  {
    title: "We don’t publish testimonials we can’t attribute",
    body: "Until a client has signed off on their name, their role and their words, there is nothing here to quote. An anonymous testimonial is worth zero and everybody knows it.",
  },
  {
    title: "We don’t discount",
    body: "If the price doesn’t fit, the scope moves. Discounting only teaches you that the first number was fake, and it makes the next conversation worse.",
  },
  {
    title: "We don’t sell what we can’t deliver in weeks",
    body: "Marketing faster than delivery can keep up is the classic way an agency dies. We only push products we can put live in two to three weeks.",
  },
  {
    title: "We don’t take shortcuts on compliance",
    body: "Opt-in before the first message, DND scrubbing before the first call, calling hours honoured. One complaint can cost you the number your whole business answers on.",
  },
];

/**
 * Route pages own their bands: each block below is wrapped in .band-dark / .band-light,
 * alternating from the top so the header always sits on dark, and closing on dark
 * because the footer is dark. Nothing inside a section sets a background of its own.
 */
export default function AboutPage() {
  return (
    <>
      {/* ── Hero + facts ─────────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative overflow-hidden pt-32 sm:pt-36 lg:pt-44">
          <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-70" />

          <div className="container-site relative pb-24 lg:pb-32">
            <Reveal>
              <Eyebrow t="Since day one">Company</Eyebrow>
            </Reveal>

            <Lines as="h1" delay={60} className="mt-8 max-w-5xl text-d1 font-bold" lines={[
                <span key="a">
                  A <span className="text-accent">growth</span>
                </span>,
                <span key="eng" className="text-accent">
                  engineering
                </span>,
                "company.",
              ]} />

            <Reveal delay={240}>
              <p className="mt-10 max-w-2xl text-lead text-mute">
                We build the system, automate it, and fill it with customers. One team, one invoice,
                and one number to call when something breaks. BlinksAI is owned and run by{" "}
                {site.founder}, and based in {site.city}.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="details" context="the about page" className="w-full sm:w-auto">
                  Talk to us
                </Button>
                <Button variant="ghost" href="/work" className="w-full sm:w-auto">
                  See the work
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Stat slabs on the band's bottom edge, split by hairlines. */}
          <div className="container-site relative">
            <ul className="grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal
                  as="li"
                  key={s.label}
                  delay={i * 60}
                  className="border-b border-r border-line"
                >
                  <Stat value={s.value} suffix={s.suffix} label={s.label} className="p-7 lg:p-9" />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* ── The point of view ────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <SectionHead
              eyebrow="Point of view"
              title={[
                "Software companies can’t market.",
                <span key="a" className="text-accent">
                  Agencies can’t build.
                </span>,
              ]}
              lead="The gap between those two is where most projects quietly die — the platform ships, nobody uses it, and each vendor points at the other. We closed the gap by doing both, and by putting it on one invoice so there is nobody left to blame."
            />

            <Reveal delay={140}>
              <p className="mt-10 max-w-3xl text-lead text-mute">
                The second thing we believe is less flattering to us. Eight deep platforms and 42
                clients is three to four years of research and development that is already done — and
                for a long time it was being sold in the most expensive possible way, as custom
                projects. Selling the same work as products changes what the buyer experiences:
              </p>
            </Reveal>

            <div className="mt-14 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left">
                <caption className="sr-only">
                  What changes when the same capability is bought as a product instead of a project
                </caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="label py-4 pr-6 font-medium text-mute">
                      Bought as a project
                    </th>
                    <th scope="col" className="label py-4 font-medium text-accent">
                      Bought as a product
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shift.map((r) => (
                    <tr key={r.project} className="border-b border-line">
                      <td className="py-5 pr-6 text-small text-mute">{r.project}</td>
                      <td className="py-5 text-small">{r.product}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* ── Language ─────────────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <SectionHead
              eyebrow="Language"
              title={["What we stopped saying,", "and what we say instead"]}
              lead="How a company describes itself is the fastest signal of whether it knows what it does. We rewrote ours, in public, and we are keeping the old list here on purpose."
            />

            <div className="mt-14 grid gap-4 lg:grid-cols-2">
              <Reveal className="h-full">
                <div className="flex h-full flex-col border border-line bg-deck p-7 sm:p-9">
                  <h3 className="label text-mute">Stopped saying</h3>
                  <ul className="mt-6 space-y-4">
                    {stopped.map((s) => (
                      <li
                        key={s}
                        className="flex items-start gap-3 text-small text-mute line-through"
                      >
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-mute" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={80} className="h-full">
                <div className="flex h-full flex-col border border-signal bg-deck p-7 sm:p-9">
                  <h3 className="label text-accent">Say instead</h3>
                  <ul className="mt-6 space-y-4">
                    {started.map((s) => (
                      <li key={s} className="flex items-start gap-3 text-small">
                        <span
                          aria-hidden
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-signal"
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </div>

      {/* ── What we won't do ─────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <SectionHead
              eyebrow="House rules"
              title={["Four things we will not do,", "including one that costs us leads"]}
              lead="These are easier to publish than to keep. Holding us to them is the point of writing them down."
            />

            <ul className="mt-14 grid border-l border-t border-line sm:grid-cols-2">
              {refusals.map((r, i) => (
                <Reveal
                  as="li"
                  key={r.title}
                  delay={i * 70}
                  className="border-b border-r border-line"
                >
                  <div className="flex h-full flex-col p-7 lg:p-9">
                    <h3 className="text-d4">{r.title}</h3>
                    <p className="mt-4 text-small text-mute">{r.body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal>
              <p className="mt-10 max-w-3xl text-small text-mute">
                We work with clients across six industries and several states. Discovery and delivery
                run remotely; onsite training is arranged where it is needed.
              </p>
            </Reveal>
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
                "Twenty minutes, free —",
                <span key="fit">
                  and we tell you if we are the <span className="text-accent">wrong fit</span>.
                </span>,
              ]} />
            <Reveal delay={200}>
              <p className="mt-7 text-lead text-mute">
                Bring the problem, not a specification. You get a scope, a fixed price and a timeline
                in writing within two days.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="details" context="the about page" className="w-full sm:w-auto">
                  Talk to us
                </Button>
                <Button
                  variant="ghost"
                  drawer="whatsapp"
                  context="the about page"
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
