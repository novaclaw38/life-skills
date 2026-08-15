import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  ageBand: z.enum(["AGE_8_11", "AGE_12_15", "AGE_16_18"]),
});

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your email, password, and age selection." },
      { status: 400 }
    );
  }

  const { email, password, ageBand } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  try {
    await prisma.user.create({
      data: { email, passwordHash, ageBand },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong creating your account. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
