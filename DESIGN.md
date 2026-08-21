---
name: Skill Up
description: An age-adapted AI mentor for real-world life skills, taught step by step.
colors:
  tomato-signal: "#c1392b"
  tomato-signal-hover: "#a52f22"
  tomato-glow: "#e05a3e"
  kraft-0: "#fdfbf6"
  kraft-50: "#f6f1e4"
  kraft-100: "#efe7d3"
  kraft-200: "#e3d6b8"
  kraft-300: "#d0bf98"
  kraft-ink-500: "#6b6152"
  kraft-ink-700: "#35302a"
  kraft-ink-800: "#241f1a"
  kraft-ink-900: "#16130f"
  kraft-ink-950: "#0d0b08"
  steel-300: "#aab2ba"
  steel-500: "#5c6772"
  steel-700: "#3a424a"
  steel-800: "#2b3138"
  packet-vehicle: "#4d6a78"
  packet-home: "#c1622b"
  packet-tools: "#c9971b"
  packet-kitchen: "#5b7a3a"
  packet-money: "#2f6b63"
  packet-personal: "#7a4a6b"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    letterSpacing: "0.08em"
  mono:
    fontFamily: "JetBrains Mono, monospace"
rounded:
  sm: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.tomato-signal}"
    textColor: "{colors.kraft-0}"
    rounded: "{rounded.sm}"
    padding: "0 1rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.tomato-signal-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.kraft-ink-800}"
    rounded: "{rounded.sm}"
    padding: "0 1rem"
    height: "2.75rem"
  packet-card:
    backgroundColor: "{colors.kraft-0}"
    textColor: "{colors.kraft-ink-800}"
    rounded: "{rounded.md}"
    padding: "0.75rem"
  header-structural:
    backgroundColor: "{colors.steel-700}"
    textColor: "{colors.kraft-0}"
---

<!--
  THESIS: Tutorials are seed packets, not SaaS cards — an enticing front you'd
  pick up, an instructional back you'd actually follow. Refuses the generic
  edtech card-grid-with-one-soft-accent default.
  OWN-WORLD: Tomato red is the only interactive signal; pea-green, sunflower-
  gold, rust, teal, and berry live only on packet-front category art, never
  on chrome. Kraft-buff paper ground, warm charcoal ink, galvanized-steel
  structural bar. Bricolage Grotesque display, Atkinson Hyperlegible body,
  JetBrains Mono for counts.
  FORM: The Seed Rack — challenger-fused, won the concept-seed roll on
  audience identification and product clarity over the assigned Field Manual
  direction; seed key 7ff64c92.
  BUILT: 2026-08-21, landing page (src/app/page.tsx). Disclosed deviation:
  the FIRST VIEWPORT contract promised the category rack inside the hero
  itself; the built hero holds only the lead packet (HeroDemo), with the
  full rack as the section immediately below, to keep the hero focused.
  Not yet extended to the in-app (Operate) surfaces — tutorials list,
  tutorial detail/steps, chat, onboarding, profile, auth all still carry
  the prior Workshop Bench tokens pending a follow-up pass.
-->

# Design System: Skill Up

## Overview

**Creative North Star: "The Seed Rack"**

Skill Up looks like a hardware-store seed-packet rack, not a SaaS dashboard: a warm kraft-buff paper ground, printed-label typography, and exactly one loud color — tomato red — reserved for the single thing worth acting on right now. Tutorials are packets: an enticing front (a real illustration, a colored category band) you'd pick off the rack, and an instructional back — the mentor chat, the actual steps — you'd flip to and follow. Category color (pea-green, sunflower-gold, rust, teal, berry, steel-blue) lives only on packet-front art; it never appears on a button, a link, or a focus ring. That discipline is what keeps six competing hues from reading as noise: the eye always knows tomato red means "act here."

Depth stays material rather than decorative: a soft paper-lift shadow at rest, stepping up to a tomato-tinted spotlight shadow on the one focal card per view (the opened lead packet in the hero). Corners are tight and printed-label small (4/6/8px) rather than soft app-bubble rounded, and the galvanized-steel header/footer bars are the one cool, structural note against an otherwise warm, paper-toned page — the rack's frame, not its content.

**Key Characteristics:**
- One signal color (tomato red) for every interactive/active element; category colors are decorative classification only, confined to packet-front art
- Kraft-buff paper ground + warm charcoal ink + galvanized-steel structural chrome (header, footer)
- Printed-label radius language: 4px controls, 6px cards, 8px panels — never soft app-bubble rounding
- Tutorials render as two-sided packets: photographed/illustrated front, instructional back (steps, mentor chat)

## Colors

A near-neutral kraft palette punctuated by one signal color, with a separate six-hue set reserved exclusively for packet-front category classification.

### Primary
- **Tomato Signal** (`#c1392b`): The only interactive/action color — primary buttons, the learner's own chat bubble, active AGE labels, hover border on packet cards, focus rings. Hover deepens to `#a52f22`.

### Neutral (Kraft)
- **Kraft 0** (`#fdfbf6`): Card and photo-panel background.
- **Kraft 50** (`#f6f1e4`): Page background (light mode).
- **Kraft 100–300** (`#efe7d3`–`#d0bf98`): Borders, dividers, scrollbar thumb.
- **Kraft Ink 500** (`#6b6152`): Muted/secondary text.
- **Kraft Ink 800** (`#241f1a`): Primary text (light mode); card background (dark mode).
- **Kraft Ink 950** (`#0d0b08`): Page background (dark mode) — a low-lit workshop, not OLED black.

### Structural (Steel)
- **Steel 700** (`#3a424a`): Header and footer bar background — the rack's frame.
- **Steel 300** (`#aab2ba`): Nav/footer link text against the steel bars.

### Packet-Front Category Colors (decorative only)
- **Vehicle** (`#4d6a78`) · **Home Repairs** (`#c1622b`) · **Tools** (`#c9971b`) · **Kitchen** (`#5b7a3a`) · **Money & Admin** (`#2f6b63`) · **Personal Care** (`#7a4a6b`) — each a category's packet-band color, applied only to that category's card art. Text on the Tools (gold) band uses dark ink for contrast; every other band uses white.

### Named Rules
**The One Signal Rule.** Tomato red is the only color that means "act here." It never appears as a category color, a background wash, or a decorative accent — its rarity is what makes it legible as the one thing to do.

**The Packet-Front Rule.** The six category colors exist only on packet-front art (the colored band + its card). No button, link, focus ring, or piece of UI chrome may borrow a category color — that would blur the one-signal discipline the whole system depends on.

## Typography

**Display Font:** Bricolage Grotesque (with system-ui, sans-serif fallback)
**Body Font:** Atkinson Hyperlegible (with system-ui, sans-serif fallback)
**Mono Font:** JetBrains Mono (with monospace fallback)

**Character:** A characterful, slightly hand-cut grotesque for headlines (packet-front energy without a script-font cliché) paired with an accessibility-first body face — genuinely justified here, not decorative: content spans an 8-to-18 audience plus parents, and body legibility is a functional requirement, not a style choice. Mono is reserved for counts and tabular data (step counters, AGE labels), never used as a "technical" costume.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 5vw, 3rem)`, 1.1 line-height, -0.01em tracking): Hero headline, section headings.
- **Body** (400, 1rem, 1.5 line-height): Default reading text, tutorial content, chat messages.
- **Label** (700, 0.6875rem, 0.08em tracking, uppercase): Packet-band category labels.
- **Mono/tabular:** Step counters ("Step 3 / 6"), AGE band labels, footer copyright — always `tabular-nums`.

## Layout

Centered container, generous section padding (`py-20`/`py-28` on desktop). The hero holds the headline + lead packet only; the full category rack is its own horizontal-scroll section immediately below (a deliberate split from the original direction contract — see BUILT note above — to keep the hero's memory test to one clear idea). Rack cards scroll horizontally on mobile (`overflow-x-auto`) and grid on `sm:`+.

## Elevation & Depth

Two-tier paper-lift shadow system: `shadow-soft` (ambient, at rest on every packet card and panel) and `shadow-float` (a tomato-tinted spotlight, reserved for the hero's one opened lead packet). Dark mode swaps the ambient shadow for a light inset edge rather than reusing a shadow that would vanish against near-black.

### Shadow Vocabulary
- **shadow-soft** (`0 1px 2px rgba(36,31,26,.06), 0 8px 20px -12px rgba(36,31,26,.18)`; dark: light inset edge + `0 10px 28px -14px rgba(0,0,0,.7)`): Default lift for every packet card and panel.
- **shadow-float** (`0 3px 6px rgba(36,31,26,.1), 0 20px 44px -18px rgba(193,57,43,.32)`; dark glow tracks `--tomato-glow`): Reserved for the hero's one opened lead packet.

### Named Rules
**The Tracked Glow Rule.** `shadow-float`'s tinted layer always matches the active mode's tomato signal (never a fixed color), so the one focal card's glow stays legibly "on brand" in both themes.

## Shapes

Printed-label radius scale — 4px on buttons/inputs, 6px on cards, 8px on panels, full-pill only on true pills/avatars. Nothing renders at 0px (sharp) or full-pill outside that one exception. 1px borders in kraft-200/300, never heavier.

## Components

### Buttons
- **Shape:** 4px radius (`rounded-sm`).
- **Primary:** Tomato Signal fill, kraft-0 text, deepens on hover.
- **Outline:** Transparent with a 1px kraft border, muted-background hover.
- **Focus:** 2px tomato-colored ring, 2px offset, on every interactive control.

### Packet Cards (`SeedPacketCard`)
- **Structure:** A colored category band (top, not side — the floor bans colored side borders) with a small-caps label, then a photo (or, absent one, a subtle diagonal kraft-hatch placeholder — never a repeated text label), then the title.
- **Shape:** 6px radius, 1px kraft border, `shadow-soft` at rest.
- **Hover:** Border shifts to tomato signal; card lifts 1px with `shadow-float`.

### The Opened Lead Packet (`HeroDemo` — signature component)
The hero's one signature moment: a card shown "opened" to its instructional back — a colored category band, a real tutorial illustration, and the mentor chat (learner's message in tomato, mentor's reply in muted kraft) — with a rotated sliver of the packet's own front peeking from behind it. This is the clearest expression of the whole system's thesis: front to pick it up, back to actually use it.

### Almanac Table (age-variant / instruction-sheet rows)
A bordered kraft panel of stacked rows (divider between, not per-row cards), each row led by a small tomato mono label (`AGE 8–11`, step number) — the "tiny type on the back of the packet" register, used for the age-adapted content comparison and the numbered how-it-works steps.

## Do's and Don'ts

### Do:
- **Do** keep tomato red as the only interactive/action color; every other hue is packet-front classification only.
- **Do** put category color on a card's top band, never a side border.
- **Do** use the printed-label radius scale (4/6/8px) — never soft app-bubble rounding.
- **Do** tint `shadow-float`'s glow to the active mode's tomato signal.

### Don't:
- **Don't** let a category color leak into a button, link, or focus ring.
- **Don't** fabricate a photo-style illustration for a category with no real asset — use the honest kraft-hatch placeholder instead.
- **Don't** reuse the light-mode ambient shadow verbatim in dark mode — it disappears against near-black; use the inset light-edge treatment.
