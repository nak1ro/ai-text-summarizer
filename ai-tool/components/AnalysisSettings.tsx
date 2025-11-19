'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

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

const SUMMARY_LENGTH_OPTIONS: Array<{ value: SummaryLength; label: string; icon: string; description: string }> = [
  { value: 'short', label: 'Short', icon: '📝', description: 'Concise overview' },
  { value: 'medium', label: 'Medium', icon: '📄', description: 'Balanced detail' },
  { value: 'long', label: 'Long', icon: '📚', description: 'Comprehensive analysis' },
];

const ANALYSIS_STYLE_OPTIONS: Array<{ value: AnalysisStyle; label: string; icon: string; description: string }> = [
  { value: 'academic', label: 'Academic', icon: '🎓', description: 'Formal, scholarly' },
  { value: 'casual', label: 'Casual', icon: '💬', description: 'Conversational, friendly' },
  { value: 'technical', label: 'Technical', icon: '⚙️', description: 'Professional, precise' },
];

const STORAGE_KEY = 'analysisSettings';

export function AnalysisSettings({ settings, onSettingsChange, disabled = false }: AnalysisSettingsProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        onSettingsChange(parsed);
      } catch {
        // Ignore parse errors
      }
    }
  }, [onSettingsChange]);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleSummaryLengthChange = (length: SummaryLength) => {
    onSettingsChange({ ...settings, summaryLength: length });
  };

  const handleAnalysisStyleChange = (style: AnalysisStyle) => {
    onSettingsChange({ ...settings, analysisStyle: style });
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {t.analysisSettings || 'Analysis Settings'}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {SUMMARY_LENGTH_OPTIONS.find(opt => opt.value === settings.summaryLength)?.label} • {' '}
              {ANALYSIS_STYLE_OPTIONS.find(opt => opt.value === settings.analysisStyle)?.label}
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-4 p-5 bg-white dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 shadow-lg animate-slideIn">
          {/* Summary Length */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
              {t.summaryLength || 'Summary Length'}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SUMMARY_LENGTH_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSummaryLengthChange(option.value)}
                  disabled={disabled}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    settings.summaryLength === option.value
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md scale-105'
                      : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-600 hover:scale-102'
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
          </div>

          {/* Analysis Style */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
              {t.analysisStyle || 'Analysis Style'}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ANALYSIS_STYLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAnalysisStyleChange(option.value)}
                  disabled={disabled}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    settings.analysisStyle === option.value
                      ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20 shadow-md scale-105'
                      : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-600 hover:scale-102'
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
          </div>
        </div>
      )}
    </div>
  );
}

