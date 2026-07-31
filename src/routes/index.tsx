import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Section, Tag } from "@/components/section";
import { useReveal } from "@/hooks/use-reveal";
import { roleRotation } from "@/lib/portfolio-data";
import { useContent } from "@/lib/portfolio-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Harshit Chandola — Gen AI & Machine Learning Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Harshit Chandola, a Gen AI / ML engineer building LLM applications, RAG pipelines with LangChain, and end-to-end Python machine learning workflows.",
      },
      { property: "og:title", content: "Harshit Chandola — Gen AI & Machine Learning Engineer" },
      {
        property: "og:description",
        content:
          "LLM applications, RAG pipelines and applied machine learning — projects, experience and skills.",
      },
    ],
  }),
  component: Home,
});

function Typewriter() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = roleRotation[index % roleRotation.length];
    const done = !deleting && text === full;
    const cleared = deleting && text === "";

    const timeout = setTimeout(
      () => {
        if (done) return setDeleting(true);
        if (cleared) {
          setDeleting(false);
          setIndex((i) => i + 1);
          return;
        }
        setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1));
      },
      done ? 1600 : deleting ? 35 : 70,
    );

    return () => clearTimeout(timeout);
  }, [text, deleting, index]);

  return (
    <span className="font-mono text-primary">
      {text}
      <span className="animate-caret">_</span>
    </span>
  );
}

function Home() {
  useReveal();
  const { achievements, education, marqueeSkills, profile, projects, skillGroups, stats } =
    useContent();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-aurora pointer-events-none absolute inset-0" />
        <div className="surface-grid animate-grid-pan pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-6xl gap-14 px-6 pb-24 pt-20 md:pb-32 md:pt-28 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="reveal" data-reveal data-visible="true">
            <span className="glass-panel inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="animate-pulse-dot size-1.5 rounded-full bg-primary" />
              Open to ML / AI roles
            </span>

            <h1 className="mt-7 text-4xl font-semibold leading-[1.05] sm:text-6xl">
              <span className="text-gradient neon-text">{profile.name}</span>
            </h1>

            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              {profile.role} — <Typewriter />
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              {profile.tagline}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="glow-ring rounded-md bg-primary px-6 py-3 font-mono text-xs uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                View projects
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="rounded-md border border-border px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                {profile.email}
              </a>
            </div>
          </div>

          <div className="reveal relative" data-reveal data-visible="true">
            <div className="animate-float card-elevated holo-border hud-corners rounded-xl p-5 font-mono text-[13px] leading-relaxed">

              <div className="flex gap-1.5 pb-4">
                <span className="size-2.5 rounded-full bg-destructive/70" />
                <span className="size-2.5 rounded-full bg-accent/70" />
                <span className="size-2.5 rounded-full bg-primary/70" />
              </div>
              <pre className="overflow-x-auto text-muted-foreground">
                <code>{`from langchain_groq import ChatGroq

llm = ChatGroq(model="llama-3.3-70b")
chain = prompt | llm | parser

chain.invoke({
  "q": "Who should we hire?"
})
# -> "Harshit Chandola"  (1.8s)`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="relative border-y border-border bg-card/40 py-4">
          <div className="flex overflow-hidden">
            <div className="animate-marquee flex shrink-0 gap-10 pr-10">
              {[...marqueeSkills, ...marqueeSkills].map((skill, i) => (
                <span
                  key={`${skill}-${i}`}
                  className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <Section className="!py-16">
        <div className="mt-0 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="reveal bg-card p-6"
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <p className="font-display text-3xl font-semibold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* About */}
      <Section eyebrow="About" title="Building with models, not just around them">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <p className="reveal text-base leading-relaxed text-muted-foreground" data-reveal>
            {profile.objective}
          </p>
          <div className="reveal card-elevated holo-border rounded-xl p-6" data-reveal>
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Education</h3>
            <ul className="mt-5 space-y-5">
              {education.map((item) => (
                <li key={item.degree}>
                  <p className="text-sm font-medium">{item.degree}</p>
                  <p className="text-sm text-muted-foreground">{item.school}</p>
                  <p className="mt-1 font-mono text-xs text-primary/80">{item.period}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Skills */}
      <Section
        eyebrow="Stack"
        title="Skills across the ML lifecycle"
        description="From data cleaning and feature engineering to prompt design and retrieval-augmented generation."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {skillGroups.map((group, i) => (
            <div
              key={group.title}
              className="reveal card-elevated holo-border rounded-xl p-6"
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold">{group.title}</h3>
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {group.note}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Featured projects */}
      <Section eyebrow="Selected work" title="Projects that shipped">
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project, i) => (
            <article
              key={project.name}
              className="reveal card-elevated holo-border flex flex-col rounded-xl p-6"
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                {project.kind}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{project.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {project.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.slice(0, 3).map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10">
          <Link
            to="/projects"
            className="font-mono text-xs uppercase tracking-widest text-primary underline-offset-8 hover:underline"
          >
            All project details →
          </Link>
        </div>
      </Section>

      {/* Achievements */}
      <Section eyebrow="Recognition" title="Certifications & achievements">
        <ul className="grid gap-4 md:grid-cols-3">
          {achievements.map((item, i) => (
            <li
              key={item}
              className="reveal card-elevated holo-border rounded-xl p-6 text-sm leading-relaxed text-muted-foreground"
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
