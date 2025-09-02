import React from "react";
import { Briefcase, Brain, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button"; // Keep your current button import path

const Features: React.FC = () => {
  const features = [
    {
      title: "AI Resume Analysis",
      description:
        "Upload your resume and let PivotAI instantly evaluate your automation risk, identify outdated skills, and show you where you stand.",
      icon: <Brain className="w-10 h-10 text-indigo-500" />,
    },
    {
      title: "Career Pivot Suggestions",
      description:
        "Based on your background, PivotAI suggests AI-resilient roles and industries with the highest growth potential.",
      icon: <TrendingUp className="w-10 h-10 text-purple-500" />,
    },
    {
      title: "Skill Gap Insights",
      description:
        "We show you exactly which in-demand skills to learn next to stay ahead of automation and keep your career future-proof.",
      icon: <Briefcase className="w-10 h-10 text-pink-500" />,
    },
  ];

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 py-20 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Why Choose PivotAI?
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-indigo-100">
          The job market is changing fast. PivotAI helps you stay ahead by using
          cutting-edge AI insights to secure your future.
        </p>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
          >
            <div className="mb-6 flex justify-center">{feature.icon}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
              {feature.title}
            </h2>
            <p className="text-gray-600 text-center leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      {/* CTA Banner */}
      <section className="bg-indigo-600 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Future-Proof Your Career?
        </h2>
        <Button className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-4 rounded-xl shadow-lg transition text-lg font-semibold">
          Analyze My Resume Now
        </Button>
      </section>
    </main>
  );
};

export default Features;
