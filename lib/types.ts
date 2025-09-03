// ──────────────────────────────────────────────────────────────────────────────


export type Strength = { label: string; evidence?: string };
export type ValueTag = string;
export type ThemeTag = string;


export type NarrativeInsights = {
strengths: Strength[];
values: ValueTag[];
themes: ThemeTag[];
limitingBeliefs: string[];
summary: string;
};


export type Skill = { id: string; name: string; category?: string };
export type Role = { id: string; title: string; family?: string; seniority?: string };


export type Opportunity = {
id: string;
role: Role;
score: number; // 0..1
fit: number; // 0..1
demand: number; // 0..1
income: number; // normalized 0..1
volatility: number; // 0..1 (lower is better)
timeToPivotWeeks: number;
rationale: string[]; // bullet points
gaps: { skill: string; effortHours: number }[];
};


export type TaskType = "learn" | "build" | "network" | "brand" | "apply";
export type Task = {
id: string;
type: TaskType;
title: string;
detail?: string;
effortHours?: number;
dueDate?: string; // ISO
status: "todo" | "doing" | "done";
};


export type Roadmap = {
id: string;
title: string;
sprintWeeks: number;
tasks: Task[];
};


export type JournalEntry = { id: string; content: string; createdAt: string };


export type UserProfile = {
id: string;
name: string;
hoursPerWeek: number;
insights?: NarrativeInsights;
skills: Skill[];
};