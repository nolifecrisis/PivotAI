import type { NextApiRequest, NextApiResponse } from "next";

type AnalysisResponse = {
  automationRisk: number;           // 0-100
  skills: string[];
  jobs: string[];                   // Top job matches
  skillGaps: { skill: string; importance: "High" | "Medium" | "Low" }[];
  confidenceScore: number;          // 0-100
  recommendations: string[];        // 30-60-90 suggestions
  // Extras to satisfy any older UI parsers we tried:
  pivotRoles?: Array<{ title: string }>;
  salaryRange?: string;
  marketNote?: string;
};

function buildMockAnalysis(resumeText: string): AnalysisResponse {
  // quick “seed” from text length for variety
  const seed = Math.max(60, Math.min(92, (resumeText?.length || 180) % 100));
  const automationRisk = Math.round(seed - 20); // ~40–72
  const confidenceScore = Math.round(80 + (seed % 15)); // ~80–95

  const baseSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "SQL",
    "System Design",
    "APIs",
    "Cloud Architecture",
    "Leadership",
  ];
  const skills = baseSkills.slice(0, 5 + ((seed / 10) | 0) % 3);

  const jobs = [
    "Solutions Architect",
    "AI Product Manager",
    "Platform Engineer",
    "Security Engineer",
    "Data Engineer",
  ].slice(0, 3 + (seed % 2));

  const skillGaps = [
    { skill: "Python (AI/ML)", importance: "High" as const },
    { skill: "AWS Lambda / Serverless", importance: "Medium" as const },
    { skill: "Vector Databases", importance: "Medium" as const },
  ];

  const recommendations = [
    "30d: Ship a small LLM feature (RAG or agent) in a weekend project.",
    "45d: Earn an AWS Associate cert; focus on serverless patterns.",
    "60d: Publish a case study on automation savings for a past project.",
    "90d: Apply to AI-platform or solutions-architect roles with tailored resumes.",
  ];

  return {
    automationRisk,
    skills,
    jobs,
    skillGaps,
    confidenceScore,
    recommendations,
    pivotRoles: jobs.map((j) => ({ title: j })), // backwards compat for earlier UI
    salaryRange: "$140k–$180k (US)",
    marketNote:
      "Strong demand for cloud + AI-platform experience; security-aligned roles growing fastest.",
  };
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { resume = "", jobDesc = "" } = req.body ?? {};
    const text = String(resume || jobDesc || "");
    if (!text.trim()) {
      return res.status(400).json({ error: "Missing resume (or jobDesc) text" });
    }

    const analysis = buildMockAnalysis(text);
    return res.status(200).json(analysis);
  } catch (err) {
    console.error("analyze API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
