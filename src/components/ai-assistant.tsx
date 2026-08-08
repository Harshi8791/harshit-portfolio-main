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

  const { messages, sendMessage, setMessages, status, error } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";
  const { mode, toggleMode } = useContentStore();

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
      <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3">
        {!open ? (
          <span className="glass-panel hidden items-center gap-2 rounded-full border border-primary/25 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground shadow-[0_0_28px_-14px_var(--primary)] sm:flex">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
            Ask my AI twin
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close AI assistant" : "Ask my AI assistant"}
          className="group relative flex size-16 items-center justify-center rounded-full transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          {/* outer glow + rotating conic ring */}
          <span className="pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,var(--primary)_90deg,transparent_200deg,var(--primary)_320deg,transparent_360deg)] opacity-70 blur-[1px] [animation:spin_5s_linear_infinite]" />
          <span className="pointer-events-none absolute inset-[2px] rounded-full border border-primary/30 bg-background/90 backdrop-blur-xl" />
          <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_40px_-6px_var(--primary)] transition-shadow duration-300 group-hover:shadow-[0_0_60px_-4px_var(--primary)]" />
          {/* pulsing halo */}
          {!open ? (
            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-primary/40 [animation-duration:2.6s]" />
          ) : null}

          <span className="relative flex size-11 items-center justify-center rounded-full bg-primary/10">
            {open ? (
              <X className="size-5 text-primary" />
            ) : (
              <img
                src={aiMark}
                alt=""
                loading="lazy"
                width={816}
                height={816}
                className="size-9 drop-shadow-[0_0_10px_var(--primary)] transition-transform duration-500 group-hover:rotate-[14deg]"
              />
            )}
          </span>

          {!open ? (
            <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full border border-background bg-primary shadow-[0_0_12px_var(--primary)]">
              <span className="animate-pulse-dot size-1.5 rounded-full bg-primary-foreground" />
            </span>
          ) : null}
        </button>
      </div>

      {open ? (
        <div className="animate-fade-in glass-panel holo-border fixed bottom-24 right-6 z-[60] flex h-[min(560px,70vh)] w-[min(400px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-primary/25">
          <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
            <span className="flex size-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/10">
              <img src={aiMark} alt="" loading="lazy" width={816} height={816} className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold tracking-tight">
                Ask {content.profile.name.split(" ")[0]}&apos;s AI
              </p>
              <p className="truncate font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Trained on my résumé
              </p>
            </div>
            <button
              type="button"
              onClick={toggleMode}
              aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={mode === "dark" ? "Light mode" : "Dark mode"}
              className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              {mode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button
              type="button"
              onClick={() => setMessages([])}
              disabled={messages.length === 0}
              aria-label="Clear chat"
              title="Clear chat"
              className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive disabled:opacity-40"
            >
              <Trash2 className="size-4" />
            </button>
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
