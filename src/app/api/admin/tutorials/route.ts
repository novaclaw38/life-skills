import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const createTutorialSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  category: z.string().min(1).max(100),
  safetyLevel: z.string().min(1).max(50),
  published: z.boolean().optional().default(false),
  steps: z
    .array(
      z.object({
        order: z.number().int().min(1),
        title: z.string().min(1).max(200),
        contentSimple: z.string().min(1),
        contentStandard: z.string().min(1),
        contentDetailed: z.string().min(1),
        imageUrl: z.string().url().optional().nullable(),
        safetyWarning: z.string().optional().nullable(),
      })
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message === "FORBIDDEN" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }

  const parsed = createTutorialSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid tutorial data.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const tutorial = await prisma.tutorial.create({
      data: {
        slug: data.slug,
        title: data.title,
        summary: data.summary,
        category: data.category,
        safetyLevel: data.safetyLevel,
        published: data.published ?? false,
        steps: {
          create: data.steps.map((step) => ({
            order: step.order,
            title: step.title,
            contentSimple: step.contentSimple,
            contentStandard: step.contentStandard,
            contentDetailed: step.contentDetailed,
            imageUrl: step.imageUrl ?? null,
            safetyWarning: step.safetyWarning ?? null,
          })),
        },
      },
      include: { steps: true },
    });

    return NextResponse.json(tutorial, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "A tutorial with that slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create tutorial." }, { status: 500 });
  }
}
