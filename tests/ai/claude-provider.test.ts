// tests/ai/claude-provider.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const createMock = vi.fn();

vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: vi.fn(function() {
      return {
        messages: { create: createMock },
      };
    }),
  };
});

import { ClaudeProvider } from "@/lib/ai/claude-provider";

describe("ClaudeProvider", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it("sends history + system prompt and returns the text response", async () => {
    createMock.mockResolvedValue({
      content: [{ type: "text", text: "You've got this! Let's loosen the lug nuts first." }],
    });

    const provider = new ClaudeProvider("fake-key");
    const result = await provider.sendMessage(
      [{ role: "user", content: "How do I start?" }],
      "What tool do I need?",
      {
        ageBand: "AGE_12_15",
        tutorialTitle: "Changing a Tire",
        currentStepTitle: "Loosen the lug nuts",
      }
    );

    expect(result).toBe("You've got this! Let's loosen the lug nuts first.");
    expect(createMock).toHaveBeenCalledTimes(1);
    const callArgs = createMock.mock.calls[0][0];
    expect(callArgs.system).toContain("Changing a Tire");
    expect(callArgs.messages).toHaveLength(2);
    expect(callArgs.messages[1]).toEqual({ role: "user", content: "What tool do I need?" });
  });

  it("throws a friendly error when the API call fails", async () => {
    createMock.mockRejectedValue(new Error("network error"));
    const provider = new ClaudeProvider("fake-key");

    await expect(
      provider.sendMessage([], "hi", {
        ageBand: "AGE_8_11",
        tutorialTitle: "Wiring a Plug",
        currentStepTitle: "Get your tools",
      })
    ).rejects.toThrow("AI companion is unavailable right now");
  });
});
