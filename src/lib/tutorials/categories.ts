export const TUTORIAL_CATEGORIES = [
  "Vehicle Maintenance",
  "Home Repairs",
  "Tool Use",
  "Kitchen Skills",
  "Money & Admin",
  "Personal Care",
] as const;

export type TutorialCategory = (typeof TUTORIAL_CATEGORIES)[number];
