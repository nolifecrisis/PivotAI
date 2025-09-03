

"use client";
import { useApp } from "../../lib/store";
import { useState } from "react";


export default function CoachPage() {
const { profile, resequenceForWeek } = useApp();
const [hours, setHours] = useState(profile.hoursPerWeek);
const [messages, setMessages] = useState<{role:"coach"|"you"; content:string}[]>([
{ role:"coach", content: "It’s a new week. 1) One win 2) Blocker 3) Realistic hours 4) Energy level." }
]);


const send = async (content:string) => {
setMessages(m => [...m, { role:"you", content }]);
// naive reactions
if (/\bhour|hrs?\b/i.test(content)) {
await resequenceForWeek(hours);
setMessages(m => [...m, { role:"coach", content: `Got it. I resequenced your plan for ~${hours}h/week. Top 3 actions are on your Roadmap.` }]);
} else if (/win|blocker|energy/i.test(content)) {
setMessages(m => [...m, { role:"coach", content: "Thanks. I’ll keep that in mind for this week’s focus." }]);
} else {
setMessages(m => [...m, { role:"coach", content: "Understood. Want me to adjust your plan based on hours?" }]);
}
};


return (
<div className="max-w-2xl">
<h1 className="text-2xl font-semibold mb-3">Coach</h1>
<div className="text-sm text-zinc-600 mb-4">Hours/week:
<input type="number" value={hours} onChange={e=>setHours(parseInt(e.target.value||"0"))} className="border rounded-md ml-2 px-2 py-1 w-24" />
<button onClick={()=>resequenced(hours=>hours)} className="hidden" />
</div>
<div className="bg-white border rounded-2xl p-4 shadow-sm min-h-[320px] flex flex-col gap-2">
{messages.map((m,i)=>(
<div key={i} className={`text-sm ${m.role==="coach"?"text-zinc-800":"text-zinc-700 ml-6"}`}>
<span className="text-xs uppercase tracking-wide mr-2 text-zinc-400">{m.role}</span>{m.content}
</div>
))}
</div>
<ChatInput onSend={send} />
</div>
);
}


function ChatInput({ onSend }:{ onSend:(s:string)=>void }){
const [v,setV] = useState("");
return (
<div className="flex gap-2 mt-3">
<input value={v} onChange={e=>setV(e.target.value)} placeholder="Type a message…" className="flex-1 border rounded-lg px-3 py-2" />
<button onClick={()=>{ if(v.trim()){ onSend(v.trim()); setV(""); } }} className="px-4 py-2 bg-zinc-900 text-white rounded-lg">Send</button>
</div>
);
}