import OpenAI from "openai";
import type { AIProvider, CompanionContext, Message } from "@/lib/ai/types";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async sendMessage(
    history: Message[],
    userMessage: string,
    ctx: CompanionContext
  ): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: buildSystemPrompt(ctx) },
          ...history.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: userMessage },
        ],
      });

      return response.choices[0]?.message?.content ?? "";
    } catch {
      throw new Error("AI companion is unavailable right now. Please try again in a moment.");
    }
  }
}
