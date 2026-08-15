# Life Skills App — Phase 1 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the foundation of the life-skills app: auth (credentials + Google, Apple stubbed), DB-backed tutorial content with age-band variants, a session-scoped AI mentor companion behind a swappable provider adapter, pre-generated tutorial images, and progress tracking — proven end-to-end against 2 seeded tutorials.

**Architecture:** Next.js App Router (existing scaffold) on Vercel, Prisma ORM against Supabase Postgres, Auth.js for authentication, Route Handlers for mutations, provider-adapter pattern for AI text generation and image generation.

**Tech Stack:** Next.js 16 (App Router) + React 19 + TypeScript, Prisma + PostgreSQL (Supabase), Auth.js v5 (`next-auth@beta`) + `@auth/prisma-adapter`, `bcryptjs`, `zod`, `@anthropic-ai/sdk` + `openai`, `@supabase/supabase-js` (storage upload), Vitest (unit/integration), Playwright (e2e), Tailwind v4.

**Spec:** `docs/superpowers/specs/2026-08-15-life-skills-foundation-design.md`

## Global Constraints

- Age bands are exactly three values: `AGE_8_11`, `AGE_12_15`, `AGE_16_18` (per spec Data model).
- AI companion memory is session-scoped: active session = same `(userId, tutorialId)` pair with `lastMessageAt` within `AI_SESSION_TIMEOUT_MINUTES` (default 120); otherwise a new session starts with empty context (per spec Session-scoped AI memory rule).
- AI provider is selected via `AI_PROVIDER=claude|openai` env var; no call site imports a concrete provider directly, only the factory (per spec AI provider adapter).
- Apple Sign In is implemented but gated behind `AUTH_APPLE_ENABLED` (default `false`) — omitted from Auth.js config and hidden from UI when disabled (per spec Auth section).
- Tutorial step content has three variants per step: `contentSimple`, `contentStandard`, `contentDetailed`, mapped to age bands (per spec Data model).
- Images are pre-generated via an offline admin script (NVIDIA API → Supabase Storage → `TutorialStep.imageUrl`); no request path ever calls the image API (per spec Image pipeline).
- Error handling: user-facing messages only, no stack traces surfaced; failed AI sends are shown as failed with retry, not silently dropped (per spec Error handling).

---

## File Structure

```
prisma/
  schema.prisma
  seed.ts
src/
  types/
    next-auth.d.ts                # Session/JWT augmentation (ageBand)
  lib/
    prisma.ts                    # Prisma client singleton
    auth.ts                      # Auth.js config
    ai/
      types.ts                   # AIProvider interface, Message, CompanionContext
      system-prompt.ts           # buildSystemPrompt(ctx)
      claude-provider.ts
      openai-provider.ts
      get-provider.ts            # factory: getAIProvider()
      session.ts                 # getOrCreateActiveSession()
    images/
      nvidia-provider.ts         # generateImage(prompt) -> Buffer
    progress.ts                  # markStepComplete, getTutorialProgress
  app/
    api/
      auth/[...nextauth]/route.ts
      signup/route.ts
      onboarding/age-band/route.ts
      chat/route.ts
      progress/route.ts
    signin/page.tsx
    signup/page.tsx
    onboarding/age-band/page.tsx
    tutorials/page.tsx
    tutorials/[slug]/page.tsx
  components/
    ChatPanel.tsx
    TutorialSteps.tsx
scripts/
  generate-tutorial-images.ts
tests/
  ai/get-provider.test.ts
  ai/claude-provider.test.ts
  ai/openai-provider.test.ts
  ai/session.test.ts
  progress.test.ts
e2e/
  tutorial-flow.spec.ts
.env.example
vitest.config.ts
playwright.config.ts
README.md
```

---

### Task 1: Project setup, Prisma schema, DB client

**Files:**
- Modify: `package.json`
- Create: `.env.example`
- Create: `prisma/schema.prisma`
- Create: `src/lib/prisma.ts`
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: `prisma` (singleton `PrismaClient` instance) exported from `src/lib/prisma.ts`, imported by every later task that touches the DB.
- Produces: Prisma models `User`, `Account`, `Session`, `VerificationToken`, `Tutorial`, `TutorialStep`, `UserProgress`, `TutorialSession`, `ConversationMessage`, enums `AgeBand`, `MessageRole` — exact shape from the spec's Data model section.

- [ ] **Step 1: Install dependencies**

```bash
npm install @prisma/client @auth/prisma-adapter next-auth@beta bcryptjs zod @anthropic-ai/sdk openai @supabase/supabase-js
npm install -D prisma vitest tsx @playwright/test @types/bcryptjs
```

- [ ] **Step 2: Add npm scripts**

Edit `package.json` `scripts` block to add:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"db:migrate": "prisma migrate dev",
"db:seed": "tsx prisma/seed.ts",
"db:generate-images": "tsx scripts/generate-tutorial-images.ts"
```

- [ ] **Step 3: Write `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

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
  id               String            @id @default(cuid())
  email            String            @unique
  passwordHash     String?
  name             String?
  ageBand          AgeBand?
  createdAt        DateTime          @default(now())

  accounts         Account[]
  sessions         Session[]
  progress         UserProgress[]
  tutorialSessions TutorialSession[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Tutorial {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  summary     String
  category    String
  safetyLevel String
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  steps            TutorialStep[]
  progress         UserProgress[]
  tutorialSessions TutorialSession[]
}

model TutorialStep {
  id              String   @id @default(cuid())
  tutorialId      String
  order           Int
  title           String
  contentSimple   String
  contentStandard String
  contentDetailed String
  imageUrl        String?
  safetyWarning   String?

  tutorial Tutorial       @relation(fields: [tutorialId], references: [id])
  progress UserProgress[]

  @@unique([tutorialId, order])
}

model UserProgress {
  id          String   @id @default(cuid())
  userId      String
  tutorialId  String
  stepId      String
  completedAt DateTime @default(now())

  user     User         @relation(fields: [userId], references: [id])
  tutorial Tutorial     @relation(fields: [tutorialId], references: [id])
  step     TutorialStep @relation(fields: [stepId], references: [id])

  @@unique([userId, stepId])
}

model TutorialSession {
  id            String   @id @default(cuid())
  userId        String
  tutorialId    String
  startedAt     DateTime @default(now())
  lastMessageAt DateTime @default(now())

  user     User                  @relation(fields: [userId], references: [id])
  tutorial Tutorial              @relation(fields: [tutorialId], references: [id])
  messages ConversationMessage[]
}

model ConversationMessage {
  id        String          @id @default(cuid())
  sessionId String
  role      MessageRole
  content   String
  createdAt DateTime        @default(now())

  session TutorialSession @relation(fields: [sessionId], references: [id])
}
```

- [ ] **Step 4: Write `src/lib/prisma.ts`**

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 5: Write `.env.example`**

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lifeskills"

NEXTAUTH_SECRET="replace-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""

AUTH_APPLE_ENABLED="false"
AUTH_APPLE_ID=""
AUTH_APPLE_SECRET=""

AI_PROVIDER="claude"
ANTHROPIC_API_KEY=""
OPENAI_API_KEY=""
AI_SESSION_TIMEOUT_MINUTES="120"

NVIDIA_API_KEY=""
SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""
SUPABASE_STORAGE_BUCKET="tutorial-images"
```

- [ ] **Step 6: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

- [ ] **Step 7: Validate schema and generate client**

Run: `npx prisma validate`
Expected: `The schema at prisma/schema.prisma is valid 🚀`

Run: `npx prisma generate`
Expected: Prisma Client generated successfully.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json .env.example prisma/schema.prisma src/lib/prisma.ts vitest.config.ts
git commit -m "feat: add Prisma schema, DB client, and project dependencies"
```

---

### Task 2: Auth.js — credentials + Google + Apple-stubbed, signup, age-band onboarding

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/types/next-auth.d.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/app/api/signup/route.ts`
- Create: `src/app/api/onboarding/age-band/route.ts`
- Create: `src/app/signup/page.tsx`
- Create: `src/app/signin/page.tsx`
- Create: `src/app/onboarding/age-band/page.tsx`
- Test: `tests/signup.test.ts`

**Interfaces:**
- Consumes: `prisma` from `src/lib/prisma.ts` (Task 1).
- Produces: `auth()` (server-side session getter), `signIn`/`signOut`, `handlers` exported from `src/lib/auth.ts`, used by every later page/route that needs the current user.
- Produces: session `user.ageBand: AgeBand | null` available via `auth()`.

- [ ] **Step 1: Write the failing test for signup validation**

```ts
// tests/signup.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { signupSchema, hashPassword } from "@/app/api/signup/route";

describe("signupSchema", () => {
  it("rejects an invalid email", () => {
    const result = signupSchema.safeParse({
      email: "not-an-email",
      password: "supersecret1",
      ageBand: "AGE_12_15",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = signupSchema.safeParse({
      email: "kid@example.com",
      password: "short",
      ageBand: "AGE_12_15",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid signup payload", () => {
    const result = signupSchema.safeParse({
      email: "kid@example.com",
      password: "supersecret1",
      ageBand: "AGE_12_15",
    });
    expect(result.success).toBe(true);
  });
});

describe("hashPassword", () => {
  it("produces a bcrypt hash different from the plaintext", async () => {
    const hash = await hashPassword("supersecret1");
    expect(hash).not.toBe("supersecret1");
    expect(hash.startsWith("$2")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/signup.test.ts`
Expected: FAIL — `Cannot find module '@/app/api/signup/route'`

- [ ] **Step 3: Write the Auth.js type augmentation**

```ts
// src/types/next-auth.d.ts
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      ageBand: "AGE_8_11" | "AGE_12_15" | "AGE_16_18" | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    ageBand?: "AGE_8_11" | "AGE_12_15" | "AGE_16_18" | null;
  }
}
```

- [ ] **Step 4: Write `src/lib/auth.ts`**

```ts
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email as string | undefined;
      const password = credentials?.password as string | undefined;
      if (!email || !password) return null;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.passwordHash) return null;

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return null;

      return { id: user.id, email: user.email, name: user.name ?? undefined };
    },
  }),
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }),
];

if (process.env.AUTH_APPLE_ENABLED === "true") {
  providers.push(
    Apple({
      clientId: process.env.AUTH_APPLE_ID,
      clientSecret: process.env.AUTH_APPLE_SECRET,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { ageBand: true },
        });
        token.ageBand = dbUser?.ageBand ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.ageBand = (token.ageBand as string | null) ?? null;
      }
      return session;
    },
  },
});

export const appleSignInEnabled = process.env.AUTH_APPLE_ENABLED === "true";
```

- [ ] **Step 5: Write `src/app/api/auth/[...nextauth]/route.ts`**

```ts
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 6: Write `src/app/api/signup/route.ts`**

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  ageBand: z.enum(["AGE_8_11", "AGE_12_15", "AGE_16_18"]),
});

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your email, password, and age selection." },
      { status: 400 }
    );
  }

  const { email, password, ageBand } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  try {
    await prisma.user.create({
      data: { email, passwordHash, ageBand },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong creating your account. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run tests/signup.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 8: Write age-band onboarding route for OAuth users**

```ts
// src/app/api/onboarding/age-band/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  ageBand: z.enum(["AGE_8_11", "AGE_12_15", "AGE_16_18"]),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to be signed in." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please choose an age range." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { ageBand: parsed.data.ageBand },
  });

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 9: Write signup, signin, and onboarding pages**

```tsx
// src/app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const AGE_BANDS = [
  { value: "AGE_8_11", label: "8–11" },
  { value: "AGE_12_15", label: "12–15" },
  { value: "AGE_16_18", label: "16–18" },
] as const;

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageBand, setAgeBand] = useState<(typeof AGE_BANDS)[number]["value"]>("AGE_12_15");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, ageBand }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Something went wrong." }));
      setError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/tutorials");
  }

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Create your account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <label className="text-sm font-medium">How old are you?</label>
        <select
          value={ageBand}
          onChange={(e) => setAgeBand(e.target.value as typeof ageBand)}
          className="rounded border px-3 py-2"
        >
          {AGE_BANDS.map((band) => (
            <option key={band.value} value={band.value}>
              {band.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/onboarding/age-band" })}
        className="rounded border px-3 py-2"
      >
        Continue with Google
      </button>
    </main>
  );
}
```

```tsx
// src/app/signin/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn("credentials", { email, password, redirect: false });
    setSubmitting(false);

    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push("/tutorials");
  }

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/onboarding/age-band" })}
        className="rounded border px-3 py-2"
      >
        Continue with Google
      </button>
    </main>
  );
}
```

```tsx
// src/app/onboarding/age-band/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AGE_BANDS = [
  { value: "AGE_8_11", label: "8–11" },
  { value: "AGE_12_15", label: "12–15" },
  { value: "AGE_16_18", label: "16–18" },
] as const;

export default function AgeBandOnboardingPage() {
  const router = useRouter();
  const [ageBand, setAgeBand] = useState<(typeof AGE_BANDS)[number]["value"]>("AGE_12_15");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/onboarding/age-band", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ageBand }),
    });

    if (!res.ok) {
      setError("Couldn't save that. Please try again.");
      return;
    }
    router.push("/tutorials");
  }

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">One more thing — how old are you?</h1>
      <p className="text-sm text-gray-600">
        This helps us explain things at the right level for you.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <select
          value={ageBand}
          onChange={(e) => setAgeBand(e.target.value as typeof ageBand)}
          className="rounded border px-3 py-2"
        >
          {AGE_BANDS.map((band) => (
            <option key={band.value} value={band.value}>
              {band.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="rounded bg-black px-3 py-2 text-white">
          Continue
        </button>
      </form>
    </main>
  );
}
```

- [ ] **Step 10: Commit**

```bash
git add src/lib/auth.ts src/types/next-auth.d.ts src/app/api/auth src/app/api/signup src/app/api/onboarding src/app/signup src/app/signin src/app/onboarding tests/signup.test.ts
git commit -m "feat: add Auth.js (credentials + Google, Apple stubbed) and signup/onboarding flow"
```

---

### Task 3: AI provider adapter (Claude + OpenAI) + factory + system prompt

**Files:**
- Create: `src/lib/ai/types.ts`
- Create: `src/lib/ai/system-prompt.ts`
- Create: `src/lib/ai/claude-provider.ts`
- Create: `src/lib/ai/openai-provider.ts`
- Create: `src/lib/ai/get-provider.ts`
- Test: `tests/ai/claude-provider.test.ts`
- Test: `tests/ai/openai-provider.test.ts`
- Test: `tests/ai/get-provider.test.ts`

**Interfaces:**
- Produces: `AIProvider` interface, `Message`, `CompanionContext` types from `src/lib/ai/types.ts` — consumed by Task 4 (chat route).
- Produces: `getAIProvider(): AIProvider` factory from `src/lib/ai/get-provider.ts` — the only import Task 4 uses to reach a provider.
- Produces: `buildSystemPrompt(ctx: CompanionContext): string` from `src/lib/ai/system-prompt.ts`.

- [ ] **Step 1: Write `src/lib/ai/types.ts`**

```ts
export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface CompanionContext {
  ageBand: "AGE_8_11" | "AGE_12_15" | "AGE_16_18";
  tutorialTitle: string;
  currentStepTitle: string;
}

export interface AIProvider {
  sendMessage(
    history: Message[],
    userMessage: string,
    ctx: CompanionContext
  ): Promise<string>;
}
```

- [ ] **Step 2: Write `src/lib/ai/system-prompt.ts`**

```ts
import type { CompanionContext } from "@/lib/ai/types";

const AGE_BAND_GUIDANCE: Record<CompanionContext["ageBand"], string> = {
  AGE_8_11:
    "The learner is 8–11. Use very short sentences, simple everyday words, and concrete examples. Never assume they can use sharp tools or electrical equipment without an adult present — always say so.",
  AGE_12_15:
    "The learner is 12–15. Use clear, plain language. They can follow multi-step instructions but may still need adult supervision for anything involving electricity, vehicles, or sharp tools — say so when relevant.",
  AGE_16_18:
    "The learner is 16–18. Use clear, direct language similar to a patient mentor talking to a young adult. They can generally work more independently, but still flag genuine safety risks.",
};

export function buildSystemPrompt(ctx: CompanionContext): string {
  return [
    "You are a supportive, patient mentor helping a young person learn a practical life skill.",
    "Your tone is consistent, encouraging, and non-judgmental. Never mock a question, no matter how basic.",
    "Stay task-focused: help the learner understand and complete the current step. Do not go off-topic.",
    "Explain in simple, plain language. Avoid jargon unless you immediately explain it.",
    `Age guidance: ${AGE_BAND_GUIDANCE[ctx.ageBand]}`,
    `The learner is currently working through the tutorial "${ctx.tutorialTitle}", on the step "${ctx.currentStepTitle}".`,
    "If a question strays into something genuinely dangerous (e.g. working on live electrical circuits, structural repairs, anything requiring a licensed professional), say so clearly and recommend involving a trusted adult or professional instead of guessing.",
  ].join("\n");
}
```

- [ ] **Step 3: Write the failing test for the Claude provider**

```ts
// tests/ai/claude-provider.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const createMock = vi.fn();

vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      messages: { create: createMock },
    })),
  };
});

import { ClaudeProvider } from "@/lib/ai/claude-provider";

describe("ClaudeProvider", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it("sends history + system prompt and returns the text response", async () => {
    createMock.mockResolvedValue({
      content: [{ type: "text", text: "You've got this! Let's loosen the lug nuts first." }],
    });

    const provider = new ClaudeProvider("fake-key");
    const result = await provider.sendMessage(
      [{ role: "user", content: "How do I start?" }],
      "What tool do I need?",
      {
        ageBand: "AGE_12_15",
        tutorialTitle: "Changing a Tire",
        currentStepTitle: "Loosen the lug nuts",
      }
    );

    expect(result).toBe("You've got this! Let's loosen the lug nuts first.");
    expect(createMock).toHaveBeenCalledTimes(1);
    const callArgs = createMock.mock.calls[0][0];
    expect(callArgs.system).toContain("Changing a Tire");
    expect(callArgs.messages).toHaveLength(2);
    expect(callArgs.messages[1]).toEqual({ role: "user", content: "What tool do I need?" });
  });

  it("throws a friendly error when the API call fails", async () => {
    createMock.mockRejectedValue(new Error("network error"));
    const provider = new ClaudeProvider("fake-key");

    await expect(
      provider.sendMessage([], "hi", {
        ageBand: "AGE_8_11",
        tutorialTitle: "Wiring a Plug",
        currentStepTitle: "Get your tools",
      })
    ).rejects.toThrow("AI companion is unavailable right now");
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run tests/ai/claude-provider.test.ts`
Expected: FAIL — `Cannot find module '@/lib/ai/claude-provider'`

- [ ] **Step 5: Write `src/lib/ai/claude-provider.ts`**

```ts
import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider, CompanionContext, Message } from "@/lib/ai/types";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";

export class ClaudeProvider implements AIProvider {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async sendMessage(
    history: Message[],
    userMessage: string,
    ctx: CompanionContext
  ): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 500,
        system: buildSystemPrompt(ctx),
        messages: [...history, { role: "user", content: userMessage }],
      });

      const textBlock = response.content.find((block) => block.type === "text");
      return textBlock && "text" in textBlock ? textBlock.text : "";
    } catch {
      throw new Error("AI companion is unavailable right now. Please try again in a moment.");
    }
  }
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run tests/ai/claude-provider.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 7: Write the failing test for the OpenAI provider**

```ts
// tests/ai/openai-provider.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const createMock = vi.fn();

vi.mock("openai", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: { completions: { create: createMock } },
    })),
  };
});

import { OpenAIProvider } from "@/lib/ai/openai-provider";

describe("OpenAIProvider", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it("sends history + system prompt and returns the message content", async () => {
    createMock.mockResolvedValue({
      choices: [{ message: { content: "Great question! Grab a screwdriver first." } }],
    });

    const provider = new OpenAIProvider("fake-key");
    const result = await provider.sendMessage(
      [{ role: "user", content: "hi" }],
      "What do I need?",
      {
        ageBand: "AGE_16_18",
        tutorialTitle: "Wiring a Plug",
        currentStepTitle: "Gather your tools",
      }
    );

    expect(result).toBe("Great question! Grab a screwdriver first.");
    const callArgs = createMock.mock.calls[0][0];
    expect(callArgs.messages[0]).toEqual({
      role: "system",
      content: expect.stringContaining("Wiring a Plug"),
    });
  });

  it("throws a friendly error when the API call fails", async () => {
    createMock.mockRejectedValue(new Error("network error"));
    const provider = new OpenAIProvider("fake-key");

    await expect(
      provider.sendMessage([], "hi", {
        ageBand: "AGE_8_11",
        tutorialTitle: "Wiring a Plug",
        currentStepTitle: "Get your tools",
      })
    ).rejects.toThrow("AI companion is unavailable right now");
  });
});
```

- [ ] **Step 8: Write `src/lib/ai/openai-provider.ts`**

```ts
import OpenAI from "openai";
import type { AIProvider, CompanionContext, Message } from "@/lib/ai/types";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async sendMessage(
    history: Message[],
    userMessage: string,
    ctx: CompanionContext
  ): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: buildSystemPrompt(ctx) },
          ...history.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: userMessage },
        ],
      });

      return response.choices[0]?.message?.content ?? "";
    } catch {
      throw new Error("AI companion is unavailable right now. Please try again in a moment.");
    }
  }
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npx vitest run tests/ai/openai-provider.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 10: Write the failing test for the factory**

```ts
// tests/ai/get-provider.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/ai/claude-provider", () => ({
  ClaudeProvider: vi.fn().mockImplementation((key: string) => ({ __kind: "claude", key })),
}));
vi.mock("@/lib/ai/openai-provider", () => ({
  OpenAIProvider: vi.fn().mockImplementation((key: string) => ({ __kind: "openai", key })),
}));

import { getAIProvider } from "@/lib/ai/get-provider";

describe("getAIProvider", () => {
  const originalEnv = { ...process.env };
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns a ClaudeProvider when AI_PROVIDER=claude", () => {
    process.env.AI_PROVIDER = "claude";
    process.env.ANTHROPIC_API_KEY = "key-a";
    const provider = getAIProvider() as unknown as { __kind: string };
    expect(provider.__kind).toBe("claude");
  });

  it("returns an OpenAIProvider when AI_PROVIDER=openai", () => {
    process.env.AI_PROVIDER = "openai";
    process.env.OPENAI_API_KEY = "key-b";
    const provider = getAIProvider() as unknown as { __kind: string };
    expect(provider.__kind).toBe("openai");
  });

  it("throws when AI_PROVIDER is unset or unknown", () => {
    delete process.env.AI_PROVIDER;
    expect(() => getAIProvider()).toThrow("Unknown AI_PROVIDER");
  });
});
```

- [ ] **Step 11: Run test to verify it fails**

Run: `npx vitest run tests/ai/get-provider.test.ts`
Expected: FAIL — `Cannot find module '@/lib/ai/get-provider'`

- [ ] **Step 12: Write `src/lib/ai/get-provider.ts`**

```ts
import type { AIProvider } from "@/lib/ai/types";
import { ClaudeProvider } from "@/lib/ai/claude-provider";
import { OpenAIProvider } from "@/lib/ai/openai-provider";

export function getAIProvider(): AIProvider {
  const providerName = process.env.AI_PROVIDER;

  if (providerName === "claude") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set.");
    return new ClaudeProvider(apiKey);
  }

  if (providerName === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not set.");
    return new OpenAIProvider(apiKey);
  }

  throw new Error(
    `Unknown AI_PROVIDER "${providerName}". Set AI_PROVIDER to "claude" or "openai".`
  );
}
```

- [ ] **Step 13: Run all AI tests to verify they pass**

Run: `npx vitest run tests/ai`
Expected: PASS (7 tests total)

- [ ] **Step 14: Commit**

```bash
git add src/lib/ai tests/ai
git commit -m "feat: add swappable AI provider adapter (Claude + OpenAI) with mentor system prompt"
```

---

### Task 4: Session-scoped memory logic + chat API route

**Files:**
- Create: `src/lib/ai/session.ts`
- Create: `src/app/api/chat/route.ts`
- Test: `tests/ai/session.test.ts`

**Interfaces:**
- Consumes: `prisma` (Task 1), `getAIProvider`, `Message`, `CompanionContext` (Task 3).
- Produces: `getOrCreateActiveSession(userId, tutorialId, timeoutMinutes): Promise<{ id: string; messages: Message[] }>` from `src/lib/ai/session.ts`, used by the chat route and by Task 9's e2e test indirectly via the API.

- [ ] **Step 1: Write the failing test for session-boundary logic**

```ts
// tests/ai/session.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const findFirst = vi.fn();
const create = vi.fn();
const update = vi.fn();
const findMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tutorialSession: { findFirst, create, update },
    conversationMessage: { findMany },
  },
}));

import { getOrCreateActiveSession } from "@/lib/ai/session";

describe("getOrCreateActiveSession", () => {
  beforeEach(() => {
    findFirst.mockReset();
    create.mockReset();
    update.mockReset();
    findMany.mockReset();
  });

  it("reuses an active session within the timeout window", async () => {
    const now = new Date("2026-08-15T12:00:00Z");
    vi.setSystemTime(now);

    findFirst.mockResolvedValue({
      id: "session-1",
      lastMessageAt: new Date("2026-08-15T11:30:00Z"),
    });
    findMany.mockResolvedValue([
      { role: "USER", content: "hi" },
      { role: "ASSISTANT", content: "hello!" },
    ]);
    update.mockResolvedValue({});

    const result = await getOrCreateActiveSession("user-1", "tutorial-1", 120);

    expect(result.id).toBe("session-1");
    expect(result.messages).toEqual([
      { role: "user", content: "hi" },
      { role: "assistant", content: "hello!" },
    ]);
    expect(create).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith({
      where: { id: "session-1" },
      data: { lastMessageAt: now },
    });
  });

  it("starts a new session when the previous one is past the timeout", async () => {
    const now = new Date("2026-08-15T12:00:00Z");
    vi.setSystemTime(now);

    findFirst.mockResolvedValue({
      id: "session-old",
      lastMessageAt: new Date("2026-08-15T09:00:00Z"),
    });
    create.mockResolvedValue({ id: "session-new" });

    const result = await getOrCreateActiveSession("user-1", "tutorial-1", 120);

    expect(result.id).toBe("session-new");
    expect(result.messages).toEqual([]);
    expect(create).toHaveBeenCalledWith({
      data: { userId: "user-1", tutorialId: "tutorial-1" },
    });
  });

  it("starts a new session when none exists yet", async () => {
    vi.setSystemTime(new Date("2026-08-15T12:00:00Z"));
    findFirst.mockResolvedValue(null);
    create.mockResolvedValue({ id: "session-new" });

    const result = await getOrCreateActiveSession("user-1", "tutorial-1", 120);

    expect(result.id).toBe("session-new");
    expect(result.messages).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ai/session.test.ts`
Expected: FAIL — `Cannot find module '@/lib/ai/session'`

- [ ] **Step 3: Write `src/lib/ai/session.ts`**

```ts
import { prisma } from "@/lib/prisma";
import type { Message } from "@/lib/ai/types";

export async function getOrCreateActiveSession(
  userId: string,
  tutorialId: string,
  timeoutMinutes: number
): Promise<{ id: string; messages: Message[] }> {
  const now = new Date();

  const latest = await prisma.tutorialSession.findFirst({
    where: { userId, tutorialId },
    orderBy: { lastMessageAt: "desc" },
  });

  const isActive =
    latest !== null &&
    now.getTime() - latest.lastMessageAt.getTime() <= timeoutMinutes * 60 * 1000;

  if (latest && isActive) {
    await prisma.tutorialSession.update({
      where: { id: latest.id },
      data: { lastMessageAt: now },
    });

    const history = await prisma.conversationMessage.findMany({
      where: { sessionId: latest.id },
      orderBy: { createdAt: "asc" },
    });

    return {
      id: latest.id,
      messages: history.map((m) => ({
        role: m.role === "USER" ? "user" : "assistant",
        content: m.content,
      })),
    };
  }

  const created = await prisma.tutorialSession.create({
    data: { userId, tutorialId },
  });

  return { id: created.id, messages: [] };
}

export async function startNewSession(
  userId: string,
  tutorialId: string
): Promise<{ id: string; messages: Message[] }> {
  const created = await prisma.tutorialSession.create({
    data: { userId, tutorialId },
  });
  return { id: created.id, messages: [] };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/ai/session.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Write `src/app/api/chat/route.ts`**

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAIProvider } from "@/lib/ai/get-provider";
import { getOrCreateActiveSession, startNewSession } from "@/lib/ai/session";

const bodySchema = z.object({
  tutorialId: z.string(),
  stepId: z.string(),
  message: z.string().min(1).max(2000),
  startNew: z.boolean().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.ageBand) {
    return NextResponse.json({ error: "You need to be signed in." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "That message couldn't be sent." }, { status: 400 });
  }

  const { tutorialId, stepId, message, startNew } = parsed.data;

  const [tutorial, step] = await Promise.all([
    prisma.tutorial.findUnique({ where: { id: tutorialId } }),
    prisma.tutorialStep.findUnique({ where: { id: stepId } }),
  ]);

  if (!tutorial || !step) {
    return NextResponse.json({ error: "That tutorial step couldn't be found." }, { status: 404 });
  }

  const timeoutMinutes = Number(process.env.AI_SESSION_TIMEOUT_MINUTES ?? "120");

  const activeSession = startNew
    ? await startNewSession(session.user.id, tutorialId)
    : await getOrCreateActiveSession(session.user.id, tutorialId, timeoutMinutes);

  let reply: string;
  try {
    const provider = getAIProvider();
    reply = await provider.sendMessage(activeSession.messages, message, {
      ageBand: session.user.ageBand as "AGE_8_11" | "AGE_12_15" | "AGE_16_18",
      tutorialTitle: tutorial.title,
      currentStepTitle: step.title,
    });
  } catch (err) {
    const friendlyMessage =
      err instanceof Error ? err.message : "AI companion is unavailable right now.";
    return NextResponse.json({ error: friendlyMessage }, { status: 502 });
  }

  await prisma.conversationMessage.createMany({
    data: [
      { sessionId: activeSession.id, role: "USER", content: message },
      { sessionId: activeSession.id, role: "ASSISTANT", content: reply },
    ],
  });

  return NextResponse.json({ sessionId: activeSession.id, reply });
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/ai/session.ts src/app/api/chat tests/ai/session.test.ts
git commit -m "feat: add session-scoped AI memory boundary and chat API route"
```

---

### Task 5: NVIDIA image provider + admin image-generation script

**Files:**
- Create: `src/lib/images/nvidia-provider.ts`
- Create: `scripts/generate-tutorial-images.ts`
- Test: `tests/images/nvidia-provider.test.ts`

**Interfaces:**
- Produces: `generateImage(prompt: string): Promise<Buffer>` from `src/lib/images/nvidia-provider.ts`, consumed only by `scripts/generate-tutorial-images.ts`.

- [ ] **Step 1: Write the failing test for the NVIDIA provider**

```ts
// tests/images/nvidia-provider.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

import { generateImage } from "@/lib/images/nvidia-provider";

describe("generateImage", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    process.env.NVIDIA_API_KEY = "fake-key";
  });

  it("returns image bytes decoded from a base64 API response", async () => {
    const base64Payload = Buffer.from("fake-image-bytes").toString("base64");
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ image: base64Payload }),
    });

    const result = await generateImage("a hand loosening a lug nut with a wrench, diagram");

    expect(result.toString()).toBe("fake-image-bytes");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws a friendly error when the API responds with a failure", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });

    await expect(generateImage("prompt")).rejects.toThrow(
      "NVIDIA image generation failed"
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/images/nvidia-provider.test.ts`
Expected: FAIL — `Cannot find module '@/lib/images/nvidia-provider'`

- [ ] **Step 3: Write `src/lib/images/nvidia-provider.ts`**

```ts
const NVIDIA_IMAGE_ENDPOINT =
  "https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-3-medium";

export async function generateImage(prompt: string): Promise<Buffer> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not set.");
  }

  const response = await fetch(NVIDIA_IMAGE_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: `simple, clear, friendly instructional illustration: ${prompt}`,
      cfg_scale: 5,
      aspect_ratio: "16:9",
      seed: 0,
      steps: 30,
    }),
  });

  if (!response.ok) {
    throw new Error(`NVIDIA image generation failed with status ${response.status}`);
  }

  const data = (await response.json()) as { image: string };
  return Buffer.from(data.image, "base64");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/images/nvidia-provider.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Write `scripts/generate-tutorial-images.ts`**

```ts
import { createClient } from "@supabase/supabase-js";
import { prisma } from "../src/lib/prisma";
import { generateImage } from "../src/lib/images/nvidia-provider";

async function main() {
  const force = process.argv.includes("--force");

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "tutorial-images";
  if (!supabaseUrl || !serviceKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
  }
  const supabase = createClient(supabaseUrl, serviceKey);

  const steps = await prisma.tutorialStep.findMany({
    where: force ? {} : { imageUrl: null },
    include: { tutorial: true },
  });

  console.log(`Generating images for ${steps.length} step(s)...`);

  for (const step of steps) {
    const prompt = `${step.tutorial.title} — ${step.title}: ${step.contentStandard}`;
    console.log(`- ${step.tutorial.slug} / step ${step.order}: ${step.title}`);

    try {
      const imageBuffer = await generateImage(prompt);
      const path = `${step.tutorialId}/${step.id}.png`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, imageBuffer, { contentType: "image/png", upsert: true });

      if (uploadError) {
        console.error(`  upload failed: ${uploadError.message}`);
        continue;
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);

      await prisma.tutorialStep.update({
        where: { id: step.id },
        data: { imageUrl: publicUrlData.publicUrl },
      });

      console.log(`  done -> ${publicUrlData.publicUrl}`);
    } catch (err) {
      console.error(`  failed: ${err instanceof Error ? err.message : err}`);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/images scripts/generate-tutorial-images.ts tests/images
git commit -m "feat: add NVIDIA image provider and admin tutorial-image generation script"
```

---

### Task 6: Seed script with 2 full tutorials

**Files:**
- Create: `prisma/seed.ts`

**Interfaces:**
- Consumes: `prisma` (Task 1).
- Produces: seeded `Tutorial` rows with slugs `changing-a-tire` and `wiring-a-plug`, consumed by Task 7 (tutorial pages) and Task 9 (e2e test).

- [ ] **Step 1: Write `prisma/seed.ts`**

```ts
import { prisma } from "../src/lib/prisma";

async function main() {
  const tire = await prisma.tutorial.upsert({
    where: { slug: "changing-a-tire" },
    update: {},
    create: {
      slug: "changing-a-tire",
      title: "Changing a Flat Tire",
      summary: "Learn how to safely change a flat tire on a car, step by step.",
      category: "Vehicle Maintenance",
      safetyLevel: "requires-adult-supervision",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Get to safety first",
            contentSimple:
              "If your tire goes flat, pull over somewhere flat and away from traffic. Turn on your hazard lights.",
            contentStandard:
              "Before touching anything, get the car to a flat, stable spot away from moving traffic, and turn on your hazard lights so other drivers can see you.",
            contentDetailed:
              "Safety comes first. Move the vehicle to a flat, stable location away from traffic, engage the parking brake, and turn on hazard lights. If you're near a busy road, consider calling for roadside help instead of working next to traffic.",
            safetyWarning: "Never change a tire on the side of a busy road — call for help instead.",
          },
          {
            order: 2,
            title: "Gather your tools",
            contentSimple:
              "You need: the spare tire, a jack, and a lug wrench. They're usually in the trunk.",
            contentStandard:
              "Find the spare tire, jack, and lug wrench — most cars store these under the trunk floor or in a side panel.",
            contentDetailed:
              "Locate the spare tire, jack, and lug wrench, typically stowed under the trunk floor or in a side compartment. Check your car's manual if you're not sure where they are.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Loosen the lug nuts",
            contentSimple:
              "Turn the lug nuts a little bit to the left with the wrench, but don't take them all the way off yet.",
            contentStandard:
              "Using the lug wrench, turn each lug nut counterclockwise about a quarter turn to loosen it. Don't remove them fully yet — the tire is still on the ground.",
            contentDetailed:
              "With the tire still on the ground for resistance, use the lug wrench to break each lug nut loose by turning counterclockwise about a quarter turn. Full removal happens after the car is jacked up.",
            safetyWarning: "Keep the tire on the ground while loosening — it stops the wheel from spinning.",
          },
          {
            order: 4,
            title: "Raise the car with the jack",
            contentSimple:
              "Put the jack under the car near the flat tire and turn it until the tire lifts off the ground.",
            contentStandard:
              "Position the jack under the car's designated jack point near the flat tire, then raise it until the tire is a few centimetres off the ground.",
            contentDetailed:
              "Place the jack under the manufacturer's designated jack point closest to the flat tire (check your manual), and raise the vehicle until the flat tire is fully off the ground.",
            safetyWarning: "Never put any part of your body under the car while it's on the jack.",
          },
          {
            order: 5,
            title: "Remove the flat and fit the spare",
            contentSimple:
              "Finish unscrewing the lug nuts, pull off the flat tire, and put the spare on in its place.",
            contentStandard:
              "Remove the lug nuts fully, pull the flat tire straight off, then line up the spare tire with the bolts and push it on.",
            contentDetailed:
              "Fully remove the lug nuts and set them aside, pull the flat tire straight off the hub, then mount the spare by aligning it with the wheel bolts and pressing it into place.",
            safetyWarning: null,
          },
          {
            order: 6,
            title: "Tighten and lower the car",
            contentSimple:
              "Screw the lug nuts back on by hand, lower the car, then tighten them firmly with the wrench in a star pattern.",
            contentStandard:
              "Hand-tighten the lug nuts, lower the car back down with the jack, then fully tighten each nut in a star (criss-cross) pattern for even pressure.",
            contentDetailed:
              "Hand-tighten the lug nuts first, lower the vehicle fully with the jack, then use the lug wrench to tighten each nut firmly in a star (criss-cross) pattern to seat the wheel evenly.",
            safetyWarning: "Drive slowly to a garage afterwards — spare tires are usually temporary.",
          },
        ],
      },
    },
  });

  const plug = await prisma.tutorial.upsert({
    where: { slug: "wiring-a-plug" },
    update: {},
    create: {
      slug: "wiring-a-plug",
      title: "Wiring a Plug",
      summary: "Learn how to safely wire a UK-style 3-pin plug.",
      category: "Home Repairs",
      safetyLevel: "requires-adult-supervision",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Make sure it's unplugged",
            contentSimple:
              "Never work on a plug that's connected to a wall socket or turned on.",
            contentStandard:
              "Before doing anything, make sure the plug is completely disconnected from any power source and the cable isn't plugged in anywhere.",
            contentDetailed:
              "Confirm the cable is fully disconnected from any power source before starting. Never work on wiring that could be live — this step is non-negotiable.",
            safetyWarning: "Never touch wiring that could be connected to power. Ask an adult to double-check.",
          },
          {
            order: 2,
            title: "Gather your tools",
            contentSimple: "You need a screwdriver and wire strippers.",
            contentStandard:
              "You'll need a flathead and/or Phillips screwdriver, and wire strippers.",
            contentDetailed:
              "Gather a flathead screwdriver, a Phillips screwdriver, and a pair of wire strippers rated for the cable's gauge.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Open the plug",
            contentSimple: "Unscrew the plug case and take the cover off.",
            contentStandard: "Undo the screw holding the plug case together and lift the cover off.",
            contentDetailed:
              "Unscrew the retaining screw on the plug casing and remove the cover to expose the terminal block.",
            safetyWarning: null,
          },
          {
            order: 4,
            title: "Connect the wires to the right terminals",
            contentSimple:
              "Brown wire goes to L, blue wire goes to N, green-and-yellow wire goes to E. Ask an adult to check.",
            contentStandard:
              "Connect the brown wire to the L (live) terminal, the blue wire to the N (neutral) terminal, and the green-and-yellow wire to the E (earth) terminal.",
            contentDetailed:
              "Match each wire to its terminal: brown to L (live), blue to N (neutral), green-and-yellow to E (earth). Strip only enough insulation to fit the terminal, and make sure no bare wire is exposed outside it.",
            safetyWarning: "Getting this wrong can be dangerous — always have an adult check your work before use.",
          },
          {
            order: 5,
            title: "Close up and check the fuse",
            contentSimple:
              "Put the cover back on and screw it shut. Check the fuse matches what the device needs.",
            contentStandard:
              "Replace the cover and secure the screw. Make sure the fuse rating matches what's recommended for the appliance.",
            contentDetailed:
              "Reattach the cover and tighten the retaining screw fully. Verify the fitted fuse matches the appliance's rated current — using the wrong fuse is a fire risk.",
            safetyWarning: "Have an adult do a final check before the plug is ever used.",
          },
        ],
      },
    },
  });

  console.log(`Seeded tutorials: ${tire.slug}, ${plug.slug}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 2: Run migration and seed against a dev database**

Run: `npm run db:migrate -- --name init`
Expected: Migration applied, Prisma Client regenerated.

Run: `npm run db:seed`
Expected: `Seeded tutorials: changing-a-tire, wiring-a-plug`

- [ ] **Step 3: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: seed changing-a-tire and wiring-a-plug tutorials"
```

---

### Task 7: Tutorial library page, tutorial detail page, chat panel UI

**Files:**
- Create: `src/app/tutorials/page.tsx`
- Create: `src/app/tutorials/[slug]/page.tsx`
- Create: `src/components/TutorialSteps.tsx`
- Create: `src/components/ChatPanel.tsx`

**Interfaces:**
- Consumes: `auth()` (Task 2), `prisma` (Task 1), `POST /api/chat` (Task 4), `POST /api/progress` (Task 8 — wired here, implemented next task).
- Produces: `<TutorialSteps>` and `<ChatPanel>` components reused by Task 8 for progress wiring.

- [ ] **Step 1: Write `src/app/tutorials/page.tsx`**

```tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TutorialsPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (!session.user.ageBand) redirect("/onboarding/age-band");

  const tutorials = await prisma.tutorial.findMany({
    where: { published: true },
    orderBy: { title: "asc" },
  });

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Tutorials</h1>
      <ul className="flex flex-col gap-3">
        {tutorials.map((tutorial) => (
          <li key={tutorial.id}>
            <Link
              href={`/tutorials/${tutorial.slug}`}
              className="block rounded border p-4 hover:bg-gray-50"
            >
              <p className="font-medium">{tutorial.title}</p>
              <p className="text-sm text-gray-600">{tutorial.summary}</p>
            </Link>
          </li>
        ))}
        {tutorials.length === 0 && (
          <p className="text-sm text-gray-600">
            No tutorials are published yet. Run <code>npm run db:seed</code> to add some.
          </p>
        )}
      </ul>
    </main>
  );
}
```

- [ ] **Step 2: Write `src/components/TutorialSteps.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ChatPanel } from "@/components/ChatPanel";

type AgeBand = "AGE_8_11" | "AGE_12_15" | "AGE_16_18";

interface Step {
  id: string;
  order: number;
  title: string;
  contentSimple: string;
  contentStandard: string;
  contentDetailed: string;
  imageUrl: string | null;
  safetyWarning: string | null;
}

function contentForAgeBand(step: Step, ageBand: AgeBand): string {
  if (ageBand === "AGE_8_11") return step.contentSimple;
  if (ageBand === "AGE_12_15") return step.contentStandard;
  return step.contentDetailed;
}

export function TutorialSteps({
  tutorialId,
  tutorialTitle,
  steps,
  ageBand,
  completedStepIds,
}: {
  tutorialId: string;
  tutorialTitle: string;
  steps: Step[];
  ageBand: AgeBand;
  completedStepIds: string[];
}) {
  const [completed, setCompleted] = useState(new Set(completedStepIds));
  const [activeStepId, setActiveStepId] = useState(steps[0]?.id ?? null);

  async function toggleComplete(stepId: string) {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutorialId, stepId }),
    });
    if (!res.ok) return;
    setCompleted((prev) => new Set(prev).add(stepId));
  }

  const activeStep = steps.find((s) => s.id === activeStepId) ?? steps[0];

  return (
    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
        {steps.map((step) => (
          <section
            key={step.id}
            className={`rounded border p-4 ${activeStepId === step.id ? "border-black" : ""}`}
            onClick={() => setActiveStepId(step.id)}
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-medium">
                {step.order}. {step.title}
              </h2>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComplete(step.id);
                }}
                className={`rounded px-2 py-1 text-xs ${
                  completed.has(step.id) ? "bg-green-100 text-green-800" : "border"
                }`}
              >
                {completed.has(step.id) ? "Completed" : "Mark complete"}
              </button>
            </div>
            {step.imageUrl && (
              <Image
                src={step.imageUrl}
                alt={step.title}
                width={480}
                height={270}
                className="mb-2 rounded"
              />
            )}
            <p className="text-sm">{contentForAgeBand(step, ageBand)}</p>
            {step.safetyWarning && (
              <p className="mt-2 rounded bg-amber-50 p-2 text-xs text-amber-800">
                ⚠ {step.safetyWarning}
              </p>
            )}
          </section>
        ))}
      </div>
      {activeStep && (
        <ChatPanel
          tutorialId={tutorialId}
          tutorialTitle={tutorialTitle}
          stepId={activeStep.id}
          stepTitle={activeStep.title}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Write `src/components/ChatPanel.tsx`**

```tsx
"use client";

import { useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function ChatPanel({
  tutorialId,
  tutorialTitle,
  stepId,
  stepTitle,
}: {
  tutorialId: string;
  tutorialTitle: string;
  stepId: string;
  stepTitle: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(startNew = false) {
    if (!input.trim() && !startNew) return;
    const userMessage = input.trim();
    setSending(true);
    setError(null);

    if (userMessage) {
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
      setInput("");
    }

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutorialId, stepId, message: userMessage || "Let's start over.", startNew }),
    });

    setSending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "The AI companion couldn't reply." }));
      setError(data.error ?? "The AI companion couldn't reply. Please try again.");
      return;
    }

    const data = (await res.json()) as { reply: string };
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
  }

  return (
    <aside className="flex h-fit flex-col gap-3 rounded border p-4">
      <div>
        <p className="text-sm font-medium">Ask your mentor</p>
        <p className="text-xs text-gray-500">
          {tutorialTitle} — {stepTitle}
        </p>
      </div>
      <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
        {messages.map((m, i) => (
          <p
            key={i}
            className={`rounded p-2 text-sm ${
              m.role === "user" ? "self-end bg-black text-white" : "bg-gray-100"
            }`}
          >
            {m.content}
          </p>
        ))}
      </div>
      {error && (
        <div className="flex items-center justify-between rounded bg-red-50 p-2 text-xs text-red-700">
          <span>{error}</span>
          <button type="button" onClick={() => send()} className="underline">
            Retry
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask a question…"
          className="flex-1 rounded border px-2 py-1 text-sm"
        />
        <button
          type="button"
          disabled={sending}
          onClick={() => send()}
          className="rounded bg-black px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
      <button
        type="button"
        onClick={() => send(true)}
        className="self-start text-xs text-gray-500 underline"
      >
        Start a new conversation
      </button>
    </aside>
  );
}
```

- [ ] **Step 4: Write `src/app/tutorials/[slug]/page.tsx`**

```tsx
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TutorialSteps } from "@/components/TutorialSteps";

export default async function TutorialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (!session.user.ageBand) redirect("/onboarding/age-band");

  const tutorial = await prisma.tutorial.findUnique({
    where: { slug },
    include: { steps: { orderBy: { order: "asc" } } },
  });
  if (!tutorial || !tutorial.published) notFound();

  const completedRows = await prisma.userProgress.findMany({
    where: { userId: session.user.id, tutorialId: tutorial.id },
    select: { stepId: true },
  });

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-1 text-2xl font-semibold">{tutorial.title}</h1>
      <p className="mb-6 text-sm text-gray-600">{tutorial.summary}</p>
      <TutorialSteps
        tutorialId={tutorial.id}
        tutorialTitle={tutorial.title}
        steps={tutorial.steps}
        ageBand={session.user.ageBand as "AGE_8_11" | "AGE_12_15" | "AGE_16_18"}
        completedStepIds={completedRows.map((r) => r.stepId)}
      />
    </main>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/tutorials src/components
git commit -m "feat: add tutorial library, tutorial detail page, and AI chat panel UI"
```

---

### Task 8: Progress tracking

**Files:**
- Create: `src/lib/progress.ts`
- Create: `src/app/api/progress/route.ts`
- Test: `tests/progress.test.ts`

**Interfaces:**
- Consumes: `prisma` (Task 1), `auth()` (Task 2).
- Produces: `markStepComplete(userId, tutorialId, stepId)`, `getTutorialProgress(userId, tutorialId): Promise<{ completedStepIds: string[]; totalSteps: number }>` from `src/lib/progress.ts`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/progress.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const upsert = vi.fn();
const findMany = vi.fn();
const count = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    userProgress: { upsert, findMany },
    tutorialStep: { count },
  },
}));

import { markStepComplete, getTutorialProgress } from "@/lib/progress";

describe("markStepComplete", () => {
  beforeEach(() => upsert.mockReset());

  it("upserts a progress row keyed on userId + stepId", async () => {
    upsert.mockResolvedValue({});
    await markStepComplete("user-1", "tutorial-1", "step-1");

    expect(upsert).toHaveBeenCalledWith({
      where: { userId_stepId: { userId: "user-1", stepId: "step-1" } },
      update: {},
      create: { userId: "user-1", tutorialId: "tutorial-1", stepId: "step-1" },
    });
  });
});

describe("getTutorialProgress", () => {
  beforeEach(() => {
    findMany.mockReset();
    count.mockReset();
  });

  it("returns completed step ids and the total step count", async () => {
    findMany.mockResolvedValue([{ stepId: "step-1" }, { stepId: "step-2" }]);
    count.mockResolvedValue(6);

    const result = await getTutorialProgress("user-1", "tutorial-1");

    expect(result).toEqual({ completedStepIds: ["step-1", "step-2"], totalSteps: 6 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/progress.test.ts`
Expected: FAIL — `Cannot find module '@/lib/progress'`

- [ ] **Step 3: Write `src/lib/progress.ts`**

Note: `UserProgress` in the schema has `@@unique([userId, stepId])`, so Prisma's generated compound key is `userId_stepId`.

```ts
import { prisma } from "@/lib/prisma";

export async function markStepComplete(
  userId: string,
  tutorialId: string,
  stepId: string
): Promise<void> {
  await prisma.userProgress.upsert({
    where: { userId_stepId: { userId, stepId } },
    update: {},
    create: { userId, tutorialId, stepId },
  });
}

export async function getTutorialProgress(
  userId: string,
  tutorialId: string
): Promise<{ completedStepIds: string[]; totalSteps: number }> {
  const [rows, totalSteps] = await Promise.all([
    prisma.userProgress.findMany({
      where: { userId, tutorialId },
      select: { stepId: true },
    }),
    prisma.tutorialStep.count({ where: { tutorialId } }),
  ]);

  return { completedStepIds: rows.map((r) => r.stepId), totalSteps };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/progress.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Write `src/app/api/progress/route.ts`**

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { markStepComplete } from "@/lib/progress";

const bodySchema = z.object({
  tutorialId: z.string(),
  stepId: z.string(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to be signed in." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Couldn't save your progress." }, { status: 400 });
  }

  try {
    await markStepComplete(session.user.id, parsed.data.tutorialId, parsed.data.stepId);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong saving your progress. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/progress.ts src/app/api/progress tests/progress.test.ts
git commit -m "feat: add progress tracking (mark step complete, persisted per user)"
```

---

### Task 9: Playwright e2e flow test

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/tutorial-flow.spec.ts`

**Interfaces:**
- Consumes: the full running app (Tasks 1-8) against a seeded test database.

- [ ] **Step 1: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
```

- [ ] **Step 2: Write `e2e/tutorial-flow.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test("signup -> age band -> view tutorial -> chat -> mark step complete", async ({ page }) => {
  const email = `test-${Date.now()}@example.com`;

  await page.goto("/signup");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password (min 8 characters)").fill("supersecret1");
  await page.getByRole("combobox").selectOption("AGE_12_15");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/tutorials/);

  await page.getByRole("link", { name: /Changing a Flat Tire/ }).click();
  await expect(page).toHaveURL(/\/tutorials\/changing-a-tire/);

  await page.getByPlaceholder("Ask a question…").fill("What tool do I need first?");
  await page.getByRole("button", { name: "Send" }).click();

  await expect(page.locator("aside p").last()).not.toHaveText("", { timeout: 15_000 });

  await page
    .getByRole("button", { name: "Mark complete" })
    .first()
    .click();
  await expect(page.getByText("Completed").first()).toBeVisible();

  await page.reload();
  await expect(page.getByText("Completed").first()).toBeVisible();
});
```

- [ ] **Step 3: Run the e2e test**

Run: `npx playwright install --with-deps chromium && npm run test:e2e`
Expected: PASS (1 test) — requires `DATABASE_URL`, `AI_PROVIDER`, and the matching API key set in the environment, and the DB migrated + seeded first.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts e2e
git commit -m "test: add end-to-end tutorial + chat + progress flow"
```

---

### Task 10: README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write `README.md`**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add setup, deployment, and extension instructions"
```
