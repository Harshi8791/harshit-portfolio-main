import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "vercel-ai-gateway",
    baseURL: "https://ai-gateway.vercel.sh/v1",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
}
