import { NextResponse } from "next/server";

/**
 * Lead intake — Architecture doc §4.4.
 *
 * The contract that matters: respond instantly, do the slow work off the response.
 * Right now the "slow work" is a console line. Wiring it up means replacing the
 * `enqueue()` body with a BullMQ publish; nothing above it should need to change.
 *
 * Before this goes live it still needs (Architecture §7):
 *   · Turnstile / hCaptcha verification
 *   · per-IP and per-phone rate limits in Redis
 *   · OTP verification of the number before any outbound call
 *   · a row in `consents` storing the exact text shown, IP and timestamp
 */

type Lead = {
  kind: "call" | "details";
  name?: string;
  phone?: string;
  business?: string;
  need?: string;
  language?: string;
  consent?: string;
  context?: string;
  path?: string;
};

const PHONE = /^[+]?[\d\s-]{8,16}$/;

/**
 * Where a lead actually goes.
 *
 * Set LEAD_WEBHOOK_URL to an n8n / Make / Zapier / Google Apps Script
 * endpoint. Until BullMQ exists this is the whole delivery mechanism, and
 * without it a submission only ever reached a console line that nobody
 * reads — which meant paid traffic filling in the form and vanishing.
 */
const WEBHOOK = process.env.LEAD_WEBHOOK_URL;

async function enqueue(job: string, payload: unknown) {
  console.log(`[queue] ${job}`, payload);

  if (!WEBHOOK) {
    // Loud on purpose. A silent no-op here is indistinguishable from
    // working, and costs real ad spend before anyone notices.
    console.error(
      `[lead] LEAD_WEBHOOK_URL is not set — "${job}" was logged and dropped. ` +
        `This lead has reached nobody.`,
    );
    return;
  }

  try {
    const res = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ job, ...(payload as object) }),
      // The visitor is already waiting; never hang the response on a slow
      // third party. The caller does not await this anyway.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[lead] webhook ${res.status} for "${job}"`, await res.text());
    }
  } catch (err) {
    console.error(`[lead] webhook failed for "${job}"`, err);
  }
}

export async function POST(req: Request) {
  let body: Lead;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (!body.phone || !PHONE.test(body.phone.trim())) {
    return NextResponse.json({ error: "That phone number doesn't look right." }, { status: 422 });
  }
  if (body.kind === "call" && body.consent !== "on") {
    return NextResponse.json(
      { error: "We need consent before an automated call — it's a TRAI requirement." },
      { status: 422 },
    );
  }

  const lead = {
    ...body,
    receivedAt: new Date().toISOString(),
    // Multi-tenant from day one (Architecture §8) even with a single tenant.
    tenantId: "blinksai",
  };

  /* Deliberately not awaited — the contract above is "respond instantly,
     do the slow work off the response". waitUntil keeps the serverless
     function alive long enough for the webhook to finish after the
     response has already been sent. */
  const delivery = Promise.all([
    enqueue("lead.created", lead),
    body.kind === "call"
      ? enqueue("call.requested", { phone: body.phone, language: body.language })
      : Promise.resolve(),
  ]);

  const ctx = (globalThis as { waitUntil?: (p: Promise<unknown>) => void });
  if (typeof ctx.waitUntil === "function") ctx.waitUntil(delivery);
  else await delivery;

  return NextResponse.json({ ok: true }, { status: 200 });
}
