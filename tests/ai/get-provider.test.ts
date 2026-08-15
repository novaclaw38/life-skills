// tests/ai/get-provider.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/ai/claude-provider", () => ({
  ClaudeProvider: vi.fn(function(key: string) {
    return { __kind: "claude", key };
  }),
}));
vi.mock("@/lib/ai/openai-provider", () => ({
  OpenAIProvider: vi.fn(function(key: string) {
    return { __kind: "openai", key };
  }),
}));

import { getAIProvider } from "@/lib/ai/get-provider";

describe("getAIProvider", () => {
  const originalEnv = { ...process.env };
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns a ClaudeProvider when AI_PROVIDER=claude", () => {
    process.env.AI_PROVIDER = "claude";
    process.env.ANTHROPIC_API_KEY = "key-a";
    const provider = getAIProvider() as unknown as { __kind: string };
    expect(provider.__kind).toBe("claude");
  });

  it("returns an OpenAIProvider when AI_PROVIDER=openai", () => {
    process.env.AI_PROVIDER = "openai";
    process.env.OPENAI_API_KEY = "key-b";
    const provider = getAIProvider() as unknown as { __kind: string };
    expect(provider.__kind).toBe("openai");
  });

  it("throws when AI_PROVIDER is unset or unknown", () => {
    delete process.env.AI_PROVIDER;
    expect(() => getAIProvider()).toThrow("Unknown AI_PROVIDER");
  });
});
