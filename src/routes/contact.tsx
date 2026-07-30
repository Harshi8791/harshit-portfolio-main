import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/section";
import { useReveal } from "@/hooks/use-reveal";
import { profile } from "@/lib/portfolio-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Harshit Chandola — GenAI / ML Engineer" },
      {
        name: "description",
        content:
          "Get in touch with Harshit Chandola for ML and GenAI roles, collaborations or freelance LLM application work. Based in Dehradun, India.",
      },
      { property: "og:title", content: "Contact Harshit Chandola — GenAI / ML Engineer" },
      {
        property: "og:description",
        content: "Open to entry-level ML/AI roles and applied GenAI collaborations.",
      },
    ],
  }),
  component: ContactPage,
});

const channels = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { label: "GitHub", value: "github.com", href: profile.github },
  { label: "LinkedIn", value: "linkedin.com", href: profile.linkedin },
];

function ContactPage() {
  useReveal();

  return (
    <Section
      eyebrow="Contact"
      title="Let's build something with AI"
      description="Open to entry-level ML / GenAI roles, internships and applied LLM projects. The fastest way to reach me is email."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {channels.map((channel, i) => (
          <a
            key={channel.label}
            href={channel.href}
            target={channel.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="reveal card-elevated group flex items-center justify-between rounded-xl p-7"
            data-reveal
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <span>
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                {channel.label}
              </span>
              <span className="mt-2 block text-base font-medium">{channel.value}</span>
            </span>
            <span className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary">
              →
            </span>
          </a>
        ))}
      </div>

      <p className="reveal mt-10 font-mono text-xs text-muted-foreground" data-reveal>
        Based in {profile.location} · Available for remote and on-site roles
      </p>
    </Section>
  );
}
