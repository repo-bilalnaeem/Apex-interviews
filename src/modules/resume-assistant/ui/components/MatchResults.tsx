import React from 'react';

export interface MatchResult {
  summary: string;
  reasoning: string;
  fileName?: string;
}

interface MatchResultsProps {
  best: MatchResult[];
  average: MatchResult[];
  different: MatchResult[];
}

const Section: React.FC<{ title: string; icon: string; results: MatchResult[]; color: string }> = ({ title, icon, results, color }) => (
  <div className={`bg-${color}-50 rounded p-4 mb-6 shadow`}>
    <h2 className={`text-xl font-bold mb-2 flex items-center`}>
      <span className="mr-2">{icon}</span> {title} ({results.length})
    </h2>
    {results.length === 0 ? (
      <p className="text-gray-500">No candidates in this category.</p>
    ) : (
      <ul className="space-y-4">
        {results.map((r, i) => (
          <li key={i} className="bg-white border rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">
                {r.fileName || `CV ${i + 1}`}
              </h3>
              <div className="text-sm text-gray-500 italic">{r.reasoning}</div>
            </div>
            <div className="text-gray-700 text-sm line-clamp-3">
              {r.summary.length > 200 ? `${r.summary.substring(0, 200)}...` : r.summary}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const MatchResults: React.FC<MatchResultsProps> = ({ best, average, different }) => (
  <div className="mt-8 grid md:grid-cols-3 gap-6">
    <Section title="Best Suited" icon="✅" results={best} color="green" />
    <Section title="Average Fit" icon="⚖️" results={average} color="yellow" />
    <Section title="Different Domain" icon="❌" results={different} color="red" />
  </div>
);

export default MatchResults;
