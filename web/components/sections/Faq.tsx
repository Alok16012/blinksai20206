"use client";

import clsx from "clsx";
import { useState } from "react";
import { faqs } from "@/lib/content";
import { Button, Reveal, SectionHead } from "@/components/ui";

/**
 * §7.14 — the ten objections that actually stall a deal, answered before they're asked.
 * Copy lives in lib/content.ts; the FAQPage schema (§12) is derived from that same array so
 * the answer a crawler reads can never drift from the answer a human reads.
 */

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Faq() {
  /* One open at a time — the first by default, so the panel is never a wall of closed rows. */
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative scroll-mt-24 py-24 lg:py-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-20">
          {/* Left rail — stays with you while you read down the list */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              t="Week 0"
              eyebrow="Objections"
              title={[
                "The questions people ask",
                <span key="l1">
                  <span className="text-accent">before they sign.</span>
                </span>,
              ]}
              lead="Answered here rather than on a call, because you should be able to disqualify us at 1 AM without talking to anyone."
            />

            <Reveal delay={180}>
              <div className="panel mt-10 p-6">
                <p className="label text-mute">Still not answered?</p>
                <p className="mt-3 text-small text-mute">
                  Ask it directly. A person replies — usually within a few working hours.
                </p>
                <Button
                  variant="ghost"
                  drawer="whatsapp"
                  context="a question from the FAQ"
                  className="mt-5 w-full sm:w-auto"
                >
                  Ask on WhatsApp
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Accordion — full-width hairline bars, no card */}
          <ul className="border-t border-line">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal as="li" key={f.q} delay={Math.min(i, 6) * 70} className="border-b border-line">
                  <h3>
                    <button
                      id={`faq-q-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="group flex min-h-12 w-full items-start gap-5 py-7 text-left"
                    >
                      <span
                        aria-hidden
                        className={clsx(
                          "w-8 shrink-0 pt-0.5 font-mono text-[1.0625rem] leading-none tabular-nums transition-colors duration-300",
                          isOpen ? "text-accent" : "text-mute",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={clsx(
                          "flex-1 font-display text-d4 font-bold transition-colors duration-300",
                          isOpen ? "text-accent" : "text-paper",
                        )}
                      >
                        {f.q}
                      </span>

                      {/* + becomes − : the vertical stroke collapses. */}
                      <span
                        aria-hidden
                        className={clsx(
                          "relative mt-1.5 size-4 shrink-0 transition-colors duration-300",
                          isOpen ? "text-accent" : "text-mute",
                        )}
                      >
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                        <span
                          className={clsx(
                            "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-400 ease-[var(--ease-reveal)]",
                            isOpen ? "scale-y-0" : "scale-y-100",
                          )}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    aria-hidden={!isOpen}
                    className={clsx(
                      "grid transition-[grid-template-rows] duration-400 ease-[var(--ease-reveal)]",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[62ch] pb-8 pl-[3.25rem] text-body text-mute">{f.a}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
