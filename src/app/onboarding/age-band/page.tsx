"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AGE_BANDS = [
  { value: "AGE_8_11", label: "8–11" },
  { value: "AGE_12_15", label: "12–15" },
  { value: "AGE_16_18", label: "16–18" },
] as const;

export default function AgeBandOnboardingPage() {
  const router = useRouter();
  const [ageBand, setAgeBand] = useState<(typeof AGE_BANDS)[number]["value"]>("AGE_12_15");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/onboarding/age-band", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ageBand }),
    });

    if (!res.ok) {
      setError("Couldn't save that. Please try again.");
      return;
    }
    router.push("/tutorials");
  }

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">One more thing — how old are you?</h1>
      <p className="text-sm text-gray-600">
        This helps us explain things at the right level for you.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <select
          value={ageBand}
          onChange={(e) => setAgeBand(e.target.value as typeof ageBand)}
          className="rounded border px-3 py-2"
        >
          {AGE_BANDS.map((band) => (
            <option key={band.value} value={band.value}>
              {band.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="rounded bg-black px-3 py-2 text-white">
          Continue
        </button>
      </form>
    </main>
  );
}
