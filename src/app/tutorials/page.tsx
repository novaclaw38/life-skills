import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TutorialsPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (!session.user.ageBand) redirect("/onboarding/age-band");

  const tutorials = await prisma.tutorial.findMany({
    where: { published: true },
    orderBy: { title: "asc" },
  });

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Tutorials</h1>
      <ul className="flex flex-col gap-3">
        {tutorials.map((tutorial) => (
          <li key={tutorial.id}>
            <Link
              href={`/tutorials/${tutorial.slug}`}
              className="block rounded border p-4 hover:bg-gray-50"
            >
              <p className="font-medium">{tutorial.title}</p>
              <p className="text-sm text-gray-600">{tutorial.summary}</p>
            </Link>
          </li>
        ))}
        {tutorials.length === 0 && (
          <p className="text-sm text-gray-600">
            No tutorials are published yet. Run <code>npm run db:seed</code> to add some.
          </p>
        )}
      </ul>
    </main>
  );
}
