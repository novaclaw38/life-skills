import { describe, it, expect, vi, beforeEach } from "vitest";

const { findFirst, create, update, findMany } = vi.hoisted(() => ({
  findFirst: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  findMany: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tutorialSession: { findFirst, create, update },
    conversationMessage: { findMany },
  },
}));

import { getOrCreateActiveSession } from "@/lib/ai/session";

describe("getOrCreateActiveSession", () => {
  beforeEach(() => {
    findFirst.mockReset();
    create.mockReset();
    update.mockReset();
    findMany.mockReset();
  });

  it("reuses an active session within the timeout window", async () => {
    const now = new Date("2026-08-15T12:00:00Z");
    vi.setSystemTime(now);

    findFirst.mockResolvedValue({
      id: "session-1",
      lastMessageAt: new Date("2026-08-15T11:30:00Z"),
    });
    findMany.mockResolvedValue([
      { role: "USER", content: "hi" },
      { role: "ASSISTANT", content: "hello!" },
    ]);
    update.mockResolvedValue({});

    const result = await getOrCreateActiveSession("user-1", "tutorial-1", 120);

    expect(result.id).toBe("session-1");
    expect(result.messages).toEqual([
      { role: "user", content: "hi" },
      { role: "assistant", content: "hello!" },
    ]);
    expect(create).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith({
      where: { id: "session-1" },
      data: { lastMessageAt: now },
    });
  });

  it("starts a new session when the previous one is past the timeout", async () => {
    const now = new Date("2026-08-15T12:00:00Z");
    vi.setSystemTime(now);

    findFirst.mockResolvedValue({
      id: "session-old",
      lastMessageAt: new Date("2026-08-15T09:00:00Z"),
    });
    create.mockResolvedValue({ id: "session-new" });

    const result = await getOrCreateActiveSession("user-1", "tutorial-1", 120);

    expect(result.id).toBe("session-new");
    expect(result.messages).toEqual([]);
    expect(create).toHaveBeenCalledWith({
      data: { userId: "user-1", tutorialId: "tutorial-1" },
    });
  });

  it("starts a new session when none exists yet", async () => {
    vi.setSystemTime(new Date("2026-08-15T12:00:00Z"));
    findFirst.mockResolvedValue(null);
    create.mockResolvedValue({ id: "session-new" });

    const result = await getOrCreateActiveSession("user-1", "tutorial-1", 120);

    expect(result.id).toBe("session-new");
    expect(result.messages).toEqual([]);
  });
});
