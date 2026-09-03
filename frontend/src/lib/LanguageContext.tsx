'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from './translations';

export type { Language };

export interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>('en');

    useEffect(() => {
        try {
            const savedLang = localStorage.getItem('finx_lang') as Language;
            if (savedLang && translations[savedLang]) {
                setLangState(savedLang);
            }
        } catch (e) {
            console.error('Error loading language setting:', e);
        }
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        try {
            localStorage.setItem('finx_lang', newLang);
        } catch (e) {
            console.error('Error saving language setting:', e);
        }
    };

    const t = (key: string, fallback?: string): string => {
        const dict = translations[lang] || translations['en'];
        if (dict && dict[key]) {
            return dict[key];
        }
        // Fallback to English translation
        if (translations['en'] && translations['en'][key]) {
            return translations['en'][key];
        }
        // Fallback to provided fallback string or key itself
        return fallback !== undefined ? fallback : key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
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
