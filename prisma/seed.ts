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

  const lightSwitch = await prisma.tutorial.upsert({
    where: { slug: "changing-a-light-switch" },
    update: {},
    create: {
      slug: "changing-a-light-switch",
      title: "Changing a Light Switch",
      summary: "Replace a broken light switch safely, from power-off to final test.",
      category: "Home Repairs",
      safetyLevel: "requires-adult-supervision",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Turn off the power",
            contentSimple:
              "Find the right circuit breaker and switch it off. Keep a torch handy.",
            contentStandard:
              "Turn off the lighting circuit at the consumer unit rather than just the wall switch. Use a torch so you can see what you're doing.",
            contentDetailed:
              "Identify the correct lighting circuit breaker and switch it off. Verify the circuit is dead with a voltage tester if you have one. Work in good local light and keep a torch available.",
            safetyWarning: "Never work on a live circuit. If unsure, ask an adult or electrician.",
          },
          {
            order: 2,
            title: "Remove the old switch",
            contentSimple: "Unscrew the faceplate, pull it out, and note which wires are where.",
            contentStandard:
              "Unscrew the faceplate, withdraw the switch, and record the wire positions before disconnecting anything.",
            contentDetailed:
              "Unscrew and remove the faceplate, then withdraw the switch unit. Before removing any wires, label or photograph their positions so you can reconnect correctly.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Connect the new switch",
            contentSimple: "Connect live, neutral, and earth to the matching terminals.",
            contentStandard:
              "Connect the live conductor to the common terminal, the switched live to the switched terminal, and earth to the earth terminal.",
            contentDetailed:
              "Match each conductor to its terminal: line/live to common, switched live to the switched terminal, and earth to the earth terminal. Use terminal screws tight enough to hold the conductor without crushing it.",
            safetyWarning: "If wires are damaged, stop and get advice before continuing.",
          },
          {
            order: 4,
            title: "Fit the new switch",
            contentSimple: "Push the switch into the box, screw on the faceplate, then restore power.",
            contentStandard:
              "Fold wires neatly, fix the new switch in the wall box, attach the faceplate, turn the power back on, and test the operation.",
            contentDetailed:
              "Neatly fold conductors into the wall box, fix the new switch, secure the faceplate, restore power at the consumer unit, and test the switch several times before leaving the job.",
            safetyWarning: null,
          },
        ],
      },
    },
  });

  const tapeMeasure = await prisma.tutorial.upsert({
    where: { slug: "using-a-tape-measure" },
    update: {},
    create: {
      slug: "using-a-tape-measure",
      title: "Using a Tape Measure and Marking Cuts",
      summary: "Measure accurately, mark clearly, and reduce wasted material on simple cuts.",
      category: "Tool Use",
      safetyLevel: "low",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Hook the tape correctly",
            contentSimple:
              "Hook the metal end over the edge or press it into the corner, then read the tape without stretching it.",
            contentStandard:
              "Use the hooked end for outside measurements and the stamped end for inside measurements. Keep the tape flat and avoid bending it sharply.",
            contentDetailed:
              "For outside measurements, hook the end so the metal tab sits flush against the edge. For inside measurements, push the end hook into the corner and read from the inside of the tab. Keep the tape as flat as possible.",
            safetyWarning: null,
          },
          {
            order: 2,
            title: "Mark your cut line",
            contentSimple:
              "Use a sharp pencil or marking knife, and mark a thin line all the way around when possible.",
            contentStandard:
              "Make a clear scribe or pencil line, then square it across the material. If you can, mark all four sides so the cut stays aligned.",
            contentDetailed:
              "Place a marking knife or sharp pencil on the mark and run a straight edge along it. Mark the top, front, and back faces so the saw or cutter can follow one consistent line.",
            safetyWarning: "Keep cutting tools sharp; dull blades slip and cause bad cuts.",
          },
          {
            order: 3,
            title: "Check before cutting",
            contentSimple: "Measure twice, then compare both marks before making any cut.",
            contentStandard:
              "Re-measure from a different reference point if you can. Check that any offcuts are still long enough for what you need.",
            contentDetailed:
              "Re-measure from another edge or corner if possible. Confirm any offcuts are usable before committing to the main cut. One extra check avoids wasting material.",
            safetyWarning: null,
          },
          {
            order: 4,
            title: "Make the cut safely",
            contentSimple: "Secure the material, use the right tool, and follow your marked line.",
            contentStandard:
              "Clamp the material, wear eye protection if needed, and cut on the waste side of the line so the finished part keeps the full dimension.",
            contentDetailed:
              "Clamp the workpiece firmly. Wear eye protection when cutting materials that can splinter or chip. Cut on the waste side of the line so the finished piece remains within tolerance.",
            safetyWarning: "Always secure loose material before cutting.",
          },
        ],
      },
    },
  });

  const budget = await prisma.tutorial.upsert({
    where: { slug: "making-a-budget-spreadsheet" },
    update: {},
    create: {
      slug: "making-a-budget-spreadsheet",
      title: "Making a Simple Budget Spreadsheet",
      summary: "Track income, expenses, and savings goals in a clear spreadsheet you can update weekly.",
      category: "Money & Admin",
      safetyLevel: "low",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Set up your categories",
            contentSimple:
              "Create columns for money in, regular bills, spending, and savings.",
            contentStandard:
              "Use clear column headings for income, fixed expenses, variable spending, and savings. Keep names short so the sheet stays readable.",
            contentDetailed:
              "Create grouped sections for income, fixed costs, variable spending, and savings. Use consistent labels and units, and leave room for a totals row or summary section.",
            safetyWarning: null,
          },
          {
            order: 2,
            title: "Enter your income",
            contentSimple: "List every source of money coming in during the month.",
            contentStandard:
              "Add each income stream as its own row. Use the same frequency for comparison, such as monthly totals.",
            contentDetailed:
              "Record each income source separately with a date or frequency label. If amounts vary, use a conservative estimate or recent average rather than an optimistic one.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "List fixed expenses",
            contentSimple: "Write down bills that are the same each month, like phone or transport.",
            contentStandard:
              "Enter fixed costs first because they are usually non-negotiable. Group them by due date if that helps with planning.",
            contentDetailed:
              "Capture rent, transport, phone, subscriptions, and insurance. If a bill is quarterly or annual, convert it to a monthly figure so your planning period is consistent.",
            safetyWarning: null,
          },
          {
            order: 4,
            title: "Track variable spending",
            contentSimple: "Estimate food, outings, and other flexible costs.",
            contentStandard:
              "Use a separate section for spending that changes. Check old receipts or bank summaries to make realistic estimates.",
            contentDetailed:
              "Review recent transactions to set realistic weekly or monthly spending targets. Keep a buffer for unexpected small purchases so the budget does not feel impossible.",
            safetyWarning: null,
          },
          {
            order: 5,
            title: "Review and adjust",
            contentSimple: "Compare income and expenses, then decide how much to save.",
            contentStandard:
              "Look for areas where spending is higher than planned. Move money into savings first if possible, then adjust flexible categories.",
            contentDetailed:
              "Compare totals and identify one or two categories to tighten. Save or set aside a target amount before optional spending, then revisit the sheet weekly or monthly.",
            safetyWarning: null,
          },
        ],
      },
    },
  });

  const button = await prisma.tutorial.upsert({
    where: { slug: "sewing-a-button" },
    update: {},
    create: {
      slug: "sewing-a-button",
      title: "Sewing a Button Back On",
      summary: "Fix a loose or missing button with basic hand-sewing steps.",
      category: "Personal Care",
      safetyLevel: "low",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Gather your kit",
            contentSimple:
              "You need matching thread, a needle, a small pair of scissors, and a pin.",
            contentStandard:
              "Use thread that matches the garment as closely as possible. A sharp needle and clean scissors make the job easier.",
            contentDetailed:
              "Select thread that matches the button and fabric. Use a sharp needle suited to the fabric weight, and keep small scissors handy for trimming thread.",
            safetyWarning: null,
          },
          {
            order: 2,
            title: "Thread the needle",
            contentSimple: "Cut about 50cm of thread, put it through the needle, and tie a knot.",
            contentStandard:
              "Cut a manageable length of thread, pass it through the needle eye, and double it before tying a secure knot at the ends.",
            contentDetailed:
              "Cut a length of thread roughly 50cm. Pass it through the needle eye, pull both ends even, and tie a secure knot. Double-threaded stitches are stronger for buttons.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Position the button",
            contentSimple: "Hold the button in place with a pin or by sewing a few temporary stitches.",
            contentStandard:
              "Align the button with the existing buttonhole or mark the position. A pin through the buttonhole keeps it steady while you sew.",
            contentDetailed:
              "Use a pin through the buttonhole to hold the button in position. Check alignment against the opposite side of the garment before making permanent stitches.",
            safetyWarning: null,
          },
          {
            order: 4,
            title: "Sew through the holes",
            contentSimple:
              "Go through each hole several times, then finish by wrapping the thread behind the button.",
            contentStandard:
              "Sew through each hole in turn with even stitches. Add a few stitches behind the button to create a small shank so the button sits without pulling the fabric.",
            contentDetailed:
              "Stitch through each hole evenly, then pass the needle between the button and fabric a few times to form a small thread shank. This gives the button a little breathing room and reduces breakage.",
            safetyWarning: null,
          },
        ],
      },
    },
  });

  const sink = await prisma.tutorial.upsert({
    where: { slug: "unblocking-a-sink-drain" },
    update: {},
    create: {
      slug: "unblocking-a-sink-drain",
      title: "Unblocking a Sink Drain",
      summary: "Clear a blocked sink drain safely using simple tools and minimal mess.",
      category: "Home Repairs",
      safetyLevel: "requires-adult-supervision",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Clear the obvious debris",
            contentSimple:
              "Remove the plug and any visible gunk from around the drain.",
            contentStandard:
              "Take out the plug or strainer and pull away hair, food, or soap buildup. Wearing gloves keeps the mess off your hands.",
            contentDetailed:
              "Remove the strainer or plug assembly and clear any surface blockage. Use rubber gloves and old cloths to keep contact with grime minimal.",
            safetyWarning: "Wear gloves if there is standing water or sharp waste in the drain.",
          },
          {
            order: 2,
            title: "Try a plunger",
            contentSimple:
              "Use a sink plunger with a few centimetres of water over the drain.",
            contentStandard:
              "Fill the basin with enough water to cover the plunger cup. Create a tight seal and use steady pushes rather than hard slams.",
            contentDetailed:
              "Add enough water to cover the plunger cup. Position the cup squarely over the drain opening and perform firm, controlled pushes to move the blockage rather than splashing dirty water.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Use a drain snake or wire",
            contentSimple:
              "Feed a flexible drain snake into the drain and twist to hook debris.",
            contentStandard:
              "Feed the snake or a straightened wire coat hanger into the drain and rotate it to hook or break up the blockage.",
            contentDetailed:
              "Insert the drain snake carefully, rotating as it goes. When you feel resistance, turn the snake to break up or retrieve the blockage rather than forcing it blindly.",
            safetyWarning: "Do not use sharp wires without adult guidance.",
          },
          {
            order: 4,
            title: "Flush with hot water",
            contentSimple:
              "Run warm water through the drain to wash away loosened debris.",
            contentStandard:
              "Use warm water rather than boiling water if the basin or pipes look older. A little detergent can help carry grease away.",
            contentDetailed:
              "Flush with warm water and mild detergent to lift remaining debris. If the sink still drains slowly, repeat the mechanical clearing before using stronger chemical methods.",
            safetyWarning: "Boiling water can damage older seals or plastic wastes; check first.",
          },
          {
            order: 5,
            title: "Know when to stop",
            contentSimple:
              "If it's still blocked, call for help instead of using chemicals.",
            contentStandard:
              "If mechanical clearing does not work, stop and ask an adult or plumber. Chemical drain cleaners are hazardous and can damage pipes.",
            contentDetailed:
              "If repeated mechanical clearing fails, use chemical treatments only if the label says they are safe for your pipe type, or better yet call a professional. Persistent blockages can mean a deeper problem.",
            safetyWarning: "Avoid chemical drain cleaners unless an adult reads the label and approves use.",
          },
        ],
      },
    },
  });

  const omelette = await prisma.tutorial.upsert({
    where: { slug: "simple-omelette" },
    update: {},
    create: {
      slug: "simple-omelette",
      title: "Making a Simple Omelette",
      summary: "Make a basic omelette with a few pantry ingredients and a little patience.",
      category: "Kitchen Skills",
      safetyLevel: "requires-adult-supervision",
      published: true,
      steps: {
        create: [
          {
            order: 1,
            title: "Gather ingredients and tools",
            contentSimple:
              "You need eggs, a knob of butter, a pinch of salt, a small bowl, and a pan.",
            contentStandard:
              "Use 2 eggs per omelette, a small non-stick pan, a fork or whisk, butter or oil, and salt. Have a spatula and plate ready before you start.",
            contentDetailed:
              "Measure ingredients before heating the pan: 2 eggs, a small knob of butter or a teaspoon of oil, a pinch of salt, and optional fillings. Have a spatula and plate ready before cooking.",
            safetyWarning: "Use oven gloves or ask an adult to handle hot pans.",
          },
          {
            order: 2,
            title: "Mix the eggs",
            contentSimple: "Crack the eggs into a bowl, add salt, and beat until smooth.",
            contentStandard:
              "Crack the eggs into a bowl, season lightly, and whisk until the yolk and white are fully combined.",
            contentDetailed:
              "Crack the eggs into a bowl, add a small pinch of salt, and whisk until uniform. Over-beating can make the texture rubbery; stop when the mixture is smooth.",
            safetyWarning: null,
          },
          {
            order: 3,
            title: "Heat the pan",
            contentSimple:
              "Melt butter over medium heat until it foams, then pour in the eggs.",
            contentStandard:
              "Melt the butter over medium heat. When it foams, pour in the eggs and tilt the pan so they spread evenly.",
            contentDetailed:
              "Melt butter over medium heat until it foams without browning. Pour in the beaten eggs and immediately tilt the pan to form an even layer.",
            safetyWarning: "Keep handles turned inward so nobody bumps the pan.",
          },
          {
            order: 4,
            title: "Cook the base",
            contentSimple:
              "Let the edges set, then lift one side and let the runny top flow underneath.",
            contentStandard:
              "Let the edges set for a few seconds, then lift one edge of the omelette and tilt the pan so the uncooked egg runs underneath.",
            contentDetailed:
              "When the edges set, lift one side and tilt the pan to let the uncooked mixture flow underneath. Repeat once or twice until the top is almost set but still slightly moist.",
            safetyWarning: null,
          },
          {
            order: 5,
            title: "Fold and serve",
            contentSimple:
              "Fold the omelette in half, slide it onto a plate, and add any fillings.",
            contentStandard:
              "Fold the omelette in half, slide it onto a warm plate, and add cheese, herbs, or leftover cooked fillings if desired.",
            contentDetailed:
              "Fold the omelette in half, slide it onto a warm plate, and add fillings such as grated cheese, soft herbs, or already-cooked ingredients. Raw fillings belong earlier in the process.",
            safetyWarning: "Hot fillings and hot pans can burn — handle carefully.",
          },
        ],
      },
    },
  });

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

  const radiator = await prisma.tutorial.upsert({
    where: { slug: "bleeding-a-radiator" },
    update: {},
    create: {
      slug: "bleeding-a-radiator",
      title: "Bleeding a Radiator",
      summary: "Release trapped air from a radiator that's cold at the top and warm at the bottom.",
      category: "Home Repairs",
      safetyLevel: "requires-adult-supervision",
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

  console.log(
    `Seeded tutorials: ${tire.slug}, ${plug.slug}, ${lightSwitch.slug}, ${tapeMeasure.slug}, ${budget.slug}, ${button.slug}, ${sink.slug}, ${omelette.slug}`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
