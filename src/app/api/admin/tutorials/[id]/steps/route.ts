import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const stepSchema = z.object({
  order: z.number().int().min(1),
  title: z.string().min(1).max(200),
  contentSimple: z.string().min(1),
  contentStandard: z.string().min(1),
  contentDetailed: z.string().min(1),
  imageUrl: z.string().url().optional().nullable(),
  safetyWarning: z.string().optional().nullable(),
});

const upsertStepsSchema = z.object({
  steps: z.array(stepSchema).min(1),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message === "FORBIDDEN" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }

  const { id } = await params;
  const parsed = upsertStepsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid step data.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const tutorial = await prisma.tutorial.findUnique({ where: { id } });
  if (!tutorial) {
    return NextResponse.json({ error: "Tutorial not found." }, { status: 404 });
  }

  const steps = parsed.data.steps;

  try {
    await prisma.$transaction(
      steps.map((step) =>
        prisma.tutorialStep.upsert({
          where: {
            tutorialId_order: {
              tutorialId: id,
              order: step.order,
            },
          },
          update: {
            title: step.title,
            contentSimple: step.contentSimple,
            contentStandard: step.contentStandard,
            contentDetailed: step.contentDetailed,
            imageUrl: step.imageUrl ?? null,
            safetyWarning: step.safetyWarning ?? null,
          },
          create: {
            tutorialId: id,
            order: step.order,
            title: step.title,
            contentSimple: step.contentSimple,
            contentStandard: step.contentStandard,
            contentDetailed: step.contentDetailed,
            imageUrl: step.imageUrl ?? null,
            safetyWarning: step.safetyWarning ?? null,
          },
        })
      )
    );

    const updated = await prisma.tutorial.findUnique({
      where: { id },
      include: { steps: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update tutorial steps." }, { status: 500 });
  }
}
