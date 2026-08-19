import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      ageBand: "AGE_8_11" | "AGE_12_15" | "AGE_16_18" | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    ageBand?: "AGE_8_11" | "AGE_12_15" | "AGE_16_18" | null;
  }
}
