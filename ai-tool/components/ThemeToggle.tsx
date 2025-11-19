'use client';

import React, {useEffect, useState} from 'react';
import {useTheme} from '@/contexts/ThemeContext';

export function ThemeToggle() {
    const {theme, toggleTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 w-10 h-10" />
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors duration-200 border border-zinc-200 dark:border-zinc-700"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? (
                // Moon icon for dark mode
                <svg
                    className="w-5 h-5 text-zinc-700 dark:text-zinc-300"
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
                    className="w-5 h-5 text-zinc-300"
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
            )}
        </button>
    );
}

