# RetailIQ — AI-Powered Retail Intelligence Platform

Transform fashion product data into strategic business decisions. RetailIQ takes
a research pipeline — originally an MSc dissertation on consumer behaviour in
fashion retail — and expands it into a modern, decision-support web application:
executive dashboards, product and customer analytics, market basket analysis,
machine-learning evaluation and interactive, in-browser AI predictions.

> Built on a **simulated** fashion retail dataset. All figures are for
> methodological demonstration, not real market data.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** design system (CSS-first tokens)
- **shadcn-style** UI primitives, **lucide-react** icons
- **Motion** (Framer Motion) for tasteful animation
- **Recharts** for data visualisation
- Offline **Python** analytics pipeline exporting JSON artifacts (from Milestone 2)
- Deployed on **Vercel**

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm run start      # serve the production build
```

## Project structure

```
src/
  app/                     # App Router pages (one folder per route)
    layout.tsx             # Root layout: fonts, metadata, navbar + footer
    page.tsx               # Home / landing
    dashboard/ …           # Interior routes (10 modules)
  components/
    site/                  # Navbar, footer, logo, page headers, reveal
    ui/                    # Button, Card, Badge (design-system primitives)
  lib/
    nav.ts                 # Navigation model (grouped destinations)
    pages.ts               # Interior page content model
    utils.ts               # cn() + formatting helpers
  app/globals.css          # Design tokens + base styles (Tailwind v4 @theme)
```

## Design system

Aesthetic inspired by Apple, Stripe, Linear and Vercel — minimal, elegant,
premium. Palette: warm white, soft powder blue, mist blue, steel blue, deep
slate. Light theme only. Generous spacing, rounded cards, minimal shadows.
Tokens live in `src/app/globals.css` under `@theme`.

## Build roadmap

The application is built incrementally, one milestone at a time:

| # | Milestone | Status |
|---|-----------|--------|
| M1 | Project scaffold + design system + app shell | ✅ Complete |
| M2 | Data & ML pipeline (Python, offline) → JSON artifacts | ⏳ Next |
| M3 | Home, Research, Methodology, About content | Planned |
| M4 | Executive Dashboard + Product Analytics | Planned |
| M5 | Customer Intelligence + Market Basket Analysis | Planned |
| M6 | Machine Learning + AI Predictions | Planned |
| M7 | Reports + PDF export + polish + ship | Planned |

## Deployment (Vercel)

The project is a standard Next.js app and deploys to Vercel with zero config:

1. Push this folder to a Git repository.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Framework preset **Next.js** is auto-detected; no environment variables are
   required (all analytics run client-side from static JSON artifacts).

A full deployment guide is added in Milestone 7.
