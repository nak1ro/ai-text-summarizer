/**
 * Reusable Stat Card Component
 * Displays statistics with gradient backgrounds and decorative elements
 */

import React from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
  unit?: string;
  gradient: string; // e.g., 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'
  textGradient: string; // e.g., 'from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400'
  borderColor: string; // e.g., 'border-green-200/50 dark:border-green-800/50'
  glowColor: string; // e.g., 'bg-green-400/20 dark:bg-green-600/20'
  textColor: string; // e.g., 'text-green-600 dark:text-green-400'
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode; // For custom content like top words
}

export function StatCard({
  value,
  label,
  unit,
  gradient,
  textGradient,
  borderColor,
  glowColor,
  textColor,
  size = 'md',
  children,
}: StatCardProps) {
  const valueSize = {
    sm: 'text-4xl',
    md: 'text-5xl',
    lg: 'text-5xl',
  };
  
  const unitSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-xl',
  };

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} p-6 rounded-xl border ${borderColor}`}
    >
      <div className="relative z-10">
        {children ? (
          children
        ) : (
          <>
            <div className="flex items-baseline gap-3 mb-2">
              <span className={`${valueSize[size]} font-black bg-gradient-to-r ${textGradient} bg-clip-text text-transparent`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </span>
              {unit && (
                <span className={`${unitSize[size]} font-semibold ${textColor.replace('text-', 'text-').replace(/\d{3}/, '700').replace('dark:text-', 'dark:text-').replace(/\d{3}/, '300')}`}>
                  {unit}
                </span>
              )}
            </div>
            <p className={`text-sm font-medium ${textColor}`}>{label}</p>
          </>
        )}
      </div>
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${glowColor} rounded-full blur-2xl`}></div>
    </div>
  );
}

