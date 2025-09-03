// ──────────────────────────────────────────────────────────────────────────────
// 5) components/OpportunityCard.tsx — card w/ rationale
// ──────────────────────────────────────────────────────────────────────────────


import type { Opportunity } from "../lib/types";
import { ScoreBadge } from "./ScoreBadge";


export function OpportunityCard({ opp, onSelect }: { opp: Opportunity; onSelect?: (id: string) => void }) {
return (
<div className="bg-white border rounded-2xl p-4 shadow-sm flex flex-col gap-3">
<div className="flex items-center justify-between">
<div>
<div className="text-sm text-zinc-500">Suggested pivot</div>
<div className="text-lg font-semibold">{opp.role.title}</div>
</div>
<div className="flex gap-2">
<ScoreBadge label="Score" value={opp.score} />
<ScoreBadge label="Fit" value={opp.fit} />
<ScoreBadge label="Demand" value={opp.demand} />
<ScoreBadge label="Income" value={opp.income} />
</div>
</div>
<ul className="list-disc pl-6 text-sm text-zinc-700">
{opp.rationale.map((r, i) => (
<li key={i}>{r}</li>
))}
</ul>
<div className="text-xs text-zinc-500">Time to pivot: {opp.timeToPivotWeeks} weeks</div>
<div className="flex flex-wrap gap-2">
{opp.gaps.map((g, i) => (
<span key={i} className="text-xs bg-zinc-100 rounded-full px-2 py-1">Gap: {g.skill} · {g.effortHours}h</span>
))}
</div>
{onSelect && (
<button onClick={() => onSelect(opp.id)} className="self-start mt-2 text-sm bg-zinc-900 text-white px-3 py-2 rounded-lg hover:opacity-90">Build roadmap</button>
)}
</div>
);
}