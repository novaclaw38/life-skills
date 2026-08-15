export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface CompanionContext {
  ageBand: "AGE_8_11" | "AGE_12_15" | "AGE_16_18";
  tutorialTitle: string;
  currentStepTitle: string;
}

export interface AIProvider {
  sendMessage(
    history: Message[],
    userMessage: string,
    ctx: CompanionContext
  ): Promise<string>;
}
