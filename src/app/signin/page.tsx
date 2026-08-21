"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

const appleSignInEnabled = process.env.NEXT_PUBLIC_AUTH_APPLE_ENABLED === "true";

export default function SigninPage() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn("credentials", { email, password, redirect: false });
    setSubmitting(false);

    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push("/tutorials");
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 p-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-card-foreground">Sign in</h1>
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby={error ? errorId : undefined}
            />
          </div>
          {error && (
            <p id={errorId} role="alert" className="text-sm text-primary">
              {error}
            </p>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
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
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-foreground underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
