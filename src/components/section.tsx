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
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
          ) : null}
          {title ? (
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{title}</h2>
          ) : null}
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
      )}
      {children ? <div className="mt-12">{children}</div> : null}
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
      {children}
    </span>
  );
}
