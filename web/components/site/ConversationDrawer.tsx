"use client";

import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useSite, type DrawerTab } from "@/lib/store";
import { site } from "@/lib/content";
import { reportConversion } from "@/lib/gtag";

const TABS: { key: DrawerTab; label: string; note: string }[] = [
  { key: "whatsapp", label: "WhatsApp", note: "Reply in ~4s" },
  { key: "call", label: "Call me", note: "AI calls in 30s" },
  { key: "details", label: "Send details", note: "4 fields" },
];

const LANGS = ["English", "हिंदी", "मराठी"];

/**
 * The one amber control. Square, mono-cased, and `text-carbon` rather than `text-ink`
 * so the label stays near-black on the fill whatever band is behind the drawer.
 */
const cta =
  "label flex min-h-13 w-full items-center justify-center gap-2 bg-signal text-carbon transition-colors hover:bg-paper hover:text-ink active:translate-y-px";

/** Recessed surface inside the drawer — inputs, previews, the consent box. */
const well = "border border-line bg-ink";

export default function ConversationDrawer() {
  const { drawerOpen, drawerTab, context, closeDrawer, setTab } = useSite();
  const [sent, setSent] = useState<null | "call" | "details">(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [lang, setLang] = useState(LANGS[0]);

  /* Reset on the way out rather than in an effect on the way in: the drawer is only ever
     re-opened from a closed state, and resetting here keeps the effect below purely about
     syncing the external system (scroll lock). */
  const close = useCallback(() => {
    setSent(null);
    setError("");
    closeDrawer();
  }, [closeDrawer]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    document.documentElement.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [drawerOpen]);

  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    context ? `Hi BlinksAI — I'm looking at ${context}.` : "Hi BlinksAI — I'd like to know more.",
  )}`;

  async function submit(kind: "call" | "details", form: HTMLFormElement) {
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, kind, context, path: location.pathname }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Something broke");
      /* Only on a 2xx. Firing on submit would count every failed and
         rate-limited attempt as a lead, and Google would optimise the
         campaign towards whatever produces broken submissions. */
      reportConversion(kind === "call" ? "demoBooked" : "formSubmit", {
        value: kind === "call" ? 1500 : 800,
        currency: "INR",
      });
      setSent(kind);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something broke. WhatsApp us instead?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Flat scrim, no blur. `carbon` is fixed, so the page dims the same amount
          whether the band underneath is near-black or white. */}
      <div
        onClick={close}
        className={clsx(
          "fixed inset-0 z-[100] bg-carbon/80 transition-opacity duration-400",
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Talk to BlinksAI"
        className={clsx(
          "fixed z-[101] transition-all duration-500 [transition-timing-function:var(--ease-reveal)]",
          "inset-x-0 bottom-0 max-h-[88vh] sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-[27rem]",
          drawerOpen
            ? "translate-y-0 opacity-100 sm:translate-x-0"
            : "pointer-events-none translate-y-full opacity-0 sm:translate-x-full sm:translate-y-0",
        )}
      >
        {/* `band-dark` is forced so every token inside resolves dark, no matter which
            band the drawer happens to be covering. */}
        <div className="band-dark noise relative flex h-full flex-col overflow-hidden border border-line bg-deck">
          <header className="relative flex items-start justify-between gap-4 border-b border-line p-5 sm:p-6">
            <div>
              <p className="label flex items-center gap-2 text-mute">
                <span className="size-1.5 rounded-full bg-mint blink" />
                Usually replies in seconds
              </p>
              <h2 className="mt-2 text-d4">Start a conversation</h2>
              {context && (
                <p className="mt-1 font-mono text-[0.6875rem] text-mute">context: {context}</p>
              )}
            </div>
            {/* One of the few legitimate circles — a round icon button. */}
            <button
              onClick={close}
              aria-label="Close"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-mute transition-colors hover:border-paper hover:text-paper"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div className="relative grid grid-cols-3 border-b border-line">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={clsx(
                  "border-r border-line px-2 py-3 text-center transition-colors duration-300 last:border-r-0",
                  drawerTab === t.key ? "bg-signal/10" : "hover:bg-deck-2",
                )}
              >
                <span
                  className={clsx(
                    "block text-small font-medium",
                    drawerTab === t.key ? "text-accent" : "text-paper",
                  )}
                >
                  {t.label}
                </span>
                <span className="mt-0.5 block font-mono text-[0.625rem] text-mute">{t.note}</span>
              </button>
            ))}
          </div>

          <div className="relative flex-1 overflow-y-auto p-5 sm:p-6">
            {sent ? (
              <Done kind={sent} onReset={() => setSent(null)} />
            ) : drawerTab === "whatsapp" ? (
              <div className="space-y-5">
                <p className="text-mute">
                  Opens WhatsApp with the page context already written in — so you don&apos;t have
                  to explain what you were looking at.
                </p>
                <div className={clsx(well, "p-4")}>
                  <p className="label mb-2 text-mute">Message preview</p>
                  <p className="font-mono text-small text-paper">
                    Hi BlinksAI — I&apos;m looking at {context || "your work"}.
                  </p>
                </div>
                <a href={waHref} target="_blank" rel="noopener noreferrer" className={cta}>
                  Open WhatsApp
                </a>
                <p className="font-mono text-[0.6875rem] text-mute">
                  Or call {site.phone} · 09:00–21:00 IST
                </p>
              </div>
            ) : drawerTab === "call" ? (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit("call", e.currentTarget);
                }}
              >
                <p className="text-mute">
                  Our AI voice agent calls you back and qualifies the enquiry — in your language.
                  Judge the product by using it.
                </p>
                <Field label="Phone number" name="phone" type="tel" placeholder="+91 " required />
                <div>
                  <p className="label mb-2 text-mute">Language</p>
                  <div className="grid grid-cols-3 gap-2">
                    {LANGS.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLang(l)}
                        className={clsx(
                          "min-h-11 border text-small font-deva transition-colors",
                          lang === l
                            ? "border-signal bg-signal/10 text-accent"
                            : "border-line text-mute hover:border-paper hover:text-paper",
                        )}
                      >
                        {l}
                      </button>
                    ))}
                    <input type="hidden" name="language" value={lang} />
                  </div>
                </div>

                {/* PRD §14 abuse control + TRAI consent */}
                <label className={clsx(well, "flex cursor-pointer items-start gap-3 p-3.5")}>
                  <input
                    type="checkbox"
                    name="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    className="mt-0.5 size-4 shrink-0 accent-[color:var(--color-signal)]"
                  />
                  <span className="text-[0.8125rem] leading-snug text-mute">
                    I agree to receive one automated call and a WhatsApp message from BlinksAI. Calls
                    are made 09:00–21:00 IST, one per number per 24 hours, and recorded with
                    disclosure.
                  </span>
                </label>

                <Submit busy={busy} disabled={!consent}>
                  Call me now
                </Submit>
                {error && <Err msg={error} />}
              </form>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit("details", e.currentTarget);
                }}
              >
                <Field label="Name" name="name" placeholder="Your name" required />
                <Field label="Phone" name="phone" type="tel" placeholder="+91 " required />
                <Field label="Business type" name="business" placeholder="Nidhi, institute, agency…" />
                <div>
                  <label htmlFor="need" className="label mb-2 block text-mute">
                    What do you need?
                  </label>
                  <textarea
                    id="need"
                    name="need"
                    rows={3}
                    placeholder="One or two lines is enough."
                    className={clsx(
                      well,
                      "w-full resize-none px-4 py-3 text-[0.9375rem] text-paper placeholder:text-mute focus:border-signal focus:outline-none",
                    )}
                  />
                </div>
                <Submit busy={busy}>Send details</Submit>
                {error && <Err msg={error} />}
                <p className="font-mono text-[0.625rem] leading-relaxed text-mute">
                  We use this only to reply to you. Stored per our privacy policy, deletable on
                  request (India DPDP Act).
                </p>
              </form>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="label mb-2 block text-mute">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={clsx(
          well,
          "min-h-12 w-full px-4 text-[0.9375rem] text-paper placeholder:text-mute focus:border-signal focus:outline-none",
        )}
      />
    </div>
  );
}

function Submit({
  children,
  busy,
  disabled,
}: {
  children: React.ReactNode;
  busy: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={busy || disabled}
      className={clsx(
        cta,
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-signal disabled:hover:text-carbon",
      )}
    >
      {busy ? "Sending…" : children}
    </button>
  );
}

function Err({ msg }: { msg: string }) {
  return (
    <p role="alert" className="border border-alert/40 bg-alert/10 p-3 text-small text-alert">
      {msg}
    </p>
  );
}

function Done({ kind, onReset }: { kind: "call" | "details"; onReset: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-10 text-center">
      <span className="grid size-14 place-items-center border border-mint bg-mint/10 text-mint">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
          <path d="M4 11.5l5 5L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h3 className="mt-5 text-d4">
        {kind === "call" ? "Calling you now" : "Got it — check WhatsApp"}
      </h3>
      <p className="mt-2 max-w-xs text-mute">
        {kind === "call"
          ? "Your phone should ring within 30 seconds. If it doesn't, WhatsApp us and we'll pick it up."
          : "A WhatsApp message with the next step is on its way — usually inside 5 seconds."}
      </p>
      <p className="mt-6 font-mono text-[0.6875rem] text-mute">
        T+0s received · T+4s WhatsApp · T+2 days scope
      </p>
      <button
        onClick={onReset}
        className="label mt-6 text-mute underline underline-offset-[6px] transition-colors hover:text-paper"
      >
        Send another
      </button>
    </div>
  );
}
