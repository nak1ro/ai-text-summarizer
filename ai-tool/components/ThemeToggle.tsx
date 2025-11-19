'use client';

import React, {useEffect, useState} from 'react';
import {useTheme} from '@/contexts/ThemeContext';
import {IconButton} from './shared/IconButton';

interface ThemeToggleProps {
    isMobile?: boolean;
}

export function ThemeToggle({ isMobile = false }: ThemeToggleProps) {
    const {theme, toggleTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className={`${isMobile ? 'w-full h-full' : 'p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 w-12 h-12'}`} />
        );
    }

    if (isMobile) {
        return (
            <button
                onClick={toggleTheme}
                className="w-full h-full rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 hover:from-zinc-200 hover:to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 dark:hover:from-zinc-700 dark:hover:to-zinc-800 transition-all duration-300 border border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-center shadow-sm hover:shadow-md text-zinc-700 dark:text-zinc-300 hover:scale-105 active:scale-95"
                aria-label="Toggle theme"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
                {theme === 'light' ? (
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )}
            </button>
        );
    }

    return (
        <IconButton
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            size="lg"
            icon={
                theme === 'light' ? (
                    // Moon icon for dark mode
                    <svg
                        className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </svg>
                ) : (
                    // Sun icon for light mode
                    <svg
                        className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                )
            }
        />
    );
}

