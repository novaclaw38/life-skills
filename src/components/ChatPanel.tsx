"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sentAt: number;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function ChatPanel({
  tutorialId,
  tutorialTitle,
  stepId,
  stepTitle,
}: {
  tutorialId: string;
  tutorialTitle: string;
  stepId: string;
  stepTitle: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [pendingIsStartNew, setPendingIsStartNew] = useState(false);

  async function send(startNew = false, retryMessage?: string) {
    const userMessage = retryMessage ?? input.trim();
    if (!userMessage && !startNew) return;
    setSending(true);
    setError(null);

    if (userMessage && !retryMessage) {
      setMessages((prev) => [...prev, { role: "user", content: userMessage, sentAt: Date.now() }]);
      setInput("");
    }
    if (startNew && !retryMessage) {
      setMessages([]);
    }
    setPendingMessage(userMessage || "Let's start over.");
    setPendingIsStartNew(startNew);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorialId, stepId, message: userMessage || "Let's start over.", startNew }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "The AI companion couldn't reply." }));
        setError(data.error ?? "The AI companion couldn't reply. Please try again.");
        return;
      }

      setPendingMessage(null);
      setPendingIsStartNew(false);
      const data = (await res.json()) as { reply: string };
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply, sentAt: Date.now() }]);
    } catch {
      setError("The AI companion couldn't reply. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <aside className="flex h-fit flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div>
        <p className="text-sm font-medium text-card-foreground">Ask your mentor</p>
        <p className="text-xs text-muted-foreground">
          {tutorialTitle} — {stepTitle}
        </p>
      </div>
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation with your mentor"
        className="flex max-h-80 flex-col gap-2 overflow-y-auto"
      >
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Ask a question about this step and your mentor will help.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn("flex flex-col gap-0.5", m.role === "user" ? "items-end" : "items-start")}
          >
            <p
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              {m.content}
            </p>
            <span className="px-1 text-[10px] text-muted-foreground">{formatTime(m.sentAt)}</span>
          </div>
        ))}
      </div>
      {error && (
        <div className="flex items-center justify-between rounded-md bg-red-50 p-2 text-xs text-red-700">
          <span>{error}</span>
          <button
            type="button"
            disabled={sending}
            onClick={() => send(pendingIsStartNew, pendingMessage ?? undefined)}
            className="underline disabled:opacity-50"
          >
            Retry
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !sending && send()}
          placeholder="Ask a question…"
          aria-label="Message your mentor"
          className="h-9 flex-1 text-sm"
        />
        <Button type="button" size="sm" disabled={sending} onClick={() => send()}>
          Send
        </Button>
      </div>
      <button
        type="button"
        disabled={sending}
        onClick={() => send(true)}
        className="self-start text-xs text-muted-foreground underline disabled:opacity-50"
      >
        Start a new conversation
      </button>
    </aside>
  );
}
