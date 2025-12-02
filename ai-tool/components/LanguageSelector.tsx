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

interface DropdownPosition {
    top: number;
    left: number;
}

interface LanguageSelectorButtonProps {
    isMobile: boolean;
    isOpen: boolean;
    language: Language;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
    onToggle: () => void;
}

interface LanguageDropdownProps {
    isMobile: boolean;
    isOpen: boolean;
    isPositioned: boolean;
    dropdownPosition: DropdownPosition;
    selectedLanguage: Language;
    onLanguageChange: (lang: Language) => void;
}

interface ArrowIconProps {
    isMobile: boolean;
    isOpen: boolean;
}

interface LanguageOptionProps {
    lang: Language;
    isSelected: boolean;
    isMobile: boolean;
    onSelect: (lang: Language) => void;
}

function calculateDropdownPosition(rect: DOMRect, isMobile: boolean): DropdownPosition {
    if (isMobile) {
        return {
            top: rect.top + rect.height,
            left: rect.left,
        };
    }

    return {
        top: rect.bottom + 8,
        left: rect.left,
    };
}

function ArrowIcon({isMobile, isOpen}: ArrowIconProps) {
    const baseClasses =
        'absolute bottom-1 right-1 w-2.5 h-2.5 text-zinc-500 dark:text-zinc-400';
    const transformClasses = isMobile ? '' : 'transition-transform duration-300';
    const rotationClass = isOpen
        ? isMobile
            ? 'rotate-0'
            : 'rotate-180'
        : isMobile
            ? 'rotate-180'
            : 'rotate-0';

    return (
        <svg
            className={`${baseClasses} ${transformClasses} ${rotationClass}`}
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
    );
}

function LanguageSelectorButton({
                                    isMobile,
                                    isOpen,
                                    language,
                                    buttonRef,
                                    onToggle,
                                }: LanguageSelectorButtonProps) {
    const baseClasses =
        'group w-full h-full rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 hover:from-zinc-200 hover:to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 dark:hover:from-zinc-700 dark:hover:to-zinc-800 transition-all duration-300 border border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-center shadow-sm hover:shadow-md text-zinc-700 dark:text-zinc-300 relative overflow-hidden';
    const mobileGapClass = isMobile ? 'gap-1.5' : '';
    const flagSizeClass = isMobile ? 'text-lg' : 'text-xl';
    const flagHoverClass = isMobile ? '' : 'group-hover:scale-110 transition-transform duration-300';

    return (
        <button
            ref={buttonRef}
            type="button"
            onClick={onToggle}
            className={`${baseClasses} ${mobileGapClass}`}
            aria-label="Select language"
        >
            <span className={`${flagSizeClass} ${flagHoverClass}`}>{languageFlags[language]}</span>
            {isMobile && (
                <span className="text-xs font-medium hidden xs:inline">
          {language.toUpperCase()}
        </span>
            )}
            <ArrowIcon isMobile={isMobile} isOpen={isOpen}/>
        </button>
    );
}

function LanguageOption({
                            lang,
                            isSelected,
                            isMobile,
                            onSelect,
                        }: LanguageOptionProps) {
    const baseClasses = 'w-full px-4 py-3 text-left flex items-center gap-3';
    const transitionClasses = isMobile ? '' : 'transition-all duration-200';
    const selectedClasses =
        'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 font-medium';
    const defaultClasses =
        'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80';

    return (
        <button
            type="button"
            key={lang}
            onClick={() => onSelect(lang)}
            className={`${baseClasses} ${transitionClasses} ${
                isSelected ? selectedClasses : defaultClasses
            }`}
        >
            <span className="text-xl">{languageFlags[lang]}</span>
            <span className="flex-1">{translations[lang].languages[lang]}</span>
            {isSelected && (
                <svg
                    className={`w-5 h-5 text-blue-600 dark:text-blue-400 ${
                        isMobile ? '' : 'animate-scaleIn'
                    }`}
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
    );
}

function LanguageDropdown({
                              isMobile,
                              isOpen,
                              isPositioned,
                              dropdownPosition,
                              selectedLanguage,
                              onLanguageChange,
                          }: LanguageDropdownProps) {
    if (!isOpen || !isPositioned) {
        return null;
    }

    const baseClasses =
        'fixed w-52 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-700/50 py-2 z-[9999] overflow-hidden';
    const animationClass = isMobile ? '' : 'animate-scaleIn';
    const transform = isMobile ? 'translateY(calc(-100% - 80px))' : 'none';
    const transformOrigin = isMobile ? 'bottom' : 'top';

    return (
        <div
            className={`${baseClasses} ${animationClass}`}
            style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                transform,
                transformOrigin,
            }}
        >
            {(Object.keys(translations) as Language[]).map((lang) => (
                <LanguageOption
                    key={lang}
                    lang={lang}
                    isSelected={selectedLanguage === lang}
                    isMobile={isMobile}
                    onSelect={onLanguageChange}
                />
            ))}
        </div>
    );
}

export function LanguageSelector({isMobile = false}: LanguageSelectorProps) {
    const {language, setLanguage} = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
        top: 0,
        left: 0,
    });
    const [isPositioned, setIsPositioned] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

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
                    const position = calculateDropdownPosition(rect, isMobile);
                    setDropdownPosition(position);
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

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="relative w-full h-full" ref={dropdownRef}>
            <LanguageSelectorButton
                isMobile={isMobile}
                isOpen={isOpen}
                language={language}
                buttonRef={buttonRef}
                onToggle={handleToggle}
            />
            <LanguageDropdown
                isMobile={isMobile}
                isOpen={isOpen}
                isPositioned={isPositioned}
                dropdownPosition={dropdownPosition}
                selectedLanguage={language}
                onLanguageChange={handleLanguageChange}
            />
        </div>
    );
}
