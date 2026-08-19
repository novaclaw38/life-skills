import { notFound, redirect } from "next/navigation";
import Link from "next/link";
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

  const related = await prisma.tutorial.findMany({
    where: {
      published: true,
      category: tutorial.category,
      id: { not: tutorial.id },
    },
    orderBy: { updatedAt: "desc" },
    take: 6,
    select: { id: true, slug: true, title: true, summary: true, category: true, steps: { select: { id: true } } },
  });

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link
        href="/tutorials"
        className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to tutorials
      </Link>
      <h1 className="mb-1 text-2xl font-semibold text-foreground">{tutorial.title}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{tutorial.summary}</p>
      <TutorialSteps
        tutorialId={tutorial.id}
        tutorialTitle={tutorial.title}
        steps={tutorial.steps}
        ageBand={session.user.ageBand as "AGE_8_11" | "AGE_12_15" | "AGE_16_18"}
        completedStepIds={completedRows.map((r) => r.stepId)}
      />

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-card-foreground">Related tutorials</h2>
        {related.length === 0 ? (
          <p className="text-sm text-muted-foreground">No related tutorials yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/tutorials/${item.slug}`}
                className="flex flex-col gap-2 rounded-lg border bg-card p-4 transition-colors hover:border-primary"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-primary">{item.category}</span>
                <p className="font-medium text-card-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
