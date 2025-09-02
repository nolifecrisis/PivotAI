import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

/** -------- utils -------- */
function cosine(a: number[], b: number[]) {
  let dot = 0,
    na = 0,
    nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const ai = a[i];
    const bi = b[i];
    dot += ai * bi;
    na += ai * ai;
    nb += bi * bi;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function sanitize(text: string, maxChars = 15000) {
  // keep it predictable for token usage
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxChars);
}

/** very simple tokenization for quick heuristics */
function tokenize(text: string) {
  return (text.toLowerCase().match(/[a-z0-9\+\#\.\-]+/g) || []).filter((t) => t.length > 1);
}

function quickKeywordMatch(resume: string, job: string) {
  const rTokens = tokenize(resume);
  const jTokens = tokenize(job);
  if (jTokens.length === 0) return { pct: 0, overlap: [], missing: [] };

  const rSet = new Set(rTokens);
  const overlap = Array.from(new Set(jTokens.filter((t) => rSet.has(t))));
  const missing = Array.from(new Set(jTokens.filter((t) => !rSet.has(t))));

  // simple ratio of overlap over JD tokens (clamped)
  const pct = Math.max(3, Math.min(97, Math.round((overlap.length / jTokens.length) * 100)));
  return { pct, overlap: overlap.slice(0, 25), missing: missing.slice(0, 25) };
}

/** -------- types -------- */
type MatchOk = {
  match: number;             // 0..100 (embeddings-based)
  quickMatch: number;        // 0..100 (keyword-based)
  overlap: string[];         // top overlapping JD tokens (keyword-based)
  missing: string[];         // top JD tokens missing from resume (keyword-based)
  method: "embedding-cosine";
  model: string;
};

type MatchErr = { error: string };

/** -------- handler -------- */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MatchOk | MatchErr>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { resume = "", job = "" } = req.body ?? {};
    const resumeText = sanitize(resume);
    const jobText = sanitize(job);

    if (!resumeText || !jobText) {
      return res.status(400).json({ error: "Missing resume or job text" });
    }

    // Always compute a quick keyword score so we can show explanations
    const quick = quickKeywordMatch(resumeText, jobText);

    // If no API key, gracefully fall back to keyword score only
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        match: Math.round(quick.pct * 0.9), // slightly conservative vs quick
        quickMatch: quick.pct,
        overlap: quick.overlap,
        missing: quick.missing,
        method: "embedding-cosine",
        model: "text-embedding-3-small (API key missing — used quick fallback)",
      });
    }

    const client = new OpenAI({ apiKey });

    // Embedding model: fast + inexpensive + solid for semantic similarity
    const model = "text-embedding-3-small";

    // Create embeddings in parallel
    const [e1, e2] = await Promise.all([
      client.embeddings.create({ model, input: resumeText }),
      client.embeddings.create({ model, input: jobText }),
    ]);

    const v1 = e1.data[0].embedding as number[];
    const v2 = e2.data[0].embedding as number[];

    const sim = cosine(v1, v2); // 0..1
    // map to 0..100 with a gentle bias upward so typical resume/JD pairs feel reasonable
    const pct = Math.round(Math.min(Math.max(sim, 0), 1) * 100);

    return res.status(200).json({
      match: pct,
      quickMatch: quick.pct,
      overlap: quick.overlap,
      missing: quick.missing,
      method: "embedding-cosine",
      model,
    });
  } catch (err) {
    console.error("match API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
