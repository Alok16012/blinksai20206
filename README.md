# BlinksAI

Marketing site and lead engine for **BlinksAI** — a growth engineering company in Nashik,
Maharashtra. We build the software, automate the follow-up, and run the marketing that
fills it.

The application lives in [`web/`](web) — start there, its README covers the architecture,
the design system, the honesty rules and the performance budget.

```bash
cd web
npm install
npm run dev
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · React Three Fiber + drei ·
GSAP ScrollTrigger · Lenis · Zustand.

## What's here

| | |
|---|---|
| `web/app` | Routes — homepage, 8 platform pages, service pages, work, company, `/api/lead` |
| `web/components/three` | The 3D layer: hero operations board, scroll-driven loop engine, per-platform module stacks |
| `web/components/sections` | One file per homepage section |
| `web/lib/content.ts` | All copy and data, shaped like the CMS types it will be swapped for |
| `web/public/platforms` | Drop product screenshots here — see the README in that folder |

## Not in this repo

The product requirements, technical architecture and growth strategy documents are
internal — they contain client names, pricing structure and revenue targets, and this
repository is public. They are listed in `.gitignore` and stay on the working machine.

## Before launch

`web/README.md` has the full list. The short version: set the real WhatsApp number and
phone in `lib/content.ts`, wire `POST /api/lead` to the queue (it validates and enforces
the TRAI consent requirement today, but only logs where the publish belongs), and add
Turnstile, rate limits and OTP verification.
