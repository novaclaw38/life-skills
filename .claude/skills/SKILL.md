---
name: ui-flow-auditor
description: Audits a web or mobile front end by tracing real user journeys (not just static screens) to find friction points, dead ends, unnecessary steps, and confusing navigation. Use when asked to review, audit, or improve a user flow, onboarding sequence, checkout process, or overall UX of an app.
---

# UI Flow Auditor

## Purpose
Evaluate a front end the way a real user experiences it: as a sequence of steps
toward a goal, not a set of isolated screens. Identify friction, drop-off risks,
and concrete design improvements.

## When to use this skill
- User asks for a UX, UI, or "user flow" audit of an app or website
- User wants to know why signup, checkout, onboarding, or another flow feels clunky
- User wants a before/after redesign recommendation for a specific journey

## Process

### 1. Define the journeys
Ask the user (if not already clear) which key journeys to audit. Typical examples:
- New user signup / onboarding
- Core "aha moment" task (e.g. post a job, book a service, complete a purchase)
- Returning user login and resume-task flow
- Payment / checkout
- Error or edge-case recovery (e.g. failed payment, expired session)

If the user has an existing app, inspect available routes, screenshots, or code
(React components, page files, navigation config) to reconstruct the actual flow
before auditing it.

### 2. Trace each journey step by step
For each journey, walk through it screen by screen or step by step, and for each
step record:
- What the user is trying to accomplish at this step
- What actions are available (buttons, inputs, links)
- What happens next for each action, including error states
- Number of clicks/taps and fields required to reach the next step
- Any point where the user must wait, leave the flow, or context-switch (e.g. check email, open WhatsApp, use a different device)

### 3. Apply the six-lens evaluation to the flow (not just the screen)
For each step, evaluate:
1. **First impression** - is the purpose of this step immediately obvious?
2. **Usability** - can the user complete the step without hesitation or backtracking?
3. **Visual hierarchy** - does the layout guide the eye to the one primary action?
4. **Visual design** - is it consistent with the rest of the app and free of clutter?
5. **Responsiveness** - does the step work cleanly on mobile, tablet, and desktop?
6. **Accessibility** - can it be completed via keyboard/screen reader, and does it meet contrast/tap-target minimums?

### 4. Flag flow-level problems specifically
Beyond individual screens, look for:
- **Dead ends**: no clear next action, or a back button that loses progress
- **Unnecessary steps**: fields or screens that could be merged, removed, or deferred
- **Redundant data entry**: asking for information already provided or inferable
- **Context switches**: forcing the user out of the app (email verification, external payment redirects) without a clear way back
- **Ambiguous state**: user can't tell if an action succeeded, is loading, or failed
- **Drop-off risk points**: steps with high cognitive load, long forms, or unclear value ("why do you need this?")
- **Inconsistent patterns**: same action (e.g. "submit") behaving or looking differently across the flow

### 5. Score using the six-lens framework (per journey, overall)
In addition to the per-step lens notes in step 3, produce an overall score for
each journey across the same six lenses, so strengths and weaknesses are
visible at a glance:
1. **First impression** - score /10, one-line justification
2. **Usability** - score /10, one-line justification
3. **Visual hierarchy** - score /10, one-line justification
4. **Visual design** - score /10, one-line justification
5. **Responsiveness** - score /10, one-line justification
6. **Accessibility** - score /10, one-line justification

Give an overall journey score as the average, plus a one-sentence summary of
the single biggest lever for improvement.

### 6. Score and prioritize flow-level findings
Rate each journey on:
- Friction score (low/medium/high) with the single biggest friction point named
- Estimated impact if fixed (does it likely affect conversion, trust, or retention?)
- Effort to fix (quick copy/layout change vs. structural rework)

Prioritize findings as:
- **Blocking**: actively prevents task completion or loses user trust/data
- **High**: significant friction but workaroundable
- **Polish**: nice-to-have improvements

### 7. Deliver recommendations
For each flagged issue, give:
- What's wrong and where (specific screen/step)
- Why it matters (impact on the user or business goal)
- A concrete fix (not just "improve this" - suggest the actual layout/copy/flow change)

Where useful, sketch the improved flow as a simple ordered step list (current
steps vs. proposed steps) so the reduction in friction is visible.

## Output format
Structure the audit as:
1. Journeys audited (list)
2. Per-journey step-by-step trace with lens scores
3. Six-lens overall scorecard per journey
4. Flow-level issues found, prioritized (Blocking / High / Polish)
5. Recommended fixes, ordered by impact vs. effort
6. Optional: proposed simplified flow (current step count vs. proposed step count)

## Notes
- This skill is app-agnostic: it works from screenshots, live URLs, or source code (React/Vue/etc. route and component files)
- Always reconstruct the *actual* flow before critiquing it - don't assume based on a single screen
- Prefer specific, actionable fixes over generic UX advice
