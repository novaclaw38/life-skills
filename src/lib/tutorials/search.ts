import { prisma } from "@/lib/prisma";
import type { TutorialCategory } from "./categories";

export interface TutorialSearchResult {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  safetyLevel: string;
  stepCount: number;
}

type AgeBand = "AGE_8_11" | "AGE_12_15" | "AGE_16_18";

export async function searchTutorials({
  query,
  category,
  ageBand,
}: {
  query?: string;
  category?: TutorialCategory | "all";
  ageBand?: AgeBand;
}): Promise<TutorialSearchResult[]> {
  const where: Record<string, unknown> = {
    published: true,
    ...(category && category !== "all" ? { category } : {}),
  };

  const tutorials = await prisma.tutorial.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      category: true,
      safetyLevel: true,
      steps: { select: { id: true } },
    },
  });

  let results: TutorialSearchResult[] = tutorials.map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    summary: t.summary,
    category: t.category,
    safetyLevel: t.safetyLevel,
    stepCount: t.steps.length,
  }));

  if (query) {
    const lower = query.toLowerCase();
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(lower) ||
        r.summary.toLowerCase().includes(lower)
    );
  }

  return results;
}
