// ──────────────────────────────────────────────────────────────────────────────
// 3) lib/store.ts — Zustand app state w/ mock services
// ──────────────────────────────────────────────────────────────────────────────


import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { formatISO } from "date-fns";
import type { UserProfile, JournalEntry, Opportunity, Roadmap, Task, TaskType } from "./types";


// Mock AI services (replace with real API later)
const mockRankOpportunities = async (profile: UserProfile): Promise<Opportunity[]> => {
const base: Opportunity[] = [
{
id: uuid(),
role: { id: uuid(), title: "AI Product Manager" },
score: 0.78,
fit: 0.74,
demand: 0.68,
income: 0.82,
volatility: 0.22,
timeToPivotWeeks: 12,
rationale: [
"Strong systems thinking from solutions architecture",
"High demand for PMs who can ship LLM features",
"Portfolio gap: experiment design + metrics"
],
gaps: [
{ skill: "Prompt engineering patterns", effortHours: 12 },
{ skill: "Experiment design", effortHours: 16 },
],
},
{
id: uuid(),
role: { id: uuid(), title: "Developer Relations (AI)" },
score: 0.74,
fit: 0.79,
demand: 0.55,
income: 0.62,
volatility: 0.28,
timeToPivotWeeks: 10,
rationale: ["Charisma + writing/music → content advantage", "Leverage demos + tutorials"],
gaps: [ { skill: "Content cadence systems", effortHours: 10 } ],
},
{
id: uuid(),
role: { id: uuid(), title: "AI Solutions Architect" },
score: 0.72,
fit: 0.88,
demand: 0.60,
income: 0.78,
volatility: 0.30,
timeToPivotWeeks: 6,
rationale: ["Near-line fit with current strengths", "Add 1–2 portfolio artifacts"],
gaps: [ { skill: "Retrieval patterns", effortHours: 8 } ],
},
];
await new Promise(r => setTimeout(r, 300));
return base;
};
const mockGenerateRoadmap = async (opp: Opportunity, hoursPerWeek: number): Promise<Roadmap> => {
let total = 0;
const tasks = baseTasks.filter(t => (total += (t.effortHours ?? 2)) <= hoursPerWeek + 2);
await new Promise(r => setTimeout(r, 250));
return { id, title: `${opp.role.title} — Sprint 1`, sprintWeeks: 2, tasks };
};


// Zustand store


type AppState = {
profile: UserProfile;
journals: JournalEntry[];
opportunities: Opportunity[];
roadmap?: Roadmap;
// actions
addJournal: (content: string) => void;
rankOpportunities: () => Promise<void>;
generateRoadmap: (oppId: string) => Promise<void>;
setTaskStatus: (taskId: string, status: Task["status"]) => void;
resequenceForWeek: (hours: number) => Promise<void>;
};


export const useApp = create<AppState>((set, get) => ({
profile: {
id: uuid(),
name: "You",
hoursPerWeek: 8,
skills: [
{ id: uuid(), name: "Solutions Architecture" },
{ id: uuid(), name: "Systems Thinking" },
{ id: uuid(), name: "Writing" },
],
insights: {
strengths: [ { label: "Systems thinking" }, { label: "Cross-functional comms" } ],
values: ["autonomy", "craft", "impact"],
themes: ["builder", "teacher"],
limitingBeliefs: ["I must be perfect before publishing"],
summary: "Experienced architect with strong teaching instinct; pivoting toward AI product roles.",
},
},
journals: [
{ id: uuid(), content: "Reflected on career shift and excitement around AI PM.", createdAt: formatISO(new Date()) },
],
opportunities: [],
roadmap: undefined,


addJournal: (content: string) => set(state => ({
journals: [{ id: uuid(), content, createdAt: formatISO(new Date()) }, ...state.journals]
})),


rankOpportunities: async () => {
const { profile } = get();
const results = await mockRankOpportunities(profile);
set({ opportunities: results });
},


generateRoadmap: async (oppId: string) => {
const { opportunities, profile } = get();
const opp = opportunities.find(o => o.id === oppId);
if (!opp) return;
const roadmap = await mockGenerateRoadmap(opp, profile.hoursPerWeek);
set({ roadmap });
},


setTaskStatus: (taskId, status) => set(state => ({
roadmap: state.roadmap ? { ...state.roadmap, tasks: state.roadmap.tasks.map(t => t.id === taskId ? { ...t, status } : t) } : undefined
})),


resequenceForWeek: async (hours: number) => {
// Simulate coach re-sequencing by regenerating roadmap using current top opp
const { opportunities } = get();
const top = opportunities[0];
if (!top) return;
const roadmap = await mockGenerateRoadmap(top, hours);
set(state => ({ profile: { ...state.profile, hoursPerWeek: hours }, roadmap }));
},
}));