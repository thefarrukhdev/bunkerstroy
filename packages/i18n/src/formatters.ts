import type { Language } from './types';

export const formatCurrency = (amount: number, language: Language): string => {
  const rounded = Math.round(amount);
  if (language === 'en') {
    return `${rounded.toLocaleString('en-US')} UZS`;
  }
  if (language === 'ru') {
    return `${rounded.toLocaleString('ru-RU')} сум`;
  }
  // uz default
  return `${rounded.toLocaleString('uz-UZ').replace(/,/g, ' ')} so‘m`;
};

export const formatNumber = (amount: number, language: Language): string => {
  if (language === 'en') {
    return amount.toLocaleString('en-US');
  }
  if (language === 'ru') {
    return amount.toLocaleString('ru-RU');
  }
  return amount.toLocaleString('uz-UZ').replace(/,/g, ' ');
};

export const formatDate = (dateInput: Date | string | number, language: Language): string => {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';

  const locale = language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'uz-UZ';
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
