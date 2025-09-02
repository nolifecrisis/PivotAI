// components/AnalyzerForm.tsx
import React, { useState } from "react";
import { Button } from "./ui/button";

export default function AnalyzerForm() {
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
      });
      const data = await res.json();
      setResult(data.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg border">
      <h2 className="text-2xl font-semibold mb-4">Upload Your Resume</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-4 border rounded-xl focus:ring focus:ring-indigo-400"
          rows={6}
          placeholder="Paste your resume here..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full py-4">
          {loading ? "Analyzing..." : "Analyze My Resume"}
        </Button>
      </form>

      {result && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-2">Your Analysis:</h3>
          <p className="text-gray-700 whitespace-pre-line">{result}</p>
        </div>
      )}
    </section>
  );
}
