import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo
} from 'react';
import type { Language, LanguageContextValue, TranslationDictionary } from './types';
import { formatCurrency, formatNumber, formatDate } from './formatters';
import { uz } from './locales/uz';
import { ru } from './locales/ru';
import { en } from './locales/en';

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  uz,
  ru,
  en
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'bunkerstroy_lang';

export const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'uz';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'uz' || stored === 'ru' || stored === 'en') {
      return stored;
    }
    // Browser language detection
    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    if (browserLang === 'ru') return 'ru';
    if (browserLang === 'en') return 'en';
  } catch {
    // fallback
  }
  return 'uz';
};

export interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return defaultLanguage || getInitialLanguage();
  });

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, newLang);
        document.documentElement.lang = newLang;
      }
    } catch {
      // storage unavailable
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'uz' ? 'ru' : language === 'ru' ? 'en' : 'uz');
  }, [language, setLanguage]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useCallback(
    (
      key: string,
      paramsOrFallback?: Record<string, string | number> | string,
      fallback?: string
    ): string => {
      let actualFallback = fallback;
      let actualParams: Record<string, string | number> | undefined;

      if (typeof paramsOrFallback === 'string') {
        actualFallback = paramsOrFallback;
      } else if (paramsOrFallback && typeof paramsOrFallback === 'object') {
        actualParams = paramsOrFallback;
      }

      const currentDict = TRANSLATIONS[language] || TRANSLATIONS.uz;
      let translation = currentDict[key] || TRANSLATIONS.uz[key] || actualFallback || key;

      if (actualParams && typeof translation === 'string') {
        Object.entries(actualParams).forEach(([paramKey, paramValue]) => {
          translation = translation.replace(
            new RegExp(`\\{${paramKey}\\}`, 'g'),
            String(paramValue)
          );
        });
      }

      return translation;
    },
    [language]
  );

  const getOrderStatusText = useCallback(
    (status: string): string => {
      const key = `order.status.${status}`;
      return t(key, status);
    },
    [t]
  );

  const contextValue: LanguageContextValue = useMemo(() => {
    return {
      language,
      setLanguage,
      toggleLanguage,
      t,
      getOrderStatusText,
      formatCurrency: (amount: number) => formatCurrency(amount, language),
      formatNumber: (amount: number) => formatNumber(amount, language),
      formatDate: (date: Date | string | number) => formatDate(date, language)
    };
  }, [language, setLanguage, toggleLanguage, t, getOrderStatusText]);

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if called outside provider
    return {
      language: 'uz',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string, _params?: any, fallback?: string) => fallback || key,
      getOrderStatusText: (status: string) => status,
      formatCurrency: (amount: number) => `${amount.toLocaleString()} so‘m`,
      formatNumber: (amount: number) => amount.toLocaleString(),
      formatDate: (date: any) => new Date(date).toLocaleDateString()
    };
  }
  return context;
};

// Aliases for standard i18n conventions
export const useTranslation = useLanguage;
