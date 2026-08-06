"use client";

import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { SectionHead, Reveal, Tilt } from "@/components/ui";
import { useSite } from "@/lib/store";

const LANGS = ["English", "हिंदी", "मराठी"];

/**
 * §7.6 — the section no competitor can copy without building the same stack.
 * The AI-call form is deliberately inline rather than in the drawer: the whole
 * point is that using the product takes one field, not a funnel.
 *
 * This is the violet section, but violet is asserted with hard edges — a violet plate
 * rule on the featured panel, violet chips, violet focus — not with an ambient glow.
 * The section sets no background of its own; the band comes from the wrapper.
 */
export default function Automation() {
  const openDrawer = useSite((s) => s.openDrawer);
  const [phone, setPhone] = useState("");
  const [lang, setLang] = useState(LANGS[0]);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function callMe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("busy");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "call",
          phone,
          language: lang,
          consent: consent ? "on" : "",
          context: "the AI voice demo",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Couldn't queue the call.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Couldn't queue the call.");
    }
  }

  return (
    <section id="automate" className="relative scroll-mt-24 py-24 lg:py-36">
      <div className="container-site">
        <SectionHead
          t="T+30s"
          eyebrow="Automation"
          accent="violet"
          title={[
            "Don't take our word for it.",
            <span key="l2" className="text-violet">
              Let it call you.
            </span>,
          ]}
          lead="This website runs on the same WhatsApp and AI-voice stack we sell. Every claim below is testable in the next thirty seconds."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-5">
          {/* AI voice — the featured demo */}
          <Reveal className="lg:col-span-3">
            {/* Per-side borders rather than `panel`, so the violet plate rule on top
                never has to out-order a `border` shorthand. */}
            <div className="noise relative flex h-full flex-col border-x border-b border-line border-t-2 border-t-violet bg-deck p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="label flex items-center gap-2 text-violet">
                    <span className="size-1.5 rounded-full bg-violet blink" />
                    AI voice agent
                  </p>
                  <h3 className="mt-4 text-d3">It calls you in 30 seconds.</h3>
                  <p className="mt-4 max-w-md text-mute">
                    Speech → Claude → speech, answering in under a second. It qualifies the enquiry,
                    books a slot, and hands over to a human the moment you ask.
                  </p>
                </div>
                <Waveform />
              </div>

              {status === "done" ? (
                <div className="mt-8 border border-mint bg-ink p-6">
                  <p className="label text-mint">Queued</p>
                  <p className="mt-3 text-paper">Your phone should ring shortly.</p>
                  <p className="mt-4 font-mono text-[0.6875rem] text-mute">
                    T+0s request · T+30s call · recorded with disclosure · one call per number / 24h
                  </p>
                </div>
              ) : (
                <form onSubmit={callMe} className="mt-8 space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="tel"
                      required
                      placeholder="+91 00000 00000"
                      aria-label="Your phone number"
                      className="min-h-13 flex-1 border border-line bg-ink px-5 text-[0.9375rem] placeholder:text-mute focus:border-violet focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!consent || status === "busy"}
                      /* Amber is the only CTA fill on the site. text-carbon is fixed —
                         text-ink would flip to white on amber in a light band. */
                      className="label min-h-13 bg-signal px-7 text-carbon transition-colors hover:bg-paper hover:text-ink active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-signal disabled:hover:text-carbon"
                    >
                      {status === "busy" ? "Dialling…" : "Call me"}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="label text-mute">In</span>
                    {LANGS.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLang(l)}
                        className={clsx(
                          "min-h-9 border px-4 text-small font-deva transition-colors",
                          lang === l
                            ? "border-violet bg-violet/10 text-violet"
                            : "border-line text-mute hover:border-paper hover:text-paper",
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>

                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 size-4 shrink-0 accent-[color:var(--color-violet)]"
                    />
                    <span className="text-[0.8125rem] leading-snug text-mute">
                      I consent to one automated call, 09:00–21:00 IST, recorded with disclosure.
                      DND-scrubbed, one call per number per 24 hours, opt-out any time.
                    </span>
                  </label>

                  {status === "error" && (
                    <p role="alert" className="text-small text-alert">
                      {msg}
                    </p>
                  )}
                </form>
              )}
            </div>
          </Reveal>

          {/* WhatsApp */}
          <Reveal delay={80} className="lg:col-span-2">
            <Tilt className="h-full">
              <div className="panel flex h-full flex-col p-6 sm:p-8">
                <p className="label flex items-center gap-2 text-mint">
                  <span className="size-1.5 rounded-full bg-mint blink" />
                  WhatsApp bot
                </p>
                <h3 className="mt-4 text-d4">Ask it about pricing.</h3>
                <p className="mt-3 text-small text-mute">
                  Official Cloud API, approved templates, opt-in first. It replies in about four
                  seconds — including at 11 PM.
                </p>

                <ChatPreview />

                <button
                  onClick={() => openDrawer("whatsapp", "WhatsApp automation")}
                  className="label mt-auto flex min-h-12 items-center justify-center bg-signal text-carbon transition-colors hover:bg-paper hover:text-ink"
                >
                  Start chat
                </button>
              </div>
            </Tilt>
          </Reveal>

          {/* Social + workflow */}
          {[
            {
              title: "Social autopilot",
              line: "30 days of posts, made, scheduled and answered. Instagram DMs hand off to WhatsApp automatically.",
              href: "/automate/social-media-automation",
              meta: "IG · FB · LinkedIn · GBP",
            },
            {
              title: "Workflow automation",
              line: "Lead → routing → CRM → quotation → follow-up → payment reminder. Zero human touch until it matters.",
              href: "/automate/workflow-automation",
              meta: "n8n · CRM · billing",
            },
          ].map((c, i) => (
            <Reveal
              key={c.title}
              delay={140 + i * 60}
              className={i === 0 ? "lg:col-span-3" : "lg:col-span-2"}
            >
              <Tilt className="h-full">
                <Link
                  href={c.href}
                  className="group flex h-full flex-col border border-line bg-deck p-6 transition-colors hover:border-signal"
                >
                  <p className="label text-accent">{c.title}</p>
                  <p className="mt-4 mb-6 text-mute">{c.line}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-5">
                    <span className="font-mono text-[0.6875rem] text-mute">{c.meta}</span>
                    <span className="text-accent transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Waveform() {
  return (
    <div className="hidden shrink-0 items-end gap-1 sm:flex" aria-hidden>
      {[10, 22, 16, 30, 20, 36, 14, 26, 12].map((h, i) => (
        <span
          key={i}
          className="w-1 bg-violet"
          style={{
            height: h,
            animation: `drift ${900 + i * 130}ms ease-in-out ${i * 60}ms infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Square bubbles — alignment and the mint edge carry the who-said-what, which is what
 * the rounded corners were doing before.
 */
function ChatPreview() {
  return (
    <div className="my-6 space-y-2.5" aria-hidden>
      <div className="ml-auto max-w-[85%] bg-deck-2 px-3.5 py-2.5 text-small">
        What does the nidhi software cost?
      </div>
      <div className="max-w-[85%] border-l-2 border-l-mint bg-mint/10 px-3.5 py-2.5 text-small">
        Setup from ₹1.5L + monthly per branch. Want the module list or a 20-min walkthrough?
      </div>
      <p className="pl-1 font-mono text-[0.625rem] text-mute">replied in 4s · sample</p>
    </div>
  );
}
