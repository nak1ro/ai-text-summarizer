import React from 'react';

interface ResultCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function ResultCard({title, icon, children, className = ''}: ResultCardProps) {
    return (
        <div
            className={`bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800 p-6 transition-all duration-300 hover:shadow-lg ${className}`}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 text-blue-600 dark:text-blue-400">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {title}
                </h3>
            </div>
            <div className="text-zinc-700 dark:text-zinc-300">{children}</div>
        </div>
    );
}
