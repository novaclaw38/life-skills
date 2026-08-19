import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const updateTutorialSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  summary: z.string().min(1).max(500).optional(),
  category: z.string().min(1).max(100).optional(),
  safetyLevel: z.string().min(1).max(50).optional(),
  published: z.boolean().optional(),
});

export async function PATCH(
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
  const parsed = updateTutorialSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid tutorial data.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const tutorial = await prisma.tutorial.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(tutorial);
  } catch {
    return NextResponse.json({ error: "Tutorial not found." }, { status: 404 });
  }
}
