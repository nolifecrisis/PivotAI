import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 text-white py-24 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white mb-6">
          PivotAI: Future-Proof Your Career
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-2xl mb-10 text-indigo-100 leading-relaxed">
          Use AI-powered insights to understand your automation risk, learn which
          skills are becoming obsolete, and pivot to secure, high-value career
          paths — instantly.
        </p>

        {/* Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Button
            className="bg-white text-indigo-700 hover:bg-gray-100 px-10 py-5 rounded-xl shadow-lg transition text-lg font-bold"
          >
            Analyze My Resume
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <a href="/dashboard">
            <Button className="bg-indigo-500 text-white hover:bg-indigo-400 px-10 py-5 rounded-xl shadow-lg transition text-lg font-bold">
              View My Dashboard
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
