/**
 * Reusable Expandable Text Component
 * Text with truncation and show more/less functionality
 */

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface ExpandableTextProps {
  text: string;
  limit?: number;
  accentColor?: 'blue' | 'purple' | 'pink' | 'green';
}

export function ExpandableText({ text, limit = 300, accentColor = 'blue' }: ExpandableTextProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > limit;
  
  const colors = {
    blue: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
    purple: 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300',
    pink: 'text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300',
    green: 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300',
  };

  if (!shouldTruncate) {
    return <p className="text-base leading-relaxed">{text}</p>;
  }

  return (
    <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
      <p className="text-base leading-relaxed">
        {isExpanded ? text : text.substring(0, limit) + '...'}
      </p>
      <div className={`mt-3 text-sm font-medium ${colors[accentColor]} flex items-center gap-1 transition-colors duration-200`}>
        {isExpanded ? (
          <>
            <span>{t.clickToShowLess}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </>
        ) : (
          <>
            <span>{t.clickToShowMore}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </div>
    </div>
  );
}

