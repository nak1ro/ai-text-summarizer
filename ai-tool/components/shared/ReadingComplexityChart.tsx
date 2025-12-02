'use client';

import React from 'react';
import {useTranslation} from '@/hooks/useTranslation';
import {useMobileDetection} from '@/hooks/useMobileDetection';

interface ReadingComplexityChartProps {
    readingLevel: string;
}

// Parse reading level string to extract numeric grade
function parseReadingLevel(readingLevel: string): { grade: number; description: string } {
    // Try to extract grade number from patterns like "7th grade", "grade 7", etc.
    const gradeMatch = readingLevel.match(/(\d+)(?:th|st|nd|rd)?\s*grade|grade\s*(\d+)/i);
    if (gradeMatch) {
        const gradeNum = parseInt(gradeMatch[1] || gradeMatch[2], 10);
        return {
            grade: gradeNum,
            description: readingLevel,
        };
    }

    // Handle college/graduate levels
    const lowerLevel = readingLevel.toLowerCase();
    if (lowerLevel.includes('graduate') || lowerLevel.includes('graduate level')) {
        return {grade: 18, description: readingLevel};
    }
    if (lowerLevel.includes('college') || lowerLevel.includes('college level')) {
        return {grade: 14, description: readingLevel};
    }
    if (lowerLevel.includes('high school') || lowerLevel.includes('high school level')) {
        return {grade: 11, description: readingLevel};
    }
    if (lowerLevel.includes('middle school') || lowerLevel.includes('middle school level')) {
        return {grade: 7, description: readingLevel};
    }
    if (lowerLevel.includes('elementary') || lowerLevel.includes('elementary level')) {
        return {grade: 5, description: readingLevel};
    }

    // Try to extract any number from the string as fallback
    const numberMatch = readingLevel.match(/\d+/);
    if (numberMatch) {
        const gradeNum = parseInt(numberMatch[0], 10);
        if (gradeNum >= 0 && gradeNum <= 20) {
            return {grade: gradeNum, description: readingLevel};
        }
    }

    // Default fallback - assume high school level
    return {grade: 10, description: readingLevel};
}

// Get the grade level category
function getGradeCategory(grade: number, levels: any[]) {
    if (grade <= 5) return levels[0];
    if (grade <= 8) return levels[1];
    if (grade <= 12) return levels[2];
    if (grade <= 16) return levels[3];
    return levels[4];
}

export function ReadingComplexityChart({readingLevel}: ReadingComplexityChartProps) {
    const {t} = useTranslation();
    const isMobile = useMobileDetection();
    const {grade, description} = parseReadingLevel(readingLevel);

    // Translate common descriptors in the reading level description
    const translateDescription = (desc: string): string => {
        let translated = desc;

        // Replace common English descriptors with translated ones
        translated = translated.replace(/easy to understand/gi, t.easyToUnderstand);
        translated = translated.replace(/moderate/gi, t.moderate);
        translated = translated.replace(/advanced/gi, t.advanced);
        translated = translated.replace(/highly technical/gi, t.highlyTechnical);
        translated = translated.replace(/very simple/gi, t.verySimple);
        translated = translated.replace(/accessible/gi, t.accessible);
        translated = translated.replace(/challenging/gi, t.challenging);
        translated = translated.replace(/\bgrade\b/gi, t.grade);
        translated = translated.replace(/\blevel\b/gi, t.level);

        return translated;
    };

    const translatedDescription = translateDescription(description);

    // Grade level ranges for Flesch-Kincaid scale with translations
    const GRADE_LEVELS = [
        {
            label: t.elementary,
            shortLabel: t.elemShort,
            min: 0,
            max: 5,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10 dark:bg-green-500/20'
        },
        {
            label: t.middleSchool,
            shortLabel: t.middleShort,
            min: 6,
            max: 8,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10 dark:bg-blue-500/20'
        },
        {
            label: t.highSchool,
            shortLabel: t.highShort,
            min: 9,
            max: 12,
            color: 'from-yellow-500 to-orange-500',
            bgColor: 'bg-orange-500/10 dark:bg-orange-500/20'
        },
        {
            label: t.college,
            shortLabel: t.collegeShort,
            min: 13,
            max: 16,
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-red-500/10 dark:bg-red-500/20'
        },
        {
            label: t.graduate,
            shortLabel: t.gradShort,
            min: 17,
            max: 20,
            color: 'from-red-600 to-purple-600',
            bgColor: 'bg-purple-500/10 dark:bg-purple-500/20'
        },
    ];

    const category = getGradeCategory(grade, GRADE_LEVELS);
    const maxGrade = 20;
    const percentage = Math.min((grade / maxGrade) * 100, 100);

    return (
        <div
            className="w-full relative overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 p-6 rounded-xl border border-teal-200/50 dark:border-teal-800/50">
            <div className="relative z-10 space-y-5">
                {/* Header */}
                <div>
                    <h3 className="text-base font-bold text-teal-700 dark:text-teal-300">
                        {t.readingComplexity}
                    </h3>
                </div>

                {/* Main Gauge Chart */}
                <div className="space-y-3">
                    {/* Grade Level Scale Bar */}
                    <div
                        className="relative h-10 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                        {/* Smooth gradient with precise color stops */}
                        <div
                            className="absolute inset-0 h-full"
                            style={{
                                background: 'linear-gradient(to right, #22c55e 0%, #10b981 20%, #3b82f6 40%, #06b6d4 50%, #eab308 60%, #f97316 70%, #ef4444 80%, #dc2626 85%, #9333ea 100%)'
                            }}
                        ></div>

                        {/* Current position indicator */}
                        <div
                            className="absolute top-0 bottom-0 w-0.5 bg-white dark:bg-zinc-100 shadow-lg z-10 pointer-events-none"
                            style={{left: `${percentage}%`, transform: 'translateX(-50%)'}}
                        >
                            {/* Indicator handle */}
                            <div
                                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white dark:bg-zinc-100 rounded-full border-2 border-teal-600 dark:border-teal-400 shadow-lg flex items-center justify-center">
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`}></div>
                            </div>
                        </div>
                    </div>

                    {/* Grade Range Labels */}
                    <div className="flex justify-between items-center px-1">
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">K-5</span>
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">6-8</span>
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">9-12</span>
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">13-16</span>
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">17+</span>
                    </div>
                </div>

                {/* Description */}
                <div className="text-center pt-2 border-t border-zinc-200/50 dark:border-zinc-700/50">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                        {translatedDescription}
                    </p>
                </div>

                {/* Category Labels - Hidden on mobile */}
                {!isMobile && (
                    <div className="grid grid-cols-5 gap-2 pt-2">
                        {GRADE_LEVELS.map((level, index) => {
                            const isActive = category.label === level.label;
                            return (
                                <div
                                    key={index}
                                    className={`text-center py-2 px-2 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? 'bg-zinc-200 dark:bg-zinc-700 scale-105 shadow-sm border border-zinc-300 dark:border-zinc-600'
                                            : 'bg-zinc-100/50 dark:bg-zinc-800/30 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
                                    }`}
                                >
                                    <p
                                        className={`text-xs font-semibold ${
                                            isActive
                                                ? 'text-zinc-700 dark:text-zinc-300'
                                                : 'text-zinc-500 dark:text-zinc-400'
                                        }`}
                                    >
                                        {level.shortLabel}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Decorative glow */}
            <div
                className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-r ${category.color} opacity-10 dark:opacity-15 rounded-full blur-3xl`}></div>
        </div>
    );
}

