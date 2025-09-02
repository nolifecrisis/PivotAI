import React from "react";
import { Brain, Briefcase, Compass } from "lucide-react";

const features = [
  {
    icon: <Brain className="h-8 w-8 text-indigo-600" />,
    title: "AI-Powered Insights",
    description: "We analyze your skills and match them with emerging career paths instantly.",
  },
  {
    icon: <Briefcase className="h-8 w-8 text-indigo-600" />,
    title: "Personalized Roadmaps",
    description: "Get a step-by-step action plan to transition into your next role.",
  },
  {
    icon: <Compass className="h-8 w-8 text-indigo-600" />,
    title: "Live Job Market Data",
    description: "Stay ahead with real-time demand analysis across industries.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Why Choose PivotAI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-8 bg-white shadow-lg rounded-2xl hover:shadow-xl transition"
            >
              {f.icon}
              <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
