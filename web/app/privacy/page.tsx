import type { Metadata } from "next";
import { Eyebrow, Lines, Reveal } from "@/components/ui";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How BlinksAI collects, uses and stores the information you send through this site — and how to have it deleted. Contact ${site.email}.`,
  alternates: { canonical: "/privacy" },
};

/* Kept deliberately narrow: it describes the lead form in app/api/lead/route.ts and
   nothing else. When analytics, a pixel or a CRM are actually wired up, they belong
   here before they ship — a policy that promises less than the code does is the one
   kind of inaccuracy that matters legally. */
const UPDATED = "9 August 2026";

type Section = { h: string; p: (string | string[])[] };

const sections: Section[] = [
  {
    h: "Who this covers",
    p: [
      `${site.name} ("we") operates this website and the software and marketing services described on it. This policy explains what happens to information you send us through this site, and applies to that site and the enquiry forms on it.`,
    ],
  },
  {
    h: "What we collect",
    p: [
      "Only what you type into an enquiry form, plus what any web server records automatically:",
      [
        "Your name, phone number, and — if you fill them in — your business name, what you need, and your preferred language.",
        "Whether you ticked the consent box for an automated call, along with the time you submitted the form.",
        "Standard server and hosting logs (IP address, browser type, pages requested), kept by our hosting provider for security and diagnostics.",
      ],
      "We do not ask for payment card details, government ID, or any sensitive personal data through this website.",
    ],
  },
  {
    h: "Why we use it",
    p: [
      "To reply to your enquiry — by WhatsApp, phone, or email — and to prepare a quote if you ask for one. We do not sell your information, and we do not share it with anyone for their own marketing.",
    ],
  },
  {
    h: "Automated calls and WhatsApp",
    p: [
      "An automated call is only placed if you tick the consent box. That consent is recorded with the exact wording shown to you. You can withdraw it at any time by replying STOP on WhatsApp or telling us on a call, and we will stop contacting you.",
      "Outbound calls are made only between 09:00 and 21:00 IST, and numbers are checked against the DND registry, as required by TRAI's commercial-communication rules.",
    ],
  },
  {
    h: "Who else sees it",
    p: [
      "Only the service providers we need to actually deliver the service — our website host, our WhatsApp and telephony providers, and our email provider. They process the data on our instructions and for no other purpose.",
      "We disclose information beyond that only when the law requires it.",
    ],
  },
  {
    h: "Advertising",
    p: [
      "If you reached us by clicking one of our advertisements on Facebook or Instagram, Meta may have recorded that click under its own privacy policy, which we do not control. When such an ad opens a WhatsApp chat, the conversation is governed by WhatsApp's own terms in addition to this policy.",
    ],
  },
  {
    h: "How long we keep it",
    p: [
      "Enquiries are kept for as long as we are in conversation with you, and for up to two years afterwards so we can pick up where we left off. Ask us to delete them sooner and we will.",
    ],
  },
  {
    h: "Your rights",
    p: [
      "Under India's Digital Personal Data Protection Act, 2023, you can ask us to show you the information we hold about you, correct it if it is wrong, or delete it. Write to us and we will respond within 30 days. There is no charge.",
    ],
  },
  {
    h: "Children",
    p: [
      "This site and these services are meant for businesses. We do not knowingly collect information from anyone under 18.",
    ],
  },
  {
    h: "Changes",
    p: [
      "If this policy changes, the revised version appears on this page with a new date at the top. Material changes will be communicated to anyone we are in active conversation with.",
    ],
  },
  {
    h: "Contact us",
    p: [
      `Questions about this policy, or a request to see or delete your data — email ${site.email} or call ${site.phone}. We are based in ${site.city}, India.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="band-dark">
        <section className="relative overflow-hidden pb-20 pt-32 sm:pt-36 lg:pb-24 lg:pt-44">
          <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-60" />
          <div className="container-site relative">
            <Reveal>
              <Eyebrow t="Legal">Privacy</Eyebrow>
            </Reveal>

            <Lines
              as="h1"
              delay={60}
              className="mt-8 max-w-4xl text-d1 font-bold"
              lines={["Privacy Policy"]}
            />

            <Reveal delay={220}>
              <p className="mt-10 max-w-2xl text-lead text-mute">
                What we collect, why we collect it, and how to make us delete it. Short, because we
                collect very little.
              </p>
            </Reveal>

            <Reveal delay={280}>
              <p className="mt-6 text-sm text-mute">Last updated {UPDATED}</p>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ── Policy ───────────────────────────────────────────────────────── */}
      <div className="band-light">
        <section className="py-24 lg:py-32">
          <div className="container-site">
            <div className="max-w-3xl">
              {sections.map((section, i) => (
                <Reveal key={section.h} delay={i * 40}>
                  <div className="mt-14 first:mt-0">
                    <h2 className="text-2xl font-bold sm:text-3xl">{section.h}</h2>
                    {section.p.map((block, j) =>
                      Array.isArray(block) ? (
                        <ul key={j} className="mt-4 space-y-3 pl-5">
                          {block.map((item) => (
                            <li key={item} className="list-disc text-lead text-mute">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p key={j} className="mt-4 text-lead text-mute">
                          {block}
                        </p>
                      ),
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
