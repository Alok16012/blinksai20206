import { industries, platforms, stats, testimonials } from "@/lib/content";
import { Button, Counter, Reveal, SectionHead } from "@/components/ui";

/**
 * §7.12 testimonials + client logos, §7.13 insights teaser.
 *
 * §7.12 rule: "Anonymous testimonials are worth zero — omit rather than fake."
 * `testimonials` is empty by design and every entry carries a `consent` flag, so an
 * un-consented quote can never render. Until forms are signed (PRD §14 content
 * governance) this section shows the consent standard plus the proof that is already
 * checkable — 8 shipped platforms, 42 clients, three named builds — instead of fiction.
 */

/* Only consented quotes are ever eligible to render. */
const consented = testimonials.filter((t) => t.consent);

const live = platforms.filter((p) => p.status === "live");
const clientCount = stats.find((s) => s.label === "clients")?.value ?? 42;

const checkable: { value: number; suffix: string; head: string; note: string }[] = [
  {
    value: platforms.length,
    suffix: "",
    head: "platforms shipped",
    note: `${live.length} running in production today`,
  },
  {
    value: clientCount,
    suffix: "",
    head: "clients",
    note: "six industries, several states",
  },
  {
    value: 3,
    suffix: "",
    head: "named builds you can ask about",
    note: live
      .slice(0, 3)
      .map((p) => p.name)
      .join("  ·  "),
  },
];

/* Honest label: this is a list of what runs in production, not a borrowed logo wall. */
const strip: { name: string; note: string; live: boolean }[] = [
  ...platforms.map((p) => ({
    name: p.product,
    note: p.status === "live" ? "live" : "in development",
    live: p.status === "live",
  })),
  ...industries.map((i) => ({ name: i.name, note: "industry", live: true })),
];

/**
 * No CMS and no /blog route yet. Topics are the real channel plan from
 * 03-BlinksAI-Growth-Strategy.md §5.1–5.3, so they are listed as what is coming —
 * not as published posts. No card links anywhere until the route exists, and no
 * read-time is shown for a piece nobody has written: an invented attribute of a
 * non-existent asset is the same lie as an invented number. These move to the
 * `Post` content type in PRD §10.1 the moment Sanity lands.
 */
const posts: { slug: string; tag: string; title: string; hook: string }[] = [
  {
    slug: "proof-machine-one-case-study-a-month",
    tag: "Playbook",
    title: "One case study a month is 72 assets a year",
    hook: "Problem, what we built, the number that changed — then the same story becomes a reel, a carousel, a broadcast, an ad and a sales PDF.",
  },
  {
    slug: "founder-led-content-hindi-marathi",
    tag: "Distribution",
    title: "Nobody buys from a logo",
    hook: "Three short videos a week in Hindi and Marathi. The cheapest brand lever in India right now, and the one most technical founders avoid.",
  },
  {
    slug: "vertical-seo-for-indian-software-buyers",
    tag: "SEO",
    title: "Vertical SEO is slow, compounding and permanent",
    hook: "Nidhi software price india beats any generic term. Platform x industry x city — but each page needs a real FAQ set and a real screenshot or it gets penalised.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

export default function Social() {
  return (
    <>
      {/* ── §7.12 ───────────────────────────────────────────────────────── */}
      <section id="social" className="relative scroll-mt-24 py-24 lg:py-36">
        <div className="container-site">
          <SectionHead
            eyebrow="In their words"
            title={
              consented.length
                ? [
                    "Named, on the record,",
                    <span key="l1">
                      <span className="text-accent">with consent on file.</span>
                    </span>,
                  ]
                : [
                    "Client names appear here",
                    <span key="l2">
                      <span className="text-accent">when the consent form comes back.</span>
                    </span>,
                  ]
            }
            lead={
              consented.length
                ? "Every quote below is attributed to a real person at a real company who signed off on it in writing."
                : "Anonymous testimonials are worth zero, so we don't run them. Until quotes are signed off, here is the part you can verify yourself."
            }
          />

          {consented.length > 0 ? (
            <ul className="mt-14 grid gap-4 lg:grid-cols-3">
              {consented.map((t, i) => (
                <Reveal as="li" key={`${t.company}-${t.name}`} delay={i * 80} className="h-full">
                  <figure className="panel flex h-full flex-col p-6 sm:p-8">
                    <blockquote className="text-lead text-paper">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-auto flex items-center gap-3 border-t border-line pt-6">
                      {/* Photo slot — initials until the consented headshot is on file. */}
                      <span
                        aria-hidden
                        className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-deck-2 font-mono text-small text-mute"
                      >
                        {initials(t.name)}
                      </span>
                      <span>
                        <span className="block text-small font-medium text-paper">{t.name}</span>
                        <span className="block font-mono text-[0.6875rem] text-mute">
                          {t.role} · {t.company}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal className="mt-14">
              <div className="panel grid lg:grid-cols-12">
                {/* The standard */}
                <div className="border-b border-line p-6 sm:p-8 lg:col-span-7 lg:border-b-0 lg:border-r lg:p-12">
                  <p className="label flex items-center gap-2.5 text-mute">
                    <span className="size-1.5 rounded-full bg-signal blink" />
                    <span className="text-paper">Pending</span>
                    <span className="opacity-40">/</span>
                    <span>Written consent</span>
                  </p>

                  <h3 className="mt-6 text-d3 font-bold">This space is empty on purpose.</h3>
                  <p className="mt-5 text-mute">
                    A quote from &ldquo;a leading NBFC&rdquo; proves nothing, and a stock photo
                    beside it proves less. So nothing goes here until a named person at a named
                    company has signed off on the exact words.
                  </p>

                  <div className="mt-8 border border-line bg-ink p-6">
                    <p className="label text-accent">The standard we hold ourselves to</p>
                    <p className="mt-3 text-small text-paper">
                      No client logo, name or testimonial appears on this site without written
                      consent on file. That applies to the marketing team as much as to the
                      developers.
                    </p>
                  </div>

                  <p className="mt-6 font-mono text-[0.6875rem] leading-relaxed text-mute">
                    Planned: two video testimonials, four named case studies. They go live the week
                    the forms come back — not before.
                  </p>
                </div>

                {/* What is already checkable */}
                <div className="p-6 sm:p-8 lg:col-span-5 lg:p-12">
                  <p className="label text-mute">What you can check today</p>

                  <dl className="mt-8">
                    {checkable.map((c) => (
                      <div key={c.head} className="border-t border-line py-7 first:border-t-0 first:pt-0">
                        <dt>
                          <span className="block font-display text-stat font-bold text-paper">
                            <Counter value={c.value} suffix={c.suffix} />
                          </span>
                          <span className="label mt-3 block text-mute">{c.head}</span>
                        </dt>
                        <dd className="mt-2.5 font-mono text-[0.6875rem] text-mint">{c.note}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-8 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row lg:flex-col xl:flex-row">
                    <Button
                      drawer="whatsapp"
                      context="client reference call"
                      className="w-full sm:w-auto lg:w-full xl:w-auto"
                    >
                      Ask for a reference call
                    </Button>
                    <Button
                      variant="ghost"
                      href="/work"
                      className="w-full sm:w-auto lg:w-full xl:w-auto"
                    >
                      See the builds
                    </Button>
                  </div>
                  <p className="mt-5 text-small text-mute">
                    We will put you on a call with a client running the same platform. That is
                    harder to fake than a quote.
                  </p>
                </div>
              </div>
            </Reveal>
          )}

          {/* Production strip — deliberately not a logo wall (PRD §14: consent for logos). */}
          <div className="mt-14">
            <p className="label text-mute">Industries and platforms in production</p>
            <div className="relative mt-5 overflow-hidden py-1 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
              <div className="marquee-track flex w-max hover:[animation-play-state:paused]">
                {[0, 1].map((copy) => (
                  <ul
                    key={copy}
                    aria-hidden={copy === 1}
                    className="flex w-max shrink-0 items-center gap-3 pr-3"
                  >
                    {strip.map((s) => (
                      <li
                        key={`${copy}-${s.name}-${s.note}`}
                        className="flex shrink-0 items-center gap-2.5 border border-line bg-deck px-5 py-3"
                      >
                        <span
                          aria-hidden
                          className={
                            s.live
                              ? "size-1.5 shrink-0 rounded-full bg-mint"
                              : "size-1.5 shrink-0 rounded-full bg-mute/50"
                          }
                        />
                        <span className="whitespace-nowrap text-small text-paper">{s.name}</span>
                        <span className="whitespace-nowrap font-mono text-[0.625rem] uppercase tracking-[0.08em] text-mute">
                          {s.note}
                        </span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── §7.13 ───────────────────────────────────────────────────────── */}
      <section id="insights" className="relative scroll-mt-24 py-24 lg:py-36">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              t="Weekly"
              eyebrow="Insights"
              title={[
                "What we are doing to grow,",
                <span key="l1">
                  <span className="text-accent">written down.</span>
                </span>,
              ]}
              lead="Not thought leadership. The actual playbook we run on this company, published while we run it."
            />
            <Reveal delay={120}>
              <p className="label inline-flex min-h-12 items-center gap-2 text-mute">
                <span aria-hidden className="size-1.5 rounded-full bg-mute" />
                First three in progress
              </p>
            </Reveal>
          </div>

          <ul className="mt-14 grid gap-4 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal as="li" key={post.slug} delay={i * 70} className="h-full">
                {/* Dashed hairline, not a solid panel — the border itself says "not built yet". */}
                <article className="flex h-full flex-col border border-dashed border-line p-6 sm:p-8">
                  <p className="label text-mute">{post.tag}</p>
                  <h3 className="mt-5 text-d4 font-bold">{post.title}</h3>
                  <p className="mt-4 text-small text-mute">{post.hook}</p>
                  <div className="mt-auto flex items-center gap-2.5 border-t border-line pt-6 text-mute">
                    <span aria-hidden className="size-1.5 rounded-full bg-mute" />
                    <span className="font-mono text-[0.6875rem]">not published yet</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
