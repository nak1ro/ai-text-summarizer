'use client';

import {useState, useEffect, JSX} from 'react';
import {useTranslation} from '@/hooks/useTranslation';
import {getStorageItem, setStorageItem} from '@/lib/storage';

export type SummaryLength = 'short' | 'medium' | 'long';
export type AnalysisStyle = 'academic' | 'casual' | 'technical';

export interface AnalysisSettings {
    summaryLength: SummaryLength;
    analysisStyle: AnalysisStyle;
}

interface AnalysisSettingsProps {
    settings: AnalysisSettings;
    onSettingsChange: (settings: AnalysisSettings) => void;
    disabled?: boolean;
}

interface Option<T extends string> {
    value: T;
    label: string;
    icon: string;
    description: string;
}

interface OptionConfig<T extends string> {
    value: T;
    labelKey: string;
    descriptionKey: string;
    fallbackLabel: string;
    fallbackDescription: string;
    icon: string;
}

// Options use translations
const SUMMARY_LENGTH_CONFIG: Array<OptionConfig<SummaryLength>> = [
    {
        value: 'short',
        labelKey: 'short',
        descriptionKey: 'shortDescription',
        fallbackLabel: 'Short',
        fallbackDescription: 'Concise overview',
        icon: '📝',
    },
    {
        value: 'medium',
        labelKey: 'medium',
        descriptionKey: 'mediumDescription',
        fallbackLabel: 'Medium',
        fallbackDescription: 'Balanced detail',
        icon: '📄',
    },
    {
        value: 'long',
        labelKey: 'long',
        descriptionKey: 'longDescription',
        fallbackLabel: 'Long',
        fallbackDescription: 'Comprehensive analysis',
        icon: '📚',
    },
];

const ANALYSIS_STYLE_CONFIG: Array<OptionConfig<AnalysisStyle>> = [
    {
        value: 'academic',
        labelKey: 'academic',
        descriptionKey: 'academicDescription',
        fallbackLabel: 'Academic',
        fallbackDescription: 'Formal, scholarly',
        icon: '🎓',
    },
    {
        value: 'casual',
        labelKey: 'casual',
        descriptionKey: 'casualDescription',
        fallbackLabel: 'Casual',
        fallbackDescription: 'Conversational, friendly',
        icon: '💬',
    },
    {
        value: 'technical',
        labelKey: 'technical',
        descriptionKey: 'technicalDescription',
        fallbackLabel: 'Technical',
        fallbackDescription: 'Professional, precise',
        icon: '⚙️',
    },
];

const STORAGE_KEY = 'analysisSettings';

const createOptions = <T extends string>(t: any, configs: Array<OptionConfig<T>>): Array<Option<T>> =>
    configs.map((config) => ({
        value: config.value,
        label: t[config.labelKey] || config.fallbackLabel,
        icon: config.icon,
        description: t[config.descriptionKey] || config.fallbackDescription,
    }));

const getSummaryLengthOptions = (t: any): Array<Option<SummaryLength>> =>
    createOptions<SummaryLength>(t, SUMMARY_LENGTH_CONFIG);

const getAnalysisStyleOptions = (t: any): Array<Option<AnalysisStyle>> =>
    createOptions<AnalysisStyle>(t, ANALYSIS_STYLE_CONFIG);

const loadSettings = (onSettingsChange: (settings: AnalysisSettings) => void): void => {
    const saved = getStorageItem<AnalysisSettings | null>(STORAGE_KEY, null);
    if (saved) {
        onSettingsChange(saved);
    }
};

const saveSettings = (settings: AnalysisSettings): void => {
    setStorageItem(STORAGE_KEY, settings);
};

interface OptionGridProps<T extends string> {
    options: Array<Option<T>>;
    selectedValue: T;
    onChange: (value: T) => void;
    disabled: boolean;
    selectedClassName: string;
    unselectedClassName: string;
}

function OptionGrid<T extends string>({
                                          options,
                                          selectedValue,
                                          onChange,
                                          disabled,
                                          selectedClassName,
                                          unselectedClassName,
                                      }: OptionGridProps<T>): JSX.Element {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(option.value)}
                    disabled={disabled}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedValue === option.value ? selectedClassName : unselectedClassName
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                        {option.label}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {option.description}
                    </div>
                </button>
            ))}
        </div>
    );
}

export function AnalysisSettings({
                                     settings,
                                     onSettingsChange,
                                     disabled = false,
                                 }: AnalysisSettingsProps): JSX.Element {
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const summaryLengthOptions = getSummaryLengthOptions(t);
    const analysisStyleOptions = getAnalysisStyleOptions(t);

    // Load settings from storage
    useEffect(() => {
        loadSettings(onSettingsChange);
    }, [onSettingsChange]);

    // Save settings to storage
    useEffect(() => {
        saveSettings(settings);
    }, [settings]);

    const handleSummaryLengthChange = (length: SummaryLength): void => {
        onSettingsChange({...settings, summaryLength: length});
    };

    const handleAnalysisStyleChange = (style: AnalysisStyle): void => {
        onSettingsChange({...settings, analysisStyle: style});
    };

    return (
        <div className="mb-6">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                    isOpen
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            />
                        </svg>
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            {t.analysisSettings || 'Analysis Settings'}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            {summaryLengthOptions.find((opt) => opt.value === settings.summaryLength)?.label} •{' '}
                            {analysisStyleOptions.find((opt) => opt.value === settings.analysisStyle)?.label}
                        </div>
                    </div>
                </div>
                <svg
                    className={`w-5 h-5 text-zinc-500 dark:text-zinc-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
            </button>

            {isOpen && (
                <div
                    className="mt-4 p-5 bg-white dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 shadow-lg animate-slideIn">
                    {/* Summary Length */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                            {t.summaryLength || 'Summary Length'}
                        </label>
                        <OptionGrid<SummaryLength>
                            options={summaryLengthOptions}
                            selectedValue={settings.summaryLength}
                            onChange={handleSummaryLengthChange}
                            disabled={disabled}
                            selectedClassName="border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md scale-105"
                            unselectedClassName="border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-600 hover:scale-102"
                        />
                    </div>

                    {/* Analysis Style */}
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                            {t.analysisStyle || 'Analysis Style'}
                        </label>
                        <OptionGrid<AnalysisStyle>
                            options={analysisStyleOptions}
                            selectedValue={settings.analysisStyle}
                            onChange={handleAnalysisStyleChange}
                            disabled={disabled}
                            selectedClassName="border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20 shadow-md scale-105"
                            unselectedClassName="border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-600 hover:scale-102"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
