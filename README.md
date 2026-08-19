# Life Skills App

A web app that teaches practical life skills — changing a tire, wiring a plug, unblocking a
toilet, and more — through step-by-step tutorials with an AI mentor companion, adapted to the
learner's age.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Prisma + PostgreSQL (Supabase)
- Auth.js v5 — email/password + Google (Apple stubbed behind a flag)
- Swappable AI provider adapter — Claude or OpenAI
- NVIDIA image API for pre-generated tutorial illustrations (admin script, not live)
- Vitest (unit/integration) + Playwright (e2e)

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — your Supabase Postgres connection string
   - `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
   - `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — from Google Cloud Console OAuth credentials
   - `AI_PROVIDER` + the matching API key (see "Swapping the AI provider" below)
   - `NVIDIA_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — only needed to run the
     image-generation script
3. `npm run db:migrate` — creates tables in your database
4. `npm run db:seed` — seeds the "Changing a Flat Tire" and "Wiring a Plug" tutorials
5. `npm run dev` — starts the app at http://localhost:3000

## Running tests

- `npm test` — Vitest unit/integration tests
- `npm run test:e2e` — Playwright end-to-end tests (starts the dev server automatically;
  requires a migrated + seeded database and a valid AI provider key)

## Adding a new tutorial

Tutorials are DB-backed, not files — add them via a seed script (see `prisma/seed.ts` for the
pattern) or a direct `prisma.tutorial.create(...)` call. Each tutorial needs:

- `slug`, `title`, `summary`, `category`, `safetyLevel`, `published`
- A list of `steps`, each with `order`, `title`, three content variants
  (`contentSimple`, `contentStandard`, `contentDetailed` — for ages 8-11, 12-15, and 16-18
  respectively), and an optional `safetyWarning`

After adding steps, run `npm run db:generate-images` to generate and attach illustrations for
any step missing an `imageUrl` (add `--force` to regenerate existing ones).

## Swapping the AI provider

Set `AI_PROVIDER` in `.env` to `claude` or `openai`, and set the matching API key
(`ANTHROPIC_API_KEY` or `OPENAI_API_KEY`). No code changes are needed — `src/lib/ai/get-provider.ts`
is the only place that reads this variable. To add a third provider, implement the `AIProvider`
interface in `src/lib/ai/types.ts` (a `sendMessage(history, userMessage, ctx)` method) in a new
file under `src/lib/ai/`, then add a branch for it in `get-provider.ts`.

## Adjusting difficulty levels for different ages

Age bands are `AGE_8_11`, `AGE_12_15`, `AGE_16_18`, chosen at signup (or via
`/onboarding/age-band` after an OAuth signup) and stored on the user. Each tutorial step has
three content variants keyed to these bands (see "Adding a new tutorial" above); the tutorial
page picks the right one automatically. The AI companion's system prompt
(`src/lib/ai/system-prompt.ts`) also adapts its language per age band — edit
`AGE_BAND_GUIDANCE` there to change tone/complexity per band.

## Configuring session-based conversation memory

The AI companion remembers messages only within an active "tutorial session" — defined as the
same user + tutorial with a message sent within the last `AI_SESSION_TIMEOUT_MINUTES` minutes
(default 120, set in `.env`). Once that window passes, or the learner clicks "Start a new
conversation," the next message starts a fresh session with no prior context. This logic lives
in `src/lib/ai/session.ts` (`getOrCreateActiveSession` / `startNewSession`).

## Deployment

1. Create a Supabase project, copy its Postgres connection string into `DATABASE_URL`.
2. Deploy to Vercel (`vercel deploy`), setting the same environment variables from `.env` in
   the Vercel project settings.
3. Run `npm run db:migrate -- deploy` (or `prisma migrate deploy`) against the production
   database before first use, then `npm run db:seed` to add the starter tutorials.
4. Run `npm run db:generate-images` locally (or in a one-off job) whenever new tutorial content
   is added, so images are attached before users see the tutorial.

## Known limitations (Phase 1 scope)

- Ships with 2 seeded tutorials; growing the library to 20-30 is a content-authoring task using
  the same schema and pipeline (see "Adding a new tutorial"), not a new build phase.
- No admin UI for content editing yet — tutorials are added via seed scripts / direct Prisma
  calls.
- Apple Sign In is implemented but disabled by default (`AUTH_APPLE_ENABLED=false`) until an
  Apple Developer Program account and credentials are available.
