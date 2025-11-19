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

interface LanguageSelectorProps {
    isMobile?: boolean;
}

export function LanguageSelector({ isMobile = false }: LanguageSelectorProps) {
    const {language, setLanguage} = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [isPositioned, setIsPositioned] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setIsPositioned(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                if (buttonRef.current) {
                    const rect = buttonRef.current.getBoundingClientRect();
                    if (isMobile) {
                        // Mobile: open to the top - calculate position accounting for transform
                        setDropdownPosition({
                            top: rect.top + rect.height,
                            left: rect.left,
                        });
                    } else {
                        // Desktop: open to the right
                        setDropdownPosition({
                            top: rect.bottom + 8,
                            left: rect.left,
                        });
                    }
                    setIsPositioned(true);
                }
            });
        } else {
            setIsPositioned(false);
        }
    }, [isOpen, isMobile]);

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full h-full" ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`group w-full h-full rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 hover:from-zinc-200 hover:to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 dark:hover:from-zinc-700 dark:hover:to-zinc-800 transition-all duration-300 border border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-center shadow-sm hover:shadow-md text-zinc-700 dark:text-zinc-300 relative overflow-hidden ${
                    isMobile ? 'gap-1.5' : ''
                }`}
                aria-label="Select language"
            >
                <span className={`${isMobile ? 'text-lg' : 'text-xl'} ${isMobile ? '' : 'group-hover:scale-110 transition-transform duration-300'}`}>{languageFlags[language]}</span>
                {isMobile && (
                    <span className="text-xs font-medium hidden xs:inline">{language.toUpperCase()}</span>
                )}
                <svg
                    className={`${isMobile ? 'absolute bottom-1 right-1' : 'absolute bottom-1 right-1'} w-2.5 h-2.5 text-zinc-500 dark:text-zinc-400 ${isMobile ? '' : 'transition-transform duration-300'} ${
                        isOpen ? (isMobile ? 'rotate-0' : 'rotate-180') : (isMobile ? 'rotate-180' : 'rotate-0')
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && isPositioned && (
                <div 
                    className={`fixed w-52 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-700/50 py-2 z-[9999] overflow-hidden ${isMobile ? '' : 'animate-scaleIn'}`}
                    style={{ 
                        top: `${dropdownPosition.top}px`, 
                        left: `${dropdownPosition.left}px`,
                        transform: isMobile ? 'translateY(calc(-100% - 80px))' : 'none',
                        transformOrigin: isMobile ? 'bottom' : 'top'
                    }}
                >
                    {(Object.keys(translations) as Language[]).map((lang) => (
                        <button
                            key={lang}
                            onClick={() => handleLanguageChange(lang)}
                            className={`w-full px-4 py-3 text-left flex items-center gap-3 ${isMobile ? '' : 'transition-all duration-200'} ${
                                language === lang
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80'
                            }`}
                        >
                            <span className="text-xl">{languageFlags[lang]}</span>
                            <span className="flex-1">{translations[lang].languages[lang]}</span>
                            {language === lang && (
                                <svg
                                    className={`w-5 h-5 text-blue-600 dark:text-blue-400 ${isMobile ? '' : 'animate-scaleIn'}`}
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

