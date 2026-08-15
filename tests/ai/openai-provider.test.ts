// tests/ai/openai-provider.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const createMock = vi.fn();

vi.mock("openai", () => {
  return {
    default: vi.fn(function() {
      return {
        chat: { completions: { create: createMock } },
      };
    }),
  };
});

import { OpenAIProvider } from "@/lib/ai/openai-provider";

describe("OpenAIProvider", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it("sends history + system prompt and returns the message content", async () => {
    createMock.mockResolvedValue({
      choices: [{ message: { content: "Great question! Grab a screwdriver first." } }],
    });

    const provider = new OpenAIProvider("fake-key");
    const result = await provider.sendMessage(
      [{ role: "user", content: "hi" }],
      "What do I need?",
      {
        ageBand: "AGE_16_18",
        tutorialTitle: "Wiring a Plug",
        currentStepTitle: "Gather your tools",
      }
    );

    expect(result).toBe("Great question! Grab a screwdriver first.");
    const callArgs = createMock.mock.calls[0][0];
    expect(callArgs.messages[0]).toEqual({
      role: "system",
      content: expect.stringContaining("Wiring a Plug"),
    });
  });

  it("throws a friendly error when the API call fails", async () => {
    createMock.mockRejectedValue(new Error("network error"));
    const provider = new OpenAIProvider("fake-key");

    await expect(
      provider.sendMessage([], "hi", {
        ageBand: "AGE_8_11",
        tutorialTitle: "Wiring a Plug",
        currentStepTitle: "Get your tools",
      })
    ).rejects.toThrow("AI companion is unavailable right now");
  });
});
