import { resolveChatModel } from "@/lib/ai/providers/model.server";
import { retrieve } from "@/lib/ai/retrieval/bm25.server";
import { resumeToChunks } from "@/lib/ai/context/resume-context";
import { buildSystemPrompt } from "@/lib/ai/prompts/system-prompt";
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
        const model = resolveChatModel();
        if (!model) return new Response("No AI API key configured", { status: 500 });

        const resume = typeof body.resume === "string" ? body.resume : "";
        const uiMessages = body.messages as UIMessage[];

        // RAG: query = last two user turns (so follow-ups keep context).
        const query = uiMessages
          .filter((m) => m.role === "user")
          .map((m) => m.parts.map((p) => (p.type === "text" ? p.text : "")).join(" "))
          .slice(-2)
          .join(" ");
        const hits = retrieve(query, resumeToChunks(resume), 6);
        const context = hits.map((h, i) => `[${i + 1}] (${h.source}) ${h.text}`).join("\n");

        const result = streamText({
          model,
          system: buildSystemPrompt(context),

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
