# blinksai.com

The BlinksAI website, built from the three specs in the parent folder:

| Doc | What it governs here |
|---|---|
| `01-BlinksAI-Website-PRD.md` | Sections, copy, design tokens, motion rules, performance budgets |
| `02-BlinksAI-Technical-Architecture.md` | Stack choices, lead intake flow, capability gate, compliance |
| `03-BlinksAI-Growth-Strategy.md` | Positioning, product naming, pricing architecture |

Section numbers are cited in comments throughout the code (`§7.4`, `§9`, …) so a change
can always be traced back to the decision that caused it.

```bash
npm install
npm run dev
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · React Three Fiber + drei
· postprocessing · GSAP ScrollTrigger · Lenis · Zustand.

## Where things live

```
app/
  layout.tsx              fonts, Organization schema, nav/footer/drawer shell
  page.tsx                homepage — sections assembled, order delegated to Reorder
  api/lead/route.ts       lead intake (Architecture §4.4) — responds instantly, queues the rest
components/
  three/LiveBoard.tsx     §7.2 hero — the 3D operations console
  three/LoopEngine.tsx    §7.4 the scroll-driven Blinks Loop engine
  three/ModuleStack.tsx   the object inside a platform card — one tile per module group
  three/stacks.tsx        ONE shared WebGL context; every card is a drei <View> into it
  three/palette.ts        scene colours, dependency-free (see the perf note below)
  three/BoardFallback.tsx tier-3 fallback + the canvas's text alternative
  site/PlatformMedia.tsx  screenshot if one is cleared, 3D module stack if not
  site/Preloader.tsx      boot screen — overlay, never a gate; 2s hard cap; once per session
  sections/*              one file per homepage section, numbered to the PRD
  site/*                  nav, footer, conversation drawer, mobile bar, smooth scroll
lib/
  content.ts              ALL copy and data — shaped like the CMS types in PRD §10.1
  capability.ts           the WebGL capability gate
  store.ts                drawer state, path selection, active loop stage
```

## The visual system

**This supersedes PRD §6.** The spec called for an all-dark "Night Shift / Control Room"
look. The owner supplied <https://unitedcarriers.com> as the visual reference instead, and
chose it over §6 — so the site is now light/dark **banded**, not dark throughout.

Measured from the reference and applied here:

| | |
|---|---|
| Bands | Sections alternate `#111111` and `#ffffff` |
| Display type | ALL CAPS, weight 700, line-height ~0.92, up to 6.5rem |
| Radius | **0 everywhere.** The only curves are true circles — dots, round icon buttons |
| Accent | Amber `#FFB224` (the brand's, kept over the reference's `#FF5500`) |
| Stats | `text-stat`, up to 5.5rem |
| Cursor | A short amber trail, as the reference does |

**Bands are assigned by the container, never by the section.** `app/page.tsx` and
`components/site/Reorder.tsx` alternate them *by position*, so §7.3's re-ordering can
shuffle the page without ever putting two dark bands together. A section only reads
semantic tokens — `text-paper`, `text-mute`, `border-line`, `bg-deck`, `bg-ink` — which
are CSS variables the band sets. Adding `bg-ink` to a `<section>` breaks this; don't.

**`text-accent` is not `text-signal`.** Amber on white is 1.9:1 contrast, far below the
4.5:1 PRD §12 requires. `--color-accent` is band-aware: `#FFB224` on dark (10.5:1),
`#9A5B00` on light (5.4:1). Use `text-accent` for accent *text*; `bg-signal` and
`border-signal` stay the bright brand amber in both bands.

**Display headlines take an array of lines.** `<SectionHead title={[...]} />` and
`<Lines>` render one clipped block per entry so each wipes up from its own baseline. Keep
lines under ~15 characters — beyond that they wrap inside their own clip and the animation
breaks. The `--text-d0` ceiling is derived from exactly that limit.

## The two rules that shape the 3D

**1. Text before pixels.** Copy and CTAs render server-side; canvases hydrate after and
never block. Both 3D scenes ship a text alternative and a CSS fallback with identical
content, so a failed WebGL check degrades instead of breaking.

**2. WebGL is gated and shared.** The hero board and the loop engine get their own
canvases; every platform module-stack shares ONE context via drei `<View>` (six separate
canvases exhausted the browser's context pool and every one came back a broken-image
icon). Everything else is HTML and CSS. `lib/capability.ts` resolves every visitor into
`full` (interactive + bloom), `lite` (mobile, reduced particle count, no antialias) or
`poster` (reduced-motion, save-data, `deviceMemory < 4`, or no WebGL2), and canvases stop
rendering entirely when scrolled out of view.

## What is real and what is scaffolding

Everything in `lib/content.ts` comes from the specs. Nothing on this site invents a client
name, a testimonial, or a revenue figure — PRD §7.8 and §7.12 forbid it, and unverifiable
numbers are removed rather than softened. Specifically:

- `testimonials` is **intentionally empty**. The section renders a consent-gated placeholder
  until written consent is on file (PRD §14). Fill the array and it renders cards.
- **Platform screenshots are drop-in.** Put a `.webp` in `public/platforms/` named after the
  platform's slug, add two lines to `lib/content.ts`, and it appears on the homepage rail,
  the `/platforms` grid and that platform's page at once. Until then the card shows the 3D
  module stack instead — same 16:10 box, so adding an image shifts nothing.
  `public/platforms/README.md` is the owner-facing guide, including the data-masking
  checklist that PRD §16 and §14 require before any capture goes live.
- The hero event feed is labelled **sample** on the board itself, per PRD §6.
- Pricing bands are the ones in the Growth Strategy; they are the only monetary figures here.
- Contact details in `lib/content.ts` are live: `+91 62070 77899` (phone and WhatsApp) and
  `info@binksaiauto.com`. They are the single source — the nav, footer, contact page, drawer,
  the build-time WhatsApp QR and `public/llms.txt` all read from there.

## Not wired yet (deliberately — PRD §15 sequencing)

`POST /api/lead` validates, enforces the TRAI consent requirement and returns 200
instantly, then logs where a BullMQ publish belongs. Before launch it needs Turnstile,
Redis rate limits, OTP verification of the number, and a row in `consents` storing the
exact text shown. The route has a comment listing each one.

Also pending: CMS (Sanity/Payload) behind `lib/content.ts`, the calendar embed in
`FinalCta`, the WhatsApp QR image, GA4/GTM/Meta CAPI, and `next-intl` for the
Hindi/Marathi landing pages. The Devanagari font and `font-deva` utility are already in
place so those pages will not fall back to a system font.

## Performance budget (PRD §8)

Budget: LCP ≤ 2.5s mobile · **first-load JS ≤ 180KB gzipped** · hero media ≤ 900KB · CLS < 0.05.

Measured against `next build` + `next start`, summing every `<script src>` on the page:

| | gzipped |
|---|---|
| Framework + site shell (`/about`) | **189 KB** |
| Homepage (`/`) | **201 KB** |
| `/platforms`, `/platforms/{slug}` | **191 KB** |
| Budget | 180 KB |

**The homepage is 21 KB over, and the floor is not app code.** React 19 + the Next 16 App
Router client runtime plus the always-present shell (nav, preloader, cursor trail, mobile
bar, smooth scroll) is 189 KB on its own — a page with zero interactive sections would
still miss the target. Everything this site adds on top of the framework is 12 KB.

Getting there from a starting 245 KB took three changes, all worth keeping:

- **GSAP, ScrollTrigger and Lenis are imported dynamically** (−47 KB). They were a third
  of the budget and are not needed before first paint. A reduced-motion visitor never
  downloads them; a mobile visitor never downloads ScrollTrigger at all, because the
  pinned loop is desktop-only.
- **The conversation drawer mounts on first idle**, not on first render (−3 KB). It is on
  every page and visible on none until a CTA is pressed.
- **Sections that only compose client leaves are server components** (−2 KB). Their copy
  and markup never become JavaScript.

Three.js and the postprocessing stack — by far the largest dependency — are already
outside this number: every canvas is `dynamic(..., { ssr: false })` behind the capability
gate, so a visitor who fails it never fetches them.

**Watch the palette import.** `components/three/palette.ts` exists only because
`components/three/lib.tsx` imports three.js at module scope. A card wrapper reading one
hex value from `lib` put the whole renderer in the first-load chunk and took the homepage
to **427 KB**. Non-3D code imports colours from `palette`, never from `lib`.

**Decision needed:** either revise the 180 KB figure (it predates the Next.js choice), or
move the marketing site to a lighter renderer. Trimming app code cannot close a gap that
is 94% framework. Note PRD §8's own rule still holds and is already satisfied — the 3D is
an upgrade to a working page, not a prerequisite for one.
