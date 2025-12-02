import React, {JSX} from 'react';

type AccentColor = 'blue' | 'purple' | 'pink' | 'green';

interface AccentStyles {
    gradient: string;
    icon: string;
    background: string;
}

interface ResultCardProps {
    title: string | React.ReactNode;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    accentColor?: AccentColor;
    topRightActions?: React.ReactNode;
    bottomRightActions?: React.ReactNode;
}

const ACCENT_STYLES: Record<AccentColor, AccentStyles> = {
    blue: {
        gradient: 'from-blue-500 to-cyan-500',
        icon: 'text-blue-600 dark:text-blue-400',
        background: 'bg-blue-50 dark:bg-blue-950/30',
    },
    purple: {
        gradient: 'from-purple-500 to-pink-500',
        icon: 'text-purple-600 dark:text-purple-400',
        background: 'bg-purple-50 dark:bg-purple-950/30',
    },
    pink: {
        gradient: 'from-pink-500 to-rose-500',
        icon: 'text-pink-600 dark:text-pink-400',
        background: 'bg-pink-50 dark:bg-pink-950/30',
    },
    green: {
        gradient: 'from-green-500 to-emerald-500',
        icon: 'text-green-600 dark:text-green-400',
        background: 'bg-green-50 dark:bg-green-950/30',
    },
};

const baseContainerClasses =
    'group relative bg-white dark:bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 p-7 transition-all duration-500 hover:shadow-2xl backdrop-blur-sm overflow-hidden';

function getContainerClasses(className: string): string {
    return `${baseContainerClasses} ${className}`.trim();
}

function getAccentStyles(accentColor: AccentColor): AccentStyles {
    return ACCENT_STYLES[accentColor];
}

function TopRightActions({ children }: { children?: React.ReactNode }): JSX.Element | null {
    if (!children) {
        return null;
    }

    return <div className="absolute top-0 right-0 flex items-center gap-2 z-20">{children}</div>;
}

function BottomRightActions({ children }: { children?: React.ReactNode }): JSX.Element | null {
    if (!children) {
        return null;
    }

    return <div className="flex items-center justify-end gap-2 mt-4">{children}</div>;
}

function ResultCardHeader(props: {
    icon: React.ReactNode;
    title: string | React.ReactNode;
    accentStyles: AccentStyles;
}): JSX.Element {
    const { icon, title, accentStyles } = props;

    return (
        <div className="flex items-center gap-4 mb-5">
            <div
                className={`flex-shrink-0 ${accentStyles.icon} p-3 rounded-xl ${accentStyles.background} shadow-sm group-hover:scale-110 transition-transform duration-300`}
            >
                {icon}
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex-1">{title}</h3>
        </div>
    );
}

export function ResultCard(props: ResultCardProps): JSX.Element {
    const {
        title,
        icon,
        children,
        className = '',
        accentColor = 'blue',
        topRightActions,
        bottomRightActions,
    } = props;

    const accentStyles = getAccentStyles(accentColor);
    const containerClasses = getContainerClasses(className);

    return (
        <div className={containerClasses}>
            <div
                className={`absolute inset-0 bg-gradient-to-br ${accentStyles.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`}
            />
            <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentStyles.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
            />
            <div className="relative z-10">
                <TopRightActions>{topRightActions}</TopRightActions>
                <ResultCardHeader icon={icon} title={title} accentStyles={accentStyles} />
                <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{children}</div>
                <BottomRightActions>{bottomRightActions}</BottomRightActions>
            </div>
        </div>
    );
}
