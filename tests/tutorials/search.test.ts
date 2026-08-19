import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => {
  const mockFindMany = vi.fn();
  return {
    prisma: {
      tutorial: {
        findMany: mockFindMany,
      },
    },
  };
});

import { prisma } from "@/lib/prisma";
import { searchTutorials } from "@/lib/tutorials/search";

const mockFindMany = vi.mocked(prisma.tutorial.findMany);

describe("searchTutorials", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns published tutorials with step counts", async () => {
    mockFindMany.mockResolvedValue([
      {
        id: "t1",
        slug: "tutorial-1",
        title: "Tutorial One",
        summary: "Summary one",
        category: "Tool Use",
        safetyLevel: "low",
        steps: [{ id: "s1" }, { id: "s2" }],
      },
    ] as unknown as Awaited<ReturnType<typeof mockFindMany>>);

    const results = await searchTutorials({});

    expect(results).toEqual([
      {
        id: "t1",
        slug: "tutorial-1",
        title: "Tutorial One",
        summary: "Summary one",
        category: "Tool Use",
        safetyLevel: "low",
        stepCount: 2,
      },
    ]);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { published: true },
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
  });

  it("filters by category", async () => {
    mockFindMany.mockResolvedValue([]);

    await searchTutorials({ category: "Tool Use" });

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { published: true, category: "Tool Use" },
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
  });

  it("filters by search query against title and summary", async () => {
    mockFindMany.mockResolvedValue([
      {
        id: "t1",
        slug: "tutorial-1",
        title: "Mowing the Lawn",
        summary: "Summary one",
        category: "Tool Use",
        safetyLevel: "low",
        steps: [{ id: "s1" }],
      },
      {
        id: "t2",
        slug: "tutorial-2",
        title: "Wiring a Plug",
        summary: "Learn about wiring",
        category: "Home Repairs",
        safetyLevel: "requires-adult-supervision",
        steps: [{ id: "s1" }],
      },
    ] as unknown as Awaited<ReturnType<typeof mockFindMany>>);

    const results = await searchTutorials({ query: "wiring" });

    expect(results).toHaveLength(1);
    expect(results[0]?.slug).toBe("tutorial-2");
  });

  it("returns empty array when no tutorials match", async () => {
    mockFindMany.mockResolvedValue([]);

    const results = await searchTutorials({ query: "does-not-exist" });

    expect(results).toEqual([]);
  });
});
