import type { Content } from "@/lib/portfolio-store";
import type { KnowledgeChunk } from "@/lib/ai/knowledge/chunks";

/** Flattens live (admin-editable) portfolio content into text lines sent to the server. */
export function buildResumeContext(c: Content): string {
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
    ...c.skillGroups.map((g) => `Skills — ${g.title} (${g.note}): ${g.items.join(", ")}`),
    ...c.projects.map(
      (pr) =>
        `Project: ${pr.name} [${pr.kind}] — ${pr.summary} Highlights: ${pr.points.join(" ")} Stack: ${pr.stack.join(", ")}`,
    ),
    ...c.experience.map((e) => `Experience: ${e.role} @ ${e.org} (${e.period}): ${e.points.join(" ")}`),
    ...c.education.map((e) => `Education: ${e.degree}, ${e.school} (${e.period})`),
    ...c.achievements.map((a) => `Achievement: ${a}`),
    ...c.stats.map((s) => `Metric: ${s.value} ${s.label}`),
  ].join("\n");
}

/** Turns the resume text back into retrievable chunks on the server. */
export function resumeToChunks(resume: string): KnowledgeChunk[] {
  return resume
    .slice(0, 20000)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 20)
    .map((text, i) => ({ id: `live-${i}`, source: "Portfolio site", text }));
}
