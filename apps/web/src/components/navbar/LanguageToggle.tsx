import React from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@bunkerstroy/ui';
import { useLanguage } from '../../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from './constants';

export interface LanguageToggleProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  variant = 'desktop',
  className
}) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'mobile') {
    return (
      <div
        className={cn(
          'flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200',
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#D95D1E] shrink-0" aria-hidden="true" />
          <span className="text-xs font-sans font-bold text-slate-700">Til / Язык / Lang:</span>
        </div>
        <div
          role="group"
          aria-label="Til tanlash / Выбор языка / Select language"
          className="inline-flex p-0.5 rounded-lg bg-white border border-slate-200 font-sans text-xs font-bold shadow-2xs"
        >
          {SUPPORTED_LANGUAGES.map((item) => {
            const isActive = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                title={item.title}
                aria-pressed={isActive}
                className={cn(
                  'px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold',
                  isActive
                    ? 'bg-[#D95D1E] text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center h-9 p-0.5 rounded-xl bg-slate-100 border border-slate-200 font-sans text-xs font-bold select-none shrink-0',
        className
      )}
      role="group"
      aria-label="Til tanlash / Выбор языка / Select language"
    >
      {SUPPORTED_LANGUAGES.map((item) => {
        const isActive = language === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            title={item.title}
            aria-pressed={isActive}
            className={cn(
              'h-7.5 px-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center font-bold min-w-[32px]',
              isActive
                ? 'bg-[#D95D1E] text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
