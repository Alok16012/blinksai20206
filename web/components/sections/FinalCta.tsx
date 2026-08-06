import QRCode from "qrcode";
import { process, site } from "@/lib/content";
import { Button, Eyebrow, Lines, Reveal } from "@/components/ui";

/**
 * §7.15 — Final CTA + booking.
 *
 * Split panel: left books the 20-minute audit, right moves a desktop visitor onto
 * their phone via WhatsApp. Nothing here claims a result; the only numbers are the
 * schedule from `process` and the reply time already stated elsewhere on the site.
 */

/** The wa.me target a scanned QR would resolve to. Bare — no prefilled text — so the
 *  printed link and the eventual encoded link are the same string. */
const waLink = `wa.me/${site.whatsapp}`;
const waHref = `https://${waLink}?text=${encodeURIComponent(
  "Hi BlinksAI — I'd like a 20-minute growth audit.",
)}`;

/** The four steps that follow directly from booking (T+0 → Week 5). */
const afterBooking = process.slice(0, 4);

/**
 * The QR is encoded on the server at build time — no runtime library in the client
 * bundle, no request to a third-party QR service (which would leak the WhatsApp number
 * and break an offline build). Black modules on a white quiet zone: maximum scanner
 * contrast, and a hard white rectangle is exactly the note the closing dark band wants.
 */
async function whatsappQr() {
  return QRCode.toString(waHref, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    color: { dark: "#111111", light: "#FFFFFFFF" },
  });
}

const reassurance = [
  { k: "Response time", v: "First reply on WhatsApp in about 4 seconds." },
  { k: "Working hours", v: "Automation answers 24/7. A person picks the thread up in hours." },
  { k: "No hard sell", v: "We tell you if we're the wrong fit." },
];

export default async function FinalCta() {
  const qrSvg = await whatsappQr();

  return (
    <section id="book" className="relative scroll-mt-24 overflow-hidden py-28 lg:py-44">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-60" />

      <div className="container-site relative">
        {/* Larger than SectionHead on purpose — last thing before the footer. */}
        <Reveal>
          <Eyebrow t="T+0">Start here</Eyebrow>
        </Reveal>

        <Lines as="h2" className="mt-7 max-w-5xl text-d1 font-bold" delay={70} lines={[
            "Twenty minutes.",
            <span key="l1" className="text-accent">
              Then you&apos;ll know if we&apos;re it.
            </span>,
          ]} />

        <Reveal delay={200}>
          <p className="mt-7 max-w-xl text-lead text-mute">
            Two ways in. Book the audit and follow the schedule below, or ask one question on
            WhatsApp and decide later.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {/* ── LEFT: book the audit ─────────────────────────────────────────── */}
          <Reveal className="lg:col-span-7">
            <div className="panel noise relative h-full p-6 sm:p-10">
              <p className="label flex items-center gap-2 text-accent">
                <span className="size-1.5 rounded-full bg-signal blink" />
                Growth audit
              </p>
              <h3 className="mt-5 text-d3 font-bold">Book a 20-minute growth audit</h3>
              <p className="mt-4 max-w-md text-mute">
                Free. You bring the problem, we bring the questions. You leave with a scope, a
                rough number, and a straight answer on whether we should be the ones building it.
              </p>

              {/*
                ┌── CALENDAR EMBED DROP-IN ────────────────────────────────────────┐
                │ The live booking widget mounts HERE, directly above the schedule │
                │ below — replace this comment, keep everything else.              │
                │                                                                  │
                │   Cal.com:  <script src="https://app.cal.com/embed/embed.js">    │
                │             loaded via next/script (strategy="lazyOnload"), then │
                │             <div data-cal-link="blinksai/growth-audit" />        │
                │   Google:   <iframe src={BOOKING_URL} loading="lazy"             │
                │             title="Book a 20-minute growth audit" />             │
                │             (BOOKING_URL from env — note `process` is shadowed    │
                │              in this module by the content import above.)         │
                │                                                                  │
                │ Whichever ships, keep the "Book the audit" button below as the   │
                │ no-JS / blocked-third-party fallback. It reaches the same inbox. │
                └──────────────────────────────────────────────────────────────────┘
              */}

              <p className="label mt-10 text-mute">What happens after you book</p>
              <ol className="mt-5">
                {afterBooking.map((step) => (
                  <li
                    key={step.t}
                    className="flex flex-col gap-1 border-t border-line py-5 sm:flex-row sm:gap-6"
                  >
                    <span className="label shrink-0 whitespace-nowrap pt-1 text-accent sm:w-24">
                      {step.t}
                    </span>
                    <div>
                      <p className="font-display text-d4 font-bold">{step.title}</p>
                      <p className="mt-1.5 text-small text-mute">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-10 border-t border-line pt-10">
                <Button
                  drawer="details"
                  context="a 20-minute growth audit"
                  className="w-full sm:w-auto"
                >
                  Book the audit
                </Button>
                <p className="mt-3 font-mono text-[0.6875rem] leading-relaxed text-mute">
                  Self-serve calendar booking isn&apos;t switched on yet. This sends four fields to
                  the same inbox and we come back with slots.
                </p>
              </div>
            </div>
          </Reveal>

          {/* ── RIGHT: WhatsApp ──────────────────────────────────────────────── */}
          <Reveal delay={70} className="lg:col-span-5">
            <div className="panel relative flex h-full flex-col p-6 sm:p-10">
              <p className="label text-mute">Or just WhatsApp us</p>
              <h3 className="mt-5 text-d4 font-bold">Skip the call. Ask one question.</h3>
              <p className="mt-4 text-small text-mute">
                Same team, same answers, no calendar. Ask what it costs, how long it takes, or
                whether we&apos;ve built for your industry.
              </p>
              <p className="mt-5 flex items-center gap-2 font-mono text-[0.75rem] text-mute">
                <span className="size-1.5 shrink-0 rounded-full bg-mint" />
                Replies in about 4 seconds — including at 11 PM
              </p>

              {/* QR tile — desktop only. PRD §7.15: the point is to move a desktop
                  visitor onto the phone where the WhatsApp relationship lives. */}
              <div className="mt-9 hidden sm:block">
                {/* Registration marks sit inside the tile's padding only — they never
                    overlap the code's quiet zone, so the scan stays clean. */}
                <div className="relative mx-auto aspect-square w-full max-w-[14.5rem] bg-white p-4">
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 size-4 border-l-2 border-t-2 border-signal"
                  />
                  <span
                    aria-hidden
                    className="absolute right-0 top-0 size-4 border-r-2 border-t-2 border-signal"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 size-4 border-b-2 border-l-2 border-signal"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-0 right-0 size-4 border-b-2 border-r-2 border-signal"
                  />
                  <div
                    role="img"
                    aria-label={`QR code linking to ${waLink}`}
                    className="size-full [&>svg]:size-full"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                </div>
                <p className="mt-4 text-center font-mono text-[0.6875rem] leading-relaxed text-mute">
                  Scan to open the chat · {waLink}
                </p>
              </div>

              <div className="mt-9 sm:mt-8">
                {/* Not <Button>: this leaves the site in a new tab, so it stays a plain
                    anchor. Geometry and type match the ghost variant. */}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 border border-line px-6 font-mono text-[0.75rem] font-medium uppercase tracking-[0.1em] text-paper transition-colors duration-200 hover:border-signal hover:text-accent sm:w-auto"
                >
                  Open WhatsApp
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </div>

              <p className="mt-auto pt-8 font-mono text-[0.6875rem] text-mute">
                {site.phone} · {site.email} · {site.city}
              </p>
            </div>
          </Reveal>
        </div>

        {/* ── Quiet reassurance row ───────────────────────────────────────────── */}
        <div className="hairline mt-16 grid gap-8 pt-10 sm:grid-cols-3">
          {reassurance.map((r, i) => (
            <Reveal key={r.k} delay={i * 70}>
              <p className="label text-mute">{r.k}</p>
              <p className="mt-3 text-small text-paper">{r.v}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
