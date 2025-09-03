// ──────────────────────────────────────────────────────────────────────────────
// 4) components/ScoreBadge.tsx — tiny visual for scores
// ──────────────────────────────────────────────────────────────────────────────


export function ScoreBadge({ label, value }: { label: string; value: number }) {
const pct = Math.round(value * 100);
return (
<div className="text-xs bg-white border rounded-xl px-2 py-1 flex items-center gap-1 shadow-sm">
<span className="font-medium">{label}</span>
<span className="tabular-nums">{pct}%</span>
</div>
);
}