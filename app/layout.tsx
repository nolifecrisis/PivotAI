// ──────────────────────────────────────────────────────────────────────────────
// 1) app/layout.tsx — shell w/ nav
// ──────────────────────────────────────────────────────────────────────────────


export const metadata = { title: "PivotAI" } as const


import Link from "next/link";
import "./globals.css";


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body className="min-h-screen bg-zinc-50 text-zinc-900">
<div className="max-w-6xl mx-auto px-4">
<header className="py-6 flex items-center justify-between">
<Link href="/" className="font-semibold text-xl">PivotAI</Link>
<nav className="flex gap-4 text-sm">
<Link href="/opportunities" className="hover:underline">Opportunities</Link>
<Link href="/roadmap" className="hover:underline">Roadmap</Link>
<Link href="/coach" className="hover:underline">Coach</Link>
<Link href="/journal" className="hover:underline">Journal</Link>
</nav>
</header>
<main className="pb-24">{children}</main>
</div>
</body>
</html>
);
}