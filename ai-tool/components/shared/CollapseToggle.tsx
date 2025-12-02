import React from 'react';

interface CollapseToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
  ariaLabel?: string;
}

export function CollapseToggle({ isCollapsed, onToggle, ariaLabel }: CollapseToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors duration-200"
      aria-label={ariaLabel || 'Toggle section'}
    >
      <svg
        className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

