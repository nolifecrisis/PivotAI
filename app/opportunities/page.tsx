// ──────────────────────────────────────────────────────────────────────────────
// 8) app/opportunities/page.tsx — Explorer
// ──────────────────────────────────────────────────────────────────────────────


"use client";
import { useApp } from "../../lib/store";
import { useEffect } from "react";
import { OpportunityCard } from "../../components/OpportunityCard";


export default function OpportunitiesPage() {
const { opportunities, rankOpportunities, generateRoadmap } = useApp();
useEffect(() => { if (opportunities.length === 0) { void rankOpportunities(); } }, []);
return (
<div className="flex flex-col gap-4">
<h1 className="text-2xl font-semibold">Opportunities</h1>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{opportunities.map(opp => (
<OpportunityCard key={opp.id} opp={opp} onSelect={(id) => generateRoadmap(id)} />
))}
</div>
</div>
);
}