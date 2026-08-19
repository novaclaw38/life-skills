import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { markStepComplete, removeStepProgress } from "@/lib/progress";

const bodySchema = z.object({
  tutorialId: z.string(),
  stepId: z.string(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to be signed in." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Couldn't save your progress." }, { status: 400 });
  }

  try {
    const step = await prisma.tutorialStep.findFirst({
      where: { id: parsed.data.stepId, tutorialId: parsed.data.tutorialId },
    });
    if (!step) {
      return NextResponse.json({ error: "That step couldn't be found." }, { status: 400 });
    }

    await markStepComplete(session.user.id, parsed.data.tutorialId, parsed.data.stepId);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong saving your progress. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

const deleteSchema = z.object({
  stepId: z.string(),
});

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to be signed in." }, { status: 401 });
  }

  const parsed = deleteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Couldn't update your progress." }, { status: 400 });
  }

  try {
    await removeStepProgress(session.user.id, parsed.data.stepId);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong updating your progress. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
