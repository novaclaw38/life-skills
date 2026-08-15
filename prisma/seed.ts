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
