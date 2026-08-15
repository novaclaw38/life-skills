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

  let tutorial, step, activeSession;
  try {
    [tutorial, step] = await Promise.all([
      prisma.tutorial.findUnique({ where: { id: tutorialId } }),
      prisma.tutorialStep.findUnique({ where: { id: stepId } }),
    ]);

    if (!tutorial || !step) {
      return NextResponse.json({ error: "That tutorial step couldn't be found." }, { status: 404 });
    }

    const timeoutMinutes = Number(process.env.AI_SESSION_TIMEOUT_MINUTES ?? "120");

    activeSession = startNew
      ? await startNewSession(session.user.id, tutorialId)
      : await getOrCreateActiveSession(session.user.id, tutorialId, timeoutMinutes);
  } catch (err) {
    console.error("Database error while preparing chat session:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  let provider;
  try {
    provider = getAIProvider();
  } catch (err) {
    console.error("AI provider configuration error:", err);
    return NextResponse.json(
      { error: "AI companion is unavailable right now. Please try again in a moment." },
      { status: 502 }
    );
  }

  let reply: string;
  try {
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

  try {
    const now = new Date();
    await prisma.conversationMessage.createMany({
      data: [
        { sessionId: activeSession.id, role: "USER", content: message, createdAt: now },
        { sessionId: activeSession.id, role: "ASSISTANT", content: reply, createdAt: new Date(now.getTime() + 1) },
      ],
    });
  } catch (err) {
    console.error("Database error while saving chat messages:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ sessionId: activeSession.id, reply });
}
