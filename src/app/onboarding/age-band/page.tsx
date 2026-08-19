"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const AGE_BANDS = [
  { value: "AGE_8_11", label: "8–11" },
  { value: "AGE_12_15", label: "12–15" },
  { value: "AGE_16_18", label: "16–18" },
] as const;

export default function AgeBandOnboardingPage() {
  const router = useRouter();
  const sessionContext = useSession();
  const { update } = sessionContext ?? {};
  const ageBandGroupLabelId = useId();
  const errorId = useId();
  const [ageBand, setAgeBand] = useState<(typeof AGE_BANDS)[number]["value"]>("AGE_12_15");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/onboarding/age-band", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ageBand }),
    });

    if (!res.ok) {
      setError("Couldn't save that. Please try again.");
      setSubmitting(false);
      return;
    }
    await update();
    router.push("/tutorials");
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 p-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-card-foreground">
          One more thing — how old are you?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This helps us explain things at the right level for you.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5" role="group" aria-labelledby={ageBandGroupLabelId}>
            <span id={ageBandGroupLabelId} className="sr-only">
              How old are you?
            </span>
            <div className="grid grid-cols-3 gap-2">
              {AGE_BANDS.map((band) => {
                const selected = ageBand === band.value;
                return (
                  <button
                    key={band.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setAgeBand(band.value)}
                    className={cn(
                      "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-transparent text-foreground hover:bg-muted"
                    )}
                  >
                    {band.label}
                  </button>
                );
              })}
            </div>
          </div>
          {error && (
            <p id={errorId} role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
