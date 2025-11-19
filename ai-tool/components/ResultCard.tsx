import React from 'react';

interface ResultCardProps {
    title: string | React.ReactNode;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    accentColor?: 'blue' | 'purple' | 'pink' | 'green';
    topRightActions?: React.ReactNode;
}

export function ResultCard({title, icon, children, className = '', accentColor = 'blue', topRightActions}: ResultCardProps) {
    const accentColors = {
        blue: 'from-blue-500 to-cyan-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
        purple: 'from-purple-500 to-pink-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30',
        pink: 'from-pink-500 to-rose-500 text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/30',
        green: 'from-green-500 to-emerald-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30',
    };

    const [gradientColors, iconColor, bgColor] = accentColors[accentColor].split(' ');

    return (
        <div
            className={`group relative bg-white dark:bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 p-7 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-sm overflow-hidden ${className}`}
        >
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            {/* Top Gradient Line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientColors} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            <div className="relative z-10">
                {/* Top Right Actions */}
                {topRightActions && (
                    <div className="absolute top-0 right-0 flex items-center gap-2 z-20">
                        {topRightActions}
                    </div>
                )}
                <div className="flex items-center gap-4 mb-5">
                    <div className={`flex-shrink-0 ${iconColor} p-3 rounded-xl ${bgColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex-1">
                        {title}
                    </h3>
                </div>
                <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{children}</div>
            </div>
        </div>
    );
}
