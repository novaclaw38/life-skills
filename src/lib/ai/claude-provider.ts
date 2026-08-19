import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider, CompanionContext, Message } from "@/lib/ai/types";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";

export class ClaudeProvider implements AIProvider {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async sendMessage(
    history: Message[],
    userMessage: string,
    ctx: CompanionContext
  ): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 500,
        system: buildSystemPrompt(ctx),
        messages: [...history, { role: "user", content: userMessage }],
      });

      const textBlock = response.content.find((block) => block.type === "text");
      return textBlock && "text" in textBlock ? textBlock.text : "";
    } catch {
      throw new Error("AI companion is unavailable right now. Please try again in a moment.");
    }
  }
}
