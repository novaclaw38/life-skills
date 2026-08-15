import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAIProvider } from "@/lib/ai/get-provider";
import { getOrCreateActiveSession, startNewSession } from "@/lib/ai/session";

const bodySchema = z.object({
  tutorialId: z.string(),
  stepId: z.string(),
  message: z.string().min(1).max(2000),
  startNew: z.boolean().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.ageBand) {
    return NextResponse.json({ error: "You need to be signed in." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "That message couldn't be sent." }, { status: 400 });
  }

  const { tutorialId, stepId, message, startNew } = parsed.data;

  const [tutorial, step] = await Promise.all([
    prisma.tutorial.findUnique({ where: { id: tutorialId } }),
    prisma.tutorialStep.findUnique({ where: { id: stepId } }),
  ]);

  if (!tutorial || !step) {
    return NextResponse.json({ error: "That tutorial step couldn't be found." }, { status: 404 });
  }

  const timeoutMinutes = Number(process.env.AI_SESSION_TIMEOUT_MINUTES ?? "120");

  const activeSession = startNew
    ? await startNewSession(session.user.id, tutorialId)
    : await getOrCreateActiveSession(session.user.id, tutorialId, timeoutMinutes);

  let reply: string;
  try {
    const provider = getAIProvider();
    reply = await provider.sendMessage(activeSession.messages, message, {
      ageBand: session.user.ageBand as "AGE_8_11" | "AGE_12_15" | "AGE_16_18",
      tutorialTitle: tutorial.title,
      currentStepTitle: step.title,
    });
  } catch (err) {
    const friendlyMessage =
      err instanceof Error ? err.message : "AI companion is unavailable right now.";
    return NextResponse.json({ error: friendlyMessage }, { status: 502 });
  }

  await prisma.conversationMessage.createMany({
    data: [
      { sessionId: activeSession.id, role: "USER", content: message },
      { sessionId: activeSession.id, role: "ASSISTANT", content: reply },
    ],
  });

  return NextResponse.json({ sessionId: activeSession.id, reply });
}
