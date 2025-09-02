// src/pages/index.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center text-center px-6 sm:px-12">
      <section className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          PivotAI <span className="text-indigo-600">— Future-Proof Your Career</span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-600">
          AI is changing everything. PivotAI helps you stay ahead by analyzing your resume,
          identifying automation risks, and showing you secure career paths.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
          >
            Get Started
          </Link>
          <Link
            href="/features"
            className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-lg transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </section>
    </div>
  );
}
