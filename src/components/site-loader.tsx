import { useEffect, useState } from "react";
import { useContent } from "@/lib/portfolio-store";

const BOOT_LINES = [
  "initialising neural core",
  "loading résumé vectors",
  "compiling portfolio shell",
  "ready",
];

export function SiteLoader() {
  const profile = useContent().profile;
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), 1700);
    const i = window.setInterval(() => setStep((s) => Math.min(s + 1, BOOT_LINES.length - 1)), 420);
    return () => {
      window.clearTimeout(t);
      window.clearInterval(i);
    };
  }, []);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      role="status"
      aria-live="polite"
    >
      <div className="surface-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="hero-aurora pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative flex flex-col items-center gap-6">
        <div className="relative flex size-28 items-center justify-center">
          <span className="boot-ring absolute inset-0 rounded-full border border-primary/25 border-t-primary" />
          <span className="boot-ring-slow absolute inset-3 rounded-full border border-accent/20 border-b-accent" />
          <span className="animate-pulse-dot absolute inset-9 rounded-full bg-primary/15 blur-md" />
          <span className="font-display text-lg font-semibold tracking-tight text-primary">
            {profile.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </span>
        </div>

        <div className="w-56 space-y-3 text-center">
          <p className="neon-text font-display text-sm font-semibold tracking-tight">
            {profile.name}
          </p>
          <div className="h-px w-full overflow-hidden bg-border">
            <span className="boot-bar block h-px w-full bg-gradient-to-r from-primary to-accent" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            {BOOT_LINES[step]}
          </p>
        </div>
      </div>
    </div>
  );
}
