"use client";
import { useApp } from "../../lib/store";
import { SprintBoard } from "../../components/SprintBoard";
import { useMemo, useState } from "react";


export default function RoadmapPage() {
const { roadmap, setTaskStatus } = useApp();
const [filter, setFilter] = useState<string>("all");
const tasks = useMemo(() => {
if (!roadmap) return [];
return roadmap.tasks.filter(t => filter === "all" ? true : t.type === filter);
}, [roadmap, filter]);


if (!roadmap) {
return (
<div>
<h1 className="text-2xl font-semibold">Roadmap</h1>
<p className="mt-2 text-sm text-zinc-600">No roadmap yet. Go to Opportunities → "Build roadmap" to generate one.</p>
</div>
);
}


return (
<div className="flex flex-col gap-4">
<div className="flex items-center justify-between">
<div>
<h1 className="text-2xl font-semibold">{roadmap.title}</h1>
<div className="text-sm text-zinc-600">Sprint: {roadmap.sprintWeeks} weeks</div>
</div>
<div className="flex gap-2">
{(["all","learn","build","network","brand","apply"]).map(k => (
<button key={k} onClick={() => setFilter(k)} className={`text-xs px-2 py-1 border rounded-lg ${filter===k?"bg-zinc-900 text-white":""}`}>{k}</button>
))}
</div>
</div>
<SprintBoard tasks={tasks} onStatus={setTaskStatus} />
</div>
);
}