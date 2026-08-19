import { prisma } from "@/lib/prisma";

export async function markStepComplete(
  userId: string,
  tutorialId: string,
  stepId: string
): Promise<void> {
  await prisma.userProgress.upsert({
    where: { userId_stepId: { userId, stepId } },
    update: {},
    create: { userId, tutorialId, stepId },
  });
}

export async function getTutorialProgress(
  userId: string,
  tutorialId: string
): Promise<{ completedStepIds: string[]; totalSteps: number }> {
  const [rows, totalSteps] = await Promise.all([
    prisma.userProgress.findMany({
      where: { userId, tutorialId },
      select: { stepId: true },
    }),
    prisma.tutorialStep.count({ where: { tutorialId } }),
  ]);

  return { completedStepIds: rows.map((r) => r.stepId), totalSteps };
}
