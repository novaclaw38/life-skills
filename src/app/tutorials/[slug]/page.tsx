import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TutorialSteps } from "@/components/TutorialSteps";

export default async function TutorialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (!session.user.ageBand) redirect("/onboarding/age-band");

  const tutorial = await prisma.tutorial.findUnique({
    where: { slug },
    include: { steps: { orderBy: { order: "asc" } } },
  });
  if (!tutorial || !tutorial.published) notFound();

  const completedRows = await prisma.userProgress.findMany({
    where: { userId: session.user.id, tutorialId: tutorial.id },
    select: { stepId: true },
  });

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-1 text-2xl font-semibold">{tutorial.title}</h1>
      <p className="mb-6 text-sm text-gray-600">{tutorial.summary}</p>
      <TutorialSteps
        tutorialId={tutorial.id}
        tutorialTitle={tutorial.title}
        steps={tutorial.steps}
        ageBand={session.user.ageBand as "AGE_8_11" | "AGE_12_15" | "AGE_16_18"}
        completedStepIds={completedRows.map((r) => r.stepId)}
      />
    </main>
  );
}
