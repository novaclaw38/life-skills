# Life Skills App — Phase 1: Foundation — Design

## Context

The app teaches practical life skills (changing a tire, wiring a plug, unblocking a toilet,
basic car maintenance, home repairs, tool use) to children and young people growing up
without fathers, with an AI mentor companion guiding them through tutorials.

Full scope decomposes into phases:

1. **Foundation** (this spec) — auth, data model, tutorial content pipeline, AI provider
   adapter, image pipeline, app shell. Proven end-to-end against 1-2 seeded tutorials.
2. Tutorial content authoring pass — fill library to 20-30 tutorials using the Phase 1
   pipeline/schema (no new architecture).
3. Progress tracking UI — dashboards/profile views over the `UserProgress` data already
   captured in Phase 1.
4. AI companion UX polish — chat UI refinement, adaptive prompt tuning.
5. Hardening — full error handling pass, full test coverage pass, deployment docs.

This spec covers Phase 1 only.

## Goals

- A user can sign up (email/password or Google/Apple OAuth), select an age band, and log in.
- A user can browse a tutorial, read age-band-appropriate step content with images, and mark
  steps complete.
- A user can chat with an AI mentor companion while viewing a tutorial; the companion has
  context of the conversation within the current tutorial session and resets on a new session.
- Tutorial content (including images) lives in the database and can be authored/updated
  without a redeploy.
- AI provider and image provider are swappable via configuration, not code changes.

## Non-goals (deferred to later phases)

- Filling the library out to 20-30 tutorials (content authoring, not architecture).
- Admin UI for content editing (Phase 1 uses seed scripts; admin UI is a later phase if needed).
- Progress-tracking dashboards/visualizations beyond the raw completion data.
- Full a11y/i18n/error-state hardening pass.

## Architecture

Next.js App Router (existing scaffold: Next 16, React 19, Tailwind v4, TypeScript) deployed
to Vercel. Prisma ORM against Supabase-hosted Postgres. No separate backend service — Route
Handlers / Server Actions handle mutations (auth callbacks, progress updates, chat messages).
AI text generation and image generation are each behind a provider adapter interface,
selected via environment variables, so providers can be swapped without touching call sites.

```
Browser
  │
  ▼
Next.js App Router (Vercel)
  ├─ Auth.js (Credentials + Google + Apple, Prisma adapter)
  ├─ Route Handlers / Server Actions
  │    ├─ Progress mutations
  │    └─ Chat endpoint → AIProvider (Claude | OpenAI)
  └─ Prisma Client
       │
       ▼
  Supabase Postgres
       │
       ▼ (offline, admin-run)
  scripts/generate-tutorial-images.ts → NVIDIA image API → Supabase Storage → TutorialStep.imageUrl
```

## Data model (Prisma)

```prisma
enum AgeBand {
  AGE_8_11
  AGE_12_15
  AGE_16_18
}

enum MessageRole {
  USER
  ASSISTANT
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?   // null for OAuth-only accounts
  name          String?
  ageBand       AgeBand
  createdAt     DateTime  @default(now())

  accounts      Account[]
  sessions      Session[]
  progress      UserProgress[]
  tutorialSessions TutorialSession[]
}

// Account, Session, VerificationToken: standard Auth.js Prisma adapter models

model Tutorial {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  summary     String
  category    String
  safetyLevel String   // e.g. "low" | "moderate" | "requires-adult-supervision"
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  steps       TutorialStep[]
  progress    UserProgress[]
  tutorialSessions TutorialSession[]
}

model TutorialStep {
  id              String   @id @default(cuid())
  tutorialId      String
  tutorial        Tutorial @relation(fields: [tutorialId], references: [id])
  order           Int
  title           String
  contentSimple   String   // AGE_8_11
  contentStandard String   // AGE_12_15
  contentDetailed String   // AGE_16_18
  imageUrl        String?
  safetyWarning   String?

  progress        UserProgress[]

  @@unique([tutorialId, order])
}

model UserProgress {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  tutorialId  String
  tutorial    Tutorial @relation(fields: [tutorialId], references: [id])
  stepId      String
  step        TutorialStep @relation(fields: [stepId], references: [id])
  completedAt DateTime @default(now())

  @@unique([userId, stepId])
}

model TutorialSession {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  tutorialId    String
  tutorial      Tutorial @relation(fields: [tutorialId], references: [id])
  startedAt     DateTime @default(now())
  lastMessageAt DateTime @default(now())

  messages      ConversationMessage[]
}

model ConversationMessage {
  id         String          @id @default(cuid())
  sessionId  String
  session    TutorialSession @relation(fields: [sessionId], references: [id])
  role       MessageRole
  content    String
  createdAt  DateTime        @default(now())
}
```

## Session-scoped AI memory rule

A `TutorialSession` is **active** for a given `(userId, tutorialId)` pair if one exists and
`lastMessageAt` is within an inactivity window (default 2 hours, configurable via
`AI_SESSION_TIMEOUT_MINUTES`). Sending a chat message:

1. Look up the most recent `TutorialSession` for `(userId, tutorialId)`.
2. If it exists and is within the window, append the message, load its prior
   `ConversationMessage` rows as context, and update `lastMessageAt`.
3. Otherwise, create a new `TutorialSession` with no prior context.

Explicit "start over" in the chat UI forces step 3 regardless of timeout. Old sessions are
retained (not deleted) for potential future analytics but are never loaded as AI context once
superseded.

## Auth

Auth.js with the Prisma adapter. Providers: Credentials (email + bcrypt-hashed password),
Google OAuth, Apple OAuth. `ageBand` is required at signup — collected directly on the
credentials signup form, or as a mandatory one-time onboarding step immediately after first
OAuth login (since Google/Apple don't supply it). Sessions via Auth.js JWT strategy (avoids
extra DB round-trip per request; `Session` table still present for adapter compatibility and
future revocation support).

## AI provider adapter

```ts
interface Message { role: "user" | "assistant"; content: string }
interface CompanionContext {
  ageBand: AgeBand;
  tutorialTitle: string;
  currentStepTitle: string;
}

interface AIProvider {
  sendMessage(history: Message[], userMessage: string, ctx: CompanionContext): Promise<string>;
}
```

`ClaudeProvider` and `OpenAIProvider` each implement this interface, wrapping their
respective SDKs. Selected at startup via `AI_PROVIDER=claude|openai` env var through a small
factory (`getAIProvider()`). The system prompt (shared across providers, built from
`CompanionContext`) encodes: supportive mentor tone, non-judgmental, task-focused, plain
language, age-band-adapted vocabulary/complexity, and awareness of the current tutorial step
so answers stay grounded in what's on screen.

## Image pipeline

`scripts/generate-tutorial-images.ts` — a standalone admin script, not part of any request
path. For each `TutorialStep` missing an `imageUrl` (or `--force` to regenerate), it builds a
prompt from the step's title/content, calls NVIDIA's image generation API, uploads the result
to a Supabase Storage bucket, and writes the resulting public URL to `TutorialStep.imageUrl`.
Run manually when authoring or updating tutorial content; never triggered by user requests.

## Testing

- **Vitest**: AI provider adapters (mocked HTTP), session-boundary logic (timeout math),
  progress-completion logic, age-band content selection.
- **Playwright**: signup with age band → login → view seeded tutorial → send a chat message →
  mark a step complete → verify progress persists on reload.

## Error handling

- Auth: invalid credentials, duplicate email, OAuth failure → user-facing messages, no stack
  traces surfaced.
- AI chat: provider timeout/error → chat UI shows a friendly retry message, does not crash the
  page; failed sends are not silently dropped (shown as failed with retry).
- Tutorial content: missing image → layout degrades gracefully (placeholder), does not block
  reading step text.
- All Route Handlers / Server Actions wrap external calls (AI provider, Prisma) in try/catch
  with typed error responses; no unhandled promise rejections.

## Deliverable scope for this phase

Working end-to-end: signup/login (credentials + Google + Apple) → age band selection → browse
2 seeded tutorials → read age-adapted steps with pre-generated images → chat with AI companion
(session-scoped memory verified across multiple messages and across a simulated timeout) →
mark steps complete and see it persist. Vitest + Playwright suites passing. README covering
setup, provider swap, difficulty-level config, and session-memory config.
