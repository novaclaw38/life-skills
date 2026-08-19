"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

const AGE_BANDS = [
  { value: "AGE_8_11", label: "8–11" },
  { value: "AGE_12_15", label: "12–15" },
  { value: "AGE_16_18", label: "16–18" },
] as const;

const appleSignInEnabled = process.env.NEXT_PUBLIC_AUTH_APPLE_ENABLED === "true";

export default function SignupPage() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const passwordHintId = useId();
  const errorId = useId();
  const ageBandGroupLabelId = useId();
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
    <div className="mx-auto flex max-w-sm flex-col gap-6 p-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-card-foreground">Create your account</h1>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={emailId}>Email</Label>
            <Input
              id={emailId}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby={error ? errorId : undefined}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={passwordId}>Password</Label>
            <Input
              id={passwordId}
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby={
                [passwordHintId, error ? errorId : null].filter(Boolean).join(" ") || undefined
              }
            />
            <p id={passwordHintId} className="text-xs text-muted-foreground">
              Minimum 8 characters.
            </p>
          </div>

          <div className="flex flex-col gap-1.5" role="group" aria-labelledby={ageBandGroupLabelId}>
            <span id={ageBandGroupLabelId} className="text-sm font-medium text-foreground">
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
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/onboarding/age-band" })}
        >
          Continue with Google
        </Button>
        {appleSignInEnabled && (
          <Button
            type="button"
            variant="outline"
            onClick={() => signIn("apple", { callbackUrl: "/onboarding/age-band" })}
          >
            Continue with Apple
          </Button>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-foreground underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
