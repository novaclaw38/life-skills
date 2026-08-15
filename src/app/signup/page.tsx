"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const AGE_BANDS = [
  { value: "AGE_8_11", label: "8–11" },
  { value: "AGE_12_15", label: "12–15" },
  { value: "AGE_16_18", label: "16–18" },
] as const;

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageBand, setAgeBand] = useState<(typeof AGE_BANDS)[number]["value"]>("AGE_12_15");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, ageBand }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Something went wrong." }));
      setError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/tutorials");
  }

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Create your account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <label className="text-sm font-medium">How old are you?</label>
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
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/onboarding/age-band" })}
        className="rounded border px-3 py-2"
      >
        Continue with Google
      </button>
    </main>
  );
}
