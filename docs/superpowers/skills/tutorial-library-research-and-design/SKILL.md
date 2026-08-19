# Tutorial Library Research & Design Skill

Use this skill when the project needs a larger tutorial library, better tutorial discovery UX, or a clearer content-authoring workflow for the life-skills app. It combines lightweight community research, design-pattern selection, and repo-local planning into one repeatable workflow.

## When to Use

- expanding the seeded tutorial set from 2 to 20–30
- designing the tutorial library, search, filter, or profile/resume screens
- choosing visual/UX patterns for tutorials, cards, progress, and onboarding
- backfilling or regenerating tutorial images from existing content
- turning tutorial content research into structured seed/spec updates

## Prerequisites

- repo context for the life-skills app at `/home/rebawn/skill-up`
- Phase 2 plan at `docs/superpowers/plans/2026-08-19-life-skills-content-and-progress.md`
- design-system options via `popular-web-designs`
- grounded findings via `grounded-citations`

## Quick Reference

```text
1. Define the tutorial expansion brief
2. Research categories, UX patterns, and visual references
3. Choose design direction and component patterns
4. Backfill content structure: categories, tags, difficulty signals
5. Write or update seed/spec content
6. Backfill missing assets with the image script
7. Verify build/tests and commit the content/design delta
```

## Procedure

### 1. Define the expansion brief

Answer:
- target audience/age bands
- tutorial count target and category mix
- safety constraints and supervision requirements
- preferred discovery model: browse, search, categories, or hybrid

Lock this before research. It keeps sourcing focused.

### 2. Research community patterns and repos

Use `web_search` and `browser_exec`/`browser_navigate` to inspect:

- tutorial learning apps and how they expose categories, progress, and resume state
- design-system patterns for cards, filters, progress indicators, and empty states
- accessibility patterns for step navigation, keyboard flow, and screen-reader labels

Register every useful source with `grounded-citations` so findings stay traceable.

Useful lens:
- **Explore surface:** filters, search, category chips, cards, related content
- **Learn surface:** step sequencing, progress bars, completion states, inline help
- **Operate surface:** authoring flows, status badges, safety warnings

### 3. Choose a design direction

Prefer one of these proven families unless the repo already has stronger tokens:

- **Documentation/learning:** Mintlify, Notion, Supabase docs style
- **Friendly warmth:** Intercom, Cal.com, Airbnb
- **Precision/tool:** Linear, Vercel, Resend

Avoid generic SaaS defaults:
- no indigo-gradient-everywhere look
- no three equal feature tiles for every surface
- no decorative glass/blur without an elevation system
- no oversized stats where product story should be

For tutorial surfaces, prefer:
- clear hierarchy: category → tutorial → step → chat
- visible progress and resume affordances
- age-appropriate tone reflected in copy length and terminology, not just font size

Use `sketch` to compare 2–3 variants before editing production code.

### 4. Structure the library

Extend `src/lib/tutorials/categories.ts` with a small canonical set:

```ts
export const TUTORIAL_CATEGORIES = [
  "Vehicle Maintenance",
  "Home Repairs",
  "Tool Use",
  "Kitchen Skills",
  "Money & Admin",
  "Personal Care",
] as const;
```

For each new tutorial, capture:
- slug, title, summary, category, safetyLevel
- step count and minimum age-band suitability
- image needs and prompt plan

### 5. Author tutorial content

Update `prisma/seed.ts` using the existing shape:
- `slug`, `title`, `summary`, `category`, `safetyLevel`, `published: true`
- 4–8 steps with `order`, `title`, `contentSimple`, `contentStandard`, `contentDetailed`
- `safetyWarning` whenever the task involves tools, electricity, vehicles, or adult supervision

Keep tone consistent:
- ages 8–11: very short sentences, concrete nouns, explicit adult gates
- ages 12–15: clear plain language, multi-step instructions allowed, flag real risks
- ages 16–18: direct mentor tone, assume more independence, keep safety real

### 6. Backfill images

Run the existing image-generation workflow for missing visuals:
```bash
npm run db:generate-images
```

If coverage is uneven, use the backfill path for missing-image steps only:
- prefer prompts tied to step title + content
- reuse the same aspect and style vocabulary across a tutorial
- avoid photoreorealistic humans unless the brand clearly requires it

### 7. Wire discovery/profile surfaces

Use the Phase 2 plan tasks as the implementation checklist:
- Task 2: search/filter with category chips and progress cards
- Task 3: `/profile` continue-learning page
- Task 4: related tutorials and detail-page state

Before editing, inspect existing components:
- `src/components/TutorialSteps.tsx`
- `src/components/ChatPanel.tsx`
- `src/app/tutorials/page.tsx`
- `src/app/tutorials/[slug]/page.tsx`

### 8. Verification

```bash
npm run -s lint
npm run -s build
npm test
```

Acceptance checks:
- signed-in user sees `/profile` or `/tutorials` with seeded library
- category filter narrows results without duplicates
- tutorial detail page shows age-band content, progress, and related tutorials
- images render or degrade gracefully
- safety warnings are visible without blocking reading

## Outputs

- updated `docs/superpowers/plans/2026-08-19-life-skills-content-and-progress.md` task checklist
- updated `prisma/seed.ts` with new tutorials
- updated `src/lib/tutorials/categories.ts`
- updated tutorial pages/components as needed
- optional `docs/ui-redesign-audit-and-resource-harvest.md` section for new research findings

## Pitfalls

- **Content over code:** this phase is mostly authoring and UX wiring, not schema work.
- **Too many categories:** start with 4–6; expand only when browsing feels flat.
- **Image dependency:** never block content rollout on image generation; text-first is fine.
- **Generic templates:** avoid tutorial UIs that look like every AI landing page.
- **Citation drift:** every external UX/repo reference should be registered in `grounded-citations` before summarizing it.
