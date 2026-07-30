import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/section";
import { useReveal } from "@/hooks/use-reveal";
import { achievements, education, experience } from "@/lib/portfolio-data";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience & Education — Harshit Chandola" },
      {
        name: "description",
        content:
          "Internship experience at UPCL and Oasis Infobyte, MCA in AI & Machine Learning, plus certifications and hackathon wins.",
      },
      { property: "og:title", content: "Experience & Education — Harshit Chandola" },
      {
        property: "og:description",
        content: "Data preprocessing, automation and front-end engineering internships.",
      },
    ],
  }),
  component: ExperiencePage,
});

function ExperiencePage() {
  useReveal();

  return (
    <>
      <Section eyebrow="Experience" title="Where I've worked">
        <ol className="relative space-y-10 border-l border-border pl-8">
          {experience.map((job, i) => (
            <li
              key={job.org}
              className="reveal relative"
              data-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <span className="absolute -left-[38px] top-1.5 size-3 rounded-full border-2 border-primary bg-background" />
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                {job.period}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{job.role}</h2>
              <p className="text-sm text-muted-foreground">{job.org}</p>
              <ul className="mt-4 space-y-2.5">
                {job.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Education" title="Academic background" className="!pt-0">
        <div className="grid gap-6 md:grid-cols-3">
          {education.map((item, i) => (
            <div
              key={item.degree}
              className="reveal card-elevated holo-border rounded-xl p-6"
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <p className="font-mono text-xs text-primary">{item.period}</p>
              <h3 className="mt-3 text-base font-semibold leading-snug">{item.degree}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.school}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Recognition" title="Certifications & achievements" className="!pt-0">
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
