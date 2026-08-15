import type { AIProvider } from "@/lib/ai/types";
import { ClaudeProvider } from "@/lib/ai/claude-provider";
import { OpenAIProvider } from "@/lib/ai/openai-provider";

export function getAIProvider(): AIProvider {
  const providerName = process.env.AI_PROVIDER;

  if (providerName === "claude") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set.");
    return new ClaudeProvider(apiKey);
  }

  if (providerName === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not set.");
    return new OpenAIProvider(apiKey);
  }

  throw new Error(
    `Unknown AI_PROVIDER "${providerName}". Set AI_PROVIDER to "claude" or "openai".`
  );
}
