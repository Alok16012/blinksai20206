/**
 * Ad landing page variants.
 *
 * One variant per Google Ads ad group. The single biggest lever on a paid
 * landing page is message match: someone who searched "nidhi company
 * software", clicked an ad headlined "Nidhi Company Software", and lands
 * on a page headlined "Growth Engineering" bounces. The `h1` here is
 * deliberately close to the ad headline for that ad group.
 *
 * Keys double as the `?for=` value in the ad's final URL, e.g.
 *   https://www.blinksaiauto.com/get-started?for=nidhi
 */

export type LandingVariant = {
  /** Mirrors the pinned HEADLINE_1 of the matching responsive search ad. */
  h1: string;
  /** One line, concrete, no adjectives. */
  sub: string;
  /** What they get. Nouns, not benefits-speak. */
  gets: string[];
  /** The objection this buyer actually has, and the answer. */
  objection: { q: string; a: string };
  /** Time to live, straight from lib/content platform data. */
  deploy: string;
  /** Sent along with the WhatsApp message so the reply has context. */
  context: string;
  /** Deep link to the full product page for people who want more. */
  more?: string;
};

export const DEFAULT_VARIANT = "software";

export const VARIANTS: Record<string, LandingVariant> = {
  software: {
    h1: "Software that is already built",
    sub: "Eight platforms running in six industries. Configured for you in about two weeks, not rebuilt from zero over six months.",
    gets: [
      "A working system, not a slide deck",
      "Fixed price agreed before we start",
      "Written scope — what is in, what is out",
      "Your data migrated, not re-typed",
      "Training for the people who will actually use it",
      "One team for the software and the leads",
    ],
    objection: {
      q: "We have been quoted half this before.",
      a: "Usually by someone billing hourly against a scope that grows. Our price is fixed and the scope is written down before a rupee moves. If the scope changes, we tell you what it costs before we build it.",
    },
    deploy: "about 2 weeks",
    context: "your platforms",
    more: "/platforms",
  },

  nidhi: {
    h1: "Nidhi company software",
    sub: "Member KYC, savings, loans and auto passbook generation in one audit-ready system. Built for nidhi companies, credit co-ops and small NBFCs.",
    gets: [
      "Member KYC and onboarding",
      "Savings, RD, FD and loan accounts",
      "Passbook generation, automatically",
      "Interest posting and maturity handling",
      "Branch-wise books and audit trail",
      "Reports your auditor will accept",
    ],
    objection: {
      q: "Our auditor is particular. Will this survive an audit?",
      a: "Every transaction carries a timestamp, a user and a branch, and nothing can be edited after posting — only reversed with a reason. That trail is the whole point of the system.",
    },
    deploy: "2–3 weeks",
    context: "Blinks Nidhi",
    more: "/platforms/nidhi-nbfc-software",
  },

  realty: {
    h1: "Real estate CRM software",
    sub: "Interactive plot map, inventory blocking, site visits and broker CRM in one place. Buyers pick their own plot instead of waiting for a PDF.",
    gets: [
      "Interactive plot and unit map",
      "Live inventory with blocking and release",
      "Site visit scheduling and follow-up",
      "Broker and channel partner CRM",
      "Booking, payment schedule and dues",
      "Every enquiry assigned, none lost",
    ],
    objection: {
      q: "Our brokers will not use a new system.",
      a: "They get a phone screen with their leads and their commission, nothing else. The complicated part stays with your office team. If a broker will not open it, they were not updating your spreadsheet either.",
    },
    deploy: "about 2 weeks",
    context: "Blinks Realty",
    more: "/platforms/real-estate-crm",
  },

  campus: {
    h1: "Institute ERP software",
    sub: "One ERP with separate portals for admin, franchise, faculty and students. Fees, attendance, results and branch reporting from a single dashboard.",
    gets: [
      "Admission and student records",
      "Fees, receipts and dues tracking",
      "Attendance and timetable",
      "Exams, marks and result publishing",
      "Franchise and multi-branch reporting",
      "Separate logins for each kind of user",
    ],
    objection: {
      q: "We have three branches and none of them work the same way.",
      a: "That is the normal case, not the exception. Branch-level settings differ; the reporting on top stays common, which is the part head office actually needs.",
    },
    deploy: "about 3 weeks",
    context: "Blinks Campus",
    more: "/platforms/institute-franchise-erp",
  },

  admissions: {
    h1: "Admission CRM software",
    sub: "Lead capture, counsellor tasks, targets and automatic follow-up. Enquiries stop dying in a WhatsApp group.",
    gets: [
      "Every enquiry captured with its source",
      "Auto-assignment to the right counsellor",
      "Day 0, 1, 3, 7 follow-up sequences",
      "Counsellor targets and daily activity",
      "Call and WhatsApp logged against the lead",
      "Which source actually produced admissions",
    ],
    objection: {
      q: "Our counsellors already have a system they ignore.",
      a: "Usually because it asks for twenty fields before it gives anything back. This one opens on today's calls and the number they are chasing. Data entry is a by-product of doing the work.",
    },
    deploy: "about 2 weeks",
    context: "Blinks Admissions",
    more: "/platforms/education-crm",
  },

  travel: {
    h1: "Travel agency CRM",
    sub: "Itinerary builder, quotations, bookings and vendor ledger in one place. Quote a full itinerary in one sitting instead of rebuilding a Word file.",
    gets: [
      "Day-by-day itinerary builder",
      "Quotation with your own margins",
      "Booking, vouchers and confirmations",
      "Vendor ledger and payables",
      "Customer follow-up until they book",
      "Season-wise profitability, per package",
    ],
    objection: {
      q: "Every trip we sell is custom.",
      a: "The itinerary is custom; the components are not. Build the hotel, transfer and activity once, then assemble. That is where the sitting-time goes, and it is the part this removes.",
    },
    deploy: "about 2 weeks",
    context: "Blinks Travel",
    more: "/platforms/travel-agency-crm",
  },

  hrms: {
    h1: "HRMS and field workforce app",
    sub: "Geo-fenced mobile punch, leave, field inspection and one-click payroll export. Run a field workforce without a WhatsApp group.",
    gets: [
      "Mobile punch with GPS and geo-fence",
      "Shift, roster and duty allocation",
      "Field inspection with photo proof",
      "Leave, holidays and overtime",
      "Payroll export in one click",
      "Client-wise deployment and billing",
    ],
    objection: {
      q: "Our guards have basic phones and bad networks.",
      a: "The app captures offline and syncs when a signal appears — the punch is recorded at the time it happened, not the time it uploaded. For the phones that cannot run it at all, supervisors mark attendance for their site.",
    },
    deploy: "about 2 weeks",
    context: "Blinks Workforce",
    more: "/platforms/hrms-field-inspection",
  },

  whatsapp: {
    h1: "WhatsApp Business API setup",
    sub: "Official Meta Cloud API with green tick, chat flows and live agent handover. Enquiries get a reply in about four seconds, including at eleven at night.",
    gets: [
      "Official Cloud API, not a plugin",
      "Green tick verification applied for",
      "Chat flows that qualify before you talk",
      "Live agent handover, shared inbox",
      "Broadcast templates that stay approved",
      "Day 0, 1, 3, 7 follow-up sequences",
    ],
    objection: {
      q: "We tried a WhatsApp tool and the number got restricted.",
      a: "That is what unofficial tools and cold broadcasts do. This is the official Cloud API with opt-in recorded, templates pre-approved and sending paced. The rules that keep a number alive are the design, not an afterthought.",
    },
    deploy: "about 1 week",
    context: "WhatsApp automation",
    more: "/automate/whatsapp-automation",
  },

  voice: {
    h1: "AI voice agent and IVR",
    sub: "An AI agent that answers missed calls in Hindi or English, qualifies the caller, books the callback and logs it in your CRM.",
    gets: [
      "Answers every call you miss",
      "Speaks Hindi and English",
      "Qualifies before it reaches your team",
      "Books the callback into a calendar",
      "Full transcript against the lead",
      "Works at 11 PM and on Sundays",
    ],
    objection: {
      q: "Customers hate talking to robots.",
      a: "They hate a menu tree. They do not mind a straight question when the alternative is a phone that rings out. It also hands over to a human the moment someone asks — and tells them that up front.",
    },
    deploy: "about 1 week",
    context: "AI voice and IVR",
    more: "/automate/ai-voice-ivr",
  },

  build: {
    h1: "Custom software development",
    sub: "ERP, CRM, portals and mobile apps built around how your business actually runs. Fixed pricing with milestone billing.",
    gets: [
      "Discovery that produces a written scope",
      "Fixed price, billed at milestones",
      "Multi-role, multi-branch by default",
      "Android and iOS from the same team",
      "Handover with documentation",
      "Support after go-live, not just before",
    ],
    objection: {
      q: "Last agency disappeared halfway.",
      a: "Milestone billing is the protection. You pay for what has shipped, not for a promise, and each milestone is a working thing you can open. If we stop being useful, you stop paying and you keep the code.",
    },
    deploy: "from 6 weeks",
    context: "a custom build",
    more: "/build",
  },
};

export function resolveVariant(key: string | undefined): LandingVariant {
  if (key && key in VARIANTS) return VARIANTS[key];
  return VARIANTS[DEFAULT_VARIANT];
}
