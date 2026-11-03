/**
 * BunkerStroy Core Internationalization & Localization Module
 * Exports complete dictionaries for Uzbek (uz), Russian (ru), and English (en).
 */

import { uz } from './uz';
import { ru } from './ru';
import { en } from './en';

export type TranslationDictionary = Record<string, string>;
export type LocaleKey = keyof typeof uz;
export type SupportedLocale = 'uz' | 'ru' | 'en';

export { uz, ru, en };

export const dictionaries: Record<SupportedLocale, TranslationDictionary> = {
  uz,
  ru,
  en
};

export const defaultLocale: SupportedLocale = 'uz';

export const supportedLocales: SupportedLocale[] = ['uz', 'ru', 'en'];

/**
 * Type-safe lookup helper
 */
export function getTranslation(locale: SupportedLocale, key: string, fallback?: string): string {
  const dict = dictionaries[locale] || dictionaries[defaultLocale];
  return dict[key] ?? fallback ?? key;
}
