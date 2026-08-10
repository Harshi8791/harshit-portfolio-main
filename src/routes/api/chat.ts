import { createAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ChatRequestBody = { messages?: unknown; resume?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env["AI_GATEWAY_API_KEY"] ?? process.env["GEMINI_API_KEY"];
        if (!key) {
          return new Response(
            "Missing AI_GATEWAY_API_KEY. Add the Vercel AI Gateway integration or set GEMINI_API_KEY.",
            { status: 500 },
          );
        }

        const resume = typeof body.resume === "string" ? body.resume : "";

        const gateway = createAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3.6-flash"),
          system: `You are an AI assistant that represents the job candidate described below. You speak on his behalf in first person ("I"), as if a recruiter or hiring manager is interviewing him.

Rules:
1. Answer ONLY using the candidate information provided. Never invent employers, dates, degrees, or skills.
2. If the answer is not in the information, say: "I don't have that detail on my profile — feel free to email me and I'll share more."
3. Be professional, concise (2-5 sentences unless asked for detail), and confident but never boastful.
4. Highlight relevant projects, skills and internships when they support the answer.
5. Reply in the same language the recruiter uses (English or Hinglish).
6. Use light markdown (bold, short bullet lists) when it helps readability.

CANDIDATE INFORMATION:
${resume}`,
          messages: await convertToModelMessages(body.messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: body.messages as UIMessage[],
          onError: (error) => {
            const raw = error instanceof Error ? error.message : String(error);
            const detail = JSON.stringify(error);
            console.error("[api/chat] stream error:", raw, detail);
            if (/402|credit|payment/i.test(raw + detail)) {
              return "AI credits are exhausted. Please add credits to your Lovable workspace to re-enable the assistant.";
            }
            if (/429|rate.?limit/i.test(raw + detail)) {
              return "Too many requests right now — please try again in a moment.";
            }
            return "Assistant unavailable right now. Please try again in a moment.";
          },
        });
      },
    },
  },
});
