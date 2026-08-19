import { prisma } from "@/lib/prisma";
import type { Message } from "@/lib/ai/types";

export async function getOrCreateActiveSession(
  userId: string,
  tutorialId: string,
  timeoutMinutes: number
): Promise<{ id: string; messages: Message[] }> {
  const now = new Date();

  const latest = await prisma.tutorialSession.findFirst({
    where: { userId, tutorialId },
    orderBy: { lastMessageAt: "desc" },
  });

  const isActive =
    latest !== null &&
    now.getTime() - latest.lastMessageAt.getTime() <= timeoutMinutes * 60 * 1000;

  if (latest && isActive) {
    await prisma.tutorialSession.update({
      where: { id: latest.id },
      data: { lastMessageAt: now },
    });

    const history = await prisma.conversationMessage.findMany({
      where: { sessionId: latest.id },
      orderBy: { createdAt: "asc" },
    });

    return {
      id: latest.id,
      messages: history.map((m) => ({
        role: m.role === "USER" ? "user" : "assistant",
        content: m.content,
      })),
    };
  }

  const created = await prisma.tutorialSession.create({
    data: { userId, tutorialId },
  });

  return { id: created.id, messages: [] };
}

export async function startNewSession(
  userId: string,
  tutorialId: string
): Promise<{ id: string; messages: Message[] }> {
  const created = await prisma.tutorialSession.create({
    data: { userId, tutorialId },
  });
  return { id: created.id, messages: [] };
}
