import React, { useCallback, useMemo, useState } from "react";
import Dropzone from "@/components/Dropzone";

type MatchResponse = {
  match: number;      // embeddings-based (0..100)
  quickMatch: number; // keyword-based (0..100)
  overlap: string[];  // tokens present in both
  missing: string[];  // tokens from JD missing in resume
  method: string;
  model: string;
};



function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div className="h-2 bg-indigo-600 transition-all" style={{ width: `${clamped}%` }} />
    </div>
  );
}

function TokenList({ title, tokens, tone }: { title: string; tokens: string[]; tone: "pos" | "neg" }) {
  const base =
    "px-2 py-1 rounded-md text-xs font-semibold inline-block whitespace-nowrap";
  const klass =
    tone === "pos"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-rose-100 text-rose-700";
  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-2">{title}</h4>
      {tokens.length === 0 ? (
        <p className="text-sm text-gray-500">None</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tokens.map((t, i) => (
            <span key={`${t}-${i}`} className={`${base} ${klass}`}>
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MatchPage() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [progress, setProgress] = useState(0);
const [explaining, setExplaining] = useState(false);
const [explanation, setExplanation] = useState<string | null>(null);
const [explainError, setExplainError] = useState<string | null>(null);
const [rewriteBusy, setRewriteBusy] = useState(false);
const [rewriteError, setRewriteError] = useState<string | null>(null);
const [rewrittenBullets, setRewrittenBullets] = useState<string[] | null>(null);
const [copied, setCopied] = useState(false);

  // quick keyword match (client-only fallback / preview)
  const quickMatchLocal = useMemo(() => {
    const tokenize = (t: string) =>
      (t.toLowerCase().match(/[a-z0-9\+\#\.\-]+/g) || []).filter((x) => x.length > 1);
    const r = new Set(tokenize(resume));
    const j = tokenize(job);
    if (j.length === 0) return 0;
    const overlap = j.filter((t) => r.has(t)).length;
    return Math.max(3, Math.min(97, Math.round((overlap / j.length) * 100)));
  }, [resume, job]);
const runExplain = useCallback(async () => {
  setExplainError(null);
  setExplanation(null);

  if (!result || !resume.trim() || !job.trim()) {
    setExplainError("Compute Smart Match first, and provide both resume and job text.");
    return;
  }

  setExplaining(true);
  try {
    const res = await fetch("/api/match-explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume,
        job,
        match: result.match,
        quickMatch: result.quickMatch,
        overlap: result.overlap,
        missing: result.missing,
      }),
    }).catch(() => null);

    if (!res || !res.ok) {
      setExplainError("Could not generate explanation. Check server/API config.");
      return;
    }
    const data = (await res.json()) as { explanation?: string; error?: string };
    if (data.error || !data.explanation) {
      setExplainError(data.error || "No explanation returned.");
    } else {
      setExplanation(data.explanation);
    }
  } catch (e) {
    setExplainError("Unexpected error generating explanation.");
  } finally {
    setExplaining(false);
  }
}, [result, resume, job]);

const copyBullets = useCallback(async () => {
  if (!rewrittenBullets || !rewrittenBullets.length) return;
  try {
    await navigator.clipboard.writeText(rewrittenBullets.map(b => `• ${b}`).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  } catch {}
}, [rewrittenBullets]);


const runRewrite = useCallback(async () => {
  setRewriteError(null);
  setRewrittenBullets(null);
  setCopied(false);

  if (!result || !resume.trim() || !job.trim()) {
    setRewriteError("Compute Smart Match first and provide both resume and job text.");
    return;
  }

  setRewriteBusy(true);
  try {
    const res = await fetch("/api/match-rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume,
        job,
        overlap: result.overlap,
        missing: result.missing,
        maxBullets: 4,
      }),
    }).catch(() => null);

    if (!res || !res.ok) {
      setRewriteError("Could not generate rewritten bullets. Check server/API config.");
      return;
    }
    const data = (await res.json()) as { bullets?: string[]; error?: string };
    if (data.error || !data.bullets) {
      setRewriteError(data.error || "No bullets returned.");
    } else {
      setRewrittenBullets(data.bullets);
    }
  } catch {
    setRewriteError("Unexpected error generating bullets.");
  } finally {
    setRewriteBusy(false);
  }
}, [result, resume, job]);

  const runSmartMatch = useCallback(async () => {
    setError(null);
    setResult(null);

    if (!resume.trim() || !job.trim()) {
      setError("Please paste both resume and job description.");
      return;
    }

    setBusy(true);
    setProgress(15);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, job }),
      }).catch(() => null);
      setProgress(65);

      if (!res || !res.ok) {
        setError("Could not compute Smart Match. Check server/API config.");
        return;
      }
      const data = (await res.json()) as MatchResponse;
      setResult(data);
      setProgress(100);
    } catch (e: any) {
      setError("Unexpected error computing match.");
    } finally {
      setTimeout(() => setProgress(0), 400);
      setBusy(false);
    }
  }, [resume, job]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header (global Navbar will appear if your _app includes it) */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-extrabold text-indigo-700">
            PivotAI
          </a>
          <nav className="hidden sm:flex gap-6 text-gray-700">
            <a href="/features" className="hover:text-indigo-700">
              Features
            </a>
            <a href="/dashboard" className="hover:text-indigo-700">
              Dashboard
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Job Match</h1>
        <p className="text-gray-600 mt-1">
          Compare your resume against a job description using keyword overlap and AI embeddings.
        </p>

        {/* Inputs */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
              <Dropzone
    sublabel="Upload your resume; you can edit the extracted text below."
    onText={(t) => setResume(t)}
  />
            <textarea
              className="mt-2 w-full border border-gray-300 rounded-xl p-3 text-gray-800 min-h-60"
              placeholder="Paste resume text here…"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
            <textarea
              className="mt-2 w-full border border-gray-300 rounded-xl p-3 text-gray-800 min-h-60"
              placeholder="Paste job description here…"
              value={job}
              onChange={(e) => setJob(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={runSmartMatch}
            disabled={busy || !resume.trim() || !job.trim()}
            className={
              "px-5 py-2.5 rounded-xl font-semibold transition " +
              (busy || !resume.trim() || !job.trim()
                ? "bg-gray-200 text-gray-500"
                : "bg-indigo-600 text-white hover:bg-indigo-700")
            }
          >
            {busy ? "Computing…" : "Compute Smart Match (AI)"}
          </button>
          <div className="flex-1">
            <ProgressBar percent={progress} />
          </div>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Quick Match (local) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Quick Match (Keywords)</h3>
            <p className="text-sm text-gray-600">
              Fast approximation based on token overlap. Use Smart Match for a semantic score.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="w-48">
                <ProgressBar percent={quickMatchLocal} />
              </div>
              <span className="text-2xl font-extrabold text-indigo-700">
                {quickMatchLocal}%
              </span>
            </div>
          </div>

          {/* Smart Match (AI) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Smart Match (AI Embeddings)</h3>
            <p className="text-sm text-gray-600">
              Uses OpenAI <code className="text-xs">text-embedding-3-small</code> with cosine similarity.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="w-48">
                <ProgressBar percent={result?.match ?? 0} />
              </div>
              <span className="text-2xl font-extrabold text-indigo-700">
                {result ? `${result.match}%` : "—"}
              </span>
            </div>
            {result && (
              <p className="text-xs text-gray-500 mt-2">
                Model: {result.model} • Method: {result.method}
              </p>
            )}
          </div>
        </div>
        {/* Explain button */}
<div className="mt-4 flex items-center gap-3">
  <button
    onClick={runExplain}
    disabled={explaining || !result}
    className={
      "px-3 py-1.5 rounded-lg text-sm font-semibold transition " +
      (explaining || !result
        ? "bg-gray-200 text-gray-500"
        : "bg-indigo-600 text-white hover:bg-indigo-700")
    }
  >
    {explaining ? "Generating…" : "Explain this score"}
  </button>
  {explainError && (
    <span className="text-sm text-rose-600">{explainError}</span>
  )}
</div>

{/* Explanation output */}
{explanation && (
  <div className="mt-4 bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-xl p-4 text-sm leading-6">
    <div className="font-semibold mb-1">Why you got this score</div>
    <div className="[&_ul]:list-disc [&_ul]:pl-5 whitespace-pre-wrap">
      {explanation}
    </div>
  </div>
)}


        {/* Explainability */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <TokenList
              title="Overlapping terms (based on job description)"
              tokens={result?.overlap ?? []}
              tone="pos"
            />
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <TokenList
              title="Missing terms (consider adding or demonstrating)"
              tokens={result?.missing ?? []}
              tone="neg"
            />
          </div>
        </div>
        {/* Resume Improvement AI */}
<div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-bold text-gray-900">Improve My Resume (AI)</h3>
    <button
      onClick={runRewrite}
      disabled={rewriteBusy || !result}
      className={
        "px-3 py-1.5 rounded-lg text-sm font-semibold transition " +
        (rewriteBusy || !result
          ? "bg-gray-200 text-gray-500"
          : "bg-indigo-600 text-white hover:bg-indigo-700")
      }
    >
      {rewriteBusy ? "Generating…" : "Rewrite Top 3–4 Bullets"}
    </button>
  </div>

  {rewriteError && (
    <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-sm">
      {rewriteError}
    </div>
  )}

  {rewrittenBullets && (
    <div className="mt-4">
      <ul className="space-y-2 text-gray-800">
        {rewrittenBullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="select-none">•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={copyBullets}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 text-sm font-semibold"
        >
          {copied ? "Copied!" : "Copy bullets"}
        </button>
        <p className="text-xs text-gray-500">
          Tip: Replace weaker bullets in your resume with these (only if truthful).
        </p>
      </div>
    </div>
  )}
</div>


        {/* Error */}
        {error && (
          <div className="mt-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-10 flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
          <div>
            <h4 className="text-lg font-bold text-indigo-900">Tip</h4>
            <p className="text-indigo-900/80 text-sm">
              Try computing Smart Match with several tailored resume versions to see which one aligns best with the JD.
            </p>
          </div>
          <a
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Back to Dashboard
          </a>
        </div>
      </main>
    </div>
  );
}
