"use client";

import clsx from "clsx";
import { useState } from "react";
import { site } from "@/lib/content";
import { reportConversion } from "@/lib/gtag";

/**
 * Inline lead capture for the ad landing page.
 *
 * Deliberately not the global drawer. On a paid page the form has to be
 * visible without a click — every extra tap between the ad and the field
 * costs conversions, and the drawer costs one before anything is even
 * asked. Three fields, because a fourth reliably loses more leads than
 * the extra information is worth.
 */

const well =
  "min-h-12 w-full border border-line bg-ink px-4 text-[0.9375rem] text-paper placeholder:text-mute focus:border-signal focus:outline-none";

export default function LeadForm({ context }: { context: string }) {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    `Hi BlinksAI — I'm looking at ${context}.`,
  )}`;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...data,
          kind: "details",
          context,
          path: location.pathname + location.search,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something broke. WhatsApp us instead?");
      }
      /* Only after a 2xx — see the same rule in ConversationDrawer. */
      reportConversion("formSubmit", { value: 800, currency: "INR" });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something broke.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="border border-mint/40 bg-mint/5 p-6 sm:p-8">
        <span className="grid size-12 place-items-center border border-mint bg-mint/10 text-mint">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path
              d="M4 11.5l5 5L18 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h3 className="mt-5 text-d4">Got it — check WhatsApp</h3>
        <p className="mt-2 text-mute">
          A message is on its way, usually inside a few seconds. If it is late, message
          us directly and we will pick it up from there.
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="label mt-5 inline-flex min-h-12 items-center gap-2 border border-line px-5 text-paper transition-colors hover:border-signal hover:text-accent"
        >
          Open WhatsApp now
        </a>
      </div>
    );
  }

  return (
    <div className="border border-line bg-deck p-5 sm:p-7">
      <p className="label flex items-center gap-2 text-mute">
        <span className="size-1.5 rounded-full bg-mint blink" />
        Usually replies in seconds
      </p>
      <h2 className="mt-3 text-d4">Tell us what you run</h2>
      <p className="mt-2 text-small text-mute">
        Three fields. We reply on WhatsApp with a straight answer, not a brochure.
      </p>

      <form className="mt-5 space-y-3.5" onSubmit={onSubmit}>
        <div>
          <label htmlFor="lp-name" className="label mb-2 block text-mute">
            Name <span className="text-accent">*</span>
          </label>
          <input id="lp-name" name="name" required placeholder="Your name" className={well} />
        </div>
        <div>
          <label htmlFor="lp-phone" className="label mb-2 block text-mute">
            WhatsApp number <span className="text-accent">*</span>
          </label>
          <input
            id="lp-phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 "
            className={well}
          />
        </div>
        <div>
          <label htmlFor="lp-business" className="label mb-2 block text-mute">
            What do you run?
          </label>
          <input
            id="lp-business"
            name="business"
            placeholder="Nidhi, institute, agency, builder…"
            className={well}
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className={clsx(
            "label flex min-h-13 w-full items-center justify-center gap-2 bg-signal text-carbon transition-colors",
            "hover:bg-paper hover:text-ink active:translate-y-px",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-signal disabled:hover:text-carbon",
          )}
        >
          {busy ? "Sending…" : "Get a fixed quote"}
        </button>

        {error && (
          <p role="alert" className="border border-alert/40 bg-alert/10 p-3 text-small text-alert">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-mute">
            or
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="label flex min-h-12 items-center justify-center border border-line text-paper transition-colors hover:border-signal hover:text-accent"
          >
            WhatsApp
          </a>
          {/* No onClick. The delegated listener in components/site/Analytics
              already reports every tel: and wa.me click on the page — adding
              one here counted the same call twice. */}
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="label flex min-h-12 items-center justify-center border border-line text-paper transition-colors hover:border-signal hover:text-accent"
          >
            Call now
          </a>
        </div>

        <p className="pt-1 font-mono text-[0.625rem] leading-relaxed text-mute">
          We use this only to reply to you. Deletable on request (India DPDP Act).
        </p>
      </form>
    </div>
  );
}
