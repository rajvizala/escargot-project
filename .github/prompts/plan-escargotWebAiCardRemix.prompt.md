# Plan: Escargot Web — AI Card Remix App

**TL;DR**: Build a mobile-first Next.js (App Router) + TypeScript web app that brings Escargot's card browsing and AI Remix experience to Android/web. 5 screens (Splash → Browse → Card Detail → Remix → Confirmation), Gemini 2.0 Flash via Vertex AI for card remixing, Turso for persistence, deployed on Vercel with OIDC auth to GCP. All API routes live as Next.js Route Handlers — no separate backend.

---

## Phase 1: Project Scaffolding & Design System

1. **Scaffold Next.js project** — App Router, TypeScript, CSS Modules (no Tailwind)
2. **Create design tokens** in `src/styles/tokens.css` — brand green (`#1B5E37`), ivory backgrounds, green-100 (`#E8F4EC`), sand, charcoal, radii, shadows
3. **Set up Google Fonts** — Playfair Display (400, 400i, 700) + DM Sans (400, 500, 600) via `next/font/google`
4. **Global reset/base styles** — mobile-first, `background: var(--color-ivory)`, border-box
5. **Shared Button component** — primary (green fill), secondary (outlined), disabled states per spec

---

## Phase 2: Data Layer & Types

6. **TypeScript types** — `Card`, `Occasion`, `RemixResult` types in `src/types/card.ts`
7. **Card data file** — 8-10 entries with real artist names (Ben Lenovitz, War and Peas, Sad Ghost Club, Odd Daughter, Toasted by Eli, etc.). Your images go in `public/cards/`
8. **React Contexts** — `CardContext` (selected card + message + tone) and `RemixContext` (prompt, result, processing state)
9. **Wire contexts** via a `'use client'` `Providers` wrapper component (`src/components/Providers.tsx`) — layout.tsx itself stays a Server Component, the Providers component wraps children with both context providers

---

## Phase 3: Frontend — 5 Screens

### Screen 1: Splash (`src/app/page.tsx`)

10. Hero: snail SVG with CSS float animation (8px, 3s loop), tagline, context copy
11. Below-fold: 3 before/after pairs — simple tap-to-toggle on mobile, drag clip-path slider on desktop only (don't over-invest here; Screen 4's split reveal is the centrepiece)
12. CTA button: brand green, hover scale(1.03), click scale(0.97)

### Screen 2: Browse (`src/app/browse/page.tsx`)

13. Horizontal scrollable filter bar — occasion pills, active = green fill, filter with layout animation
14. CSS Grid (`auto-fill`, `minmax(160px, 1fr)`), lazy-loaded images, skeleton shimmer loaders
15. "Remixable" sparkle badge on eligible cards
16. Hover: scale(1.04) + shadow; mobile tap press
17. POST to `/api/analytics/view` on card click

### Screen 3: Card Detail (`src/app/card/[id]/page.tsx`)

18. Full-bleed card image (55% viewport) with parallax scroll
19. Tone selector: Funny / Sincere / Sarcastic pills — changes placeholder text
20. Auto-expanding textarea, live char count, state in CardContext
21. "Remix This Card →" (green, only if remixable) + "Send As-Is →" (outlined)

### Screen 4: Remix (`src/app/remix/[id]/page.tsx`)

22. Card thumbnail reminder at top
23. Prompt input + example chips ("Make it two grooms", "Add a wheelchair", "Change the dog to a cat", etc.)
24. Loading animation: card expands, translucent overlay, particle dots, cycling copy every 3s
25. **Split reveal** (the centrepiece): vertical divider sweeps left→right via clip-path showing original vs remix. "Life is combinatorial. This card is now yours."
26. "Use This Remix" → Confirmation; "Try Another Prompt" → reset

### Screen 5: Confirmation (`src/app/confirmation/page.tsx`)

27. Animated envelope SVG floating upward + honest prototype copy
28. Delivery timeline: Printed (Day 1) → Mailed (Day 3) → Delivered (Day 5), staggered animation (400ms apart)
29. "Download your remix" (browser native download, `escargot-remix-[cardId].png`) + "Browse more cards"

---

## Phase 4: Backend — API Route Handlers

30. **`src/lib/vertexai.ts`** — OIDC token via `@vercel/oidc` using `headers()` from `next/headers` (App Router pattern — no `req` object needed) → GCP STS exchange → Vertex AI credentials. `remixCardImage()` no longer takes `req` as a param.
31. **`src/lib/turso.ts`** — `@libsql/client` singleton with env vars
32. **`src/lib/rateLimit.ts`** — in-memory Map, 5 calls/IP/minute, ~20 lines
33. **`/api/remix`** — validate, rate-limit, call Gemini with engineered prompt ("preserve art style", "only the specific change", "print quality"), write to Turso `remix_history`, return `{ remixedImage, remixId, processingMs }`
34. **`/api/analytics/view`** — write to Turso `card_views`
35. **`/api/health`** — verify OIDC wiring

---

## Phase 5: Infrastructure Setup

36. **Turso**: `turso db create escargot-remix`, run schema (tables: `remix_history`, `card_views`), copy URL + token
37. **Vercel OIDC** (step-by-step instructions):
    - Dashboard → Project → Settings → General
    - Under "OIDC Federation" → toggle **ON**
    - Set Issuer Mode to **Team** → issuer URL becomes `https://oidc.vercel.com/<your-team-slug>`
    - This must match the audience/issuer in your GCP WIF pool provider config
    - Vercel injects `x-vercel-oidc-token` header into every serverless function automatically
38. **Environment variables** in Vercel Dashboard:
    - `GCP_PROJECT_ID`, `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`
    - `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
39. **`maxDuration`** — set as a top-level export in `src/app/api/remix/route.ts` (`export const maxDuration = 30;`) instead of vercel.json — cleaner App Router pattern
40. **Dependencies**: `@vercel/oidc`, `google-auth-library`, `@google-cloud/vertexai`, `@libsql/client`

---

## Phase 6: Polish & Mobile Testing

41. Responsive verification at 375px base / 768px breakpoint — Chrome DevTools (Pixel 7, Galaxy S23, iPhone SE)
42. Remix loading overlay on slow 3G throttle — cycling copy must feel smooth
43. Accessibility: focus states, alt text, aria-labels
44. Performance: lazy-loaded images, skeleton loaders

---

## Verification

1. `npm run build` — zero TypeScript errors
2. All 5 screens render at 375px and desktop widths
3. Splash: float animation + before/after slider on touch
4. Browse: filter pills work, skeleton → images, card click navigates
5. Card Detail: tone changes placeholder, message persists across nav, Remix button disabled for non-remixable
6. Remix: chips fill input, full loading sequence plays, split reveal animates
7. Confirmation: envelope floats, timeline staggers, download generates PNG
8. `/api/health` → 200 (OIDC verified)
9. `/api/analytics/view` → row in Turso
10. `/api/remix` → returns remixed image + Turso row; 6th call in 1min → rate limited

---

## Decisions

- **Next.js App Router** — API routes as route handlers
- **CSS Modules** — no CSS-in-JS (mirrors Escargot's stated engineering direction)
- **React Context only** — no Redux/Zustand (state is simple enough)
- **Static card data** — TS file, not API-fetched (per spec)
- **Simulated confirmation** — honest prototype copy, no real payment/fulfillment
- **Vercel OIDC → GCP WIF** — zero stored secrets; short-lived tokens only

## Scope

**In**: All 5 screens, AI remix, Turso persistence, analytics, mobile-first responsive, all spec animations, Vercel deployment config.

**Out**: Real payments, address collection, actual mailing, user accounts, iOS parity.
