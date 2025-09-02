import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2,
  UploadCloud,
  BrainCircuit,
  FileText,
  BookOpenCheck,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Loader2,
  Target,
  Sparkles,
  ShieldCheck,
  Settings,
  BarChart3,
  ChevronRight,
  ArrowRight,
  Mail
} from "lucide-react";

// shadcn/ui components (available in canvas runtime)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/**
 * PivotAI MVP – Interactive Mockup
 * Single-file React component.
 * - Landing hero → Onboarding (paste resume/LinkedIn) → Analysis → Results
 * - Results include: Automation Risk, Skill Gaps, Pivot Paths, 90‑Day Plan
 * - Pricing CTA + Email capture (non-functional stub)
 *
 * Notes:
 * - All data is mocked locally. "Run Analysis" simulates a backend call.
 * - Tailwind classes target a clean, modern aesthetic (teal/navy/stone).
 */

const brand = {
  name: "PivotAI",
  primary: "#0ea5e9", // sky-500
  dark: "#111827", // gray-900
  accent: "#06b6d4", // cyan-500
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
      <Sparkles className="h-3 w-3" /> {children}
    </span>
  );
}

const sampleResume = `Senior Solutions Architect with 12+ years in web platforms, APIs, and team leadership. Led migration to microservices, designed data pipelines, and mentored dev teams. Skills: Node.js, Python, SQL, AWS, GCP, product strategy, stakeholder management.`;

type View = "home" | "onboard" | "analyzing" | "results";

export default function PivotAI_Mock() {
  const [view, setView] = useState<View>("home");
  const [resume, setResume] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [includeJobs, setIncludeJobs] = useState<boolean>(true);
  const [result, setResult] = useState<any>(null);

  const runAnalysis = async () => {
    setView("analyzing");
    // Simulate latency and AI processing
    await new Promise((r) => setTimeout(r, 1400));

    // Very lightweight mock logic derived from resume text length
    const seniority = resume.length > 300 ? "Senior" : resume.includes("Architect") ? "Staff" : "Mid";
    const automationRisk = Math.max(6, 42 - Math.min(30, Math.floor(resume.length / 20))); // 6–42%

    const skills = [
      { name: "System Design", level: 88 },
      { name: "Leadership", level: 84 },
      { name: "AI Tooling", level: 62 },
      { name: "Data Engineering", level: 71 },
      { name: "Go-To-Market", level: 55 },
    ];

    const gaps = [
      { name: "AI Product Strategy", delta: 28 },
      { name: "LLM Eval/Guardrails", delta: 22 },
      { name: "Business Storytelling", delta: 18 },
    ];

    const pivots = [
      {
        title: "AI Product Manager",
        salary: "$165k–$220k",
        fit: 90,
        reasons:
          ["Deep system design + stakeholder comms", "Can translate tech into outcomes", "Leadership experience"],
        steps: [
          "Ship 1 internal AI assistant MVP",
          "Create KPI framework & success metrics",
          "Publish 2 case studies on impact",
        ],
      },
      {
        title: "Platform Architect (AI/ML)",
        salary: "$175k–$240k",
        fit: 86,
        reasons: ["Architecture background", "Cloud & data pipelines", "Team mentorship"],
        steps: [
          "Design LLM gateway with evals",
          "Introduce vector DB + retrieval patterns",
          "Create cost/perf dashboards",
        ],
      },
      {
        title: "Technical Program Manager (AI)",
        salary: "$150k–$200k",
        fit: 81,
        reasons: ["Cross‑functional leadership", "Roadmapping", "Delivery"],
        steps: [
          "Define AI rollout roadmap",
          "Establish governance & risk reviews",
          "Ship v1 to one BU, scale to three",
        ],
      },
    ];

    const plan = [
      {
        phase: "Weeks 1–2",
        focus: "Foundations & Assessment",
        tasks: [
          "Complete AI Product Basics (3h) & LLM Fundamentals (6h)",
          "Draft pivot thesis & target roles",
          "Rewrite LinkedIn headline + About with impact metrics",
        ],
        deliverable: "Public pivot brief + updated LinkedIn",
      },
      {
        phase: "Weeks 3–6",
        focus: "Portfolio & Projects",
        tasks: [
          "Build 1 case‑study worthy AI MVP (guardrailed chatbot or retrieval app)",
          "Implement evaluation harness + analytics dashboard",
          "Write a 1,200‑word post on outcomes (latency, cost, CX)",
        ],
        deliverable: "Live demo + write‑up",
      },
      {
        phase: "Weeks 7–9",
        focus: "Market Signal & Outreach",
        tasks: [
          "Curate 25 target companies + warm intros",
          "Publish 2 LinkedIn posts/week on lessons learned",
          "Run 10 informational interviews",
        ],
        deliverable: "Interview pipeline & referrals",
      },
      {
        phase: "Weeks 10–12",
        focus: "Interview Readiness",
        tasks: [
          "AI PM case drills (PRD, metrics, tradeoffs)",
          "Architecture deep dives (RAG patterns, evals)",
          "Mock interviews + salary strategy",
        ],
        deliverable: "Offer negotiation plan",
      },
    ];

    const jobs = includeJobs
      ? [
          {
            title: "AI Product Manager – Platform",
            company: "Atlas Systems",
            location: "Remote (US)",
            est: "$180k base + equity",
          },
          {
            title: "Principal Architect – GenAI",
            company: "Nimbus Data",
            location: "San Francisco, CA",
            est: "$210k base + bonus",
          },
          {
            title: "TPM – AI Integrations",
            company: "BrightFlow",
            location: "Remote",
            est: "$160k base + bonus",
          },
        ]
      : [];

    setResult({ seniority, automationRisk, skills, gaps, pivots, plan, jobs });
    setView("results");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <span className="font-semibold tracking-tight">{brand.name}</span>
            <Pill>Career Reinvention</Pill>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a className="text-sm text-slate-600 hover:text-slate-900" href="#how">How it works</a>
            <a className="text-sm text-slate-600 hover:text-slate-900" href="#features">Features</a>
            <a className="text-sm text-slate-600 hover:text-slate-900" href="#pricing">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">Log in</Button>
            <Button size="sm" onClick={() => setView("onboard")}>Get started</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.section
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="grid gap-8 py-12 md:grid-cols-2 md:py-20"
            >
              <div className="flex flex-col gap-6">
                <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                  Transform your career in the <span className="text-sky-600">AI age</span>
                </h1>
                <p className="text-lg text-slate-600">
                  PivotAI analyzes your experience, highlights automation risk, and crafts a
                  personalized 90‑day roadmap to your next role — with courses, projects,
                  and intro scripts you can use today.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="lg" onClick={() => setView("onboard")}>Create my roadmap</Button>
                  <Button variant="outline" size="lg" onClick={() => setView("onboard")}>Try free scan</Button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600 md:grid-cols-4">
                  {[
                    { icon: ShieldCheck, label: "Risk scan" },
                    { icon: Target, label: "Pivot paths" },
                    { icon: BookOpenCheck, label: "Upskilling plan" },
                    { icon: BarChart3, label: "Market signals" },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
                      <f.icon className="h-4 w-4 text-sky-600" />
                      <span>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="border-sky-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Wand2 className="h-4 w-4 text-sky-600" /> Instant Preview
                  </CardTitle>
                  <Badge variant="outline">MVP</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Label htmlFor="resume">Paste a few lines of your resume</Label>
                  <Textarea id="resume" rows={6} placeholder={sampleResume} value={resume} onChange={(e)=>setResume(e.target.value)} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch id="jobs" checked={includeJobs} onCheckedChange={setIncludeJobs} />
                      <Label htmlFor="jobs">Suggest live roles</Label>
                    </div>
                    <Button onClick={() => setView("onboard")}>Continue</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {view === "onboard" && (
            <motion.section
              key="onboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="py-12 md:py-16"
            >
              <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-center gap-2 text-sm text-slate-600">
                  <span className="rounded bg-slate-100 px-2 py-1">1</span> Paste resume
                  <ChevronRight className="h-4 w-4" />
                  <span className="rounded bg-slate-100 px-2 py-1">2</span> Configure
                  <ChevronRight className="h-4 w-4" />
                  <span className="rounded bg-slate-100 px-2 py-1">3</span> Results
                </div>
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UploadCloud className="h-5 w-5 text-sky-600" /> Your Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea rows={8} placeholder={sampleResume} value={resume} onChange={(e)=>setResume(e.target.value)} />
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Target roles</Label>
                        <Input placeholder="e.g., AI Product Manager, Platform Architect" />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <Switch id="jobs2" checked={includeJobs} onCheckedChange={setIncludeJobs} />
                          <Label htmlFor="jobs2">Include job suggestions</Label>
                        </div>
                        <small className="text-slate-500">Experimental</small>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <Button variant="outline" onClick={()=>setView("home")}>Back</Button>
                      <Button onClick={runAnalysis}>
                        <Wand2 className="mr-2 h-4 w-4" /> Run Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.section>
          )}

          {view === "analyzing" && (
            <motion.section
              key="analyzing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="py-24"
            >
              <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                </div>
                <h2 className="text-2xl font-semibold">Analyzing your experience…</h2>
                <p className="text-slate-600">Mapping skills to high‑demand roles, estimating automation risk, and drafting your 90‑day plan.</p>
              </div>
            </motion.section>
          )}

          {view === "results" && result && (
            <motion.section
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="py-10 md:py-14"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-semibold">Your Pivot Report</h2>
                  <p className="text-slate-600">Profile: <strong>{result.seniority}</strong> • Automation Risk: <strong>{result.automationRisk}%</strong></p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={()=>setView("onboard")}>Edit profile</Button>
                  <Button><FileText className="mr-2 h-4 w-4"/> Export PDF</Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Left column */}
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-sky-600"/> Automation Risk & Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-slate-600">Overall Automation Risk</span>
                          <span className="font-medium">{result.automationRisk}%</span>
                        </div>
                        <Progress value={100 - result.automationRisk} />
                        <p className="mt-2 text-xs text-slate-500">Lower is better. Investing in AI product strategy and evaluation skills will further reduce risk.</p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {result.skills.map((s:any, i:number) => (
                          <div key={i} className="rounded-lg border p-3">
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span>{s.name}</span>
                              <span className="font-medium">{s.level}%</span>
                            </div>
                            <Progress value={s.level} />
                          </div>
                        ))}
                      </div>

                      <div>
                        <h4 className="mb-2 font-medium">Top Skill Gaps</h4>
                        <div className="grid gap-3 md:grid-cols-3">
                          {result.gaps.map((g:any, i:number) => (
                            <div key={i} className="rounded-lg border bg-amber-50 p-3 text-amber-900">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">{g.name}</span>
                                <Badge variant="secondary">+{g.delta}</Badge>
                              </div>
                              <p className="mt-1 text-xs opacity-80">Add 1 project & 1 course to close</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card id="paths">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Target className="h-4 w-4 text-sky-600"/> Recommended Pivot Paths</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.pivots.map((p:any, idx:number)=> (
                        <div key={idx} className="rounded-xl border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-sky-600">Fit {p.fit}%</Badge>
                              <h4 className="text-lg font-semibold">{p.title}</h4>
                            </div>
                            <div className="text-sm text-slate-600">Est. comp: <span className="font-medium">{p.salary}</span></div>
                          </div>
                          <ul className="mt-3 grid list-disc gap-1 pl-6 text-sm text-slate-700 md:grid-cols-2">
                            {p.reasons.map((r:string, i:number)=> <li key={i}>{r}</li>)}
                          </ul>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {p.steps.map((s:string, i:number)=> (
                              <span key={i} className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs"><CheckCircle2 className="h-3 w-3 text-emerald-600"/>{s}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card id="plan">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><BookOpenCheck className="h-4 w-4 text-sky-600"/> 90‑Day Upskilling Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.plan.map((ph:any, i:number)=> (
                        <div key={i} className="rounded-lg border p-4">
                          <div className="mb-1 flex items-center justify-between">
                            <h4 className="font-semibold">{ph.phase}</h4>
                            <Badge variant="outline">{ph.focus}</Badge>
                          </div>
                          <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-slate-700">
                            {ph.tasks.map((t:string, j:number)=> <li key={j}>{t}</li>)}
                          </ul>
                          <p className="mt-2 text-xs text-slate-500">Deliverable: {ph.deliverable}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-sky-600"/> Suggested Roles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.jobs.length === 0 ? (
                        <p className="text-sm text-slate-600">Role suggestions disabled. Enable during onboarding to preview matches.</p>
                      ) : (
                        result.jobs.map((j:any, i:number)=>(
                          <div key={i} className="rounded-lg border p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{j.title}</p>
                                <p className="text-sm text-slate-600">{j.company} • {j.location}</p>
                              </div>
                              <span className="text-sm">{j.est}</span>
                            </div>
                            <Button variant="outline" size="sm" className="mt-2 w-full">Open Listing</Button>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Card id="pricing">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-sky-600"/> Upgrade to Pro</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-slate-600">
                        Unlock unlimited scans, resume rewrites, and live job matching.
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-semibold">$12</span>
                        <span className="pb-1 text-sm text-slate-500">/ month</span>
                      </div>
                      <Button className="w-full">Start 7‑day trial</Button>
                      <div className="text-xs text-slate-500">Cancel anytime. No credit card required for the free scan.</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Mail className="h-4 w-4 text-sky-600"/> Get Your Report via Email</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Input placeholder="you@domain.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
                      <Button className="w-full">Send me the PDF</Button>
                      <p className="text-xs text-slate-500">We’ll email a shareable PDF of this report (stubbed in mockup).</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* How it works */}
        {view === "home" && (
          <section id="how" className="py-16">
            <h3 className="mb-8 text-center text-2xl font-semibold">How it works</h3>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: UploadCloud, title: "1. Assess", desc: "Paste your resume or link your LinkedIn to scan your skills and roles." },
                { icon: BrainCircuit, title: "2. Plan", desc: "Get personalized pivot paths and a focused 90‑day upskilling roadmap." },
                { icon: TrendingUp, title: "3. Execute", desc: "Apply with tailored assets, track market signals, and land interviews." },
              ].map((s, i)=> (
                <Card key={i} className="text-center">
                  <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50">
                      <s.icon className="h-6 w-6 text-sky-600" />
                    </div>
                    <CardTitle>{s.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{s.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-10 border-t bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a className="text-sm text-slate-600 hover:text-slate-900" href="#">Privacy</a>
            <a className="text-sm text-slate-600 hover:text-slate-900" href="#">Terms</a>
            <a className="text-sm text-slate-600 hover:text-slate-900" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
