import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Dropzone from "@/components/Dropzone";

/** ---------------------------
 * Helpers / tiny UI components
 * -------------------------- */


const SectionCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={"bg-white border border-gray-200 rounded-2xl shadow-sm " + className}
        {...rest}
      />
    );
  }
);
SectionCard.displayName = "SectionCard";

export { SectionCard };
function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {hint ? <p className="text-xs text-gray-500 mt-1">{hint}</p> : null}
    </div>
  );
}
function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div className="h-2 bg-indigo-600 transition-all" style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }} />
    </div>
  );
}
/** Simple semicircle risk gauge (pure SVG) */
function RiskGauge({ score }: { score: number }) {
  const clamped = Math.min(Math.max(score, 0), 100);
  const color = clamped < 35 ? "#16a34a" : clamped < 70 ? "#f59e0b" : "#dc2626";
  const r = 80, cx = 100, cy = 100;
  const startAngle = Math.PI;
  const endAngle = Math.PI + (Math.PI * clamped) / 100;
  const startX = cx + r * Math.cos(startAngle), startY = cy + r * Math.sin(startAngle);
  const endX = cx + r * Math.cos(endAngle), endY = cy + r * Math.sin(endAngle);
  const bgPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const valPath = `M ${startX} ${startY} A ${r} ${r} 0 ${clamped > 50 ? 1 : 0} 1 ${endX} ${endY}`;
  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        <path d={bgPath} stroke="#e5e7eb" strokeWidth="14" fill="none" />
        <path d={valPath} stroke={color} strokeWidth="14" fill="none" />
        <text x="100" y="105" textAnchor="middle" className="fill-gray-600" fontSize="12">0</text>
        <text x="180" y="105" textAnchor="middle" className="fill-gray-600" fontSize="12">100</text>
      </svg>
      <div className="text-center mt-2">
        <p className="text-sm text-gray-600">Automation Risk</p>
        <p className="text-2xl font-extrabold" style={{ color }}>{clamped}%</p>
      </div>
    </div>
  );
}

/** ---------------------------
 * Types & mock builder
 * -------------------------- */
type GapPriority = "High" | "Medium" | "Low";
type Analysis = {
  risk: number;
  skills: string[];
  topRoles: { title: string; demand: number }[];
  gaps: { skill: string; priority: GapPriority }[];
  recommendations: string[];
  salaryRange?: string;
  marketNote?: string;
};
function buildMockAnalysis(seedText: string): Analysis {
  const base = Math.min(90, Math.max(10, (seedText?.length || 120) % 91));
  const risk = Math.round(25 + (base % 60));
  const skills = ["JavaScript", "React", "Node.js", "SQL", "System Design", "Leadership", "APIs", "Cloud"]
    .slice(0, 5 + ((base / 10) | 0) % 3);
  const gaps = [
    { skill: "Python (AI/ML)", priority: "High" as const },
    { skill: "AWS Lambda", priority: "Medium" as const },
    { skill: "Vector Databases", priority: "Medium" as const },
  ];
  const topRoles = [
    { title: "AI Product Manager", demand: 88 },
    { title: "Solutions Architect", demand: 84 },
    { title: "Platform Engineer", demand: 81 },
    { title: "Security Engineer", demand: 79 },
    { title: "Data Engineer", demand: 76 },
  ];
  const recommendations = [
    "30d: Ship a small LLM feature (RAG or agent).",
    "45d: Earn an AWS Associate cert (serverless focus).",
    "60d: Publish an automation case study from a past project.",
    "90d: Target AI platform or solutions roles with tailored resumes.",
  ];
  return {
    risk,
    skills,
    gaps,
    topRoles,
    recommendations,
    salaryRange: "$140k–$180k (US)",
    marketNote: "Demand strong for cloud/AI-platform; security-aligned roles rising.",
  };
}

/** ---------------------------
 * Dashboard page
 * -------------------------- */
export default function Dashboard() {
  const [busy, setBusy] = useState(false);
  const [resumeText, setResumeText] = useState<string>("");
  const [jobText, setJobText] = useState<string>("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<Array<{ ts: number; resumePreview: string; analysis: Analysis }>>([]);
const [smartMatch, setSmartMatch] = useState<number | null>(null);
const [smartBusy, setSmartBusy] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  /** --- localStorage history --- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pivotai.history");
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);
  const pushHistory = useCallback((resumeSeed: string, a: Analysis) => {
    const entry = {
      ts: Date.now(),
      resumePreview: resumeSeed.slice(0, 140),
      analysis: a,
    };
    const next = [entry, ...history].slice(0, 10);
    setHistory(next);
    try {
      localStorage.setItem("pivotai.history", JSON.stringify(next));
    } catch {}
  }, [history]);

  /** --- call API or mock --- */
  const runAnalyze = useCallback(async () => {
    if (!resumeText.trim()) {
      alert("Paste your resume or upload a file first.");
      return;
    }
    setBusy(true);
    setProgress(15);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeText }),
      }).catch(() => null);
      setProgress(65);
      let a: Analysis;
      if (res && res.ok) {
        const json = await res.json();
        a = {
          risk: Number(json.automationRisk ?? 60),
          skills: json.skills ?? [],
          topRoles: (json.pivotRoles?.map((p: any) => ({ title: p.title || String(p), demand: 75 + Math.floor(Math.random()*20) })) ?? json.jobs?.map((j: string) => ({ title: j, demand: 75 + Math.floor(Math.random()*20) })) ?? []),
          gaps: (json.skillGaps ?? []).map((g: any) => ({ skill: g.skill || String(g), priority: (g.importance || "Medium") as GapPriority })),
          recommendations: json.recommendations ?? json.plan ?? [],
          salaryRange: json.salaryRange ?? "$130k–$170k",
          marketNote: json.marketNote ?? "Strong market for cloud + AI product skills.",
        };
      } else {
        a = buildMockAnalysis(resumeText);
      }
      setAnalysis(a);
      pushHistory(resumeText, a);
    } finally {
      setProgress(100);
      setTimeout(() => setProgress(0), 400);
      setBusy(false);
    }
  }, [resumeText, pushHistory]);

  /** --- job match % (very simple keyword overlap for MVP) --- */
  const matchPct = useMemo(() => {
    if (!analysis || !jobText.trim()) return 0;
    const resumeBag = new Set(
      (resumeText + " " + analysis.skills.join(" ")).toLowerCase().match(/[a-zA-Z0-9\+\#\.]+/g) || []
    );
    const jobTokens = (jobText.toLowerCase().match(/[a-zA-Z0-9\+\#\.]+/g) || []);
    if (jobTokens.length === 0) return 0;
    const overlap = jobTokens.filter((t) => resumeBag.has(t)).length;
    const pct = Math.round((overlap / jobTokens.length) * 100);
    return Math.max(3, Math.min(97, pct));
  }, [analysis, jobText, resumeText]);

  /** --- export PDF --- */
  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const node = reportRef.current;
    const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff" });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const w = canvas.width * ratio;
    const h = canvas.height * ratio;
    const x = (pageWidth - w) / 2;
    const y = 24;
    pdf.addImage(img, "PNG", x, y, w, h);
    pdf.save("pivotai-report.pdf");
  };

  /** --- UI --- */
  const top3 = useMemo(() => analysis?.topRoles.slice(0, 3) ?? [], [analysis?.topRoles]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-extrabold text-indigo-700">PivotAI</a>
          <nav className="hidden sm:flex gap-6 text-gray-700">
            <a href="/features" className="hover:text-indigo-700">Features</a>
            <a href="/" className="hover:text-indigo-700">Home</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Input row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Resume input */}
          <SectionCard className="p-6 lg:col-span-2">
  <Dropzone
    label="Resume"
    sublabel="Upload your resume (PDF, DOCX, DOC, or TXT). You can still edit the text below."
    onText={(t) => setResumeText(t)}
  />
  <textarea
    className="mt-3 w-full border border-gray-300 rounded-xl p-3 text-gray-800 min-h-40"
    placeholder="Paste or edit the extracted resume text here…"
    value={resumeText}
    onChange={(e) => setResumeText(e.target.value)}
  />
  <div className="mt-3 flex items-center gap-3">
    <button
      onClick={runAnalyze}
      disabled={busy || !resumeText.trim()}
      className={
        "px-4 py-2 rounded-xl font-semibold transition " +
        (busy || !resumeText.trim()
          ? "bg-gray-200 text-gray-500"
          : "bg-indigo-600 text-white hover:bg-indigo-700")
      }
    >
      {busy ? "Analyzing…" : "Analyze"}
    </button>
    <div className="flex-1"><ProgressBar percent={progress} /></div>
  </div>
</SectionCard>
          {/* Risk */}
          <SectionCard className="p-6 flex flex-col items-center justify-center">
            <h3 className="text-base font-semibold text-gray-900">Your Automation Risk</h3>
            <p className="text-sm text-gray-600 mb-2">(Lower is better • personalized to your resume)</p>
            <RiskGauge score={analysis?.risk ?? 0} />
          </SectionCard>
        </div>

        {/* Quick stats */}
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <StatCard label="Resume Loaded" value={resumeText ? "Yes" : "No"} hint="Paste text to analyze" />
          <StatCard label="Suggested Salary Range" value={analysis?.salaryRange ?? "—"} hint="Based on market & seniority" />
          <StatCard label="Top Role Demand" value={top3[0] ? `${top3[0].demand}%` : "—"} hint={top3[0]?.title ?? "—"} />
        </div>

        {/* Job posting & match */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <SectionCard className="p-6">
            <h3 className="text-xl font-bold text-gray-900">Job Posting</h3>
            <p className="text-sm text-gray-600">Paste a job description to compute a quick match score.</p>
            <textarea
              className="mt-3 w-full border border-gray-300 rounded-xl p-3 text-gray-800 min-h-40"
              placeholder="Paste job description here…"
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
            />
            <div className="mt-3">
              <p className="text-sm text-gray-600">Match Percentage</p>
              <div className="flex items-center gap-3">
                <div className="w-40"><ProgressBar percent={matchPct} /></div>
                <span className="text-lg font-bold text-indigo-700">{matchPct}%</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="p-6">
            <h3 className="text-xl font-bold text-gray-900">Recommended Pivots</h3>
            <p className="text-sm text-gray-600">Higher demand → faster interviews & safer roles.</p>
            <ul className="mt-4 space-y-3">
              {(analysis?.topRoles ?? []).map((r, i) => (
                <li key={i} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <span className="text-gray-800">{r.title}</span>
                  <span className="text-sm font-semibold text-indigo-700">{r.demand}% demand</span>
                </li>
              ))}
            </ul>
            {analysis?.marketNote ? <p className="text-xs text-gray-500 mt-3">{analysis.marketNote}</p> : null}
          </SectionCard>

          <SectionCard className="p-6" ref={reportRef}>
            <h3 className="text-xl font-bold text-gray-900">30–60–90 Day Plan</h3>
            <ol className="mt-3 list-decimal list-inside space-y-2 text-gray-800">
              {(analysis?.recommendations ?? [
                "30d: Ship a small LLM feature.",
                "60d: Earn an AWS cert.",
                "90d: Tailor resume & apply broadly.",
              ]).map((step, i) => (<li key={i}>{step}</li>))}
            </ol>

            <h4 className="text-lg font-semibold text-gray-900 mt-6">Top Skills</h4>
            <ul className="mt-2 list-disc list-inside text-gray-800">
              {(analysis?.skills ?? []).map((s, i) => <li key={i}>{s}</li>)}
            </ul>

            <h4 className="text-lg font-semibold text-gray-900 mt-6">Skill Gaps</h4>
            <ul className="mt-2 space-y-2">
              {(analysis?.gaps ?? []).map((g, i) => (
                <li key={i} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <span className="text-gray-800">{g.skill}</span>
                  <span className={
                    "text-xs font-semibold px-2 py-1 rounded-md " +
                    (g.priority === "High" ? "bg-red-100 text-red-700"
                      : g.priority === "Medium" ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700")
                  }>
                    {g.priority}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex gap-3">
              <button
                disabled={!analysis}
                className={
                  "px-4 py-2 rounded-xl font-semibold transition " +
                  (!analysis ? "bg-gray-200 text-gray-500" : "bg-indigo-600 text-white hover:bg-indigo-700")
                }
                onClick={downloadPDF}
              >
                Download PDF
              </button>
              <button
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-50"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Analyze Another
              </button>
            </div>
          </SectionCard>
        </div>

        {/* History */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Recent Analyses</h3>
          {history.length === 0 ? (
            <p className="text-gray-600">No history yet. Analyze a resume to see it here.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((h) => (
                <SectionCard key={h.ts} className="p-4">
                  <p className="text-xs text-gray-500">
                    {new Date(h.ts).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-800 mt-1 line-clamp-3">
                    {h.resumePreview}…
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-700">
                      Risk: <span className="font-semibold">{h.analysis.risk}%</span>
                    </span>
                    <button
                      className="text-indigo-700 font-semibold hover:underline"
                      onClick={() => setAnalysis(h.analysis)}
                    >
                      Load
                    </button>
                  </div>
                </SectionCard>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
