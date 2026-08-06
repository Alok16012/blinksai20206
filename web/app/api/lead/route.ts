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

function enqueue(job: string, payload: unknown) {
  // TODO: BullMQ → n8n → WhatsApp Cloud API / Exotel. See Architecture §4.1.
  console.log(`[queue] ${job}`, payload);
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

  enqueue("lead.created", lead);
  if (body.kind === "call") enqueue("call.requested", { phone: body.phone, language: body.language });

  return NextResponse.json({ ok: true }, { status: 200 });
}
