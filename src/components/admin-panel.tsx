import { useEffect, useState, type ReactNode } from "react";
import { THEMES, useContentStore, type Content } from "@/lib/portfolio-store";

const ACCESS_CODE = "harshit";

const TABS = [
  "Profile",
  "Skills",
  "Projects",
  "Experience",
  "Education",
  "Stats",
  "Awards",
  "Theme",
] as const;
type Tab = (typeof TABS)[number];

/* ---------- primitives ---------- */

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  const cls =
    "w-full rounded-md border border-primary/25 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:shadow-[0_0_22px_-8px_var(--primary)]";
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-primary/80">
        {label}
      </span>
      {textarea ? (
        <textarea
          rows={3}
          className={cls}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={cls}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function Btn({
  children,
  onClick,
  tone = "ghost",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "ghost" | "solid" | "danger";
  type?: "button" | "submit";
}) {
  const tones = {
    ghost:
      "border border-primary/35 text-primary hover:bg-primary/10 hover:shadow-[0_0_22px_-8px_var(--primary)]",
    solid:
      "border border-primary bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-[0_0_28px_-6px_var(--primary)]",
    danger: "border border-destructive/40 text-destructive hover:bg-destructive/10",
  } as const;
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-md px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-all ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

function Card({ title, onRemove, children }: { title: string; onRemove: () => void; children: ReactNode }) {
  return (
    <div className="holo-border hud-corners rounded-xl border border-primary/15 bg-card/50 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">{title}</p>
        <Btn tone="danger" onClick={onRemove}>
          Delete
        </Btn>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/** Comma / newline separated list helpers */
const toList = (v: string) =>
  v
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

/* ---------- panel ---------- */

export function AdminPanel() {
  const { content, setContent, reset, theme, setTheme, adminOpen, closeAdmin } = useContentStore();
  const [tab, setTab] = useState<Tab>("Profile");
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!adminOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAdmin();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [adminOpen, closeAdmin]);

  if (!adminOpen) return null;

  const patch = (part: Partial<Content>) => {
    setContent((prev) => ({ ...prev, ...part }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-xl md:p-8">
      <div className="admin-shell animate-fade-in relative w-full max-w-5xl rounded-2xl p-6 md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
              System console
            </p>
            <h2 className="neon-text mt-2 font-display text-2xl font-semibold">
              Admin<span className="text-primary">.panel</span>
            </h2>
          </div>
          <Btn onClick={closeAdmin}>Close ✕</Btn>
        </div>

        {!unlocked ? (
          <form
            className="mt-10 max-w-sm space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (code.trim().toLowerCase() === ACCESS_CODE) setUnlocked(true);
              else setError(true);
            }}
          >
            <Field label="Access code" value={code} onChange={(v) => (setCode(v), setError(false))} />
            {error ? (
              <p className="font-mono text-[11px] text-destructive">
                Access denied. Please check the code and try again.
              </p>
            ) : (
              <p className="font-mono text-[11px] text-muted-foreground">
                Default access code: harshit
              </p>
            )}
            <Btn tone="solid" type="submit">
              Unlock
            </Btn>
          </form>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap gap-2 border-b border-primary/15 pb-4">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-all ${
                    tab === t
                      ? "bg-primary/15 text-primary shadow-[0_0_22px_-10px_var(--primary)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-5">
              {tab === "Profile" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {(
                    [
                      ["name", "Name"],
                      ["role", "Role"],
                      ["email", "Email"],
                      ["phone", "Phone"],
                      ["location", "Location"],
                      ["github", "GitHub URL"],
                      ["linkedin", "LinkedIn URL"],
                    ] as const
                  ).map(([key, label]) => (
                    <Field
                      key={key}
                      label={label}
                      value={content.profile[key]}
                      onChange={(v) => patch({ profile: { ...content.profile, [key]: v } })}
                    />
                  ))}
                  <div className="md:col-span-2">
                    <Field
                      label="Tagline"
                      textarea
                      value={content.profile.tagline}
                      onChange={(v) => patch({ profile: { ...content.profile, tagline: v } })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Field
                      label="About / career objective"
                      textarea
                      value={content.profile.objective}
                      onChange={(v) => patch({ profile: { ...content.profile, objective: v } })}
                    />
                  </div>
                </div>
              ) : null}

              {tab === "Skills" ? (
                <>
                  {content.skillGroups.map((g, i) => (
                    <Card
                      key={i}
                      title={g.title || "Skill group"}
                      onRemove={() =>
                        patch({ skillGroups: content.skillGroups.filter((_, x) => x !== i) })
                      }
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        <Field
                          label="Group title"
                          value={g.title}
                          placeholder="e.g. Gen AI and LLMs"
                          onChange={(v) =>
                            patch({
                              skillGroups: content.skillGroups.map((x, k) =>
                                k === i ? { ...x, title: v } : x,
                              ),
                            })
                          }
                        />
                        <Field
                          label="Short note"
                          value={g.note}
                          placeholder="e.g. Core strength"
                          onChange={(v) =>
                            patch({
                              skillGroups: content.skillGroups.map((x, k) =>
                                k === i ? { ...x, note: v } : x,
                              ),
                            })
                          }
                        />
                      </div>
                      <Field
                        label="Skills in this group (comma separated)"
                        textarea
                        value={g.items.join(", ")}
                        placeholder="LangChain, RAG, Prompt engineering"
                        onChange={(v) =>
                          patch({
                            skillGroups: content.skillGroups.map((x, k) =>
                              k === i ? { ...x, items: toList(v) } : x,
                            ),
                          })
                        }
                      />
                    </Card>
                  ))}
                  <Btn
                    tone="solid"
                    onClick={() =>
                      patch({
                        skillGroups: [...content.skillGroups, { title: "", note: "", items: [] }],
                      })
                    }
                  >
                    + Add skill group
                  </Btn>
                  <Field
                    label="Scrolling banner skills (comma separated)"
                    textarea
                    value={content.marqueeSkills.join(", ")}
                    onChange={(v) => patch({ marqueeSkills: toList(v) })}
                  />
                </>
              ) : null}

              {tab === "Projects" ? (
                <>
                  {content.projects.map((p, i) => (
                    <Card
                      key={i}
                      title={p.name || "New project"}
                      onRemove={() => patch({ projects: content.projects.filter((_, x) => x !== i) })}
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        <Field
                          label="Project name"
                          value={p.name}
                          placeholder="CLI Chatbot — LLM Application"
                          onChange={(v) =>
                            patch({
                              projects: content.projects.map((x, k) =>
                                k === i ? { ...x, name: v } : x,
                              ),
                            })
                          }
                        />
                        <Field
                          label="Category"
                          value={p.kind}
                          placeholder="Gen AI, Computer Vision or Frontend"
                          onChange={(v) =>
                            patch({
                              projects: content.projects.map((x, k) =>
                                k === i ? { ...x, kind: v } : x,
                              ),
                            })
                          }
                        />
                      </div>
                      <Field
                        label="Short summary"
                        textarea
                        value={p.summary}
                        placeholder="One or two lines describing what it does"
                        onChange={(v) =>
                          patch({
                            projects: content.projects.map((x, k) =>
                              k === i ? { ...x, summary: v } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Key highlights (one per line)"
                        textarea
                        value={p.points.join("\n")}
                        placeholder={"Sub-2s latency\nSecure key handling"}
                        onChange={(v) =>
                          patch({
                            projects: content.projects.map((x, k) =>
                              k === i ? { ...x, points: toList(v) } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Tech stack (comma separated)"
                        value={p.stack.join(", ")}
                        placeholder="Python, LangChain, Groq API"
                        onChange={(v) =>
                          patch({
                            projects: content.projects.map((x, k) =>
                              k === i ? { ...x, stack: toList(v) } : x,
                            ),
                          })
                        }
                      />
                    </Card>
                  ))}
                  <Btn
                    tone="solid"
                    onClick={() =>
                      patch({
                        projects: [
                          ...content.projects,
                          { name: "", kind: "", summary: "", points: [], stack: [] },
                        ],
                      })
                    }
                  >
                    + Add project
                  </Btn>
                </>
              ) : null}

              {tab === "Experience" ? (
                <>
                  {content.experience.map((job, i) => (
                    <Card
                      key={i}
                      title={job.org || "New role"}
                      onRemove={() =>
                        patch({ experience: content.experience.filter((_, x) => x !== i) })
                      }
                    >
                      <div className="grid gap-3 md:grid-cols-3">
                        <Field
                          label="Role"
                          value={job.role}
                          placeholder="Technical Intern"
                          onChange={(v) =>
                            patch({
                              experience: content.experience.map((x, k) =>
                                k === i ? { ...x, role: v } : x,
                              ),
                            })
                          }
                        />
                        <Field
                          label="Organization"
                          value={job.org}
                          placeholder="Company or organization name"
                          onChange={(v) =>
                            patch({
                              experience: content.experience.map((x, k) =>
                                k === i ? { ...x, org: v } : x,
                              ),
                            })
                          }
                        />
                        <Field
                          label="Duration"
                          value={job.period}
                          placeholder="Jul 2024 – Aug 2024"
                          onChange={(v) =>
                            patch({
                              experience: content.experience.map((x, k) =>
                                k === i ? { ...x, period: v } : x,
                              ),
                            })
                          }
                        />
                      </div>
                      <Field
                        label="Responsibilities (one per line)"
                        textarea
                        value={job.points.join("\n")}
                        onChange={(v) =>
                          patch({
                            experience: content.experience.map((x, k) =>
                              k === i ? { ...x, points: toList(v) } : x,
                            ),
                          })
                        }
                      />
                    </Card>
                  ))}
                  <Btn
                    tone="solid"
                    onClick={() =>
                      patch({
                        experience: [
                          ...content.experience,
                          { role: "", org: "", period: "", points: [] },
                        ],
                      })
                    }
                  >
                    + Add experience
                  </Btn>
                </>
              ) : null}

              {tab === "Education" ? (
                <>
                  {content.education.map((ed, i) => (
                    <Card
                      key={i}
                      title={ed.school || "New education"}
                      onRemove={() =>
                        patch({ education: content.education.filter((_, x) => x !== i) })
                      }
                    >
                      <div className="grid gap-3 md:grid-cols-3">
                        <Field
                          label="Degree"
                          value={ed.degree}
                          placeholder="MCA, AI & Machine Learning"
                          onChange={(v) =>
                            patch({
                              education: content.education.map((x, k) =>
                                k === i ? { ...x, degree: v } : x,
                              ),
                            })
                          }
                        />
                        <Field
                          label="Institution"
                          value={ed.school}
                          placeholder="University name"
                          onChange={(v) =>
                            patch({
                              education: content.education.map((x, k) =>
                                k === i ? { ...x, school: v } : x,
                              ),
                            })
                          }
                        />
                        <Field
                          label="Years attended"
                          value={ed.period}
                          placeholder="2025 – 2027"
                          onChange={(v) =>
                            patch({
                              education: content.education.map((x, k) =>
                                k === i ? { ...x, period: v } : x,
                              ),
                            })
                          }
                        />
                      </div>
                    </Card>
                  ))}
                  <Btn
                    tone="solid"
                    onClick={() =>
                      patch({
                        education: [...content.education, { degree: "", school: "", period: "" }],
                      })
                    }
                  >
                    + Add education
                  </Btn>
                </>
              ) : null}

              {tab === "Stats" ? (
                <>
                  {content.stats.map((s, i) => (
                    <Card
                      key={i}
                      title={s.label || "New stat"}
                      onRemove={() => patch({ stats: content.stats.filter((_, x) => x !== i) })}
                    >
                      <div className="grid gap-3 md:grid-cols-[0.4fr_1fr]">
                        <Field
                          label="Value"
                          value={s.value}
                          placeholder="<2s"
                          onChange={(v) =>
                            patch({
                              stats: content.stats.map((x, k) => (k === i ? { ...x, value: v } : x)),
                            })
                          }
                        />
                        <Field
                          label="Label"
                          value={s.label}
                          placeholder="LLM response latency shipped"
                          onChange={(v) =>
                            patch({
                              stats: content.stats.map((x, k) => (k === i ? { ...x, label: v } : x)),
                            })
                          }
                        />
                      </div>
                    </Card>
                  ))}
                  <Btn
                    tone="solid"
                    onClick={() => patch({ stats: [...content.stats, { value: "", label: "" }] })}
                  >
                    + Add stat
                  </Btn>
                </>
              ) : null}

              {tab === "Awards" ? (
                <>
                  <Field
                    label="Achievements and certifications (one per line)"
                    textarea
                    value={content.achievements.join("\n")}
                    onChange={(v) => patch({ achievements: toList(v) })}
                  />
                </>
              ) : null}

              {tab === "Theme" ? (
                <div>
                  <p className="mb-4 font-mono text-[11px] text-muted-foreground">
                    Pick a colour scheme for the whole site. It applies instantly and is
                    remembered on this device.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {THEMES.map((t) => {
                      const active = theme === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTheme(t.id)}
                          className={`holo-border hud-corners group rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                            active
                              ? "border-primary bg-primary/10 shadow-[0_0_30px_-10px_var(--primary)]"
                              : "border-primary/15 bg-card/50 hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {t.swatch.map((c) => (
                              <span
                                key={c}
                                className="size-5 rounded-full border border-foreground/10"
                                style={{ background: c }}
                              />
                            ))}
                          </div>
                          <p className="mt-3 font-display text-sm font-semibold text-foreground">
                            {t.name}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                            {t.note}
                          </p>
                          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                            {active ? "● Active" : "Apply"}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-primary/15 pt-5">
              <p className="font-mono text-[11px] text-muted-foreground">
                {saved ? (
                  <span className="text-primary">● Changes saved on this device</span>
                ) : (
                  "Every change is saved automatically on this device"
                )}
              </p>
              <div className="flex gap-2">
                <Btn tone="danger" onClick={() => reset()}>
                  Reset to resume data
                </Btn>
                <Btn tone="solid" onClick={closeAdmin}>
                  Done
                </Btn>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
