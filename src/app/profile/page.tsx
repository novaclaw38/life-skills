import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProgressRing } from "@/components/ProgressRing";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (!session.user.ageBand) redirect("/onboarding/age-band");

  const tutorials = await prisma.tutorial.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      category: true,
      steps: { select: { id: true } },
    },
  });

  const progressRows = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
    select: { tutorialId: true, stepId: true },
  });

  const completedByTutorial = new Map<string, string[]>();
  for (const row of progressRows) {
    const list = completedByTutorial.get(row.tutorialId) ?? [];
    list.push(row.stepId);
    completedByTutorial.set(row.tutorialId, list);
  }

  const inProgress = tutorials
    .map((t) => ({
      ...t,
      completedStepIds: completedByTutorial.get(t.id) ?? [],
    }))
    .filter((t) => t.completedStepIds.length > 0 && t.completedStepIds.length < t.steps.length)
    .sort((a, b) => b.completedStepIds.length - a.completedStepIds.length);

  const completed = tutorials
    .map((t) => ({
      ...t,
      completedStepIds: completedByTutorial.get(t.id) ?? [],
    }))
    .filter((t) => t.completedStepIds.length === t.steps.length && t.steps.length > 0);

  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <h1 className="text-2xl font-semibold text-card-foreground">Your progress</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off, or review what you’ve finished.</p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl p-6">
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-card-foreground">Continue learning</h2>
          {inProgress.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing in progress yet. Browse <Link className="underline" href="/tutorials">tutorials</Link> to get started.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inProgress.map((tutorial) => {
                const percent = Math.round((tutorial.completedStepIds.length / tutorial.steps.length) * 100);
                return (
                  <Link
                    key={tutorial.id}
                    href={`/tutorials/${tutorial.slug}`}
                    className="flex flex-col gap-2 rounded-lg border bg-card p-4 transition-colors hover:border-primary"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wide text-primary">{tutorial.category}</span>
                      <span className="text-xs text-muted-foreground">{percent}%</span>
                    </div>
                    <p className="font-medium text-card-foreground">{tutorial.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{tutorial.summary}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{tutorial.completedStepIds.length}/{tutorial.steps.length} steps</span>
                      <ProgressRing percent={percent} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-card-foreground">Completed</h2>
          {completed.length === 0 ? (
            <p className="text-sm text-muted-foreground">Complete a tutorial and it’ll show up here.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completed.map((tutorial) => (
                <Link
                  key={tutorial.id}
                  href={`/tutorials/${tutorial.slug}`}
                  className="flex flex-col gap-2 rounded-lg border bg-card p-4 transition-colors hover:border-primary"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-primary">{tutorial.category}</span>
                  <p className="font-medium text-card-foreground">{tutorial.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{tutorial.summary}</p>
                  <span className="text-xs text-muted-foreground">Finished</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
