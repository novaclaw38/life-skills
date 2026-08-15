import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma");

import { prisma } from "@/lib/prisma";
import { markStepComplete, getTutorialProgress } from "@/lib/progress";

const mockUpsert = vi.fn();
const mockFindMany = vi.fn();
const mockCount = vi.fn();

describe("markStepComplete", () => {
  beforeEach(() => {
    vi.mocked(prisma).userProgress = {
      upsert: mockUpsert,
    } as unknown as typeof prisma.userProgress;
    mockUpsert.mockReset();
  });

  it("upserts a progress row keyed on userId + stepId", async () => {
    mockUpsert.mockResolvedValue({});
    await markStepComplete("user-1", "tutorial-1", "step-1");

    expect(mockUpsert).toHaveBeenCalledWith({
      where: { userId_stepId: { userId: "user-1", stepId: "step-1" } },
      update: {},
      create: { userId: "user-1", tutorialId: "tutorial-1", stepId: "step-1" },
    });
  });
});

describe("getTutorialProgress", () => {
  beforeEach(() => {
    vi.mocked(prisma).userProgress = {
      findMany: mockFindMany,
    } as unknown as typeof prisma.userProgress;
    vi.mocked(prisma).tutorialStep = {
      count: mockCount,
    } as unknown as typeof prisma.tutorialStep;
    mockFindMany.mockReset();
    mockCount.mockReset();
  });

  it("returns completed step ids and the total step count", async () => {
    mockFindMany.mockResolvedValue([{ stepId: "step-1" }, { stepId: "step-2" }]);
    mockCount.mockResolvedValue(6);

    const result = await getTutorialProgress("user-1", "tutorial-1");

    expect(result).toEqual({ completedStepIds: ["step-1", "step-2"], totalSteps: 6 });
  });
});
