import React, { useState } from 'react';
import InputForm from './InputForm';
import MatchResults, { MatchResult } from './MatchResults';
import { matchCVsToJD } from '../utils/matcher';

const ResumeMatching = () => {
    const [results, setResults] = useState<{
        best: MatchResult[];
        average: MatchResult[];
        different: MatchResult[];
    } | null>(null);

    const handleMatch = (cvs: string[], jd: string, fileNames: string[]) => {
        const matchResults = matchCVsToJD(cvs, jd, fileNames);
        setResults(matchResults);
    };
  return (
    <div className="space-y-6">
        <div className="py-8">

        <h1 className="text-3xl font-display font-bold mb-3 text-[#F5F5F5]">Resume Matcher for HR</h1>
        <p className="text-[#6B6B6B] mb-8">Upload up to 4 CV files and provide a job description to automatically categorize candidates</p>

        {/* Quick instructions */}
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-[#CAFF02] mb-2 text-sm">Quick Start</h3>
          <ul className="text-sm text-[#9B9B9B] space-y-1">
            <li>• Upload CV files (PDF, Word, or Text format)</li>
            <li>• If PDF fails, try refreshing or converting to Word/Text</li>
            <li>• Enter job requirements in the text area</li>
            <li>• Click &quot;Match Candidates&quot; to see results</li>
          </ul>
        </div>

        <InputForm onMatch={handleMatch} />
        {results && <MatchResults {...results} />}

        </div>
    </div>
  );
};

export default ResumeMatching;
