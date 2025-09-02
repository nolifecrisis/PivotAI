import React from "react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-20">
      <h2 className="text-4xl font-bold mb-4">AI-Powered Career Intelligence</h2>
      <p className="text-lg mb-6">
        PivotAI helps you analyze your resume, job postings, and skill gaps instantly.
      </p>
      <a
        href="#analyzer"
        className="bg-white text-indigo-600 px-6 py-3 rounded-full shadow hover:bg-gray-100"
      >
        Try It Now
      </a>
    </section>
  );
}
