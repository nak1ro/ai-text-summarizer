/**
 * Reusable Extracted Text Preview Component
 * Displays extracted text with consistent styling
 */

import React from 'react';

interface ExtractedTextPreviewProps {
  text: string;
  maxLength?: number;
  title?: string;
}

export function ExtractedTextPreview({ text, maxLength = 200, title = 'Extracted Text' }: ExtractedTextPreviewProps) {
  return (
    <div className="mt-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl shadow-md">
      <p className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {title}
      </p>
      <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
        {text.substring(0, maxLength)}
        {text.length > maxLength ? '...' : ''}
      </p>
    </div>
  );
}

