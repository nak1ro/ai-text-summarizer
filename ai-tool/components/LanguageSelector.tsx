'use client';

import React, {useState, useRef, useEffect} from 'react';
import {useLanguage, Language} from '@/contexts/LanguageContext';
import {translations} from '@/lib/translations';

const languageFlags: Record<Language, string> = {
    en: '🇬🇧',
    es: '🇪🇸',
    de: '🇩🇪',
    fr: '🇫🇷',
    pl: '🇵🇱',
};

export function LanguageSelector() {
    const {language, setLanguage} = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group p-3 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 hover:from-zinc-200 hover:to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 dark:hover:from-zinc-700 dark:hover:to-zinc-800 transition-all duration-300 border border-zinc-200/50 dark:border-zinc-700/50 flex items-center gap-2 shadow-sm hover:shadow-md"
                aria-label="Select language"
            >
                <span className="text-xl group-hover:scale-110 transition-transform duration-300">{languageFlags[language]}</span>
                <svg
                    className={`w-4 h-4 text-zinc-600 dark:text-zinc-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-700/50 py-2 z-50 animate-scaleIn overflow-hidden">
                    {(Object.keys(translations) as Language[]).map((lang) => (
                        <button
                            key={lang}
                            onClick={() => handleLanguageChange(lang)}
                            className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-200 ${
                                language === lang
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80'
                            }`}
                        >
                            <span className="text-xl">{languageFlags[lang]}</span>
                            <span className="flex-1">{translations[lang].languages[lang]}</span>
                            {language === lang && (
                                <svg
                                    className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-scaleIn"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

