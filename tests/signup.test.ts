import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { signupSchema, hashPassword } from "@/app/api/signup/route";

describe("signupSchema", () => {
  it("rejects an invalid email", () => {
    const result = signupSchema.safeParse({
      email: "not-an-email",
      password: "supersecret1",
      ageBand: "AGE_12_15",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = signupSchema.safeParse({
      email: "kid@example.com",
      password: "short",
      ageBand: "AGE_12_15",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid signup payload", () => {
    const result = signupSchema.safeParse({
      email: "kid@example.com",
      password: "supersecret1",
      ageBand: "AGE_12_15",
    });
    expect(result.success).toBe(true);
  });
});

describe("hashPassword", () => {
  it("produces a bcrypt hash different from the plaintext", async () => {
    const hash = await hashPassword("supersecret1");
    expect(hash).not.toBe("supersecret1");
    expect(hash.startsWith("$2")).toBe(true);
  });
});
