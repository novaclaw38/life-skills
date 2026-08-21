# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dual audience: learners aged 8-18 (in three age bands — AGE_8_11, AGE_12_15, AGE_16_18 — chosen at signup or via `/onboarding/age-band`) who use tutorials directly, and their parents/guardians, who are also a primary audience (choosing/overseeing tutorials, not just an incidental viewer).

## Product Purpose

Teaches practical life skills — changing a tire, wiring a plug, unblocking a toilet, and more — through step-by-step tutorials with an AI mentor companion, adapted to the learner's age.

## Positioning

An age-adapted AI mentor: each tutorial step has three content variants (`contentSimple`, `contentStandard`, `contentDetailed` for the three age bands) plus an AI companion that adapts tone and depth to the learner's exact age — not a one-size-fits-all how-to article or generic video tutorial.

## Operating Context

- Tutorials are DB-backed (Prisma/Postgres via Supabase), not static files; added via seed scripts or direct `prisma.tutorial.create(...)` calls.
- Each tutorial has a `slug`, `title`, `summary`, `category`, `safetyLevel`, `published` flag, and an ordered list of steps.
- Each step carries an optional `safetyWarning` and a pre-generated illustration (`imageUrl`), produced by an admin script (`npm run db:generate-images`), not live at request time.
- AI provider is swappable (Claude or OpenAI) via `AI_PROVIDER` env var and a shared `AIProvider` interface — no code changes needed to switch.
- Auth via Auth.js v5 (email/password + Google; Apple stubbed behind a flag).
- A marketing landing page exists separately from the in-app tutorial experience.

## Capabilities and Constraints

- Tasks span a range of real-world risk (electrical work, tools, plumbing), so safety levels and per-step warnings are a functional requirement, not decoration.
- Content must render distinctly per age band — this is a data/product requirement (three content variants per step), not just a display toggle.
- AI mentor responses must stay consistent in behavior regardless of which provider (Claude/OpenAI) is configured.

## Brand Commitments

Product name: Skill Up.

## Evidence on Hand

Seed data covers two tutorials: "Changing a Flat Tire" and "Wiring a Plug" (see `prisma/seed.ts`). No testimonials, case studies, press, or third-party proof exist yet — future work must not fabricate these.

## Product Principles

- Meet the learner at their actual age, not a generic teen/adult default — the three-tier content system is core, not optional.
- Treat safety as first-class content, not a footnote, on any tutorial where real-world risk exists.
- Keep parents and learners both able to navigate the product on their own terms — neither audience is secondary.
- Preserve provider-agnostic AI behavior — no UI or UX decision should assume a specific AI backend.

## Accessibility & Inclusion

No formal accessibility standard or binding requirement established yet.
