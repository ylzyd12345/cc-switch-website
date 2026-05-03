import { type ReactNode, useEffect, useState } from 'react';
import {
  LANGUAGE_STORAGE_KEY,
  LanguageContext,
  type LanguageContextValue,
} from './language-context';
import { type Language, translations } from './translations';

function isSupportedLanguage(language: string | null): language is Language {
  return language === 'zh' || language === 'en' || language === 'ja';
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'zh';

  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isSupportedLanguage(savedLanguage)) return savedLanguage;

  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith('ja')) return 'ja';
  if (browserLanguage.startsWith('en')) return 'en';

  return 'zh';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
