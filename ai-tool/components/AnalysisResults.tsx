'use client';

import React from 'react';
import {AnalysisResult} from '@/types';
import {ResultCard} from './ResultCard';
import {useTranslation} from '@/hooks/useTranslation';

interface AnalysisResultsProps {
    result: AnalysisResult;
}

export function AnalysisResults({result}: AnalysisResultsProps) {
    const {t} = useTranslation();
    
    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
            {/* Summary Card */}
            <ResultCard
                title={t.summary}
                accentColor="blue"
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
                title={t.keyPoints}
                accentColor="purple"
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
                <ul className="space-y-4">
                    {result.keyPoints.map((point, index) => (
                        <li key={index} className="flex gap-4 group">
              <span
                  className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                {index + 1}
              </span>
                            <span className="flex-1 pt-1 text-base">{point}</span>
                        </li>
                    ))}
                </ul>
            </ResultCard>

            {/* Explanation Card */}
            <ResultCard
                title={t.simpleExplanation}
                accentColor="pink"
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
                title={t.readingTimeStats}
                accentColor="green"
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
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-xl border border-green-200/50 dark:border-green-800/50">
                        <div className="relative z-10">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                    {result.readingTime}
                                </span>
                                <span className="text-xl font-semibold text-green-700 dark:text-green-300">
                                    {result.readingTime === 1 ? t.minute : t.minutes}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                {t.estimatedReadingTime}
                            </p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-400/20 dark:bg-green-600/20 rounded-full blur-2xl"></div>
                    </div>
                    
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 p-6 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
                        <div className="relative z-10">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                                    {result.wordCount.toLocaleString()}
                                </span>
                                <span className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">
                                    {result.wordCount === 1 ? t.word : t.words}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                {t.totalWordCount}
                            </p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-400/20 dark:bg-emerald-600/20 rounded-full blur-2xl"></div>
                    </div>
                    
                    <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 p-6 rounded-xl border border-teal-200/50 dark:border-teal-800/50">
                        <div className="relative z-10">
                            <div className="mb-2">
                                <span className="text-2xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent block leading-tight">
                                    {result.readingLevel}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
                                Reading Level
                            </p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-teal-400/20 dark:bg-teal-600/20 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </ResultCard>
        </div>
    );
}
