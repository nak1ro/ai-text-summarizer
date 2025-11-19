'use client';

import React, {createContext, useContext, useEffect, useState} from 'react';

export type Language = 'en' | 'es' | 'de' | 'fr' | 'pl';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({children}: {children: React.ReactNode}) {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        // Check localStorage first, then browser language
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('language') as Language | null;
            if (savedLang) {
                setLanguageState(savedLang);
            } else {
                // Detect browser language
                const browserLang = navigator.language.split('-')[0];
                const supportedLang = ['en', 'es', 'de', 'fr', 'pl'].includes(browserLang) 
                    ? browserLang as Language 
                    : 'en';
                setLanguageState(supportedLang);
            }
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', lang);
        }
    };

    return (
        <LanguageContext.Provider value={{language, setLanguage}}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

