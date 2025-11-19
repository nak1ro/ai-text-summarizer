'use client';

import React from 'react';
import {AnalysisResult} from '@/types';
import {ResultCard} from './ResultCard';

interface AnalysisResultsProps {
    result: AnalysisResult;
}

export function AnalysisResults({result}: AnalysisResultsProps) {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
            {/* Summary Card */}
            <ResultCard
                title="Summary"
                icon={
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                }
            >
                <p className="text-base leading-relaxed">{result.summary}</p>
            </ResultCard>

            {/* Key Points Card */}
            <ResultCard
                title="Key Points"
                icon={
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                    </svg>
                }
            >
                <ul className="space-y-3">
                    {result.keyPoints.map((point, index) => (
                        <li key={index} className="flex gap-3">
              <span
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
                            <span className="flex-1 pt-0.5">{point}</span>
                        </li>
                    ))}
                </ul>
            </ResultCard>

            {/* Explanation Card */}
            <ResultCard
                title="Simple Explanation"
                icon={
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                    </svg>
                }
            >
                <p className="text-base leading-relaxed">{result.explanation}</p>
            </ResultCard>

            {/* Reading Time Card */}
            <ResultCard
                title="Reading Time & Stats"
                icon={
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                }
            >
                <div className="space-y-4">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {result.readingTime}
                            </span>
                            <span className="text-lg text-zinc-600 dark:text-zinc-400">
                                {result.readingTime === 1 ? 'minute' : 'minutes'}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            Estimated reading time
                        </p>
                    </div>
                    
                    <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
                                {result.wordCount.toLocaleString()}
                            </span>
                            <span className="text-base text-zinc-600 dark:text-zinc-400">
                                {result.wordCount === 1 ? 'word' : 'words'}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            Total word count
                        </p>
                    </div>
                </div>
            </ResultCard>
        </div>
    );
}
