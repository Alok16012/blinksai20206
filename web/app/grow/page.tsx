import type { Metadata } from "next";
import { Button, Eyebrow, Lines, Reveal, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Grow — Meta Ads, Google Ads, creative, video and SEO",
  description:
    "Performance marketing wired into your CRM. Server-side conversions and offline conversion upload teach Meta and Google to find buyers instead of form-fillers — usually a 20–40% cost-per-lead improvement in six to eight weeks.",
  alternates: { canonical: "/grow" },
};

/* The measurement loop — Technical Architecture §4.3, §4.4 and §5.5. */
const loop = [
  {
    t: "T+0s",
    title: "Click becomes a lead",
    body: "A Meta click-to-WhatsApp ad or a high-intent Google search ad lands on a page built for that campaign, never the homepage. UTMs, gclid and fbclid are stored against the lead record, not just the browser session.",
  },
  {
    t: "T+4s",
    title: "First reply goes out",
    body: "A templated WhatsApp message is sent within seconds, with the page the person was reading embedded in the first line. Nothing waits for tomorrow morning.",
  },
  {
    t: "T+1m",
    title: "Qualified fires server-side",
    body: "When the lead qualifies, a Meta CAPI and Google Ads enhanced-conversion event is sent from our server with hashed identifiers. No pixel to block, no cookie to lose, no browser in the way.",
  },
  {
    t: "T+3d",
    title: "Won is uploaded back",
    body: "Closed deals are uploaded to Meta and Google as offline conversions. The algorithm stops optimising for whoever fills forms fastest and starts optimising for people who look like your buyers.",
  },
  {
    t: "Week 6–8",
    title: "Cost per lead falls",
    body: "This feedback loop is usually worth a 20–40% cost-per-lead improvement within six to eight weeks. It is the single most common thing missing from an Indian SMB ad account.",
  },
];

const channels = [
  {
    label: "Meta Ads",
    note: "Click-to-WhatsApp",
    body: "The highest-converting path for local Indian SMBs: the ad opens a chat, the chat gets answered in seconds, the conversation is attributed back to the ad set that paid for it.",
  },
  {
    label: "Google Ads",
    note: "High-intent search",
    body: "Expensive per click, cheapest per deal. We buy the searches where somebody is already looking to solve the problem you solve, and land them on a page written for that search.",
  },
  {
    label: "Creative & video",
    note: "Reels, ads, edits",
    body: "Creative is the targeting now. Short-form video, ad variants and edits produced against a brief, tested in the account, and replaced when the numbers say so.",
  },
  {
    label: "SEO & content",
    note: "Compounding traffic",
    body: "Vertical pages for the searches that actually convert — product, industry and city — each with genuinely unique content, because templated pages with a swapped city name get penalised.",
  },
];

const reported = [
  "Leads, calls, proposals and closed deals — by source, not in aggregate",
  "Cost per qualified lead per channel, not cost per click",
  "Which creative and which keyword produced revenue, and which only produced traffic",
  "What we are changing next month, and what we got wrong last month",
];

/** Bands are applied here, alternating from a dark header down to a dark close. */
export default function GrowPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative overflow-hidden pt-32 pb-24 sm:pt-36 lg:pt-44 lg:pb-32">
          <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-70" />

          <div className="container-site relative">
            <Reveal>
              <Eyebrow t="Week 5" accent="mint">
                Grow
              </Eyebrow>
            </Reveal>

            <Lines as="h1" delay={60} className="mt-8 max-w-5xl text-d1 font-bold" lines={[
                "Ads that learn from",
                "your closed deals,",
                <span key="not" className="text-accent">
                  not your form fills.
                </span>,
              ]} />

            <Reveal delay={280}>
              <p className="mt-10 max-w-2xl text-lead text-mute">
                Most agencies optimise towards a form submission, because a browser pixel cannot see
                anything past it. We fire conversions server-side out of the CRM — on{" "}
                <span className="text-paper">qualified</span> and again on{" "}
                <span className="text-paper">won</span> — so Meta and Google learn from the people
                who actually bought.
              </p>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="details" context="the grow page" className="w-full sm:w-auto">
                  Get a growth plan
                </Button>
                <Button variant="ghost" href="/#pricing" className="w-full sm:w-auto">
                  See retainer pricing
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ── The measurement loop ─────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <div className="grid gap-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHead
                  eyebrow="The difference"
                  title={[
                    "The feedback loop",
                    <span key="most" className="text-accent">
                      most ad accounts never get.
                    </span>,
                  ]}
                  lead="Because we also built the system the leads land in, we can tell the ad platforms what happened after the click. Almost nobody can do this, which is why almost nobody does it."
                />
              </div>

              <ol className="lg:col-span-7">
                {loop.map((s, i) => (
                  <Reveal as="li" key={s.t} delay={i * 60}>
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

      {/* ── Channels ─────────────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <SectionHead
              eyebrow="What we run"
              accent="mint"
              title={["Four channels, run by", "the team that built the system"]}
              lead="No handover between the people who shipped the platform and the people who fill it. That removes the one argument every client eventually has with two vendors."
            />

            <ul className="mt-14 grid border-l border-t border-line sm:grid-cols-2">
              {channels.map((c, i) => (
                <Reveal
                  as="li"
                  key={c.label}
                  delay={i * 70}
                  className="border-b border-r border-line"
                >
                  <div className="flex h-full flex-col p-7 lg:p-9">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-d3">{c.label}</h3>
                      <span className="label shrink-0 text-mute">{c.note}</span>
                    </div>
                    <p className="mt-5 text-small text-mute">{c.body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* ── Reporting + honest terms ─────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <div className="grid gap-4 lg:grid-cols-2">
              <Reveal className="h-full">
                <div className="flex h-full flex-col border border-line bg-deck p-7 sm:p-9">
                  <h2 className="text-d3">What the monthly review actually contains</h2>
                  <p className="mt-5 text-small text-mute">
                    Impressions, reach and CTR are inputs. They are in the appendix. The first page is
                    a funnel.
                  </p>
                  <ul className="mt-8 space-y-4 border-t border-line pt-8">
                    {reported.map((r) => (
                      <li key={r} className="flex items-start gap-3 text-small">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-mint" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={80} className="h-full">
                <div className="flex h-full flex-col border border-line bg-deck p-7 sm:p-9">
                  <h2 className="text-d3">The terms, before you ask</h2>
                  <dl className="mt-8 space-y-6">
                    <div>
                      <dt className="label text-mute">Price</dt>
                      <dd className="mt-2 text-small">
                        Growth retainers start at ₹40,000 per month, and are never discounted. If the
                        price does not fit, the scope moves instead.
                      </dd>
                    </div>
                    <div>
                      <dt className="label text-mute">Term</dt>
                      <dd className="mt-2 text-small">
                        Three months to start, because an ad account needs that long to produce a
                        number you can trust. After that it is monthly.
                      </dd>
                    </div>
                    <div>
                      <dt className="label text-mute">Landing</dt>
                      <dd className="mt-2 text-small">
                        Every campaign gets its own page. Sending paid traffic to a homepage is the
                        cheapest way to waste a budget.
                      </dd>
                    </div>
                  </dl>
                </div>
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
                "Send us the ad account.",
                <span key="cost">
                  We will tell you what it is{" "}
                  <span className="text-accent">really costing</span>.
                </span>,
              ]} />
            <Reveal delay={200}>
              <p className="mt-7 text-lead text-mute">
                Twenty minutes, free. If your current agency is already doing this properly, we will
                say so and leave you alone.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="details" context="the grow page" className="w-full sm:w-auto">
                  Get a growth plan
                </Button>
                <Button
                  variant="ghost"
                  drawer="whatsapp"
                  context="the grow page"
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
