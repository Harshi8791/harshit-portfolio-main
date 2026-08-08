import { toExternalUrl } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useContent, useContentStore } from "@/lib/portfolio-store";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const profile = useContent().profile;
  const { openAdmin } = useContentStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-panel border-x-0 border-t-0 shadow-[0_10px_40px_-30px_var(--primary)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          type="button"
          title="Open admin panel"
          aria-label="Open admin panel"
          onClick={() => {
            setOpen(false);
            openAdmin();
          }}
          className="group flex items-center gap-2.5"
        >
          <span className="animate-pulse-dot size-2.5 rounded-full bg-primary" />
          <span className="term-glow font-mono text-sm font-semibold tracking-tight transition-colors group-hover:text-primary">
            <span className="text-primary">root@</span>
            {profile.name.split(" ")[0]?.toLowerCase()}
            <span className="text-muted-foreground">:~#</span>
          </span>
        </button>



        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="rounded-sm px-3 py-2 font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-primary" }}
            >
              ./{link.label.toLowerCase()}
            </Link>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="ml-3 rounded-sm border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-xs tracking-wide text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            sudo hire_me
          </a>
        </div>


        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-border p-2 md:hidden"
        >
          <span className="block h-px w-5 bg-foreground" />
          <span className="mt-1.5 block h-px w-5 bg-foreground" />
        </button>
      </nav>

      {open ? (
        <div className="animate-fade-in border-t border-border bg-background/95 px-6 pb-5 pt-2 backdrop-blur-xl md:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block py-2.5 font-mono text-xs uppercase tracking-widest text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  const profile = useContent().profile;

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono">
          © {new Date().getFullYear()} {profile.name} — {profile.location.split(",")[0]}, India
        </p>
        <div className="flex gap-5 font-mono">
          <a className="transition-colors hover:text-primary" href={`mailto:${profile.email}`}>
            Email
          </a>
          <a
            className="transition-colors hover:text-primary"
            href={toExternalUrl(profile.github)}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="transition-colors hover:text-primary"
            href={toExternalUrl(profile.linkedin)}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
