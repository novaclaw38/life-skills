import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { markStepComplete } from "@/lib/progress";

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
    await markStepComplete(session.user.id, parsed.data.tutorialId, parsed.data.stepId);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong saving your progress. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
