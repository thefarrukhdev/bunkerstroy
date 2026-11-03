import React from 'react';
import { cn } from '@bunkerstroy/ui';
import { useLanguage } from '../../context/LanguageContext';

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
      <div className={cn('flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200', className)}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-700">Til / Язык:</span>
        </div>
        <div className="inline-flex p-0.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] font-bold shadow-2xs">
          <button
            type="button"
            onClick={() => setLanguage('uz')}
            className={cn(
              'px-3 py-1 rounded-md transition-all cursor-pointer',
              language === 'uz'
                ? 'bg-[#D95D1E] text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            UZ
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ru')}
            className={cn(
              'px-3 py-1 rounded-md transition-all cursor-pointer',
              language === 'ru'
                ? 'bg-[#D95D1E] text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            RU
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center h-9 sm:h-9 p-0.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-[11px] font-bold select-none shrink-0',
        className
      )}
      role="group"
      aria-label="Til tanlash"
    >
      <button
        type="button"
        onClick={() => setLanguage('uz')}
        title="O‘zbek tili"
        className={cn(
          'h-7.5 px-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center font-bold min-w-[32px]',
          language === 'uz'
            ? 'bg-[#D95D1E] text-white font-bold shadow-2xs'
            : 'text-slate-600 hover:text-slate-900'
        )}
      >
        UZ
      </button>
      <button
        type="button"
        onClick={() => setLanguage('ru')}
        title="Русский язык"
        className={cn(
          'h-7.5 px-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center font-bold min-w-[32px]',
          language === 'ru'
            ? 'bg-[#D95D1E] text-white font-bold shadow-2xs'
            : 'text-slate-600 hover:text-slate-900'
        )}
      >
        RU
      </button>
    </div>
  );
};
