import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

type Ok = { bullets: string[] };
type Err = { error: string };

const SYSTEM = `You rewrite resume bullet points for job alignment.
Rules:
- Never fabricate responsibilities, employers, dates, titles, or metrics.
- Only include skills/keywords that the candidate likely has or can evidence from the resume text.
- Prefer concise, action-verb-led bullets (max ~22 words).
- Use measurable impact if present in the resume; if none, omit (do not invent numbers).
- Gently mirror the JD’s phrasing only when truthful.
- Return 3–4 bullets, each on a new line, no numbering or quotes.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Ok | Err>
) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const {
      resume = "",
      job = "",
      overlap = [],
      missing = [],
      maxBullets = 4,
    } = (req.body ?? {}) as {
      resume?: string;
      job?: string;
      overlap?: string[];
      missing?: string[];
      maxBullets?: number;
    };

    const resumeText = String(resume || "").slice(0, 5000);
    const jobText = String(job || "").slice(0, 5000);
    const desired = Math.max(3, Math.min(4, Number(maxBullets) || 4));

    // Fallback if no API key: deterministic, safe template using overlap/missing
    if (!process.env.OPENAI_API_KEY) {
      const useTerms = (Array.isArray(overlap) ? overlap : []).slice(0, 4)
        .concat((Array.isArray(missing) ? missing : []).slice(0, 2));
      const uniq = Array.from(new Set(useTerms.filter(Boolean)));
      const base = [
        `Delivered features aligning to role needs, emphasizing ${uniq.slice(0, 2).join(", ")} and stakeholder outcomes.`,
        `Improved systems using ${uniq.slice(2, 4).join(", ")}; focused on reliability, clarity, and maintainability.`,
        `Partnered cross-functionally to translate requirements into shipped work; documented decisions and reduced rework.`,
        `Closed gaps by practicing relevant tools and patterns; validated changes via reviews and tests.`,
      ].slice(0, desired);
      return res.status(200).json({ bullets: base });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = "gpt-4o-mini";

    const prompt = `
Goal: Rewrite up to ${desired} resume bullets to improve alignment with the job description.

Job terms candidate already matches (from JD): ${
      Array.isArray(overlap) && overlap.length ? overlap.slice(0, 20).join(", ") : "(none)"
    }
Important JD terms candidate might be missing (ONLY include if truthful in their background): ${
      Array.isArray(missing) && missing.length ? missing.slice(0, 20).join(", ") : "(none)"
    }

Resume excerpt (use ONLY what's true here; do NOT invent):
${resumeText}

Job description excerpt (for phrasing alignment only when accurate):
${jobText}

Output format:
- ${desired} bullet lines, no numbering, no quotes.
- Each bullet ≤ ~22 words.
- Start with a strong action verb.
- Incorporate truthful overlaps; cautiously add missing terms ONLY if clearly supported by the resume.
- No company names/dates unless present in resume text.
- No fabricated metrics. If a metric exists in resume, you may include it.
`.trim();

    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.4,
      max_tokens: 300,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
    });

    const text = completion.choices?.[0]?.message?.content ?? "";
    const bullets = text
      .split("\n")
      .map((l) => l.replace(/^[-•\s]+/, "").trim())
      .filter((l) => l.length > 0)
      .slice(0, desired);

    if (bullets.length === 0) {
      return res.status(200).json({
        bullets: [
          "Delivered features aligned to job requirements; emphasized correctness, clarity, and maintainability.",
          "Collaborated with partners to translate requirements into shipped functionality with measurable outcomes.",
          "Proactively learned role-relevant tools; validated changes through reviews and testing.",
        ].slice(0, desired),
      });
    }

    return res.status(200).json({ bullets });
  } catch (err) {
    console.error("match-rewrite error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
