import type { Metadata } from "next";
import Link from "next/link";
import { Button, Counter, Eyebrow, Lines, Reveal, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Digital marketing package — Meta Ads, Google Ads, content and GMB",
  description:
    "One monthly fee for 15 posts, 15 reels, Meta Ads, Google Ads, Google Business Profile and YouTube Shorts — scripted, edited, posted and reported. ₹16,000/month management, ₹15,000 minimum ad spend, written lead target or the fee comes back.",
  alternates: { canonical: "/grow/digital-marketing" },
};

/* ── What is included, per platform (proposal §3) ─────────────────────────── */
const platforms = [
  {
    label: "Instagram",
    note: "Reels · posts · stories",
    items: [
      "15 feed posts a month",
      "15 scripted reels a month",
      "Daily stories and highlights",
      "Bio, hashtag and search setup",
      "Comment and DM replies",
      "Collab and trending-audio strategy",
    ],
  },
  {
    label: "Facebook",
    note: "Page · lead ads",
    items: [
      "Page managed end to end",
      "The same 15 posts and 15 reels",
      "Lead form ads and click-to-WhatsApp",
      "Page SEO and CTA button setup",
      "Reviews and messages handled",
      "Local group and community push",
    ],
  },
  {
    label: "Google Business",
    note: "Map pack · reviews",
    items: [
      "Profile rebuilt and optimised",
      "Weekly GMB posts and offers",
      "Photo and product uploads",
      "Review replies managed",
      "Local map-pack ranking work",
      "Q&A and service area setup",
    ],
  },
  {
    label: "YouTube",
    note: "Shorts · SEO",
    items: [
      "Channel setup and branding",
      "15 Shorts, repurposed from the reels",
      "Title, description and tag SEO",
      "Custom thumbnails",
      "Playlists and end screens",
      "Monthly performance review",
    ],
  },
];

/* ── The content pipeline (proposal §4) ───────────────────────────────────── */
const pipeline = [
  {
    t: "Step 1",
    title: "Strategy and calendar",
    body: "Audience, offer and competitor study, then a 30-day content calendar that you approve before anything is produced.",
  },
  {
    t: "Step 2",
    title: "Scripting",
    body: "Every reel gets a written hook, dialogue and call to action — in Hindi, Hinglish or English, whichever your customer actually speaks.",
  },
  {
    t: "Step 3",
    title: "Shoot direction",
    body: "A shot list and location guide. Shoot it yourself on a phone, or our team comes to you for a bulk day.",
  },
  {
    t: "Step 4",
    title: "Design and edit",
    body: "Poster design, reel editing, subtitles, trending audio, your brand colours — by an editor, not a template app.",
  },
  {
    t: "Step 5",
    title: "Approval",
    body: "The month is previewed in one WhatsApp group. Approved content is scheduled the same day.",
  },
  {
    t: "Step 6",
    title: "Post and engage",
    body: "Best-time posting, hashtags, comment and DM replies, and a weekly report you can read in a minute.",
  },
];

/* ── Paid channels (proposal §5) ──────────────────────────────────────────── */
const meta = [
  "Business Manager, Pixel and Conversions API setup",
  "Lead form ads that land straight in WhatsApp or the CRM",
  "Click-to-WhatsApp campaigns — the highest-quality leads for local businesses",
  "Custom and lookalike audiences built from your own data",
  "Retargeting: video viewers, page visitors, form drop-offs",
  "Creative A/B testing — a new hook every week",
  "Daily budget pacing and cost-per-lead optimisation",
];

const google = [
  "Search campaigns on buying-intent keywords",
  "Call-only ads that ring your phone directly",
  "Performance Max and display retargeting",
  "YouTube video ads cut from your own reels",
  "Local campaigns driving calls and directions from GMB",
  "Negative keyword cleaning every week",
  "Conversion tracking and GA4 setup",
];

/* ── Live account proof (proposal §6) ─────────────────────────────────────── */
const campaigns = [
  { name: "15th June Leads Ads", status: "Best", leads: "184", cpl: "₹63.92", budget: "₹300/day" },
  { name: "Maheshwari City Bihta — Leads", status: "Active", leads: "21", cpl: "₹85.32", budget: "₹500/day" },
  { name: "New Leads campaign", status: "In draft", leads: "—", cpl: "—", budget: "₹1,000/day" },
];

/* ── Guarantee conditions (proposal §7) ───────────────────────────────────── */
const conditions = [
  {
    n: "01",
    title: "₹500 a day in ad spend, without a break",
    body: "Continuous across all 90 days. If the budget stops midway the guarantee is void, because the test was never actually run.",
  },
  {
    n: "02",
    title: "The lead target is fixed in writing first",
    body: "A realistic monthly number, set against your industry, city and budget, written into the agreement before the first rupee is spent.",
  },
  {
    n: "03",
    title: "Content approved within 48 hours",
    body: "If posts and reels are not approved on time the calendar slips, and that period does not count towards the 90 days.",
  },
  {
    n: "04",
    title: "Leads called within 24 hours",
    body: "We can deliver the leads; somebody on your side has to pick up the phone. Call logs are checked as part of any claim.",
  },
  {
    n: "05",
    title: "The refund is the management fee, not the ad spend",
    body: "Ad spend goes to Meta and Google, not to us, so it is not ours to return. The fee you paid us is.",
  },
  {
    n: "06",
    title: "Paid within 15 working days",
    body: "A claim triggers a joint review of the numbers, then a direct bank transfer.",
  },
];

/* ── First 30 days (proposal §9) ──────────────────────────────────────────── */
const weeks = [
  {
    t: "Week 1",
    title: "Setup and launch",
    items: [
      "Kick-off call and business understanding",
      "Page, GMB and YouTube audit and cleanup",
      "Business Manager, Pixel and CAPI setup",
      "Content calendar approved",
      "First Meta campaign live",
    ],
  },
  {
    t: "Week 2",
    title: "Content rollout",
    items: [
      "Bulk shoot or raw footage collected",
      "Reels edited, posts designed",
      "Daily posting begins",
      "Google Ads search live",
      "First weekly report",
    ],
  },
  {
    t: "Week 3",
    title: "Optimise",
    items: [
      "Creative A/B testing",
      "Audience and keyword refinement",
      "Retargeting campaigns switched on",
      "Cost per lead pushed down",
      "GMB review drive",
    ],
  },
  {
    t: "Week 4",
    title: "Scale",
    items: [
      "Budget moved onto winning ads",
      "Losing ads paused",
      "Monthly review call",
      "Next month planned",
      "Lead quality feedback loop closed",
    ],
  },
];

const addons = [
  { label: "Dynamic website", price: "₹12,000 one-time" },
  { label: "CRM + WhatsApp automation", price: "On request" },
  { label: "Extra 15 reels a month", price: "₹8,000" },
  { label: "On-location shoot day", price: "₹5,000 / day" },
];

/** Bands are applied here, alternating from a dark header down to a dark close. */
export default function DigitalMarketingPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative overflow-hidden pt-32 pb-24 sm:pt-36 lg:pt-44 lg:pb-32">
          <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-70" />

          <div className="container-site relative">
            <Reveal>
              <Link
                href="/grow"
                className="label inline-flex items-center gap-2 text-mute transition-colors hover:text-paper"
              >
                <span aria-hidden>←</span>
                Grow
              </Link>
            </Reveal>

            <Lines as="h1" delay={60} className="mt-8 max-w-5xl text-d1 font-bold" lines={[
                "We don’t post.",
                <span key="leads" className="text-accent">
                  We bring leads.
                </span>,
              ]} />

            <Reveal delay={280}>
              <p className="mt-10 max-w-2xl text-lead text-mute">
                One monthly fee covers Instagram, Facebook, Google Business and YouTube — 15 posts
                and 15 reels scripted, shot, edited and posted — plus Meta Ads and Google Ads run by
                the same team. A lead target goes into the agreement in writing, and if it is missed
                the management fee comes back.
              </p>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="details" context="the digital marketing package" className="w-full sm:w-auto">
                  Get a lead target
                </Button>
                <Button variant="ghost" href="/proposal" className="w-full sm:w-auto">
                  Open the full proposal
                </Button>
              </div>
            </Reveal>

            <Reveal delay={420}>
              <dl className="mt-16 grid gap-x-8 gap-y-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { v: 15, s: "", l: "feed posts a month" },
                  { v: 15, s: "", l: "reels a month" },
                  { v: 4, s: "", l: "platforms managed" },
                  { v: 90, s: " days", l: "to hit the target, or refund" },
                ].map((s) => (
                  <div key={s.l}>
                    <dt className="font-display text-d1 font-bold text-paper">
                      <Counter value={s.v} suffix={s.s} />
                    </dt>
                    <dd className="label mt-3 text-mute">{s.l}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ── What you get ─────────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <SectionHead
              eyebrow="Full scope"
              accent="mint"
              title={["One package,", "four platforms, end to end"]}
              lead="Strategy, content, shoot direction, editing, posting, ads and reporting are all on our side of the line. The only thing we need from you is an approval."
            />

            <div className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
              {platforms.map((p, i) => (
                <Reveal key={p.label} delay={i * 60} className="border-b border-r border-line">
                  <div className="flex h-full flex-col p-7 lg:p-8">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-d4">{p.label}</h3>
                      <span className="label shrink-0 text-mute">{p.note}</span>
                    </div>
                    <ul className="mt-6 space-y-3 border-t border-line pt-6">
                      {p.items.map((it) => (
                        <li key={it} className="flex items-start gap-3 text-small text-mute">
                          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-mint" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <p className="mt-10 max-w-3xl font-mono text-[0.6875rem] leading-relaxed text-mute">
                Included at no extra charge: a WhatsApp Business catalogue with auto-reply setup, and
                one landing page for the campaign — because paid traffic sent to a homepage is the
                cheapest way to waste a budget.
              </p>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ── Content engine ───────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <div className="grid gap-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHead
                  eyebrow="Content engine"
                  title={[
                    "Thirty pieces a month,",
                    <span key="script" className="text-accent">
                      from script to scheduled.
                    </span>,
                  ]}
                  lead="You give us one day for a bulk shoot — or send raw clips from a phone — and the entire month is produced and scheduled in one pass. Festival and offer dates are planned separately."
                />
              </div>

              <ol className="lg:col-span-7">
                {pipeline.map((s, i) => (
                  <Reveal as="li" key={s.t} delay={i * 60}>
                    <div className="flex flex-col gap-2 border-b border-line py-6 sm:flex-row sm:gap-8">
                      <span className="label shrink-0 whitespace-nowrap pt-1 text-accent sm:w-20">
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

      {/* ── Paid ads ─────────────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <SectionHead
              eyebrow="Performance marketing"
              accent="mint"
              title={["Meta and Google,", "one team, one funnel"]}
              lead="Split across two vendors, the budget gets spent twice on the same person. Run together, a video viewer on Instagram can be met again by a search ad the day they finally go looking."
            />

            <div className="mt-14 grid gap-4 lg:grid-cols-2">
              {[
                { title: "Meta Ads", note: "Facebook + Instagram", items: meta },
                { title: "Google Ads", note: "Search · PMax · YouTube", items: google },
              ].map((c, i) => (
                <Reveal key={c.title} delay={i * 80} className="h-full">
                  <div className="flex h-full flex-col border border-line bg-deck p-7 sm:p-9">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-d3">{c.title}</h3>
                      <span className="label shrink-0 text-mute">{c.note}</span>
                    </div>
                    <ul className="mt-8 space-y-4 border-t border-line pt-8">
                      {c.items.map((it) => (
                        <li key={it} className="flex items-start gap-3 text-small">
                          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-mint" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-4 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
              {[
                { s: "Awareness", b: "Cheap reach through reels and video views" },
                { s: "Consideration", b: "Retargeting and testimonial creative" },
                { s: "Lead", b: "Form, WhatsApp and call ads" },
                { s: "Sale", b: "CRM follow-up and WhatsApp automation" },
              ].map((f, i) => (
                <Reveal key={f.s} delay={i * 50} className="border-b border-r border-line p-7">
                  <p className="label text-accent">{f.s}</p>
                  <p className="mt-3 text-small text-mute">{f.b}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── Live account proof ───────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <SectionHead
              eyebrow="Proof · live client account"
              title={[
                "205 leads at",
                <span key="cpl" className="text-accent">
                  ₹66 a lead.
                </span>,
              ]}
              lead="These are the numbers from a running client account, read straight off Meta Ads Manager and Google Ads in August 2026 — not a case study written after the fact. You get the same admin access to your own accounts."
            />

            <div className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
              {[
                { v: "205", l: "form leads · Meta", n: "Across 4 campaigns" },
                { v: "₹66", l: "average cost per lead", n: "₹63.92 on the best campaign" },
                { v: "11.5%", l: "Google Ads CTR", n: "235 impressions · 27 clicks" },
                { v: "₹18.92", l: "average cost per click", n: "Search · 1-day view" },
              ].map((s, i) => (
                <Reveal key={s.l} delay={i * 60} className="border-b border-r border-line p-7">
                  <p className="font-display text-d2 font-bold text-paper">{s.v}</p>
                  <p className="label mt-3 text-mute">{s.l}</p>
                  <p className="mt-2 text-small text-mint">{s.n}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <div className="mt-4 overflow-x-auto border border-line bg-deck">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <caption className="label border-b border-line px-7 py-5 text-left text-mute">
                    Meta Ads Manager — campaign view, August 2026
                  </caption>
                  <thead>
                    <tr className="label text-mute">
                      <th scope="col" className="border-b border-line px-7 py-4 font-medium">Campaign</th>
                      <th scope="col" className="border-b border-line px-7 py-4 font-medium">Status</th>
                      <th scope="col" className="border-b border-line px-7 py-4 font-medium">Leads</th>
                      <th scope="col" className="border-b border-line px-7 py-4 font-medium">Cost / lead</th>
                      <th scope="col" className="border-b border-line px-7 py-4 font-medium">Budget</th>
                    </tr>
                  </thead>
                  <tbody className="text-small">
                    {campaigns.map((c) => (
                      <tr key={c.name}>
                        <td className="border-b border-line px-7 py-4">{c.name}</td>
                        <td className="border-b border-line px-7 py-4 text-mute">{c.status}</td>
                        <td className="border-b border-line px-7 py-4">{c.leads}</td>
                        <td className="border-b border-line px-7 py-4 text-mint">{c.cpl}</td>
                        <td className="border-b border-line px-7 py-4 text-mute">{c.budget}</td>
                      </tr>
                    ))}
                    <tr className="font-mono">
                      <td className="px-7 py-4 text-paper">Total — 4 campaigns</td>
                      <td className="px-7 py-4 text-mute">—</td>
                      <td className="px-7 py-4 text-paper">205</td>
                      <td className="px-7 py-4 text-mint">₹66.11</td>
                      <td className="px-7 py-4 text-mute">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Reveal>

            <Reveal>
              <p className="mt-8 max-w-3xl font-mono text-[0.6875rem] leading-relaxed text-mute">
                One account, one industry, one city, one offer. Results vary with all four, so this is
                evidence that the system works — not a promise that your account will return the same
                number. The target we write into your agreement is set against your own market.
              </p>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ── Guarantee ────────────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <div className="grid gap-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHead
                  eyebrow="Risk reversal"
                  accent="mint"
                  title={[
                    "Miss the target,",
                    <span key="refund" className="text-accent">
                      get the fee back.
                    </span>,
                  ]}
                  lead="If the monthly lead target written into the agreement is not met within 90 days, the management fee for that period is refunded in full. The conditions are printed here rather than buried in an annexure, because every one of them changes whether the test is fair."
                />
                <Reveal delay={260}>
                  <div className="mt-10 border border-line bg-deck p-7">
                    <p className="label text-mute">Minimum ad spend</p>
                    <p className="mt-3 text-d3">₹500 a day · ₹15,000 a month</p>
                    <p className="mt-4 text-small text-mute">
                      Below this the guarantee does not apply — there is not enough spend to learn
                      from. The service itself carries on as normal.
                    </p>
                  </div>
                </Reveal>
              </div>

              <ol className="lg:col-span-7">
                {conditions.map((c, i) => (
                  <Reveal as="li" key={c.n} delay={i * 50}>
                    <div className="flex flex-col gap-2 border-b border-line py-6 sm:flex-row sm:gap-8">
                      <span className="label shrink-0 pt-1 text-accent sm:w-12">{c.n}</span>
                      <div>
                        <h3 className="text-d4">{c.title}</h3>
                        <p className="mt-2 text-small text-mute">{c.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <SectionHead
              eyebrow="Investment"
              title={["One fee.", "Everything included."]}
              lead="Design, editing, scripting, posting, ad management and reporting are all inside the management fee. There is no separate creative charge and no percentage taken on ad spend."
            />

            <div className="mt-14 grid gap-4 lg:grid-cols-12">
              <Reveal className="lg:col-span-7">
                <div className="panel noise relative h-full overflow-hidden p-7 sm:p-9">
                  <p className="label text-accent">Complete growth package</p>
                  <p className="mt-6 font-display text-stat font-bold text-paper">₹16,000</p>
                  <p className="label mt-3 text-mute">per month · management fee</p>
                  <ul className="mt-10 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
                    {[
                      "15 feed posts, designed and captioned",
                      "15 reels, scripted and edited",
                      "Daily Instagram stories",
                      "Facebook page management",
                      "Google Business Profile",
                      "YouTube Shorts and SEO",
                      "Meta Ads, fully managed",
                      "Google Ads, fully managed",
                      "Pixel, CAPI and conversion tracking",
                      "One landing page",
                      "WhatsApp Business setup",
                      "Weekly report and a monthly call",
                      "Comments and DMs handled",
                      "A named account manager",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-3 text-small">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-mint" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <div className="grid gap-4 lg:col-span-5">
                <Reveal delay={80}>
                  <div className="border border-line bg-deck p-7">
                    <h3 className="text-d4">The whole monthly number</h3>
                    <dl className="mt-7 border-t border-line">
                      {[
                        { k: "Management fee", s: "to BlinksAI", v: "₹16,000" },
                        { k: "Ad spend, minimum", s: "direct to Meta and Google · ₹500/day", v: "₹15,000" },
                        { k: "Setup and onboarding", s: "one-time", v: "Free" },
                      ].map((r) => (
                        <div
                          key={r.k}
                          className="flex items-start justify-between gap-6 border-b border-line py-4"
                        >
                          <dt className="text-small">
                            {r.k}
                            <span className="mt-1 block text-mute">{r.s}</span>
                          </dt>
                          <dd className="shrink-0 font-mono text-small text-paper">{r.v}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-6 flex items-baseline justify-between gap-6">
                      <p className="label text-mute">Total from month one</p>
                      <p className="font-display text-d3 font-bold text-accent">₹31,000</p>
                    </div>
                    <p className="mt-6 text-small text-mute">
                      The ad spend can be billed to your own card, straight to Meta and Google. We
                      manage it; we take no commission on it.
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={140}>
                  <div className="border border-line bg-deck p-7">
                    <h3 className="text-d4">Add-ons, optional</h3>
                    <dl className="mt-7 border-t border-line">
                      {addons.map((a) => (
                        <div
                          key={a.label}
                          className="flex items-baseline justify-between gap-6 border-b border-line py-4"
                        >
                          <dt className="text-small">{a.label}</dt>
                          <dd className="shrink-0 font-mono text-small text-mute">{a.price}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Reveal>
              </div>
            </div>

            <Reveal>
              <p className="mt-8 max-w-3xl font-mono text-[0.6875rem] leading-relaxed text-mute">
                Monthly in advance, GST extra. Rolling month to month — cancel with 30 days’ notice,
                no annual lock-in. Every account, pixel and creative stays in your name, so if the
                contract ends you keep the asset and the history.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <div className="mt-10 border border-line p-7 sm:p-9">
                <h3 className="text-d4">Where this sits against the growth retainer</h3>
                <p className="mt-4 max-w-3xl text-small text-mute">
                  This package runs your content and your ad accounts. The{" "}
                  <Link href="/grow" className="text-accent underline underline-offset-4">
                    growth retainer
                  </Link>{" "}
                  from ₹40,000 a month is a different job: conversions fired server-side out of a CRM
                  and closed deals uploaded back to Meta and Google, so the algorithms optimise for
                  buyers rather than form-fillers. Start here; move up when the lead volume is worth
                  engineering against.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ── First 30 days ────────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="relative py-24 lg:py-36">
          <div className="container-site">
            <SectionHead
              eyebrow="Onboarding"
              accent="mint"
              title={["What happens in", "the first 30 days"]}
              lead="Work starts within 48 hours of payment and the first campaign is live inside week one. All we need from you is brand files, page access, one shoot day or raw clips, and approvals within 48 hours."
            />

            <div className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
              {weeks.map((w, i) => (
                <Reveal key={w.t} delay={i * 60} className="border-b border-r border-line">
                  <div className="flex h-full flex-col p-7 lg:p-8">
                    <p className="label text-accent">{w.t}</p>
                    <h3 className="mt-3 text-d4">{w.title}</h3>
                    <ul className="mt-6 space-y-3 border-t border-line pt-6">
                      {w.items.map((it) => (
                        <li key={it} className="flex items-start gap-3 text-small text-mute">
                          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-mint" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
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
              <Eyebrow t="15 min">Next step</Eyebrow>
            </Reveal>
            <Lines as="h2" className="mt-7 text-d2 font-bold" delay={60} lines={[
                "Tell us the business.",
                <span key="number">
                  We will give you a{" "}
                  <span className="text-accent">lead number</span> on the call.
                </span>,
              ]} />
            <Reveal delay={200}>
              <p className="mt-7 text-lead text-mute">
                Fifteen minutes to understand your market, your competition and your margin. The
                monthly lead target we quote on that call is the same one that goes into the
                guarantee — we do not revise it upward once the contract is signed.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button drawer="details" context="the digital marketing package" className="w-full sm:w-auto">
                  Get a lead target
                </Button>
                <Button
                  variant="ghost"
                  drawer="whatsapp"
                  context="the digital marketing package"
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
