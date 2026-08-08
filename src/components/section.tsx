import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-6xl px-6 py-20 md:py-28 ${className}`}>
      {(eyebrow || title) && (
        <div className="reveal max-w-2xl" data-reveal>
          {eyebrow ? (
            <p className="font-mono text-xs tracking-[0.12em] text-muted-foreground">
              <span className="text-primary">visitor@portfolio</span>:<span className="text-accent">~</span>${" "}
              <span className="text-foreground">
                cat {eyebrow.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.md
              </span>
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-3 font-mono text-2xl font-semibold md:text-3xl">
              <span className="text-primary/60"># </span>
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      )}

      {children ? <div className="mt-12">{children}</div> : null}
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/60 hover:text-primary hover:shadow-[0_0_18px_-6px_var(--primary)]">
      {children}
    </span>
  );
}

