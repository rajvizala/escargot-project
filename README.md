# Escargot — Web Card Remix

I'm on Android. I couldn't access your app. So I built what the web experience should look like — including the AI Remix feature brought to a platform it doesn't exist on yet.

Live demo: https://escargot-project-two.vercel.app/

---

## What This Is

Escargot's core thesis — that physical mail is worth doing, and worth doing beautifully — resonated with me immediately. The AI Remix feature in particular stuck with me after reading the team's writing on inclusive design: the idea that life is combinatorial, that no fixed card catalog can represent every relationship, and that the right tool should let anyone adapt a card to reflect their actual life.

This project brings that feature to the web. It is not a clone of the iOS app. It is a focused prototype of the browse-to-remix journey, built as a mobile-first web application, deployable to any device without an install.

---

## The Five Screens

**Landing** — Introduces the Remix concept through three before/after card pairs (a couple becoming two grooms, a dog becoming a cat, an Army uniform becoming Navy) before the user has touched anything. The concept should be legible before it needs to be explained.

**Browse** — A card catalog filtered by occasion, with artist attribution on every card. Cards marked as remixable carry a visual badge — mirroring Escargot's real artist opt-in system and the ethics behind it.

**Card Detail** — Full-bleed card view with a message composer. Includes a tone selector (Funny, Sincere, Sarcastic) that changes the placeholder message — a small product extension that treats the writing prompt as part of the experience.

**Remix** — The centrepiece. A prompt input pre-loaded with example chips that tell the inclusion story directly. While Gemini processes the request, an animated overlay with cycling copy makes the wait feel intentional rather than broken. The result arrives as a split reveal — a vertical wipe showing the original and the remixed card side by side, settling on the line: "Life is combinatorial. This card is now yours."

**Confirmation** — An honest prototype screen. Acknowledges this is a demo, shows what the real Escargot app does at this point (prints, stamps, mails), and lets the user download their remixed card as a PNG.

---

## Technical Stack

**Frontend**
- Next.js 15 (App Router) with TypeScript
- CSS Modules with a hand-written design token system — no CSS-in-JS
- Playfair Display (headings) and DM Sans (body) via next/font
- All animations written in CSS — no animation library dependency

**Backend**
- Next.js Route Handlers (no separate server)
- Vertex AI Gemini via Google Cloud Workload Identity Federation
- Turso (libSQL) for remix history and card view persistence

**Infrastructure**
- Vercel (frontend + serverless functions, single deployment)
- Vercel OIDC Federation — short-lived tokens exchanged with GCP, zero stored secrets
- Google Cloud Workload Identity Pool for service account impersonation

**Auth flow**
```
Vercel request → OIDC token injected per-invocation
→ GCP STS token exchange
→ Service account impersonation
→ Vertex AI Gemini call
```

No API keys. No long-lived credentials. No service account JSON files.

---

## Running Locally

Prerequisites: Node 20+, Vercel CLI, a Vercel account linked to this project.

```bash
# Install dependencies
npm install

# Pull environment variables (includes OIDC token for local Vertex AI auth)
vercel env pull

# Run with full Vercel runtime simulation
vercel dev
```

`npm run dev` will not work for the remix feature — `vercel dev` is required to inject the OIDC token locally.

**Environment variables required in Vercel dashboard:**

| Variable | Description |
|----------|-------------|
| `GCP_PROJECT_ID` | Google Cloud project ID |
| `GCP_AUDIENCE` | Workload Identity Pool audience string |
| `GCP_SA_IMPERSONATION_URL` | Service account impersonation endpoint |
| `TURSO_DATABASE_URL` | Turso database connection URL |
| `TURSO_AUTH_TOKEN` | Turso authentication token |

---

## The AI Remix Prompt

The prompt sent to Gemini is engineered to preserve what matters:

```
You are an expert card illustrator given a greeting card image and a user request to modify it.

Rules:
- Preserve the original art style exactly — do not change the illustration 
  technique, color palette, or artistic voice
- Make ONLY the specific change requested. Do not improve or alter anything else
- Maintain print quality — clean lines, high contrast, no artifacts
- The output must look like it could be commercially printed on a greeting card

User's requested change: "{prompt}"
```

The constraint "do not improve or alter anything else" is deliberate. Without it, Gemini tends to drift the entire composition toward its own aesthetic preferences rather than making the single change requested. Getting this right took iteration.

---

## How I Built It

I used Claude (claude.ai) and GitHub Copilot throughout the build for scaffolding and boilerplate — consistent with the engineering workflow described in the job posting.

Specifically: component boilerplate, the initial Vertex AI service layer, CSS keyframe drafts, and Vitest test structure were all AI-assisted first drafts that I validated, corrected, and in several cases rewrote.

I did not use AI for: the Gemini prompt wording (iterated manually until style preservation was consistent), the split reveal animation (required taste, not just correctness), or the inclusion example chips (these needed genuine care about what the product actually means — AI-generated versions were too generic).

The Workload Identity Federation setup — exchanging Vercel OIDC tokens for short-lived GCP credentials without storing any secrets — was the most technically involved part of the infrastructure and took meaningful debugging to get right across issuer URL mismatches and service account permission scoping.

---

## What I Would Build Next

- Replace placeholder card images with real Gemini-generated artwork using the same Vertex AI setup
- Add a remix history page showing everything the app has generated — the Turso schema is already in place
- Keyboard and screen reader accessibility pass — focus states and aria-labels are present but not fully audited
- A shareable link for the remixed card — the confirmation screen downloads it locally, but a share URL would close the loop socially

---

## Project Structure

```
src/
  app/
    page.tsx                  Landing
    browse/page.tsx           Card catalog
    card/[id]/page.tsx        Card detail + message
    remix/[id]/page.tsx       AI remix
    confirmation/page.tsx     Send confirmation
    api/
      remix/route.ts          POST — Vertex AI call + Turso write
      analytics/view/route.ts POST — card view logging
      health/route.ts         GET  — OIDC verification
  lib/
    vertexai.ts               Vertex AI client via OIDC
    turso.ts                  Turso libSQL client
    rateLimit.ts              In-memory rate limiter (5 calls/IP/min)
  components/
  styles/
    tokens.css                Design token system
public/
  cards/                      Card artwork (card-01 through card-10)
  examples/                   Before/after pairs for landing page
```
