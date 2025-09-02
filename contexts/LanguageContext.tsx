
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { translations } from '../lib/translations';
import { Language } from '../types';

type LanguageContextType = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = useCallback((key: string): string => {
        const keys = key.split('.');
        
        const findTranslation = (lang: Language): string | undefined => {
            let result: any = translations[lang];
            for (const k of keys) {
                result = result?.[k];
                if (result === undefined) return undefined;
            }
            return result;
        };

        let result = findTranslation(language);
        if (result === undefined && language !== 'en') {
            result = findTranslation('en');
        }

        return result || key;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
