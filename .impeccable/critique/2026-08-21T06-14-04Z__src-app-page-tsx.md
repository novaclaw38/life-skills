---
target: landing page (src/app/page.tsx)
total_score: 26
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
timestamp: 2026-08-21T06-14-04Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Mobile rack has no scroll-position affordance |
| 2 | Match Between System / Real World | 4 | Seed-packet metaphor carried through consistently |
| 3 | User Control and Freedom | 3 | No mobile menu fallback for header nav |
| 4 | Consistency and Standards | 3 | One rack card breaks photo pattern; one band fails contrast |
| 5 | Error Prevention | 3 | No forms on this page; no dead links |
| 6 | Recognition Rather Than Recall | 4 | Context always co-located with content |
| 7 | Flexibility and Efficiency | n/a | Not applicable to single-scroll marketing surface |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained overall; one illegible decorative element |
| 9 | Error Recovery | 3 | No error states to fail |
| 10 | Help and Documentation | n/a | Acceptable to omit on landing page |
| **Total** | | **26/32** | **Good (81%)** |

## Design Specificity Verdict
Not a reskinned template — seed-packet metaphor executed with real commitment (category-band+photo fronts, "off the rack" copy, concrete task language, age-band table demonstrates the mechanic rather than describing it). Detector: 0 findings (exit 0). Browser: both viewports clean, no console errors; the "N" badge is the Next.js dev overlay, not app content.

## What's Working
1. Seed-packet metaphor has real follow-through across header, hero, cards, mentor sections.
2. Reduced-motion handling done correctly (graceful degradation + real prefers-reduced-motion block).
3. Real keyboard accessibility groundwork (focus-visible rings verified live, clean heading structure).

## Priority Issues
- [P1] Wiring-a-plug / jump-starting-a-car examples carry zero safety framing for an 8+ audience. Fix: one trust line near these examples or in How it works.
- [P1] "Home Repairs" packet band fails AA contrast: white text on rust measures 4.02:1 (independently recomputed from token hex, confirmed exact) vs 4.5:1 minimum; appears on rack card + mentor-demo header. Kitchen band passes only marginally (4.73:1). Fix: darken --packet-home, recheck all six as a set.
- [P2] First rack card ("Checking engine oil") has no photo, breaking the pattern its siblings establish.
- [P2] Mobile header drops "Tutorials"/"How it works" with no menu fallback.
- [P3] Hero's "peeking packet" decorative sliver reads as a rendering glitch, not a flourish.

## Persona Red Flags
- Jordan (first-timer): no supervision signal on real wiring instructions.
- Casey (mobile): rack shows ~2.5 of 6 cards, no scroll affordance, and "See all 22" is also hidden below sm.
- Sam (accessibility): focus rings good; Home Repairs 4.02:1 contrast is a concrete failure.

## Minor Observations
- Four "Start learning" CTAs never vary copy.
- sm-size Button/header Sign-in link ~34-36px tall, under 44px touch-target guideline.
- Rack's overflow-x-auto has no scroll-snap.

## Questions to Consider
1. Was "real stakes over safe stakes" deliberate for wiring/jump-start examples, or an oversight?
2. The packet metaphor implies a flippable object — nothing on the page actually flips. Considered and cut?
3. Were all six packet colors contrast-checked as a set, or only the primary signal color?
