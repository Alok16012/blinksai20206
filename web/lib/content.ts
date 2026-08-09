/**
 * Single content source for the site.
 *
 * Shapes mirror the CMS content types in `01-BlinksAI-Website-PRD.md` §10.1 so this
 * file can be swapped for a Sanity/Payload fetch without touching a component.
 *
 * Content rule from PRD §7.8: every number here must be traceable to a client and a
 * date. Anything not verifiable is marked `unverified: true` and rendered as "sample".
 */

export type Pillar = "build" | "automate" | "market" | "measure" | "improve";

/* ── Global ─────────────────────────────────────────────────────────────── */

/**
 * Canonical origin, single source of truth.
 *
 * The live site is blinksaiauto.com. Four files previously hardcoded
 * blinksai.com, which sent every canonical URL, the sitemap, robots.txt
 * and the OG image to a domain that does not serve the site.
 */
export const SITE_URL = "https://www.blinksaiauto.com";

export const site = {
  name: "BlinksAI",
  tagline: "We build the software. Then we fill it with customers.",
  sub: "Software, automation and marketing from one team — 8 platforms shipped, 42 clients, 6 industries. From the first line of code to the first customer.",
  category: "Growth Engineering",
  /** Owner and founder. The specs were drafted with a different name; this is correct. */
  founder: "Alok Kumar",
  /** wa.me format: country code, no "+" and no spaces. */
  whatsapp: "919229961418",
  phone: "+91 92299 61418",
  email: "info@blinksaiauto.com",
  city: "Nashik, Maharashtra",
  lastDeploy: "3 days ago",
};

export const stats = [
  { value: 50, suffix: "+", label: "projects delivered" },
  { value: 42, suffix: "", label: "clients" },
  { value: 150, suffix: "+", label: "features shipped" },
  { value: 3, suffix: "", label: "mobile apps" },
];

/* ── §7.3 Self-identification ───────────────────────────────────────────── */

export type PathKey = "build" | "grow" | "automate" | "all";

export const paths: {
  key: PathKey;
  need: string;
  detail: string;
  services: string;
  accent: "signal" | "violet" | "mint";
}[] = [
  {
    key: "build",
    need: "a system built",
    detail: "HRMS, CRM, ERP, portals, apps",
    services: "8 platforms ready to configure",
    accent: "signal",
  },
  {
    key: "grow",
    need: "more customers",
    detail: "Meta & Google ads, creative, video",
    services: "Traced to revenue, not impressions",
    accent: "mint",
  },
  {
    key: "automate",
    need: "my follow‑up automated",
    detail: "WhatsApp, AI voice, social, workflow",
    services: "Answers in 4 seconds, at 11 PM",
    accent: "violet",
  },
  {
    key: "all",
    need: "all of it",
    detail: "The full Blinks Loop",
    services: "Build → Automate → Market → Measure",
    accent: "signal",
  },
];

/* ── §7.4 The Blinks Loop ───────────────────────────────────────────────── */

export const loopStages: {
  key: Pillar;
  t: string;
  label: string;
  headline: string;
  body: string;
  proof: string;
  href: string;
}[] = [
  {
    key: "build",
    t: "T+0",
    label: "Build",
    headline: "Platforms deep enough to run the whole business",
    body: "Custom platforms, apps and portals. Eight already shipped and running in production — so most projects start at 70% built, not zero.",
    proof: "Growus Auto — 27 modules, live",
    href: "/build",
  },
  {
    key: "automate",
    t: "T+4s",
    label: "Automate",
    headline: "It answers before you wake up",
    body: "WhatsApp Cloud API, AI voice agents in Hindi and Marathi, workflow automation. Every enquiry gets a reply in seconds, every hour of the day.",
    proof: "Auto-passbook triggers · WhatsApp in 4s",
    href: "/automate",
  },
  {
    key: "market",
    t: "Week 5",
    label: "Market",
    headline: "Then we fill it",
    body: "Meta and Google Ads, creative, video, SEO. The same team that built the system runs the campaigns into it — no handover, no blame.",
    proof: "Click-to-WhatsApp with real attribution",
    href: "/grow",
  },
  {
    key: "measure",
    t: "Monthly",
    label: "Measure",
    headline: "Every rupee traced to a result",
    body: "Server-side conversions, ROAS dashboards, call and lead attribution. Closed deals get uploaded back to Meta and Google so the ads learn from buyers, not form-fillers.",
    proof: "Lead → call → proposal → closed, by source",
    href: "/grow",
  },
  {
    key: "improve",
    t: "Ongoing",
    label: "Improve",
    headline: "The loop compounds",
    body: "What we learn in Measure changes what we Build. That is the whole point of running one system instead of hiring three vendors.",
    proof: "20–40% CPL improvement in 6–8 weeks",
    href: "/work",
  },
];

/* ── §7.5 Platforms ─────────────────────────────────────────────────────── */

/**
 * Screenshots are drop-in — no developer required.
 *
 * Convention: a platform's screenshot lives at `/platforms/{slug}.webp`, i.e. the file
 * `web/public/platforms/nidhi-nbfc-software.webp` for slug `nidhi-nbfc-software`.
 * Drop the file in, add two lines to that platform's entry below, and the homepage
 * rail, the /platforms grid and the /platforms/{slug} page all switch from placeholder
 * to image at once:
 *
 *     shot: "/platforms/nidhi-nbfc-software.webp",
 *     shotAlt: "Member passbook screen showing an auto-generated deposit entry",
 *
 * Extra screens are optional and follow the same folder:
 *
 *     gallery: ["/platforms/nidhi-nbfc-software-2.webp", "..."],
 *
 * `web/public/platforms/README.md` is the owner-facing version of these instructions,
 * including the exact filename every platform expects.
 *
 * All three fields are deliberately UNSET on every platform right now. A path pointing
 * at a file that does not exist renders a broken frame, which is worse than the honest
 * placeholder the components fall back to. And per PRD §16 + §14 (content governance),
 * no capture goes in until the client has signed off on it and every piece of real
 * customer data in the frame has been masked.
 */
export type Platform = {
  slug: string;
  name: string;
  product: string;
  industry: string;
  headline: string;
  number: string;
  numberLabel: string;
  status: "live" | "in development";
  modules: string[];
  for: string;
  deploy: string;
  model: string;
  /** Hero/product screenshot at `/platforms/{slug}.webp` — 1600×1000, 16:10. */
  shot?: string;
  /** What the screenshot actually shows. Describe the screen, never the sales pitch. */
  shotAlt?: string;
  /** Optional extra screens, same folder, same size. Set `shot` first. */
  gallery?: string[];
};

export const platforms: Platform[] = [
  {
    slug: "hrms-field-inspection",
    name: "Growus Auto",
    product: "Blinks Workforce",
    industry: "HRMS + field inspection",
    headline: "Run a field workforce without a WhatsApp group",
    number: "27",
    numberLabel: "modules",
    status: "live",
    modules: [
      "Attendance & shifts",
      "Field inspection",
      "Payroll",
      "Leave & compliance",
      "Client sites",
      "Reports",
    ],
    for: "Security & facility agencies, contractors, field teams",
    deploy: "2 weeks",
    model: "Setup + ₹/employee/month",
  },
  {
    slug: "nidhi-nbfc-software",
    name: "Nidhi NBFC Bank",
    product: "Blinks Nidhi",
    industry: "FinTech / cooperative",
    headline: "The whole nidhi, from passbook to audit",
    number: "8",
    numberLabel: "core modules · auto passbook",
    status: "live",
    modules: [
      "Member & KYC",
      "Savings & RD/FD",
      "Loans & EMI",
      "Auto passbook",
      "Branch & cash",
      "Audit & reports",
    ],
    for: "Nidhi companies, credit co-ops, small NBFCs",
    deploy: "2–3 weeks",
    model: "Setup + ₹/month per branch",
  },
  {
    slug: "institute-franchise-erp",
    name: "Sengoleit",
    product: "Blinks Campus",
    industry: "EdTech / university + franchise",
    headline: "One ERP, four kinds of people using it",
    number: "4",
    numberLabel: "role portals",
    status: "live",
    modules: [
      "Admin portal",
      "Franchise portal",
      "Faculty portal",
      "Student portal",
      "Exams & results",
      "Fees",
    ],
    for: "Universities, institutes, franchise networks",
    deploy: "3 weeks",
    model: "Setup + ₹/student/year",
  },
  {
    slug: "education-crm",
    name: "DCW CRM",
    product: "Blinks Admissions",
    industry: "Education consultancy",
    headline: "Counsellors stop losing enquiries",
    number: "2",
    numberLabel: "apps — Android + iOS",
    status: "live",
    modules: [
      "Lead capture",
      "Counsellor tasks",
      "Targets & incentives",
      "Follow-up sequences",
      "Analytics",
    ],
    for: "Education consultancies, coaching chains",
    deploy: "2 weeks",
    model: "Setup + ₹/counsellor/month",
  },
  {
    slug: "real-estate-crm",
    name: "Mahesewari Group",
    product: "Blinks Realty",
    industry: "Real estate",
    headline: "Buyers pick the plot themselves",
    number: "1",
    numberLabel: "interactive plot map",
    status: "live",
    modules: [
      "Interactive plot map",
      "Inventory & blocking",
      "Site-visit booking",
      "Broker CRM",
      "Payment schedule",
    ],
    for: "Brokerages, developers",
    deploy: "2 weeks",
    model: "Setup + ₹/agent/month",
  },
  {
    slug: "travel-agency-crm",
    name: "Shera Travels",
    product: "Blinks Travel",
    industry: "Travel",
    headline: "Quote a full itinerary in one sitting",
    number: "1",
    numberLabel: "itinerary builder",
    status: "live",
    modules: [
      "Itinerary builder",
      "Quotation & margin",
      "Bookings",
      "Vendor ledger",
      "Enquiry inbox",
    ],
    for: "Travel agencies, tour operators",
    deploy: "2 weeks",
    model: "Setup + ₹/month",
  },
  {
    slug: "employee-management",
    name: "Falcon EMP",
    product: "Blinks Workforce Lite",
    industry: "HR",
    headline: "Punch in from the site, not the office",
    number: "1",
    numberLabel: "mobile punch",
    status: "live",
    modules: ["Mobile punch", "Geo-fencing", "Leave", "Payroll export", "Team reports"],
    for: "SMB teams with staff outside the office",
    deploy: "1 week",
    model: "Setup + ₹/employee/month",
  },
  {
    slug: "agri-distribution",
    name: "Soil",
    product: "Blinks Agri",
    industry: "Agriculture",
    headline: "Distribution that survives the season",
    number: "—",
    numberLabel: "in development",
    status: "in development",
    modules: ["Dealer network", "Orders", "Stock", "Credit & collection"],
    for: "Agri-input distributors and dealer networks",
    deploy: "TBD",
    model: "TBD",
  },
];

/* ── §7.6 Automation demos ──────────────────────────────────────────────── */

export const automations = [
  {
    key: "whatsapp",
    icon: "chat",
    title: "WhatsApp bot",
    line: "Ask it about pricing. It replies in seconds.",
    cta: "Start chat",
    accent: "mint" as const,
    href: "/automate/whatsapp-automation",
  },
  {
    key: "voice",
    icon: "phone",
    title: "AI voice agent",
    line: "Enter your number. It calls in 30 seconds, in हिंदी / मराठी / English.",
    cta: "Call me",
    accent: "violet" as const,
    href: "/automate/ai-voice-ivr",
  },
  {
    key: "social",
    icon: "calendar",
    title: "Social autopilot",
    line: "30 days of posts, made and scheduled for you.",
    cta: "See how",
    accent: "signal" as const,
    href: "/automate/social-media-automation",
  },
  {
    key: "workflow",
    icon: "gear",
    title: "Workflow automation",
    line: "Lead → CRM → follow-up with zero human touch.",
    cta: "See how",
    accent: "mint" as const,
    href: "/automate/workflow-automation",
  },
];

/* ── §7.7 Industries ────────────────────────────────────────────────────── */

export const industries = [
  { slug: "nidhi-finance", name: "Nidhi & Finance", pain: "Passbooks, audits, and branch cash — still on paper" },
  { slug: "education", name: "Education", pain: "Enquiries go cold before a counsellor calls back" },
  { slug: "real-estate", name: "Real Estate", pain: "Site visits booked on WhatsApp, lost in WhatsApp" },
  { slug: "travel", name: "Travel", pain: "40% of enquiries arrive after office hours" },
  { slug: "security-facility", name: "Security & Facility", pain: "Attendance across 30 client sites, by phone call" },
  { slug: "healthcare", name: "Healthcare", pain: "Missed calls are missed appointments" },
  { slug: "agriculture", name: "Agriculture", pain: "Dealer orders and credit tracked in a diary" },
];

/* ── §7.9 Process ───────────────────────────────────────────────────────── */

export const process = [
  { t: "T+0", title: "Discovery call", body: "20 minutes, free. We tell you if we're the wrong fit." },
  { t: "T+2 days", title: "Scope, fixed price, timeline", body: "Written. No hourly billing surprises." },
  { t: "Week 1–4", title: "Build sprints", body: "A working demo every week. You see it, not a status report." },
  { t: "Week 5", title: "Go live + automation on", body: "WhatsApp, IVR and follow-up switched on the same week." },
  { t: "Ongoing", title: "Marketing runs, numbers reviewed", body: "Monthly review against the numbers we agreed on." },
];

/* ── §7.10 Pricing ──────────────────────────────────────────────────────── */

export const pricing = [
  {
    model: "Platform licence",
    who: "You need a system that already exists",
    shape: ["Ready product + configuration", "Training + 3 months support", "Annual AMC"],
    band: "Setup from ₹1.5L + monthly",
    tier: "Start",
    featured: false,
  },
  {
    model: "Growth retainer",
    who: "You need customers and follow-up, monthly",
    shape: ["Ads + creative + video", "WhatsApp & IVR automation", "Monthly reporting against revenue"],
    band: "From ₹40k / month",
    tier: "Grow",
    featured: true,
  },
  {
    model: "Build project",
    who: "You need something that doesn't exist yet",
    shape: ["Fixed scope, fixed price", "Milestone billing", "Code and data are yours"],
    band: "From ₹4L, milestone-billed",
    tier: "Scale",
    featured: false,
  },
];

/* ── §7.14 FAQ ──────────────────────────────────────────────────────────── */

export const faqs = [
  {
    q: "What does it actually cost?",
    a: "Platform licences start around ₹1.5 lakh setup plus a monthly fee. Custom builds start around ₹4 lakh, billed by milestone. Growth retainers start at ₹40,000/month. We publish bands rather than a price list because scope genuinely changes the number — but you will have a fixed written price before any work starts.",
  },
  {
    q: "How long until it's live?",
    a: "If one of our 8 platforms fits, 2–3 weeks including configuration and training. A fully custom build is typically 6–10 weeks. We commit to a date in writing at the scope stage.",
  },
  {
    q: "Who owns the code and the data?",
    a: "You own your data, always, and you can export it at any time. For custom builds you own the code. For platform licences you licence the product and own everything you put into it.",
  },
  {
    q: "What happens if you disappear?",
    a: "Fair question — it's the most common thing that goes wrong with software vendors. Every project ships with documentation, a handover, and an AMC. We've been running the same 8 platforms in production for years; the client list and the support SLA are checkable before you sign.",
  },
  {
    q: "Is my data secure?",
    a: "TLS 1.3 in transit, encryption at rest, role-based access, audit logs on exports, daily backups with 30-day retention. We align to the India DPDP Act on consent, retention and deletion requests.",
  },
  {
    q: "We already have a developer. Can you still help?",
    a: "Yes. Plenty of clients keep their developer for the product and use us for automation and marketing — the WhatsApp, IVR and ads layer plugs into what you already have.",
  },
  {
    q: "Will the AI voice agent sound like a robot?",
    a: "Judge it yourself — enter your number in the automation section and it will call you in Hindi, Marathi or English. It answers in under a second, you can interrupt it, and 'connect me to a person' always works.",
  },
  {
    q: "Do you work outside Maharashtra?",
    a: "Yes. Clients across six industries and several states. Discovery and delivery run remotely; onsite training is arranged where it's needed.",
  },
  {
    q: "Is there a minimum contract?",
    a: "Growth retainers run on a 3-month initial term, because ad accounts need that long to produce a trustworthy number. Platform licences are annual. Build projects have no retainer commitment at all.",
  },
  {
    q: "Is WhatsApp automation compliant?",
    a: "We use the official WhatsApp Cloud API with approved templates and explicit opt-in, and outbound calls are DND-scrubbed and kept inside 9am–9pm per TRAI rules. Shortcuts here get your number blocked, so we don't take them.",
  },
];

/* ── §7.12 Testimonials ─────────────────────────────────────────────────── */
/* PRD §7.12: anonymous testimonials are worth zero. These stay empty until written
   consent is on file (PRD §14, content governance). The section renders a consent
   placeholder rather than inventing quotes. */

export type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
  consent: boolean;
};

export const testimonials: Testimonial[] = [];

/* ── Live Board sample events (PRD §6: clearly labelled sample) ─────────── */

export const sampleEvents: {
  lane: Pillar;
  label: string;
  meta: string;
  t: string;
}[] = [
  { lane: "market", label: "lead captured", meta: "Nashik · meta ads", t: "T+0s" },
  { lane: "automate", label: "whatsapp sent", meta: "auto · template", t: "T+4s" },
  { lane: "automate", label: "ai call answered", meta: "Marathi", t: "T+38s" },
  { lane: "measure", label: "lead qualified", meta: "score 82", t: "T+1m" },
  { lane: "measure", label: "demo booked", meta: "calendar", t: "T+2m" },
  { lane: "build", label: "scope shared", meta: "fixed price", t: "T+2d" },
  { lane: "market", label: "enquiry received", meta: "Pune · google", t: "T+0s" },
  { lane: "automate", label: "follow-up queued", meta: "D1 · D3 · D7", t: "T+6s" },
  { lane: "improve", label: "roas uploaded", meta: "meta capi", t: "T+3d" },
  { lane: "build", label: "platform live", meta: "week 3", t: "T+21d" },
];

/* ── Nav ────────────────────────────────────────────────────────────────── */

export const megaMenu: {
  pillar: string;
  blurb: string;
  stat: string;
  accent: "signal" | "violet" | "mint";
  links: { label: string; href: string; note: string }[];
}[] = [
  {
    pillar: "Build",
    blurb: "The system itself",
    stat: "8 platforms live",
    accent: "signal",
    links: [
      { label: "Custom software", href: "/build", note: "ERP, CRM, portals" },
      { label: "Mobile apps", href: "/build", note: "Android + iOS" },
      { label: "Web platforms", href: "/build", note: "Multi-role, multi-branch" },
      { label: "Ready platforms", href: "/platforms", note: "Configure in 2 weeks" },
    ],
  },
  {
    pillar: "Automate",
    blurb: "It answers while you sleep",
    stat: "4s first reply",
    accent: "violet",
    links: [
      { label: "WhatsApp automation", href: "/automate/whatsapp-automation", note: "Official Cloud API" },
      { label: "AI voice / IVR", href: "/automate/ai-voice-ivr", note: "हिंदी · मराठी · EN" },
      { label: "Social automation", href: "/automate/social-media-automation", note: "Post, reply, capture" },
      { label: "Workflow automation", href: "/automate/workflow-automation", note: "Lead → CRM → follow-up" },
    ],
  },
  {
    pillar: "Grow",
    blurb: "Then we fill it",
    stat: "Traced to closed deals",
    accent: "mint",
    links: [
      { label: "Meta Ads", href: "/grow", note: "Click-to-WhatsApp" },
      { label: "Google Ads", href: "/grow", note: "High-intent search" },
      { label: "Creative & video", href: "/grow", note: "Reels, ads, edits" },
      { label: "SEO & content", href: "/grow", note: "Compounding traffic" },
    ],
  },
];
