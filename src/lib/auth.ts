import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email as string | undefined;
      const password = credentials?.password as string | undefined;
      if (!email || !password) return null;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.passwordHash) return null;

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return null;

      return { id: user.id, email: user.email, name: user.name ?? undefined };
    },
  }),
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }),
];

if (process.env.AUTH_APPLE_ENABLED === "true") {
  providers.push(
    Apple({
      clientId: process.env.AUTH_APPLE_ID,
      clientSecret: process.env.AUTH_APPLE_SECRET,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers,
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { ageBand: true },
        });
        token.ageBand = dbUser?.ageBand ?? null;
      }
      if (trigger === "update") {
        // Re-read from the DB rather than trusting the client-supplied update
        // payload, since ageBand gates content sensitivity.
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub! },
          select: { ageBand: true },
        });
        token.ageBand = dbUser?.ageBand ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.ageBand =
          (token.ageBand as "AGE_8_11" | "AGE_12_15" | "AGE_16_18" | null) ?? null;
      }
      return session;
    },
  },
});

export const appleSignInEnabled = process.env.AUTH_APPLE_ENABLED === "true";
