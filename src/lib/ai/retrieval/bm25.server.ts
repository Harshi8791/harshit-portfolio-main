import { knowledgeChunks, type KnowledgeChunk } from "@/lib/ai/knowledge/chunks";

const STOP = new Set(
  "a an the is are was were be to of in on for and or with your you me my i do does did what who how why when where which tell about have has can kya hai ho ke ki ka me mein aap aapka apne".split(" "),
);

// Small synonym map so common recruiter phrasing hits the right chunk.
const SYN: Record<string, string[]> = {
  strength: ["strengths", "good", "best"],
  weakness: ["weaknesses", "improve"],
  hobby: ["hobbies", "free", "time", "interests"],
  family: ["father", "mother", "siblings", "parents"],
  parents: ["father", "mother"],
  goal: ["goals", "future", "plan", "see", "yourself"],
  future: ["goal", "years"],
  internship: ["experience", "intern", "worked"],
  work: ["experience", "intern"],
  study: ["education", "degree", "college", "university"],
  college: ["education", "university"],
  age: ["birth", "born"],
  birthday: ["birth", "born"],
  passion: ["why", "motivation"],
  project: ["projects", "built"],
  language: ["languages", "spoken", "hindi", "english"],
};

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9+\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map((t) => (t.length > 4 && t.endsWith("s") ? t.slice(0, -1) : t));
}

type Indexed = KnowledgeChunk & { tokens: string[] };

function buildIndex(chunks: KnowledgeChunk[]) {
  const docs: Indexed[] = chunks.map((c) => ({ ...c, tokens: tokenize(c.text) }));
  const df = new Map<string, number>();
  for (const d of docs) for (const t of new Set(d.tokens)) df.set(t, (df.get(t) ?? 0) + 1);
  const avg = docs.reduce((s, d) => s + d.tokens.length, 0) / docs.length;
  return { docs, df, avg };
}

/** BM25 retrieval over the knowledge base plus optional live portfolio chunks. */
export function retrieve(query: string, extra: KnowledgeChunk[] = [], k = 5): KnowledgeChunk[] {
  const { docs, df, avg } = buildIndex([...knowledgeChunks, ...extra]);
  const base = tokenize(query);
  const q = [...base, ...base.flatMap((t) => SYN[t] ?? [])];
  if (!q.length) return docs.slice(0, k);
  const N = docs.length;
  const scored = docs.map((d) => {
    let score = 0;
    for (const t of q) {
      const tf = d.tokens.filter((x) => x === t).length;
      if (!tf) continue;
      const n = df.get(t) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += (idf * tf * 2.2) / (tf + 1.2 * (0.25 + 0.75 * (d.tokens.length / avg)));
    }
    return { d, score };
  });
  const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, k);
  // Always keep the headline so the model knows who it is.
  const out = hits.map((h) => h.d);
  const head = docs.find((d) => d.id === "headline")!;
  if (!out.includes(head)) out.push(head);
  return out;
}
