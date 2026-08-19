import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("UNAUTHORIZED");
  }

  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!allowed.includes(session.user.email)) {
    throw new Error("FORBIDDEN");
  }

  return session.user;
}
