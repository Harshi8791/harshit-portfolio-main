import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey },
  });
}

/** Direct Google Gemini API (user-provided key) via its OpenAI-compatible endpoint. */
export function createGeminiProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
}

/**
 * Prefers the user's own Gemini key; falls back to the Lovable AI Gateway.
 */
export function resolveChatModel() {
  const geminiKey = process.env["GEMINI_API_KEY"];
  if (geminiKey) {
    return createGeminiProvider(geminiKey)("gemini-3.6-flash");
  }

  const lovableKey = process.env["LOVABLE_API_KEY"];
  if (lovableKey) {
    return createLovableAiGatewayProvider(lovableKey)("google/gemini-3.6-flash");
  }

  return null;
}
