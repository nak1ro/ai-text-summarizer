'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/types';
import { AnalysisResults } from '@/components/AnalysisResults';
import { formatCount } from '@/lib/utils';

const MAX_CHARS = 5000;

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    // Reset states
    setError(null);
    setResult(null);

    // Validate input
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    if (text.length > MAX_CHARS) {
      setError(`Text exceeds maximum length of ${formatCount(MAX_CHARS)} characters`);
      return;
    }

    if (text.trim().length < 10) {
      setError('Text is too short. Please provide at least 10 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow Ctrl/Cmd + Enter to submit
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAnalyze();
    }
  };

  const charCount = text.length;
  const charPercentage = (charCount / MAX_CHARS) * 100;
  const charCountColor =
    charCount > MAX_CHARS
      ? 'text-red-600 dark:text-red-400'
      : charCount > MAX_CHARS * 0.9
      ? 'text-orange-600 dark:text-orange-400'
      : 'text-zinc-500 dark:text-zinc-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 py-8 px-4">
      <main className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            AI Text Summarizer
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Paste your text and get instant AI-powered analysis
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 mb-8">
          <div className="mb-4">
            <label
              htmlFor="text-input"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Your Text
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste or type your text here (up to 5,000 characters)..."
              className="w-full h-64 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              disabled={loading}
            />
          </div>

          {/* Character Counter */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    charCount > MAX_CHARS
                      ? 'bg-red-500'
                      : charCount > MAX_CHARS * 0.9
                      ? 'bg-orange-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(charPercentage, 100)}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${charCountColor}`}>
                {formatCount(charCount)} / {formatCount(MAX_CHARS)}
              </span>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Analyze
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to analyze
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200">
                Error
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && <AnalysisResults result={result} />}
      </main>
    </div>
  );
}
