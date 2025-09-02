import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

type ExplainOk = { explanation: string };
type ExplainErr = { error: string };

const SYSTEM = `You write brief, clear hiring analytics explanations. 
Explain in 120-180 words, organized in short bullet points. 
Be practical and specific. Avoid generic advice.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExplainOk | ExplainErr>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { resume = "", job = "", match, quickMatch, overlap = [], missing = [] } = req.body ?? {};
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Graceful fallback if no key: deterministic, useful text
      const topOverlap = (overlap as string[]).slice(0, 10).join(", ") || "few direct overlaps";
      const topMissing = (missing as string[]).slice(0, 10).join(", ") || "key keywords from the job post";
      const synthetic = `
• Your resume aligns with several terms (${topOverlap}), which boosted the score.
• The match dropped due to missing terms (${topMissing}). Add these to skills/projects where true.
• Strengthen the summary with role-specific metrics and mirror the job’s phrasing for key responsibilities.
• Showcase 1–2 recent projects that demonstrate the top 3 required skills from the job.
• Tailor a 3–5 bullet “Core Skills” section that uses the employer’s exact terms (only if accurate).
      `.trim();
      return res.status(200).json({ explanation: synthetic });
    }

    const openai = new OpenAI({ apiKey });

    const prompt = `
Job Match Summary
Match (embeddings): ${match ?? "—"}%
Quick Match (keywords): ${quickMatch ?? "—"}%

Top overlapping terms from JD found in resume:
${Array.isArray(overlap) && overlap.length ? "- " + overlap.slice(0, 15).join("\n- ") : "- (none listed)"}

Important JD terms missing from resume (consider adding only if accurate):
${Array.isArray(missing) && missing.length ? "- " + missing.slice(0, 15).join("\n- ") : "- (none listed)"}

Resume (excerpt, first 1200 chars):
${String(resume).slice(0, 1200)}

Job (excerpt, first 1200 chars):
${String(job).slice(0, 1200)}

Write a concise explanation (120–180 words) with bullets:
• Why the score is what it is
• What to add/remove/tailor to improve alignment
• 1 concrete project or evidence suggestion to demonstrate fit
Only give practical guidance—no fluff.
    `.trim();

    // Use a small, fast model; fall back if unavailable.
    const model = "gpt-4o-mini";

    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.4,
      max_tokens: 260,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
    });

    const explanation =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Could not generate explanation.";

    return res.status(200).json({ explanation });
  } catch (err) {
    console.error("match-explain error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
