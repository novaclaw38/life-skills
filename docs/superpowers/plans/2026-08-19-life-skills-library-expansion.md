# Life Skills App — Library Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Grow the seeded tutorial library from 8 to 22 published tutorials, reaching the 20-30 target set in the Phase 1 design spec, spread across all six existing categories.

**Architecture:** Pure content addition on the existing Phase 1/2 data model and seed pipeline — no schema, route, or component changes. Each new tutorial is appended to `prisma/seed.ts` using the same `prisma.tutorial.upsert` shape already used by the eight existing tutorials.

**Tech Stack:** Prisma seed script (`tsx prisma/seed.ts`), existing `Tutorial`/`TutorialStep` Prisma models.

**Spec:** `docs/superpowers/specs/2026-08-15-life-skills-foundation-design.md` (Non-goals: "Filling the library out to 20-30 tutorials" — this plan implements that deferred item) and `docs/superpowers/plans/2026-08-19-life-skills-content-and-progress.md` Task 1 (which set up `src/lib/tutorials/categories.ts` and seeded the first 2 additional tutorials this plan continues from).

## Global Constraints

- Keep the existing Prisma schema as the canonical source of truth; do not add new models or fields.
- Every new tutorial must use one of the six categories already defined in `src/lib/tutorials/categories.ts`: `"Vehicle Maintenance"`, `"Home Repairs"`, `"Tool Use"`, `"Kitchen Skills"`, `"Money & Admin"`, `"Personal Care"`.
- Every new tutorial must set `published: true` and have a unique, URL-safe `slug`.
- Every new tutorial must have at least 4 steps, each with `order`, `title`, `contentSimple`, `contentStandard`, `contentDetailed`, and `safetyWarning` (use `null` when there is no safety concern for that step).
- `safetyLevel` is a free-form string; use `"low"` for tutorials with no real physical/financial risk, and `"requires-adult-supervision"` for anything involving power tools, electricity, gas, heat, or money transfers.
- Preserve UK-English conventions already used in the seed data (e.g. "torch" not "flashlight", "consumer unit" not "breaker box", 3-pin plugs).
- Do not touch `src/app/**`, `src/components/**`, or any test/e2e file that isn't explicitly listed below — this plan is additive content only.

---

## File Structure Additions

```
prisma/
  seed.ts   # append 14 new tutorial upsert blocks + update the final console.log summary
```

No other files are created or modified.

---

## Task 1: Vehicle Maintenance additions

**Files:**
- Modify: `prisma/seed.ts` — insert new blocks after the existing `omelette` block (before `console.log` / `main()` close), each following the same `prisma.tutorial.upsert({...})` pattern as the existing `tire` block at the top of the file.

**Interfaces:**
- Consumes: `prisma` (already imported at the top of `prisma/seed.ts`).
- Produces: two new local `const` bindings, `engineOil` and `jumpStart`, referenced later in the final `console.log` summary line (Task 7).

- [ ] **Step 1: Add "Checking and Topping Up Engine Oil"**

Insert this block after the `omelette` block and before `console.log(...)`:

```ts
  const engineOil = await prisma.tutorial.upsert({
    where: { slug: "checking-engine-oil" },
    update: {},
    create: {
      slug: "checking-engine-oil",
      title: "Checking and Topping Up Engine Oil",
      summary: "Check your car's oil level with the dipstick and top it up safely if it's low.",
      category: "Vehicle Maintenance",
      safetyLevel: "low",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Park on level ground",
            contentSimple:
              "Park somewhere flat and wait a few minutes after driving before you check the oil.",
            contentStandard:
              "Park on level ground and let the engine sit for a few minutes after driving so the oil settles back into the sump.",
            contentDetailed:
              "Park on level ground, switch off the engine, and wait 5-10 minutes so oil that's clinging to the engine's upper parts has time to drain back into the sump for an accurate reading.",
            safetyWarning: "Let the engine cool a little first — engine parts can be hot enough to burn you.",
          },
          {
            order: 2,
            title: "Find and pull the dipstick",
            contentSimple:
              "Open the bonnet and find the dipstick — it usually has a brightly coloured handle.",
            contentStandard:
              "Open the bonnet, locate the dipstick (often yellow or orange handled), pull it fully out, and wipe it clean with a cloth.",
            contentDetailed:
              "Open the bonnet and locate the dipstick, typically marked with a bright handle and an oil-can symbol. Pull it out fully and wipe the blade clean with a lint-free cloth so your first reading isn't inflated by residue.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Read the level",
            contentSimple:
              "Push the dipstick back in fully, pull it out again, and check where the oil mark sits between the min and max lines.",
            contentStandard:
              "Reinsert the clean dipstick fully, remove it again, and read the oil film against the min/max markers on the blade.",
            contentDetailed:
              "Reinsert the wiped dipstick all the way, then withdraw it again and hold it horizontally to read where the oil film sits relative to the min and max marks. Below min means you need to top up.",
            safetyWarning: null,
          },
          {
            order: 4,
            title: "Top up if needed",
            contentSimple:
              "If it's low, add a small amount of the right oil through the filler cap, then check again.",
            contentStandard:
              "If the level is below the minimum mark, remove the oil filler cap and add oil matching your car's manual in small amounts, rechecking the dipstick between pours.",
            contentDetailed:
              "If below minimum, unscrew the filler cap (separate from the dipstick) and add the oil grade specified in your owner's manual in small increments — around 250ml at a time — rechecking the dipstick after each pour to avoid overfilling.",
            safetyWarning: "Never overfill — too much oil can damage the engine. Ask an adult if you're unsure which oil to use.",
          },
        ],
      },
    },
  });
```

- [ ] **Step 2: Add "Jump-Starting a Car Battery"**

Insert directly after the `engineOil` block:

```ts
  const jumpStart = await prisma.tutorial.upsert({
    where: { slug: "jump-starting-a-car" },
    update: {},
    create: {
      slug: "jump-starting-a-car",
      title: "Jump-Starting a Car Battery",
      summary: "Safely connect jump leads to start a car with a flat battery, with an adult present.",
      category: "Vehicle Maintenance",
      safetyLevel: "requires-adult-supervision",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Position the cars",
            contentSimple:
              "Park the working car close to the flat one, nose to nose, but not touching, and switch both off.",
            contentStandard:
              "Park the donor car close enough for the jump leads to reach, ideally nose to nose, with both engines off and handbrakes on.",
            contentDetailed:
              "Position the donor vehicle within reach of your jump leads, engines off, handbrakes engaged, and both cars in park or neutral with gears disengaged before connecting anything.",
            safetyWarning: "Always have an adult present for jump-starting — a wrong connection can cause sparks or damage.",
          },
          {
            order: 2,
            title: "Connect the positive leads",
            contentSimple:
              "Clip one red clamp to the flat battery's positive terminal, the other red clamp to the good battery's positive terminal.",
            contentStandard:
              "Attach the red (positive) clamp to the flat battery's positive terminal, then attach the other red clamp to the donor battery's positive terminal.",
            contentDetailed:
              "Connect the first red clamp to the positive (+) terminal of the flat battery, then connect the second red clamp to the positive (+) terminal of the donor battery. Positive terminals are usually marked with a plus sign and a red cover.",
            safetyWarning: "Never let the red and black clamps touch each other while connected — this can cause a dangerous short.",
          },
          {
            order: 3,
            title: "Connect the negative lead safely",
            contentSimple:
              "Clip one black clamp to the good battery's negative terminal, and the other to bare metal on the flat car, away from the battery.",
            contentStandard:
              "Attach the black (negative) clamp to the donor battery's negative terminal, then attach the other black clamp to an unpainted metal point on the flat car's engine block, away from the battery and fuel system.",
            contentDetailed:
              "Connect the first black clamp to the negative (-) terminal of the donor battery. Connect the final black clamp to an unpainted metal earthing point on the flat car's engine — not the battery itself — to reduce the risk of sparks near battery gases.",
            safetyWarning: "Never connect the final clamp directly to the flat battery's negative terminal — sparks near a battery can be dangerous.",
          },
          {
            order: 4,
            title: "Start the engines and remove leads",
            contentSimple:
              "Start the working car, wait a minute, then try starting the flat one. Remove the leads in reverse order once running.",
            contentStandard:
              "Start the donor car and let it run for a minute or two, then start the previously flat car. Once it's running, disconnect the leads in reverse order of how they were attached.",
            contentDetailed:
              "Start the donor vehicle and let it idle for one to two minutes to build charge, then attempt to start the flat vehicle. Once running, remove the clamps in reverse order — last-on, first-off — keeping clamps from touching each other or bodywork as you go.",
            safetyWarning: "Let the newly-started car run or drive for at least 20-30 minutes to recharge the battery.",
          },
        ],
      },
    },
  });
```

- [ ] **Step 3: Verify the seed file still compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no output (no type errors).

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: seed engine oil and jump-start vehicle maintenance tutorials"
```

---

## Task 2: Home Repairs additions

**Files:**
- Modify: `prisma/seed.ts` — insert new blocks after the `jumpStart` block from Task 1.

**Interfaces:**
- Consumes: `prisma`.
- Produces: `drywall` and `radiator` local `const` bindings for the Task 7 summary line.

- [ ] **Step 1: Add "Patching a Hole in Drywall"**

```ts
  const drywall = await prisma.tutorial.upsert({
    where: { slug: "patching-a-hole-in-drywall" },
    update: {},
    create: {
      slug: "patching-a-hole-in-drywall",
      title: "Patching a Hole in Drywall",
      summary: "Repair a small hole or dent in a plasterboard wall with filler and a scraper.",
      category: "Home Repairs",
      safetyLevel: "low",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Clean up the hole",
            contentSimple:
              "Brush away loose bits of plasterboard and dust around the hole.",
            contentStandard:
              "Remove any loose or crumbling material around the hole with your fingers or a scraper, then brush away dust so filler will stick properly.",
            contentDetailed:
              "Clear away loose or crumbling plasterboard around the damaged area with a scraper, then dust off the surface with a dry brush or cloth. Filler adheres poorly to dusty or loose surfaces.",
            safetyWarning: null,
          },
          {
            order: 2,
            title: "Apply filler",
            contentSimple:
              "Use a filler knife to press filler into the hole until it's slightly higher than the wall.",
            contentStandard:
              "Load a filling knife with ready-mixed filler and press it firmly into the hole, slightly overfilling since it shrinks a little as it dries.",
            contentDetailed:
              "Load a filling knife with ready-mixed or mixed powder filler, press it firmly into the hole to avoid trapped air, and build it up slightly proud of the surrounding wall to allow for shrinkage as it cures.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Let it dry and sand smooth",
            contentSimple:
              "Wait until the filler is fully dry and hard, then sand it flat with fine sandpaper.",
            contentStandard:
              "Allow the filler to dry fully per the packet instructions, then sand it flush with the wall using fine-grit sandpaper and a light touch.",
            contentDetailed:
              "Leave the filler to dry fully — usually a few hours, longer for deep holes — then sand it flush with fine-grit (around 180-220) sandpaper, checking with your hand for a smooth, even surface.",
            safetyWarning: "Wear a dust mask when sanding filler — the dust can irritate your lungs.",
          },
          {
            order: 4,
            title: "Prime and paint",
            contentSimple:
              "Wipe away dust, then paint over the patch to match the wall.",
            contentStandard:
              "Wipe the patch clean of sanding dust, apply a thin coat of primer if the wall is a strong colour, then paint to match the surrounding wall.",
            contentDetailed:
              "Wipe down the patch and surrounding area to remove all sanding dust. Apply a primer coat if painting over a patch on a dark or strongly coloured wall, let it dry, then apply matching paint in thin, even coats.",
            safetyWarning: null,
          },
        ],
      },
    },
  });
```

- [ ] **Step 2: Add "Bleeding a Radiator"**

```ts
  const radiator = await prisma.tutorial.upsert({
    where: { slug: "bleeding-a-radiator" },
    update: {},
    create: {
      slug: "bleeding-a-radiator",
      title: "Bleeding a Radiator",
      summary: "Release trapped air from a radiator that's cold at the top and warm at the bottom.",
      category: "Home Repairs",
      safetyLevel: "low",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Turn on the heating",
            contentSimple:
              "Turn the heating on and feel each radiator — cold at the top usually means trapped air.",
            contentStandard:
              "Switch the heating system on and check each radiator by hand — one that's cold at the top but warm lower down likely has trapped air.",
            contentDetailed:
              "Turn the central heating on and let radiators warm up, then check each one by hand. A radiator that's cool at the top but warm at the bottom is a classic sign of trapped air needing to be bled.",
            safetyWarning: null,
          },
          {
            order: 2,
            title: "Turn off the heating and get ready",
            contentSimple:
              "Turn the heating off, then find the bleed key and a cloth or small container.",
            contentStandard:
              "Switch off the heating system so the radiator isn't actively heating, then get a radiator bleed key and a cloth or small container to catch drips.",
            contentDetailed:
              "Switch off the central heating so the pump isn't circulating hot water, and let the radiator cool slightly. Gather a radiator bleed key and a cloth or small container to catch any water that escapes.",
            safetyWarning: "Let the radiator cool a bit first — the valve and escaping water can be hot.",
          },
          {
            order: 3,
            title: "Open the bleed valve",
            contentSimple:
              "Fit the key on the valve at the top corner and turn it slowly anticlockwise until you hear hissing.",
            contentStandard:
              "Fit the bleed key onto the valve at the top of the radiator and turn it slowly anticlockwise a quarter turn — you should hear air hissing out.",
            contentDetailed:
              "Fit the bleed key onto the square valve fitting at the top corner of the radiator, hold your cloth beneath it, and turn slowly anticlockwise about a quarter turn. You'll hear a hiss as trapped air escapes.",
            safetyWarning: null,
          },
          {
            order: 4,
            title: "Close the valve and check pressure",
            contentSimple:
              "As soon as water dribbles out instead of air, close the valve, then check the boiler pressure gauge.",
            contentStandard:
              "Close the valve firmly as soon as a steady trickle of water appears (no more hissing), then check your boiler's pressure gauge and top up if it's dropped below the recommended range.",
            contentDetailed:
              "Once air stops hissing and water begins to dribble out steadily, close the valve firmly with the key. Afterwards, check the boiler's pressure gauge — bleeding radiators often drops system pressure, and it may need topping up via the filling loop.",
            safetyWarning: "Ask an adult to help top up boiler pressure — overfilling can trigger a fault or leak.",
          },
        ],
      },
    },
  });
```

- [ ] **Step 3: Verify the seed file still compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no output (no type errors).

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: seed drywall patching and radiator bleeding home repair tutorials"
```

---

## Task 3: Home Repairs — unblocking a toilet

**Files:**
- Modify: `prisma/seed.ts` — insert one new block after the `radiator` block from Task 2. This is the "unblocking a toilet" tutorial named explicitly in the Phase 1 design spec's original scope list but never seeded.

**Interfaces:**
- Consumes: `prisma`.
- Produces: `toilet` local `const` binding for the Task 7 summary line.

- [ ] **Step 1: Add "Unblocking a Toilet"**

```ts
  const toilet = await prisma.tutorial.upsert({
    where: { slug: "unblocking-a-toilet" },
    update: {},
    create: {
      slug: "unblocking-a-toilet",
      title: "Unblocking a Toilet",
      summary: "Clear a blocked toilet with a plunger before it overflows.",
      category: "Home Repairs",
      safetyLevel: "low",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Stop the water rising further",
            contentSimple:
              "If the bowl is very full, don't flush again — take off the cistern lid and hold the flap shut if water keeps running.",
            contentStandard:
              "If the bowl is nearly full, avoid flushing again. If water keeps trickling in, remove the cistern lid and hold the flush valve closed, or turn off the toilet's isolation valve if there is one.",
            contentDetailed:
              "If the bowl is close to overflowing, do not flush again. Remove the cistern lid to check whether water is still running in, and either hold the flush valve flap closed or shut the isolation valve (usually behind or beside the toilet) to stop more water entering.",
            safetyWarning: null,
          },
          {
            order: 2,
            title: "Get the right plunger",
            contentSimple:
              "Use a flanged (funnel-shaped) plunger made for toilets, not a flat sink plunger.",
            contentStandard:
              "Use a flanged toilet plunger — it has an extra rubber flap that helps it seal inside the bowl's curved outlet, unlike a flat sink plunger.",
            contentDetailed:
              "A flanged plunger, with its extended rubber flap, seals far better against a toilet's curved outlet than a flat-cupped sink plunger. Using the wrong type wastes effort and can push water everywhere instead of down the pipe.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Plunge with a good seal",
            contentSimple:
              "Push the plunger fully over the hole so no air gaps remain, then pump firmly up and down.",
            contentStandard:
              "Position the plunger over the outlet so it forms a full seal with no air gaps, then push down gently first to expel air, then plunge firmly and rhythmically 10-15 times.",
            contentDetailed:
              "Angle the plunger into the bowl to fill it with the flange fully submerged, ensuring a complete seal with no trapped air. Push down gently on the first stroke to avoid splashing, then plunge firmly and rhythmically for 10-15 strokes, keeping the seal intact throughout.",
            safetyWarning: "Wear gloves and wash your hands thoroughly afterwards.",
          },
          {
            order: 4,
            title: "Test and repeat if needed",
            contentSimple:
              "Pour a bucket of water in slowly to test if it drains. If not, plunge again or ask an adult for help.",
            contentStandard:
              "Slowly pour a bucket of water into the bowl to test drainage rather than flushing straight away. If it drains normally, the blockage has cleared; if not, repeat plunging or ask an adult about a toilet auger.",
            contentDetailed:
              "Test with a slowly poured bucket of water rather than a full flush, which risks overflow if the blockage remains. If drainage is still slow after two or three plunging attempts, stop and ask an adult about using a toilet auger or calling a plumber.",
            safetyWarning: "If the bowl is still rising after two attempts, stop and get an adult rather than risking an overflow.",
          },
        ],
      },
    },
  });
```

- [ ] **Step 2: Verify the seed file still compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no output (no type errors).

- [ ] **Step 3: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: seed unblocking-a-toilet tutorial"
```

---

## Task 4: Tool Use additions

**Files:**
- Modify: `prisma/seed.ts` — insert new blocks after the `toilet` block from Task 3.

**Interfaces:**
- Consumes: `prisma`.
- Produces: `cordlessDrill` and `screwdrivers` local `const` bindings for the Task 7 summary line.

- [ ] **Step 1: Add "Using a Cordless Drill Safely"**

```ts
  const cordlessDrill = await prisma.tutorial.upsert({
    where: { slug: "using-a-cordless-drill" },
    update: {},
    create: {
      slug: "using-a-cordless-drill",
      title: "Using a Cordless Drill Safely",
      summary: "Set up, drill, and drive screws with a cordless drill without wrecking the job or your fingers.",
      category: "Tool Use",
      safetyLevel: "requires-adult-supervision",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Choose the right bit and set the clutch",
            contentSimple:
              "Pick a drill bit or screwdriver bit that matches the job, and set the clutch to a low number for screws.",
            contentStandard:
              "Fit the correct drill or driver bit for the job and set the clutch dial to a low-to-medium number when driving screws so you don't strip them or the material.",
            contentDetailed:
              "Select the drill or driver bit matched to the task — a twist bit for drilling, a Phillips/Pozi bit for screws. Set the clutch dial low for driving screws into soft material and higher only for pure drilling, which disengages the clutch entirely on most drills.",
            safetyWarning: null,
          },
          {
            order: 2,
            title: "Secure the workpiece",
            contentSimple:
              "Clamp down what you're drilling into so it can't spin or slide.",
            contentStandard:
              "Clamp the workpiece to a bench or hold it firmly against a stable surface — never hold small pieces only in your hand while drilling.",
            contentDetailed:
              "Secure the workpiece with a clamp or vice wherever possible. Small or loose pieces can spin violently if a bit binds, so never rely on holding them by hand alone, especially with anything metal.",
            safetyWarning: "Never drill into material you're holding only in your hand — it can spin and cut you.",
          },
          {
            order: 3,
            title: "Drill or drive with steady pressure",
            contentSimple:
              "Hold the drill straight, start slow, and apply steady, gentle pressure.",
            contentStandard:
              "Keep the drill perpendicular to the surface, start at a low speed to create a starting point, then apply steady, even pressure without forcing it.",
            contentDetailed:
              "Hold the drill perpendicular to the work surface, start at low speed to establish the hole or screw start without the bit wandering, then increase to a comfortable speed with steady, even pressure. Let the tool do the work rather than forcing it.",
            safetyWarning: "Wear safety glasses — drilling throws off small chips and dust.",
          },
          {
            order: 4,
            title: "Finish and store safely",
            contentSimple:
              "Release the trigger before pulling the bit out, then put the drill away with the safety lock on.",
            contentStandard:
              "Let the drill fully stop before withdrawing the bit from the hole, then engage any safety lock and store the drill and battery separately from young children.",
            contentDetailed:
              "Release the trigger and allow the chuck to fully stop before withdrawing the bit — pulling out a spinning bit can snag material or your hand. Engage the forward/reverse safety lock, and store the drill and its battery in a safe, dry place.",
            safetyWarning: "Always have an adult nearby the first several times you use a power drill.",
          },
        ],
      },
    },
  });
```

- [ ] **Step 2: Add "Choosing and Using the Right Screwdriver"**

```ts
  const screwdrivers = await prisma.tutorial.upsert({
    where: { slug: "choosing-the-right-screwdriver" },
    update: {},
    create: {
      slug: "choosing-the-right-screwdriver",
      title: "Choosing and Using the Right Screwdriver",
      summary: "Match screwdriver type and size to the screw so you don't strip it, and drive screws cleanly.",
      category: "Tool Use",
      safetyLevel: "low",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Identify the screw head type",
            contentSimple:
              "Look at the screw head: a single slot is flathead, a cross shape is Phillips or Pozi.",
            contentStandard:
              "Check the screw head shape: a single straight slot needs a flathead driver; a cross-shaped slot needs a Phillips or Pozidriv driver — look closely, as they look similar but aren't interchangeable.",
            contentDetailed:
              "Identify the drive type: flathead (single slot), Phillips (cross with tapered flanks, can cam out), or Pozidriv (cross with extra small ribs between the arms, common in the UK). Using the wrong cross-head type damages both the screw and the driver.",
            safetyWarning: null,
          },
          {
            order: 2,
            title: "Match the size",
            contentSimple:
              "Pick a driver tip that fills the screw head snugly, not loose and not too big to fit.",
            contentStandard:
              "Choose a driver size that fits the screw head snugly with no visible gap or wobble — too small or too large both lead to stripped screws.",
            contentDetailed:
              "Test-fit the driver in the screw head before applying force: it should sit snugly with no wobble and no gap around the edges. A too-small tip will slip and round out the screw slot; a too-large tip won't seat fully.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Apply straight, steady pressure",
            contentSimple:
              "Push straight down into the screw while you turn, so the driver doesn't slip out.",
            contentStandard:
              "Keep the driver aligned straight with the screw axis and apply firm downward pressure as you turn, so the tip stays seated instead of camming out.",
            contentDetailed:
              "Hold the driver perfectly in line with the screw's axis and apply consistent downward pressure throughout the turn. Angling the driver even slightly increases the chance it slips out (\"cams out\"), rounding the screw head.",
            safetyWarning: "Keep your other hand clear of the screwdriver's path in case it slips.",
          },
          {
            order: 4,
            title: "Deal with a stubborn or stripped screw",
            contentSimple:
              "If it won't turn, try a rubber band between the tip and screw for extra grip, or ask for help.",
            contentStandard:
              "If a screw won't budge or the head is starting to round out, try placing a wide rubber band between the driver tip and the screw for extra grip, or use a properly sized driver and firmer, straight pressure. Ask an adult if it's still stuck.",
            contentDetailed:
              "For a stubborn screw, a rubber band placed between the driver tip and screw head can add grip and reduce slipping. If the head is already rounding, stop forcing it and ask an adult — a screw extractor or different technique may be needed to avoid making it worse.",
            safetyWarning: null,
          },
        ],
      },
    },
  });
```

- [ ] **Step 3: Verify the seed file still compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no output (no type errors).

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: seed cordless drill and screwdriver tool-use tutorials"
```

---

## Task 5: Kitchen Skills additions

**Files:**
- Modify: `prisma/seed.ts` — insert new blocks after the `screwdrivers` block from Task 4.

**Interfaces:**
- Consumes: `prisma`.
- Produces: `rice`, `knifeSkills`, and `pastaSauce` local `const` bindings for the Task 7 summary line.

- [ ] **Step 1: Add "Cooking Rice Perfectly"**

```ts
  const rice = await prisma.tutorial.upsert({
    where: { slug: "cooking-rice-perfectly" },
    update: {},
    create: {
      slug: "cooking-rice-perfectly",
      title: "Cooking Rice Perfectly",
      summary: "Cook fluffy, non-sticky rice on the hob every time using the absorption method.",
      category: "Kitchen Skills",
      safetyLevel: "requires-adult-supervision",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Rinse the rice",
            contentSimple:
              "Put the rice in a sieve and rinse it under cold water until the water runs clear.",
            contentStandard:
              "Rinse the rice in a sieve under cold running water, swishing it with your hand until the water runs mostly clear — this removes excess starch that causes stickiness.",
            contentDetailed:
              "Place rice in a fine sieve and rinse under cold running water, agitating gently with your fingers, until the runoff water is mostly clear rather than cloudy. This washes off surface starch and reduces clumping during cooking.",
            safetyWarning: null,
          },
          {
            order: 2,
            title: "Measure water and rice",
            contentSimple:
              "Use about 1.5 cups of water for every cup of rice, unless the packet says otherwise.",
            contentStandard:
              "Use a ratio of roughly 1.5 parts water to 1 part rice for white rice, adjusting to the packet instructions if given, and add a pinch of salt.",
            contentDetailed:
              "For white long-grain rice, use approximately 1.5 parts water to 1 part rice by volume, following packet guidance if it differs (basmati and jasmine often use closer to 1:1.5, brown rice needs more water and time). Add a small pinch of salt to the pot.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Bring to the boil, then simmer covered",
            contentSimple:
              "Bring it to a boil, then turn it right down, put the lid on, and don't lift the lid while it cooks.",
            contentStandard:
              "Bring the pot to a boil uncovered, then reduce to the lowest simmer, cover with a tight lid, and avoid lifting the lid — this traps steam that finishes cooking the rice evenly.",
            contentDetailed:
              "Bring to a rolling boil uncovered, then immediately reduce heat to the lowest simmer setting and cover tightly with a lid. Resist lifting the lid during cooking, as escaping steam changes the water ratio and can leave rice undercooked or unevenly cooked.",
            safetyWarning: "Use oven gloves or a folded cloth if you need to move a hot pot — handles get hot too.",
          },
          {
            order: 4,
            title: "Rest, then fluff",
            contentSimple:
              "Take it off the heat, leave the lid on for 5-10 minutes, then fluff with a fork.",
            contentStandard:
              "Once the water is absorbed (usually 15-18 minutes for white rice), remove from heat and let it rest, covered, for 5-10 minutes before fluffing gently with a fork.",
            contentDetailed:
              "Once water is fully absorbed — check by tilting the pot or looking for steam holes on the surface — remove from heat and let the covered pot rest undisturbed for 5-10 minutes. This lets residual steam finish the grains. Fluff gently with a fork rather than stirring, to avoid mashing the rice.",
            safetyWarning: null,
          },
        ],
      },
    },
  });
```

- [ ] **Step 2: Add "Basic Knife Skills and Safety"**

```ts
  const knifeSkills = await prisma.tutorial.upsert({
    where: { slug: "basic-knife-skills" },
    update: {},
    create: {
      slug: "basic-knife-skills",
      title: "Basic Knife Skills and Safety",
      summary: "Hold, grip, and cut safely with a kitchen knife using the claw grip.",
      category: "Kitchen Skills",
      safetyLevel: "requires-adult-supervision",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Choose the right knife and stabilise your board",
            contentSimple:
              "Use a sharp knife sized for the job, and put a damp cloth under your chopping board so it doesn't slide.",
            contentStandard:
              "Pick a knife with a sharp, appropriately sized blade for the ingredient, and stabilise your chopping board by placing a damp cloth or non-slip mat underneath.",
            contentDetailed:
              "Select a knife matched to the task — a small paring knife for detail work, a larger chef's knife for most chopping. A sharp knife is safer than a dull one because it requires less force and is less likely to slip. Stabilise the board with a damp cloth or non-slip mat underneath.",
            safetyWarning: "A sharp knife is safer than a blunt one — blunt blades slip more easily.",
          },
          {
            order: 2,
            title: "Grip the knife correctly",
            contentSimple:
              "Hold the handle firmly with your fingers wrapped around it, not gripping the blade.",
            contentStandard:
              "Grip the handle firmly with all fingers, keeping your index finger and thumb pinched slightly onto the blade's base for control, rather than wrapping around the sharp edge.",
            contentDetailed:
              "Use a firm handle grip with your index finger and thumb pinching the blade just above the handle (the \"pinch grip\") for better control and balance, keeping the rest of your fingers curled around the handle, well clear of the cutting edge.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Use the claw grip on your guide hand",
            contentSimple:
              "Curl the fingers of your other hand inward like a claw, so your knuckles guide the blade, not your fingertips.",
            contentStandard:
              "Curl the fingers of your non-knife hand inward into a claw shape, using your knuckles as a guide for the blade while keeping fingertips tucked well away from the edge.",
            contentDetailed:
              "Form a claw shape with your guide hand — fingertips curled under and back, knuckles forward — so the flat of the knife blade rests against your knuckles as a guide. This keeps fingertips protected far from the cutting edge throughout the cut.",
            safetyWarning: "Always keep fingertips tucked in and away from the blade — the claw grip is what protects them.",
          },
          {
            order: 4,
            title: "Cut with a rocking or slicing motion",
            contentSimple:
              "Move the knife forward and down in one smooth motion, moving your guide hand back as you go.",
            contentStandard:
              "Use a smooth rocking or forward-slicing motion rather than sawing straight down, moving your claw-grip hand backward incrementally as you cut through the ingredient.",
            contentDetailed:
              "Cut using a smooth rocking motion (tip staying near the board, heel lifting and falling) or a forward slicing motion for larger items, rather than chopping straight down. Move your guide hand backward in small increments after each cut, always keeping your knuckles ahead of your fingertips relative to the blade.",
            safetyWarning: "Never leave a knife submerged in a sink of water where it can't be seen — always wash it separately.",
          },
        ],
      },
    },
  });
```

- [ ] **Step 3: Add "Making a Simple Pasta Sauce"**

```ts
  const pastaSauce = await prisma.tutorial.upsert({
    where: { slug: "making-a-simple-pasta-sauce" },
    update: {},
    create: {
      slug: "making-a-simple-pasta-sauce",
      title: "Making a Simple Pasta Sauce",
      summary: "Cook a basic tomato pasta sauce from tinned tomatoes, garlic, and herbs.",
      category: "Kitchen Skills",
      safetyLevel: "requires-adult-supervision",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Prep your ingredients",
            contentSimple:
              "Chop an onion and garlic finely, and open a tin of chopped tomatoes.",
            contentStandard:
              "Finely chop one onion and 2 cloves of garlic, and open a 400g tin of chopped tomatoes ready to add.",
            contentDetailed:
              "Finely dice one onion and mince 2 cloves of garlic. Open a 400g tin of chopped tomatoes. Having everything prepped before you start cooking (\"mise en place\") makes the next steps much less stressful.",
            safetyWarning: null,
          },
          {
            order: 2,
            title: "Soften the onion and garlic",
            contentSimple:
              "Heat some oil in a pan, add the onion, cook until soft, then add the garlic for a minute.",
            contentStandard:
              "Heat a tablespoon of oil in a pan over medium heat, add the onion, and cook for 5-7 minutes until soft and translucent, then add the garlic and cook for one more minute, stirring so it doesn't burn.",
            contentDetailed:
              "Heat a tablespoon of oil over medium heat, add the onion, and cook for 5-7 minutes, stirring occasionally, until soft and translucent but not browned. Add the garlic and cook for a further 30-60 seconds, stirring constantly — garlic burns quickly and turns bitter.",
            safetyWarning: "Turn pan handles inward on the hob so you don't knock them and spill hot oil.",
          },
          {
            order: 3,
            title: "Add tomatoes and simmer",
            contentSimple:
              "Pour in the tin of tomatoes, add a pinch of salt and dried herbs, and let it bubble gently.",
            contentStandard:
              "Add the tinned tomatoes, a pinch of salt, and a teaspoon of dried herbs such as oregano or basil, then reduce the heat and let it simmer gently for 15-20 minutes, stirring occasionally.",
            contentDetailed:
              "Pour in the tinned tomatoes, season with a pinch of salt and a teaspoon of dried herbs (oregano and basil work well), and reduce heat to a gentle simmer. Let it cook uncovered for 15-20 minutes, stirring occasionally, so it thickens rather than staying watery.",
            safetyWarning: "Simmering tomato sauce can spit — stand back a little when stirring or use a splash guard.",
          },
          {
            order: 4,
            title: "Taste, adjust, and combine with pasta",
            contentSimple:
              "Taste the sauce and add more salt or herbs if needed, then mix with cooked pasta.",
            contentStandard:
              "Taste the sauce and adjust seasoning with more salt, pepper, or herbs as needed, then combine with your drained, cooked pasta and a splash of the pasta cooking water if it needs loosening.",
            contentDetailed:
              "Taste the sauce and adjust with more salt, black pepper, or a pinch of sugar to balance acidity if needed. Combine with drained, cooked pasta, adding a splash of reserved pasta cooking water to loosen the sauce and help it cling to the pasta.",
            safetyWarning: null,
          },
        ],
      },
    },
  });
```

- [ ] **Step 4: Verify the seed file still compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no output (no type errors).

- [ ] **Step 5: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: seed rice, knife skills, and pasta sauce kitchen tutorials"
```

---

## Task 6: Money & Admin and Personal Care additions

**Files:**
- Modify: `prisma/seed.ts` — insert new blocks after the `pastaSauce` block from Task 5.

**Interfaces:**
- Consumes: `prisma`.
- Produces: `payslip`, `standingOrder`, `ironing`, and `laundry` local `const` bindings for the Task 7 summary line.

- [ ] **Step 1: Add "Understanding a Payslip"**

```ts
  const payslip = await prisma.tutorial.upsert({
    where: { slug: "understanding-a-payslip" },
    update: {},
    create: {
      slug: "understanding-a-payslip",
      title: "Understanding a Payslip",
      summary: "Read a payslip to check your pay, tax, and deductions are correct.",
      category: "Money & Admin",
      safetyLevel: "low",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Find your gross pay",
            contentSimple:
              "Gross pay is your total earnings before anything is taken off.",
            contentStandard:
              "Locate the \"gross pay\" figure — this is your total earnings for the period before tax, National Insurance, or any other deductions are subtracted.",
            contentDetailed:
              "Gross pay is your headline figure: total earnings for the pay period before any deductions. It should match your agreed hourly rate or salary for the hours/period worked — check this first, since every other figure is calculated from it.",
            safetyWarning: null,
          },
          {
            order: 2,
            title: "Check tax and National Insurance",
            contentSimple:
              "Look for Income Tax and National Insurance — these are taken off automatically to pay for public services.",
            contentStandard:
              "Find the Income Tax and National Insurance (NI) lines — these are statutory deductions taken automatically based on your tax code and earnings level.",
            contentDetailed:
              "Locate Income Tax and National Insurance deductions. Income Tax is calculated against your tax code (shown elsewhere on the payslip, usually starting with numbers like 1257L) and NI is based on earnings thresholds. If your tax code looks wrong or unfamiliar, that's worth asking about.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Check other deductions",
            contentSimple:
              "Look for anything else being taken off, like a pension or student loan repayment.",
            contentStandard:
              "Check for any other deductions such as workplace pension contributions, student loan repayments, or union fees, and confirm they match what you've agreed to.",
            contentDetailed:
              "Review any remaining deduction lines, such as a workplace pension contribution (often matched by your employer), student loan repayments, or other benefits-in-kind. Confirm the amounts and that you recognise every deduction listed.",
            safetyWarning: null,
          },
          {
            order: 4,
            title: "Confirm net pay matches what you receive",
            contentSimple:
              "Net pay is what actually lands in your bank account — check it matches your bank statement.",
            contentStandard:
              "Find the \"net pay\" figure (gross pay minus all deductions) and confirm it matches what actually arrives in your bank account on payday.",
            contentDetailed:
              "Net pay is gross pay minus every deduction, and it should exactly match the amount that lands in your bank account. If it doesn't match, or a deduction looks unfamiliar or wrong, raise it with your employer's payroll or HR contact promptly — errors are easier to fix quickly.",
            safetyWarning: null,
          },
        ],
      },
    },
  });
```

- [ ] **Step 2: Add "Setting Up a Bank Standing Order"**

```ts
  const standingOrder = await prisma.tutorial.upsert({
    where: { slug: "setting-up-a-standing-order" },
    update: {},
    create: {
      slug: "setting-up-a-standing-order",
      title: "Setting Up a Bank Standing Order",
      summary: "Set up an automatic recurring payment from your bank account, like for rent or savings.",
      category: "Money & Admin",
      safetyLevel: "requires-adult-supervision",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Gather the recipient's details",
            contentSimple:
              "Get the account name, sort code, and account number of whoever you're paying.",
            contentStandard:
              "Collect the payee's account name, 6-digit sort code, and 8-digit account number — get these directly from a trusted source, like a signed tenancy agreement, not just a text message.",
            contentDetailed:
              "Collect the exact account name, sort code, and account number of the payee. Verify these details from a trusted, official source (a signed agreement, an official letter, or a direct in-person confirmation) — payment detail scams often arrive by text or email pretending to be a landlord or company.",
            safetyWarning: "Never change payment details based only on a text or email — always verify by phone or in person.",
          },
          {
            order: 2,
            title: "Open the standing order form in your banking app",
            contentSimple:
              "In your banking app or website, find \"Payments\" then \"Set up a standing order.\"",
            contentStandard:
              "In your banking app or online banking, navigate to the payments section and choose \"Set up a standing order\" (distinct from a one-off payment or a Direct Debit).",
            contentDetailed:
              "Open your bank's app or website and find the payments section, then choose the standing order option specifically — this differs from a one-off transfer (single payment) and a Direct Debit (amount set by the payee, not you).",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Enter the amount and frequency",
            contentSimple:
              "Enter how much to pay, how often (like monthly), and the start date.",
            contentStandard:
              "Enter the payment amount, choose the frequency (weekly, monthly, etc.), and set the start date — for rent, this is usually the day before or on your payday.",
            contentDetailed:
              "Enter the exact amount, select the recurring frequency, and choose a start date. For recurring bills like rent, time the start date a day or two after your typical payday so funds are reliably available when the payment goes out.",
            safetyWarning: null,
          },
          {
            order: 4,
            title: "Double-check and confirm",
            contentSimple:
              "Review all the details once more before confirming, then check it went through correctly.",
            contentStandard:
              "Review the payee details, amount, frequency, and start date one final time before confirming, then check your account a day or two after the first payment to confirm it processed correctly.",
            contentDetailed:
              "Before confirming, review every field once more — account details are the most common source of costly errors. After the first scheduled payment, check your account to confirm it processed for the correct amount to the correct recipient, and keep a note of the standing order for your own budget tracking.",
            safetyWarning: "Set a reminder to review your standing orders every few months so you don't keep paying for something you've cancelled.",
          },
        ],
      },
    },
  });
```

- [ ] **Step 3: Add "Ironing a Shirt"**

```ts
  const ironing = await prisma.tutorial.upsert({
    where: { slug: "ironing-a-shirt" },
    update: {},
    create: {
      slug: "ironing-a-shirt",
      title: "Ironing a Shirt",
      summary: "Iron a shirt in the right order to get a crease-free finish without burning it.",
      category: "Personal Care",
      safetyLevel: "requires-adult-supervision",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Check the care label and set the temperature",
            contentSimple:
              "Look at the label inside the collar for the fabric type, and set the iron to match it.",
            contentStandard:
              "Check the care label for fabric type and recommended heat setting, and set the iron accordingly — cotton and linen take more heat, synthetics need it much lower.",
            contentDetailed:
              "Check the care label inside the collar or side seam for the fabric composition and iron symbol. Set the iron's temperature dial to match: cotton and linen tolerate high heat, while polyester, silk, and blends need low-to-medium heat to avoid melting or scorching.",
            safetyWarning: "Never leave a hot iron standing flat and unattended — always stand it upright.",
          },
          {
            order: 2,
            title: "Iron the collar and cuffs first",
            contentSimple:
              "Start with the collar, ironing from the points inward, then do the cuffs.",
            contentStandard:
              "Lay the collar flat and iron from the outer points toward the centre on both sides, then open and iron the cuffs flat, working around the buttons.",
            contentDetailed:
              "Start with the smaller, structured areas: lay the collar open and iron from each point toward the centre on the underside first, then the top side. Open the cuffs flat and iron around the buttons, doing both sides.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Iron the body, front to back",
            contentSimple:
              "Do the front panels with the buttons, then the back, then the sleeves last.",
            contentStandard:
              "Iron the front panels around the buttons, then lay the shirt back-up over the board and iron the yoke and back, then finish with the sleeves.",
            contentDetailed:
              "Iron the front panels, working around buttons and the plackets carefully. Lay the shirt with the back up over the ironing board, smoothing out the yoke and back panel. Finish with the sleeves, laying each flat with the seam aligned along one edge, ironing both sides.",
            safetyWarning: "Keep your free hand away from the ironing area — the plate stays hot even after you lift it.",
          },
          {
            order: 4,
            title: "Hang immediately",
            contentSimple:
              "Put the shirt on a hanger straight away while it's still warm, so it keeps its shape.",
            contentStandard:
              "Hang the shirt on a hanger immediately after ironing, buttoning the top button, so it cools into shape rather than picking up new creases.",
            contentDetailed:
              "Hang the shirt on a shaped hanger right away, buttoning at least the top button and smoothing the shoulders. Ironing it right before it's needed, then leaving it crumpled, undoes the work — hanging while warm lets it set into shape.",
            safetyWarning: "Switch the iron off and let it cool fully on its stand before putting it away.",
          },
        ],
      },
    },
  });
```

- [ ] **Step 4: Add "Doing a Load of Laundry"**

```ts
  const laundry = await prisma.tutorial.upsert({
    where: { slug: "doing-a-load-of-laundry" },
    update: {},
    create: {
      slug: "doing-a-load-of-laundry",
      title: "Doing a Load of Laundry",
      summary: "Sort, wash, and dry a load of laundry without shrinking or dyeing everything pink.",
      category: "Personal Care",
      safetyLevel: "low",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Sort by colour and fabric",
            contentSimple:
              "Split clothes into lights, darks, and delicates so colours don't run onto each other.",
            contentStandard:
              "Sort clothes into separate piles: whites/lights, darks/colours, and delicates, since dyes from dark items can run onto lighter ones in the wash.",
            contentDetailed:
              "Sort into at least three groups: whites and light colours, darks and bright colours, and delicates (silk, wool, anything hand-wash only). New or unwashed dark items are the most likely to bleed dye, so wash them separately the first couple of times.",
            safetyWarning: null,
          },
          {
            order: 2,
            title: "Check pockets and care labels",
            contentSimple:
              "Empty every pocket, and check labels for anything that shouldn't go in the machine.",
            contentStandard:
              "Empty all pockets of tissues, coins, and anything else, and check care labels for items that need a cooler wash, hand-washing only, or shouldn't be tumble dried.",
            contentDetailed:
              "Check every pocket for tissues (which shred and coat everything in lint), coins, and loose items that can damage the drum. Check care labels for temperature limits, hand-wash-only symbols, and drying restrictions before adding items to the machine load.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Choose the right settings and load the machine",
            contentSimple:
              "Pick a temperature that suits the fabrics, add the right amount of detergent, and don't overfill the drum.",
            contentStandard:
              "Choose a wash temperature matching the most delicate item in the load, measure detergent according to the load size and water hardness, and fill the drum no more than three-quarters full.",
            contentDetailed:
              "Select a wash temperature suited to the most delicate item in the load — when in doubt, wash cooler. Measure detergent per the manufacturer's guidance for load size and local water hardness (too much leaves residue, too little leaves clothes dirty). Load the drum loosely, no more than around three-quarters full, so clothes can move and rinse properly.",
            safetyWarning: null,
          },
          {
            order: 4,
            title: "Dry appropriately",
            contentSimple:
              "Check the label before tumble drying — some things need to be hung up to dry instead.",
            contentStandard:
              "Check the care label before tumble drying — items marked with a crossed-out tumble dryer symbol should be air-dried on a rack or line instead, especially wool and anything that can shrink.",
            contentDetailed:
              "Check the care label's drying symbols before choosing a method. A crossed-out square-with-circle symbol means no tumble drying — air dry those items flat or on a hanger instead. Wool and some synthetics shrink or lose shape quickly in a hot dryer, so it's worth checking every time rather than assuming.",
            safetyWarning: null,
          },
        ],
      },
    },
  });
```

- [ ] **Step 5: Verify the seed file still compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no output (no type errors).

- [ ] **Step 6: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: seed payslip, standing order, ironing, and laundry tutorials"
```

---

## Task 7: Update seed summary, run seed, and full verification

**Files:**
- Modify: `prisma/seed.ts` — update the final `console.log` line to list all 22 tutorial slugs (8 existing + 14 new).

**Interfaces:**
- Consumes: all local `const` bindings from Tasks 1-6 (`engineOil`, `jumpStart`, `drywall`, `radiator`, `toilet`, `cordlessDrill`, `screwdrivers`, `rice`, `knifeSkills`, `pastaSauce`, `payslip`, `standingOrder`, `ironing`, `laundry`) plus the 8 pre-existing bindings (`tire`, `plug`, `lightSwitch`, `tapeMeasure`, `budget`, `button`, `sink`, `omelette`).
- Produces: nothing new — this task verifies and ties off the whole plan.

- [ ] **Step 1: Update the console.log summary**

Replace the existing summary line:

```ts
  console.log(
    `Seeded tutorials: ${tire.slug}, ${plug.slug}, ${lightSwitch.slug}, ${tapeMeasure.slug}, ${budget.slug}, ${button.slug}, ${sink.slug}, ${omelette.slug}`
  );
```

with:

```ts
  console.log(
    `Seeded tutorials: ${tire.slug}, ${plug.slug}, ${lightSwitch.slug}, ${tapeMeasure.slug}, ${budget.slug}, ${button.slug}, ${sink.slug}, ${omelette.slug}, ${engineOil.slug}, ${jumpStart.slug}, ${drywall.slug}, ${radiator.slug}, ${toilet.slug}, ${cordlessDrill.slug}, ${screwdrivers.slug}, ${rice.slug}, ${knifeSkills.slug}, ${pastaSauce.slug}, ${payslip.slug}, ${standingOrder.slug}, ${ironing.slug}, ${laundry.slug}`
  );
```

- [ ] **Step 2: Run the seed against the local database**

```bash
npm run db:seed
```

Expected: script completes without error and logs all 22 slugs.

- [ ] **Step 3: Run full verification**

```bash
npm run -s lint
npm run -s build
npm test
```

Expected: lint shows no new errors (pre-existing warnings in unrelated files are fine), build succeeds, all existing tests still pass.

- [ ] **Step 4: Spot-check category distribution**

```bash
grep -c "category: \"Vehicle Maintenance\"" prisma/seed.ts
grep -c "category: \"Home Repairs\"" prisma/seed.ts
grep -c "category: \"Tool Use\"" prisma/seed.ts
grep -c "category: \"Kitchen Skills\"" prisma/seed.ts
grep -c "category: \"Money & Admin\"" prisma/seed.ts
grep -c "category: \"Personal Care\"" prisma/seed.ts
```

Expected counts: Vehicle Maintenance 3, Home Repairs 6, Tool Use 3, Kitchen Skills 4, Money & Admin 3, Personal Care 3 (22 total).

- [ ] **Step 5: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: expand seeded tutorial library to 22 tutorials across six categories"
```

---

## Acceptance Criteria

- `prisma/seed.ts` seeds 22 published tutorials (up from 8), spanning all six categories in `src/lib/tutorials/categories.ts`.
- Every new tutorial has at least 4 steps with all three content variants and appropriate `safetyWarning` values.
- `npm run db:seed`, `npm run -s lint`, `npm run -s build`, and `npm test` all succeed with no new failures.
- No changes outside `prisma/seed.ts`.

## Suggested Sequencing

1. Task 1: Vehicle Maintenance
2. Task 2: Home Repairs (drywall, radiator)
3. Task 3: Home Repairs (toilet)
4. Task 4: Tool Use
5. Task 5: Kitchen Skills
6. Task 6: Money & Admin, Personal Care
7. Task 7: summary update, seed run, full verification
