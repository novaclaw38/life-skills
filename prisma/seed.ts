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
