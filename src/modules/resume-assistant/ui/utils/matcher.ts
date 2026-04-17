// matcher.ts
// Simple keyword intersection-based matching logic

import { MatchResult } from '../components/MatchResults';

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
  );
}

export function matchCVsToJD(cvs: string[], jd: string, fileNames?: string[]): {
  best: MatchResult[];
  average: MatchResult[];
  different: MatchResult[];
} {
  const jdTokens = tokenize(jd);
  const results = { best: [], average: [], different: [] } as {
    best: MatchResult[];
    average: MatchResult[];
    different: MatchResult[];
  };

  cvs.forEach((summary, index) => {
    const cvTokens = tokenize(summary);
    const intersection = new Set([...cvTokens].filter(x => jdTokens.has(x)));
    const matchScore = intersection.size / (jdTokens.size || 1);
    let category: keyof typeof results;
    let reasoning: string;
    const fileName = fileNames?.[index] || `CV ${index + 1}`;
    
    if (matchScore > 0.3) {
      category = 'best';
      reasoning = `High keyword match (${intersection.size} common keywords)`;
    } else if (matchScore > 0.15) {
      category = 'average';
      reasoning = `Moderate keyword match (${intersection.size} common keywords)`;
    } else {
      category = 'different';
      reasoning = `Low keyword match (${intersection.size} common keywords)`;
    }
    
    results[category].push({ 
      summary, 
      reasoning,
      fileName
    });
  });

  return results;
}
