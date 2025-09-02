export default function ResultsDashboard({ results }: { results: any }) {
  if (!results) return null;

  return (
    <div className="bg-white p-8 rounded-xl shadow-md mt-8 border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        Analysis Results
      </h2>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-gray-900">Extracted Skills</h3>
        <ul className="list-disc list-inside text-gray-700">
          {results.skills?.map((skill: string, idx: number) => (
            <li key={idx}>{skill}</li>
          ))}
        </ul>
      </div>

      {/* Job Matches */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-gray-900">Top Job Matches</h3>
        <ul className="list-disc list-inside text-gray-700">
          {results.jobs?.map((job: string, idx: number) => (
            <li key={idx}>{job}</li>
          ))}
        </ul>
      </div>

      {/* Skill Gaps */}
      {results.skillGaps && results.skillGaps.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg text-gray-900">Skill Gaps</h3>
          <ul className="list-disc list-inside text-gray-700">
            {results.skillGaps.map((gap: any, idx: number) => (
              <li key={idx}>
                {gap.skill} —{" "}
                <span className="italic text-sm text-gray-600">
                  {gap.importance} priority
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-gray-900">
          Career Recommendations
        </h3>
        <ul className="list-disc list-inside text-gray-700">
          {results.recommendations?.map((rec: string, idx: number) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* Confidence */}
      <div className="mt-6">
        <p className="text-gray-800">
          <strong>Confidence Score:</strong>{" "}
          <span className="text-indigo-600 font-semibold">
            {results.confidenceScore}%
          </span>
        </p>
      </div>
    </div>
  );
}
