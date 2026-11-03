export type Language = 'uz' | 'ru' | 'en';

export type { TranslationDictionary, SupportedLocale, LocaleKey } from './locales/index';

export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, paramsOrFallback?: Record<string, string | number> | string, fallback?: string) => string;
  formatCurrency: (amount: number) => string;
  formatNumber: (amount: number) => string;
  formatDate: (date: Date | string | number) => string;
  getOrderStatusText: (status: string) => string;
}

export interface LanguageOption {
  code: Language;
  label: string;
  shortLabel: string;
  title?: string;
  flag?: string;
}
