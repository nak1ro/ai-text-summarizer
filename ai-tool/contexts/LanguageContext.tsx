'use client';

import React, {createContext, JSX, useContext, useState} from 'react';
import { getStorageItem, setStorageItem } from '@/lib/storage';

export type Language = 'en' | 'es' | 'de' | 'fr' | 'pl';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DEFAULT_LANGUAGE: Language = 'en';
const LANGUAGE_STORAGE_KEY = 'language';
const SUPPORTED_LANGUAGES: Language[] = ['en', 'es', 'de', 'fr', 'pl'];
const isBrowser = typeof window !== 'undefined';

// Check storage first, then browser language
function getInitialLanguage(): Language {
    const storedLanguage = getStoredLanguage();
    if (storedLanguage) {
        return storedLanguage;
    }
    return getBrowserLanguage();
}

// Detect browser language
function getBrowserLanguage(): Language {
    if (!isBrowser) {
        return DEFAULT_LANGUAGE;
    }
    const browserLang = navigator.language.split('-')[0];
    const supportedLang = SUPPORTED_LANGUAGES.find((lang) => lang === browserLang);
    return supportedLang ?? DEFAULT_LANGUAGE;
}

function getStoredLanguage(): Language | null {
    if (!isBrowser) {
        return null;
    }
    return getStorageItem<Language | null>(LANGUAGE_STORAGE_KEY, null);
}

function persistLanguage(lang: Language): void {
    if (!isBrowser) {
        return;
    }
    setStorageItem(LANGUAGE_STORAGE_KEY, lang);
}

export function LanguageProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [language, setLanguageState] = useState<Language>(getInitialLanguage);

    const setLanguage = (lang: Language): void => {
        setLanguageState(lang);
        persistLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextType {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
