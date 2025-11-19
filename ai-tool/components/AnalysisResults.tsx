'use client';

import React, {useState} from 'react';
import {AnalysisResult} from '@/types';
import {ResultCard} from './ResultCard';
import {useTranslation} from '@/hooks/useTranslation';
import {useMobileDetection} from '@/hooks/useMobileDetection';
import {CollapseToggle} from './shared/CollapseToggle';
import {NavigationButton} from './shared/NavigationButton';
import {ExpandableText} from './shared/ExpandableText';
import {StatCard} from './shared/StatCard';
import {TopWordsModal} from './shared/TopWordsModal';
import {CopyButton} from './shared/CopyButton';
import {ReadingComplexityChart} from './shared/ReadingComplexityChart';

interface AnalysisResultsProps {
    result: AnalysisResult;
}

export function AnalysisResults({result}: AnalysisResultsProps) {
    const {t} = useTranslation();
    const isMobile = useMobileDetection();
    
    // State for collapsed sections
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
        summary: false,
        keyPoints: false,
        explanation: false,
        stats: false,
    });
    
    // State for top words modal
    const [isTopWordsModalOpen, setIsTopWordsModalOpen] = useState(false);
    
    const toggleSection = (section: string) => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };
    
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    
    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
            {/* Jump Navigation */}
            <div className="sticky top-4 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-200/50 dark:border-zinc-700/50 p-4 animate-slideIn">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{t.quickNavigation}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <NavigationButton
                        onClick={() => scrollToSection('summary-section')}
                        emoji="📝"
                        label={t.summary}
                        color="blue"
                    />
                    <NavigationButton
                        onClick={() => scrollToSection('keypoints-section')}
                        emoji="📋"
                        label={t.keyPoints}
                        color="purple"
                    />
                    <NavigationButton
                        onClick={() => scrollToSection('explanation-section')}
                        emoji="💡"
                        label={t.explanation}
                        color="pink"
                    />
                    <NavigationButton
                        onClick={() => scrollToSection('stats-section')}
                        emoji="📊"
                        label={t.stats}
                        color="green"
                    />
                </div>
            </div>

            {/* Summary Card */}
            <div id="summary-section">
            <ResultCard
                title={t.summary}
                accentColor="blue"
                topRightActions={
                    <>
                        {!isMobile && (
                            <CopyButton 
                                text={result.summary}
                                label={t.copy || 'Copy'}
                                className="!p-2"
                            />
                        )}
                        <CollapseToggle
                            isCollapsed={collapsedSections.summary}
                            onToggle={() => toggleSection('summary')}
                            ariaLabel="Toggle summary"
                        />
                    </>
                }
                bottomRightActions={
                    isMobile ? (
                        <CopyButton 
                            text={result.summary}
                            label={t.copy || 'Copy'}
                            className="!p-2"
                        />
                    ) : undefined
                }
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
                {!collapsedSections.summary && (
                    <ExpandableText text={result.summary} accentColor="blue" />
                )}
            </ResultCard>
            </div>

            {/* Key Points Card */}
            <div id="keypoints-section">
            <ResultCard
                title={t.keyPoints}
                accentColor="purple"
                topRightActions={
                    <>
                        {!isMobile && (
                            <CopyButton 
                                text={result.keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}
                                label={t.copy || 'Copy'}
                                className="!p-2"
                            />
                        )}
                        <CollapseToggle
                            isCollapsed={collapsedSections.keyPoints}
                            onToggle={() => toggleSection('keyPoints')}
                            ariaLabel="Toggle key points"
                        />
                    </>
                }
                bottomRightActions={
                    isMobile ? (
                        <CopyButton 
                            text={result.keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}
                            label={t.copy || 'Copy'}
                            className="!p-2"
                        />
                    ) : undefined
                }
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
                {!collapsedSections.keyPoints && (
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
                )}
            </ResultCard>
            </div>

            {/* Explanation Card */}
            <div id="explanation-section">
            <ResultCard
                title={t.simpleExplanation}
                accentColor="pink"
                topRightActions={
                    <>
                        {!isMobile && (
                            <CopyButton 
                                text={result.explanation}
                                label={t.copy || 'Copy'}
                                className="!p-2"
                            />
                        )}
                        <CollapseToggle
                            isCollapsed={collapsedSections.explanation}
                            onToggle={() => toggleSection('explanation')}
                            ariaLabel="Toggle explanation"
                        />
                    </>
                }
                bottomRightActions={
                    isMobile ? (
                        <CopyButton 
                            text={result.explanation}
                            label={t.copy || 'Copy'}
                            className="!p-2"
                        />
                    ) : undefined
                }
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
                {!collapsedSections.explanation && (
                    <ExpandableText text={result.explanation} accentColor="pink" />
                )}
            </ResultCard>
            </div>

            {/* Reading Time Card */}
            <div id="stats-section">
            <ResultCard
                title={
                    <div className="flex items-center justify-between w-full">
                        <span>{isMobile ? t.statistics : t.readingTimeStats}</span>
                        <CollapseToggle
                            isCollapsed={collapsedSections.stats}
                            onToggle={() => toggleSection('stats')}
                            ariaLabel="Toggle stats"
                        />
                    </div>
                }
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
                {!collapsedSections.stats && (
                <div className="space-y-6">
                    {/* First Row - Main Stats */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <StatCard
                            value={result.readingTime}
                            unit={result.readingTime === 1 ? t.minute : t.minutes}
                            label={t.estimatedReadingTime}
                            gradient="from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
                            textGradient="from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400"
                            borderColor="border-green-200/50 dark:border-green-800/50"
                            glowColor="bg-green-400/20 dark:bg-green-600/20"
                            textColor="text-green-600 dark:text-green-400"
                        />
                        
                        <StatCard
                            value={result.wordCount}
                            unit={result.wordCount === 1 ? t.word : t.words}
                            label={t.totalWordCount}
                            gradient="from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20"
                            textGradient="from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400"
                            borderColor="border-emerald-200/50 dark:border-emerald-800/50"
                            glowColor="bg-emerald-400/20 dark:bg-emerald-600/20"
                            textColor="text-emerald-600 dark:text-emerald-400"
                        />
                    </div>
                    
                    {/* Reading Complexity Chart - Full Width */}
                    <div className="w-full">
                        <ReadingComplexityChart readingLevel={result.readingLevel} />
                    </div>
                    
                    {/* Second Row - Additional Stats */}
                    <div className="grid md:grid-cols-4 gap-6">
                        <StatCard
                            value={result.speakingTime}
                            unit={t.minutes}
                            label={t.speakingTime}
                            gradient="from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20"
                            textGradient="from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400"
                            borderColor="border-cyan-200/50 dark:border-cyan-800/50"
                            glowColor="bg-cyan-400/20 dark:bg-cyan-600/20"
                            textColor="text-cyan-600 dark:text-cyan-400"
                            size="sm"
                        />
                        
                        <StatCard
                            value={result.uniqueWords}
                            label={t.uniqueWords}
                            gradient="from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"
                            textGradient="from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
                            borderColor="border-blue-200/50 dark:border-blue-800/50"
                            glowColor="bg-blue-400/20 dark:bg-blue-600/20"
                            textColor="text-blue-600 dark:text-blue-400"
                            size="sm"
                        />
                        
                        <StatCard
                            value={result.averageSentenceLength}
                            unit={t.words}
                            label={t.avgSentence}
                            gradient="from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20"
                            textGradient="from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
                            borderColor="border-indigo-200/50 dark:border-indigo-800/50"
                            glowColor="bg-indigo-400/20 dark:bg-indigo-600/20"
                            textColor="text-indigo-600 dark:text-indigo-400"
                            size="sm"
                        />
                        
                        <div 
                            onClick={() => setIsTopWordsModalOpen(true)}
                            className="cursor-pointer transition-transform duration-300 hover:scale-105"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setIsTopWordsModalOpen(true);
                                }
                            }}
                            aria-label="Open top words modal"
                        >
                            <StatCard
                                gradient="from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20"
                                textGradient="from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400"
                                borderColor="border-purple-200/50 dark:border-purple-800/50"
                                glowColor="bg-purple-400/20 dark:bg-purple-600/20"
                                textColor="text-purple-600 dark:text-purple-400"
                                value=""
                                label=""
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                        {t.topWords}
                                    </p>
                                    <svg className="w-4 h-4 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    {result.topWords.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-purple-700 dark:text-purple-300 truncate max-w-[80px]">
                                                {item.word}
                                            </span>
                                            <span className="text-purple-600 dark:text-purple-400 font-bold">
                                                {item.count}×
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </StatCard>
                        </div>
                    </div>
                </div>
                )}
            </ResultCard>
            </div>

            {/* Top Words Modal */}
            <TopWordsModal
                isOpen={isTopWordsModalOpen}
                onClose={() => setIsTopWordsModalOpen(false)}
                topWords={result.topWords}
            />

        </div>
    );
}
