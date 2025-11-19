/**
 * Top Words Modal Component
 * Displays the top 15 most frequently used words
 */

import React, { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface TopWordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  topWords: Array<{ word: string; count: number }>;
}

export function TopWordsModal({ isOpen, onClose, topWords }: TopWordsModalProps) {
  const { t } = useTranslation();
  // Filter out words that appear only once and take top 15
  const filteredWords = topWords.filter(item => item.count > 1).slice(0, 15);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 max-h-[80vh] overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/40 dark:to-fuchsia-950/40 border-b border-purple-200/50 dark:border-purple-800/50 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                {t.topWordsModalTitle}
              </h2>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                {t.topWordsModalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 rounded-xl transition-all duration-300 group"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-100px)] p-6">
          {filteredWords.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-purple-100 dark:bg-purple-900/20 rounded-2xl mb-4">
                <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">
                {t.noRepeatedWords}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
                {t.allWordsOnce}
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredWords.map((item, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-4 p-4 bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50 dark:from-purple-950/20 dark:to-fuchsia-950/20 border border-purple-200/50 dark:border-purple-800/50 rounded-xl hover:shadow-md hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Rank Badge */}
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white font-black text-lg rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    {idx + 1}
                  </div>

                  {/* Word */}
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100 truncate">
                      {item.word}
                    </p>
                  </div>

                  {/* Count Badge */}
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/40 dark:to-fuchsia-900/40 rounded-lg border border-purple-300 dark:border-purple-700">
                      <span className="text-xl font-black text-purple-700 dark:text-purple-300">
                        {item.count}
                      </span>
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 ml-1">
                        ×
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 to-fuchsia-200 dark:from-purple-800 to-fuchsia-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

