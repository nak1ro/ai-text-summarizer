/**
 * Reusable Navigation Button Component
 * Used for quick navigation with color-coded sections
 */

import React from 'react';

interface NavigationButtonProps {
  onClick: () => void;
  emoji: string;
  label: string;
  color: 'blue' | 'purple' | 'pink' | 'green';
}

export function NavigationButton({ onClick, emoji, label, color }: NavigationButtonProps) {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/50',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50',
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 ${colors[color]} rounded-lg transition-all duration-200 text-sm font-medium`}
    >
      {emoji} {label}
    </button>
  );
}

