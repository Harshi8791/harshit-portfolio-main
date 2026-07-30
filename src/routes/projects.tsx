import { createFileRoute } from "@tanstack/react-router";
import { Section, Tag } from "@/components/section";
import { useReveal } from "@/hooks/use-reveal";
import { projects } from "@/lib/portfolio-data";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Harshit Chandola, GenAI Engineer" },
      {
        name: "description",
        content:
          "GenAI and machine learning projects by Harshit Chandola: a LangChain + LLaMA 3.3 chatbot, an OpenCV face recognition attendance system, and responsive web apps.",
      },
      { property: "og:title", content: "Projects — Harshit Chandola, GenAI Engineer" },
      {
        property: "og:description",
        content: "LLM chatbots, computer vision systems and responsive front-end builds.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  useReveal();

  return (
    <Section
      eyebrow="Projects"
      title="Things I designed, built and debugged"
      description="Each project below is hands-on work — from LLM orchestration to real-time computer vision."
    >
      <div className="space-y-6">
        {projects.map((project, i) => (
          <article
            key={project.name}
            className="reveal card-elevated grid gap-8 rounded-xl p-7 md:grid-cols-[0.9fr_1.1fr] md:p-9"
            data-reveal
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                {project.kind}
              </span>
              <h2 className="mt-3 text-2xl font-semibold">{project.name}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {project.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
            </div>
            <ul className="space-y-4 border-t border-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              {project.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
