/**
 * Reusable Icon Button Component
 * Square buttons with icons, used for theme toggle, language selector, etc.
 */

import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'danger';
}

export function IconButton({
  icon,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}: IconButtonProps) {
  const sizes = {
    sm: 'p-2 w-10 h-10',
    md: 'p-3 w-12 h-12',
    lg: 'p-4 w-14 h-14',
  };
  
  const variants = {
    default: 'bg-gradient-to-br from-zinc-100 to-zinc-50 hover:from-zinc-200 hover:to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 dark:hover:from-zinc-700 dark:hover:to-zinc-800 border-zinc-200/50 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-300',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-transparent text-white',
  };

  return (
    <button
      className={`relative group rounded-xl transition-all duration-300 border shadow-sm hover:shadow-md overflow-hidden flex items-center justify-center ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {variant === 'default' && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-purple-400/20 dark:from-purple-400/10 dark:to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      <div className="relative z-10">{icon}</div>
    </button>
  );
}

