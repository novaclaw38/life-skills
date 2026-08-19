# Life Skills App — Phase 2 (Content & Progress Surface) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the app usable beyond the current two-tutorial demo: give learners discoverability over a larger tutorial library, give them a place to resume and review progress, and give maintainers a safe way to author and publish tutorial content without dropping into Prisma/scripts.

**Architecture:** Next.js App Router, Prisma + Supabase Postgres, Auth.js v5. Build directly on the Phase 1 data model and routes. No new auth or AI-provider work is required in this phase.

**Tech additions:** Server Actions for simple mutations, Zod for shared request validation, class/status-based filtering over `Tutorial`, localStorage-backed client-side learning-state cache for resilient offline-like behavior.

**Spec:** this plan is the source of truth for Phase 2 scope.

---

## Global Constraints

- Keep the existing Prisma schema as the canonical source of truth; do not add new models unless absolutely necessary.
- Keep the public `src/app/api/*` surface stable unless a route needs an extension; prefer extending behavior over adding parallel routes.
- Preserve the age-band content variant system; any new tutorial page or preview must render the correct variant.
- Preserve the Apple Sign In feature-flag behavior.
- Preserve the current AI provider adapter contract; no provider changes in this phase.
- Error handling remains user-facing only; no stack traces surfaced.

---

## File Structure Additions

```
prisma/
  seed.ts                           # extend with 4-6 additional tutorials
src/
  lib/
    tutorials/
      search.ts                     # search/filter helpers
      categories.ts                 # category/safetyLevel enums/constants
  app/
    actions/
      progress.ts                   # toggleComplete Server Action
    tutorials/
      page.tsx                      # enhanced library page
      [slug]/
        page.tsx                    # enhanced detail page with related tutorials
  app/
    (app)/
      layout.tsx                    # optional shared tutorial shell
      profile/
        page.tsx                    # new: learning dashboard
      search/
        page.tsx                    # new: search/filter page
src/
  components/
    TutorialCard.tsx                 # reusable library card
    CategoryFilter.tsx               # category filter chips
    ProgressRing.tsx                 # inline tutorial progress indicator
    ContinueLearning.tsx             # resume row on profile
tests/
  tutorials/search.test.ts
  actions/progress.test.ts
  e2e/
    tutorial-discovery.spec.ts
```

---

## Task 1: Tutorial authoring extension — seed a richer library

**Scope:** Grow the tutorial library from 2 to 8-10 tutorials and add one cross-cutting tutorial metadata feature: tags/search text + canonical category values.

**Interfaces:**
- Consumes: `prisma` from `src/lib/prisma.ts`.
- Produces: additional seeded `Tutorial` + `TutorialStep` rows.
- Produces: normalized category constants in `src/lib/tutorials/categories.ts`.

- [ ] **Step 1: Add category constants**

```ts
// src/lib/tutorials/categories.ts
export const TUTORIAL_CATEGORIES = [
  "Vehicle Maintenance",
  "Home Repairs",
  "Tool Use",
  "Kitchen Skills",
  "Money & Admin",
  "Personal Care",
] as const;

export type TutorialCategory = (typeof TUTORIAL_CATEGORIES)[number];
```

- [ ] **Step 2: Extend `prisma/seed.ts`**

Add 6-8 new tutorials across the categories above. Requirements per tutorial:

- `slug`, `title`, `summary`, `category`, `safetyLevel`, `published: true`
- At least 4 steps each, each with `order`, `title`, `contentSimple`, `contentStandard`, `contentDetailed`, optional `safetyWarning`

Keep the existing tire and plug tutorials. New tutorial slugs must be unique and URL-safe.

- [ ] **Step 3: Run migration/seed locally**

```bash
npm run db:migrate
npm run db:seed
```

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.ts src/lib/tutorials/categories.ts
git commit -m "feat: expand seeded tutorial library and add tutorial category constants"
```

---

## Task 2: Tutorial search/filter surface

**Scope:** Let learners find tutorials by category, search text, and age-band suitability.

**Interfaces:**
- Consumes: `prisma`, `auth()`.
- Produces: `/tutorials`, `/search`, reusable card/filter components.

- [ ] **Step 1: Write `src/lib/tutorials/search.ts`**

```ts
import { prisma } from "@/lib/prisma";
import type { TutorialCategory } from "./categories";

type AgeBand = "AGE_8_11" | "AGE_12_15" | "AGE_16_18";

export interface TutorialSearchResult {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  safetyLevel: string;
  stepCount: number;
}

export async function searchTutorials({
  query,
  category,
  ageBand,
}: {
  query?: string;
  category?: TutorialCategory | "all";
  ageBand?: AgeBand;
}): Promise<TutorialSearchResult[]> {
  const where: Record<string, unknown> = {
    published: true,
    ...(category && category !== "all" ? { category } : {}),
  };

  const tutorials = await prisma.tutorial.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      category: true,
      safetyLevel: true,
      steps: { select: { id: true } },
    },
  });

  let results = tutorials.map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    summary: t.summary,
    category: t.category,
    safetyLevel: t.safetyLevel,
    stepCount: t.steps.length,
  }));

  if (query) {
    const lower = query.toLowerCase();
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(lower) ||
        r.summary.toLowerCase().includes(lower)
    );
  }

  return results;
}
```

- [ ] **Step 2: Write `/tutorials` server page with filter controls**

Prefer a URL-driven filter state:
- `?q=...`
- `?category=...`
- `?ageBand=...`

Render `CategoryFilter` and a search form that submits to the same URL.

- [ ] **Step 3: Write `src/components/TutorialCard.tsx`**

```tsx
"use client";

import Link from "next/link";
import { TutorialSearchResult } from "@/lib/tutorials/search";
import { cn } from "@/lib/utils";
import { ProgressRing } from "@/components/ProgressRing";

export function TutorialCard({
  tutorial,
  completedStepIds,
}: {
  tutorial: TutorialSearchResult;
  completedStepIds: string[];
}) {
  const progress =
    tutorial.stepCount === 0
      ? 0
      : Math.round((completedStepIds.length / tutorial.stepCount) * 100);

  return (
    <Link
      href={`/tutorials/${tutorial.slug}`}
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-card p-4 transition-colors",
        "hover:border-primary"
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-card-foreground">{tutorial.title}</h3>
        {progress > 0 ? (
          <span className="text-xs text-muted-foreground">{progress}%</span>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {tutorial.summary}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{tutorial.category}</span>
        {progress > 0 ? <ProgressRing percent={progress} /> : null}
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Write `src/components/CategoryFilter.tsx`**

A row of clickable category chips plus an optional age-band selector that reads current query params via `useSearchParams` and navigates with updated params.

- [ ] **Step 5: Write `src/components/ProgressRing.tsx`**

Accessible ring/bar indicator for completion percentage; keep it small and reusable.

- [ ] **Step 6: Write tests**

Add:
- `tests/tutorials/search.test.ts` with mocked Prisma queries for text/category filtering and empty result cases.

- [ ] **Step 7: Run build/tests**

```bash
npm run -s build
npm test
```

- [ ] **Step 8: Commit**

```bash
git add src/lib/tutorials src/components src/app/tutorials tests/tutorials/search.test.ts
git commit -m "feat: add tutorial search, category filters, and library cards"
```

---

## Task 3: Continue-learning profile page

**Scope:** Add `/profile` as the logged-in landing page after onboarding/sign-in, showing in-progress tutorials and recent activity.

**Interfaces:**
- Consumes: `auth()`, `prisma`, `getTutorialProgress` from Task 1 path, plus existing chat/progress routes.
- Produces: `/profile`.

- [ ] **Step 1: Create `/profile` server page**

```ts
// src/app/profile/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ContinueLearning } from "@/components/ContinueLearning";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id || !session.user.ageBand) {
    redirect("/signin");
  }

  const tutorials = await prisma.tutorial.findMany({
    where: { published: true },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      category: true,
      steps: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const progressRows = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
    select: { tutorialId: true, stepId: true },
  });

  const completedByTutorial = new Map<string, string[]>();
  for (const row of progressRows) {
    const list = completedByTutorial.get(row.tutorialId) ?? [];
    list.push(row.stepId);
    completedByTutorial.set(row.tutorialId, list);
  }

  const items = tutorials.map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    summary: t.summary,
    category: t.category,
    stepCount: t.steps.length,
    completedStepIds: completedByTutorial.get(t.id) ?? [],
  }));

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Your learning</h1>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ContinueLearning key={item.id} tutorial={item} />
        ))}
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Write `src/components/ContinueLearning.tsx`**

Render tutorial card with resume CTA. If no progress exists, show `Start`; otherwise show `Continue`.

- [ ] **Step 3: Wire post-login redirect**

Update `/tutorials` and `/onboarding/age-band` success path to `/profile` instead of `/tutorials` for a more goal-oriented landing.

- [ ] **Step 4: Update home redirect**

In `src/app/page.tsx`, signed-in users should redirect to `/profile`.

- [ ] **Step 5: Run build/tests**

```bash
npm run -s build
npm test
```

- [ ] **Step 6: Commit**

```bash
git add src/app/profile src/components/ContinueLearning.tsx src/app/page.tsx src/app/tutorials/page.tsx src/app/onboarding/age-band/page.tsx
git commit -m "feat: add continue-learning profile page and post-login redirect"
```

---

## Task 4: Tutorial detail enhancement — related tutorials + safety-aware copy

**Scope:** Improve `/tutorials/[slug]` with related tutorials, completed-step persistence across reloads, and clearer safety copy.

**Interfaces:**
- Consumes: existing `TutorialSteps`, `ChatPanel`.
- Produces: enhanced tutorial detail page.

- [ ] **Step 1: Add related-tutorial server lookup**

In `src/app/tutorials/[slug]/page.tsx`, fetch 2-3 tutorials in the same `category` excluding the current `slug`. Pass them to a new `src/components/RelatedTutorials.tsx`.

- [ ] **Step 2: Persist active step and scroll state**

`TutorialSteps` should accept `initialActiveStepId` and use it as the initial `activeStepId` so the user returns to where they were. Read from query params or client storage only; do not require a new backend model.

- [ ] **Step 3: Add inline tutorial completion summary**

Below the progress bar, render a one-line summary: “You’ve completed 3 of 6 steps.”

- [ ] **Step 4: Run build/tests**

```bash
npm run -s build
npm test
```

- [ ] **Step 5: Commit**

```bash
git add src/app/tutorials/[slug]/page.tsx src/components/TutorialSteps.tsx src/components/RelatedTutorials.tsx
git commit -m "feat: add related tutorials and improved tutorial detail state"
```

---

## Task 5: Content authoring API

**Scope:** Add maintainer-facing API routes under `/api/admin/tutorials` for CRUD on tutorial content, with a simple code-based access gate.

**Interfaces:**
- Consumes: `auth()`, `prisma`, Zod.
- Produces: `POST /api/admin/tutorials`, `PATCH /api/admin/tutorials/[id]`, `POST /api/admin/tutorials/[id]/steps`.

- [ ] **Step 1: Add admin access guard**

```ts
// src/lib/admin.ts
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("UNAUTHORIZED");
  }

  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!allowed.includes(session.user.email)) {
    throw new Error("FORBIDDEN");
  }

  return session.user;
}
```

- [ ] **Step 2: Write `POST /api/admin/tutorials`**

Accepts `slug`, `title`, `summary`, `category`, `safetyLevel`, `steps[]`. Validates with Zod. Creates tutorial + steps. Returns created ids.

- [ ] **Step 3: Write `PATCH /api/admin/tutorials/[id]`**

Accepts partial tutorial fields and/or step updates. Do not allow changing `slug` after creation; treat it as immutable.

- [ ] **Step 4: Write `POST /api/admin/tutorials/[id]/steps`**

Accepts an ordered batch of step objects and upserts them by order. Reorders existing steps when needed.

- [ ] **Step 5: Add tests**

Create `tests/admin/tutorials.test.ts` with mocked `requireAdmin`, Prisma create/update, and validation failures.

- [ ] **Step 6: Run build/tests**

```bash
npm run -s build
npm test
```

- [ ] **Step 7: Commit**

```bash
git add src/app/api/admin src/lib/admin.ts tests/admin/tutorials.test.ts
git commit -m "feat: add admin tutorial authoring API with email-based access gate"
```

---

## Task 6: Missing-image reaper script

**Scope:** Provide an idempotent script to backfill `TutorialStep.imageUrl` for any step missing an image.

**Interfaces:**
- Consumes: `src/lib/images/nvidia-provider.ts`, Supabase storage config.
- Produces: `scripts/backfill-missing-images.ts`.

- [ ] **Step 1: Write `scripts/backfill-missing-images.ts`**

Behavior:
- Query `TutorialStep` rows where `imageUrl` is null or empty.
- For each, call `generateImage(prompt)`.
- Upload to Supabase Storage bucket `SUPABASE_STORAGE_BUCKET`.
- Update `TutorialStep.imageUrl`.
- Print a summary of successes/failures; never hard-fail on a single bad step.

- [ ] **Step 2: Add npm script**

```json
"db:backfill-images": "tsx scripts/backfill-missing-images.ts"
```

- [ ] **Step 3: Run build/tests**

```bash
npm run -s build
npm test
```

- [ ] **Step 4: Commit**

```bash
git add scripts/backfill-missing-images.ts package.json
git commit -m "feat: add missing-image backfill script for tutorial steps"
```

---

## Task 7: Progress-tracking surface tests + hardening

**Scope:** Expand coverage for the new profile/search flows and fix the remaining known Phase 1 gaps without broad refactors.

- [ ] **Step 1: Add profile page test**

Add a test that validates `/profile` redirects unauthenticated users and does not crash when progress data is empty.

- [ ] **Step 2: Add search tests**

Cover:
- empty query returns published tutorials
- category filter narrows results
- search query matches title/summary
- age band filter is accepted without throwing

- [ ] **Step 3: Fix known Phase 1 deferred items if low-risk**

Focus only on:
- add a NaN guard for `AI_SESSION_TIMEOUT_MINUTES`
- ensure `/api/chat` validates `step.tutorialId === tutorialId` before using both in AI context

Do not refactor auth, schema, or chat UX.

- [ ] **Step 4: Run full checks**

```bash
npm run -s lint
npm run -s build
npm test
```

- [ ] **Step 5: Commit**

```bash
git add tests src/app/api/chat/route.ts src/lib/ai/session.ts
git commit -m "fix: harden chat session math and expand progress/search coverage"
```

---

## Task 8: E2e coverage for discovery and resume flow

**Scope:** Add one Playwright spec for the new `/profile` and `/tutorials` filtering behavior.

- [ ] **Step 1: Write `e2e/profile-and-discovery.spec.ts`**

Cover:
- signup -> redirect to `/profile`
- see seeded tutorials on `/profile`
- navigate from `/profile` into a tutorial
- use category/search filters on `/tutorials`
- mark a step complete and verify it persists on reload

- [ ] **Step 2: Commit**

```bash
git add e2e/profile-and-discovery.spec.ts
git commit -m "test: add e2e profile and tutorial discovery flow"
```

---

## Phase 2 Acceptance Criteria

- A logged-in user lands on `/profile` and sees in-progress tutorials.
- A user can browse `/tutorials`, filter by category/search, and open any published tutorial.
- Seed library includes at least 8 published tutorials across multiple categories.
- Maintainers can create/update tutorial content via `/api/admin/tutorials` without redeploying.
- All existing Phase 1 tests still pass.
- `npm run build` remains green.

## Suggested Sequencing

1. Task 1: expand library + categories
2. Task 2: search/filter surface
3. Task 3: profile page
4. Task 5: admin authoring API
5. Task 4: tutorial detail polish
6. Task 6: missing-image backfill script
7. Task 7/8: tests and e2e coverage
