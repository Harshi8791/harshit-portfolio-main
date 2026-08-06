import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Moon, Send, Sun, Trash2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useContent, useContentStore } from "@/lib/portfolio-store";
import aiMark from "@/assets/ai-twin-mark.png";

import type { Content } from "@/lib/portfolio-store";

function buildResumeContext(c: Content): string {
  const p = c.profile;
  return [
    `Name: ${p.name}`,
    `Role: ${p.role}`,
    `Tagline: ${p.tagline}`,
    `Location: ${p.location}`,
    `Email: ${p.email}`,
    `Phone: ${p.phone}`,
    `LinkedIn: ${p.linkedin}`,
    `GitHub: ${p.github}`,
    `Objective: ${p.objective}`,
    "",
    "SKILLS:",
    ...c.skillGroups.map((g) => `- ${g.title} (${g.note}): ${g.items.join(", ")}`),
    "",
    "PROJECTS:",
    ...c.projects.map(
      (pr) =>
        `- ${pr.name} [${pr.kind}] — ${pr.summary} | Highlights: ${pr.points.join(" ")} | Stack: ${pr.stack.join(", ")}`,
    ),
    "",
    "EXPERIENCE:",
    ...c.experience.map((e) => `- ${e.role} @ ${e.org} (${e.period}): ${e.points.join(" ")}`),
    "",
    "EDUCATION:",
    ...c.education.map((e) => `- ${e.degree}, ${e.school} (${e.period})`),
    "",
    "ACHIEVEMENTS:",
    ...c.achievements.map((a) => `- ${a}`),
    "",
    "KEY METRICS:",
    ...c.stats.map((s) => `- ${s.value} ${s.label}`),
  ].join("\n");
}

function messageText(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

const SUGGESTIONS = [
  "What GenAI projects have you built?",
  "Walk me through your experience.",
  "Why should we hire you?",
];

export function AiAssistant() {
  const content = useContent();
  const resume = useMemo(() => buildResumeContext(content), [content]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({ resume }),
      }),
    [resume],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!busy) inputRef.current?.focus();
  }, [busy]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setInput("");
    void sendMessage({ text: value });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Ask my AI assistant"}
        className="fixed bottom-6 right-6 z-[60] flex size-14 items-center justify-center rounded-full border border-primary/50 bg-background/80 text-primary shadow-[0_0_36px_-8px_var(--primary)] backdrop-blur-xl transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground"
      >
        {open ? <X className="size-5" /> : <Bot className="size-6" />}
        {!open ? (
          <span className="animate-pulse-dot absolute -right-0.5 -top-0.5 size-3 rounded-full bg-primary" />
        ) : null}
      </button>

      {open ? (
        <div className="animate-fade-in glass-panel holo-border fixed bottom-24 right-6 z-[60] flex h-[min(560px,70vh)] w-[min(400px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-primary/25">
          <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
            <span className="flex size-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold tracking-tight">
                Ask {content.profile.name.split(" ")[0]}&apos;s AI
              </p>
              <p className="truncate font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Trained on my résumé
              </p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Hi — I&apos;m {content.profile.name.split(" ")[0]}&apos;s AI twin. Ask me about his
                  projects, skills or experience.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-border px-3 py-1.5 text-left font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((message) => (
              <div
                key={message.id}
                className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={`max-w-[85%] space-y-2 rounded-xl px-3 py-2 text-sm leading-relaxed [&_a]:text-primary [&_a]:underline [&_code]:font-mono [&_code]:text-primary [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-foreground ${
                    message.role === "user"
                      ? "border border-primary/40 bg-primary/15 text-foreground"
                      : "border border-border bg-card/70 text-muted-foreground"
                  }`}
                >
                  {messageText(message) ? (
                    <ReactMarkdown>{messageText(message)}</ReactMarkdown>
                  ) : (
                    <span className="font-mono text-xs text-primary">thinking…</span>
                  )}

                </div>
              </div>
            ))}

            {status === "submitted" ? (
              <div className="flex justify-start">
                <div className="rounded-xl border border-border bg-card/70 px-3 py-2 font-mono text-xs text-primary">
                  <span className="animate-pulse">analysing résumé…</span>
                </div>
              </div>
            ) : null}

            {error ? (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                Assistant unavailable right now. Please try again in a moment.
              </p>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border/60 px-3 py-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my work…"
              className="flex-1 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="flex size-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
