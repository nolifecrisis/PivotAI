// ──────────────────────────────────────────────────────────────────────────────
// 6) components/SprintBoard.tsx — simple kanban
// ──────────────────────────────────────────────────────────────────────────────


import type { Task } from "../lib/types";


export function SprintBoard({ tasks, onStatus }: { tasks: Task[]; onStatus: (id: string, status: Task["status"]) => void }) {
const cols: Task["status"][] = ["todo", "doing", "done"];
return (
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
{cols.map(col => (
<div key={col} className="bg-white border rounded-2xl p-3 shadow-sm min-h-[280px]">
<div className="font-medium capitalize mb-2">{col}</div>
<div className="flex flex-col gap-2">
{tasks.filter(t => t.status === col).map(t => (
<div key={t.id} className="border rounded-xl p-3 bg-zinc-50">
<div className="text-sm font-medium">{t.title}</div>
<div className="text-xs text-zinc-600">{t.type} · {t.effortHours ?? 2}h</div>
<div className="flex gap-2 mt-2">
{col !== "todo" && <button className="text-xs px-2 py-1 border rounded-lg" onClick={() => onStatus(t.id, "todo")}>To‑do</button>}
{col !== "doing" && <button className="text-xs px-2 py-1 border rounded-lg" onClick={() => onStatus(t.id, "doing")}>Doing</button>}
{col !== "done" && <button className="text-xs px-2 py-1 border rounded-lg" onClick={() => onStatus(t.id, "done")}>Done</button>}
</div>
</div>
))}
</div>
</div>
))}
</div>
);
}