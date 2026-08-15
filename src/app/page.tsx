import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/tutorials");
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Life Skills
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Learn practical life skills — like changing a tire, wiring a plug, or unblocking a
          toilet — step by step, with an AI mentor to help along the way.
        </p>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-black px-5 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Sign up
          </Link>
          <Link
            href="/signin"
            className="flex h-12 flex-1 items-center justify-center rounded-full border border-black/[.08] px-5 font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
