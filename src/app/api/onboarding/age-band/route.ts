import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  ageBand: z.enum(["AGE_8_11", "AGE_12_15", "AGE_16_18"]),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to be signed in." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please choose an age range." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { ageBand: parsed.data.ageBand },
  });

  return NextResponse.json({ ok: true });
}
