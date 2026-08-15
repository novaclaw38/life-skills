"use client";

import { useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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

  async function send(startNew = false, retryMessage?: string) {
    const userMessage = retryMessage ?? input.trim();
    if (!userMessage && !startNew) return;
    setSending(true);
    setError(null);

    if (userMessage && !retryMessage) {
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
      setInput("");
    }
    setPendingMessage(userMessage || "Let's start over.");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutorialId, stepId, message: userMessage || "Let's start over.", startNew }),
    });

    setSending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "The AI companion couldn't reply." }));
      setError(data.error ?? "The AI companion couldn't reply. Please try again.");
      return;
    }

    setPendingMessage(null);
    const data = (await res.json()) as { reply: string };
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
  }

  return (
    <aside className="flex h-fit flex-col gap-3 rounded border p-4">
      <div>
        <p className="text-sm font-medium">Ask your mentor</p>
        <p className="text-xs text-gray-500">
          {tutorialTitle} — {stepTitle}
        </p>
      </div>
      <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
        {messages.map((m, i) => (
          <p
            key={i}
            className={`rounded p-2 text-sm ${
              m.role === "user" ? "self-end bg-black text-white" : "bg-gray-100"
            }`}
          >
            {m.content}
          </p>
        ))}
      </div>
      {error && (
        <div className="flex items-center justify-between rounded bg-red-50 p-2 text-xs text-red-700">
          <span>{error}</span>
          <button
            type="button"
            disabled={sending}
            onClick={() => send(false, pendingMessage ?? undefined)}
            className="underline disabled:opacity-50"
          >
            Retry
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !sending && send()}
          placeholder="Ask a question…"
          className="flex-1 rounded border px-2 py-1 text-sm"
        />
        <button
          type="button"
          disabled={sending}
          onClick={() => send()}
          className="rounded bg-black px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
      <button
        type="button"
        disabled={sending}
        onClick={() => send(true)}
        className="self-start text-xs text-gray-500 underline disabled:opacity-50"
      >
        Start a new conversation
      </button>
    </aside>
  );
}
