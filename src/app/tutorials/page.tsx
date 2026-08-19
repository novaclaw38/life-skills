import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchTutorials } from "@/lib/tutorials/search";
import { TutorialCard } from "@/components/TutorialCard";
import { CategoryFilter } from "@/components/CategoryFilter";

export default async function TutorialsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; ageBand?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (!session.user.ageBand) redirect("/onboarding/age-band");

  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const ageBand = typeof params.ageBand === "string" ? params.ageBand : undefined;

  const tutorials = await searchTutorials({
    query,
    category: category as any,
    ageBand: ageBand as any,
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

  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-center md:flex-row md:text-left">
          <div className="flex flex-1 flex-col gap-2">
            <h1 className="text-2xl font-semibold text-card-foreground">Tutorials</h1>
            <p className="text-sm text-muted-foreground">
              Practical skills, explained step by step, with your AI mentor on hand.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl p-6">
        <div className="mb-6 flex flex-col gap-4">
          <form className="flex gap-2" action="/tutorials" method="get">
            <input
              type="text"
              name="q"
              defaultValue={query ?? ""}
              placeholder="Search tutorials..."
              className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              Search
            </button>
          </form>
          <CategoryFilter selectedCategory={category as any} selectedAgeBand={ageBand as any} />
        </div>

        {tutorials.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tutorials match that search. Try different keywords or filters.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((tutorial) => (
              <TutorialCard
                key={tutorial.id}
                tutorial={tutorial}
                completedStepIds={completedByTutorial.get(tutorial.id) ?? []}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
