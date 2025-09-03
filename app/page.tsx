"use client";
import { useApp } from "../lib/store";
import Link from "next/link";


export default function Home() {
const { profile, opportunities, rankOpportunities } = useApp();
return (
<div className="flex flex-col gap-6">
<section className="bg-white border rounded-2xl p-6 shadow-sm">
<div className="text-sm text-zinc-500">Personal Pivot Profile</div>
<h1 className="text-2xl font-semibold mt-1">Hi {profile.name} — weekly focus</h1>
<p className="text-zinc-700 mt-2">{profile.insights?.summary}</p>
<div className="mt-3 text-sm text-zinc-600">Values: {profile.insights?.values.join(", ")}</div>
</section>


<section className="bg-white border rounded-2xl p-6 shadow-sm">
<div className="flex items-center justify-between">
<h2 className="text-lg font-semibold">Top Opportunities</h2>
<button onClick={rankOpportunities} className="text-sm bg-zinc-900 text-white px-3 py-2 rounded-lg">Refresh</button>
</div>
<div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
{opportunities.slice(0,3).map(opp => (
<div key={opp.id} className="border rounded-2xl p-4">
<div className="text-sm text-zinc-500">Role</div>
<div className="font-medium">{opp.role.title}</div>
<div className="text-xs text-zinc-500 mt-2">Score {(opp.score*100).toFixed(0)}%</div>
</div>
))}
{opportunities.length === 0 && (
<div className="text-sm text-zinc-600">No opportunities yet — click Refresh above.</div>
)}
</div>
<div className="mt-4">
<Link href="/opportunities" className="text-sm underline">Explore all opportunities →</Link>
</div>
</section>


<section className="bg-white border rounded-2xl p-6 shadow-sm">
<h2 className="text-lg font-semibold">This Week</h2>
<p className="text-sm text-zinc-600">Hours available: {profile.hoursPerWeek}/week · Head to the Roadmap tab to plan.</p>
</section>
</div>
);
}