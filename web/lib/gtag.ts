/**
 * Google Ads conversion tracking.
 *
 * Generated from the live account (5259578529) — do not hand-edit the labels.
 * They are public values (they ship in the page source), not secrets.
 *
 * Nothing here throws if gtag is missing: an ad blocker, a failed script
 * load, or SSR must never break a WhatsApp click.
 */

export const GOOGLE_ADS_ID = "AW-17057991512";

/** send_to values, one per conversion action in the Ads account. */
export const CONVERSIONS = {
  demoBooked: "AW-17057991512/M9fVCJv2vt4cENiW8cU_",
  formSubmit: "AW-17057991512/l_wzCJj2vt4cENiW8cU_",
  phoneClick: "AW-17057991512/SztvCJX2vt4cENiW8cU_",
  pricingView: "AW-17057991512/y3tQCJ72vt4cENiW8cU_",
  whatsappClick: "AW-17057991512/GA3rCJL2vt4cENiW8cU_",
} as const;

export type ConversionKey = keyof typeof CONVERSIONS;

type GtagFn = (
  command: string,
  action: string,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

/**
 * Report a conversion. Safe to call anywhere, including before the script
 * has loaded — gtag queues into dataLayer itself once the stub exists.
 */
export function reportConversion(
  key: ConversionKey,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: CONVERSIONS[key], ...params });
}

/**
 * Conversion + navigation in one. Google's own snippet does this: the
 * callback lets the beacon leave before the browser tears the page down,
 * with a timeout so a blocked request cannot strand the user.
 */
export function reportConversionThen(
  key: ConversionKey,
  navigate: () => void,
  timeoutMs = 900,
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    navigate();
    return;
  }
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    navigate();
  };
  window.gtag("event", "conversion", {
    send_to: CONVERSIONS[key],
    event_callback: go,
  });
  window.setTimeout(go, timeoutMs);
}
