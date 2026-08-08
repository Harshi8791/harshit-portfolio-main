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
          <span className="term-window hidden items-center gap-2 rounded-sm px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground sm:flex">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
            $ ./ask_ai_twin
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
        <div className="animate-fade-in term-window fixed bottom-24 right-6 z-[60] flex h-[min(560px,70vh)] w-[min(420px,calc(100vw-3rem))] flex-col overflow-hidden">
          <div className="term-bar">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-destructive/70" />
              <span className="size-2.5 rounded-full bg-accent/70" />
              <span className="size-2.5 rounded-full bg-primary/70" />
            </span>
            <span className="ml-2 truncate text-primary">
              {content.profile.name.split(" ")[0]?.toLowerCase()}-ai@shell: ~
            </span>
            <span className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={toggleMode}
                aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                title={mode === "dark" ? "Light mode" : "Dark mode"}
                className="flex size-7 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {mode === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setMessages([])}
                disabled={messages.length === 0}
                aria-label="Clear chat"
                title="Clear chat"
                className="flex size-7 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive disabled:opacity-40"
              >
                <Trash2 className="size-3.5" />
              </button>
            </span>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4 font-mono text-[13px]"
          >
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  <span className="text-primary">system</span>:~$ init ai_twin --resume
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  Session ready. I&apos;m {content.profile.name.split(" ")[0]}&apos;s AI twin — ask
                  about projects, skills or experience.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-sm border border-border px-2.5 py-1.5 text-left text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      $ {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((message) => (
              <div key={message.id} className="space-y-1">
                <p className="text-[11px] text-muted-foreground">
                  {message.role === "user" ? (
                    <>
                      <span className="text-accent">visitor@shell</span>:~$
                    </>
                  ) : (
                    <>
                      <span className="text-primary">ai_twin</span>@shell:~#
                    </>
                  )}
                </p>
                <div
                  className={`space-y-2 border-l-2 pl-3 leading-relaxed [&_a]:text-primary [&_a]:underline [&_code]:text-primary [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-foreground ${
                    message.role === "user"
                      ? "border-accent/50 text-foreground"
                      : "border-primary/50 text-muted-foreground"
                  }`}
                >
                  {messageText(message) ? (
                    <ReactMarkdown>{messageText(message)}</ReactMarkdown>
                  ) : (
                    <span className="text-xs text-primary">thinking…</span>
                  )}
                </div>
              </div>
            ))}

            {status === "submitted" ? (
              <p className="text-xs text-primary">
                <span className="animate-pulse">$ parsing resume…</span>
              </p>
            ) : null}

            {error ? (
              <p className="rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                stderr: assistant unavailable right now. Please try again in a moment.
              </p>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-primary/25 bg-background/40 px-3 py-3 font-mono"
          >
            <span className="text-xs text-primary">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ask --about work"
              className="flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="flex size-8 items-center justify-center rounded-sm border border-primary/40 bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      ) : null}

    </>
  );
}
