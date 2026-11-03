import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';
import { cn } from '@bunkerstroy/ui';
import { RegionSelectorProps } from './types';
import { UZBEKISTAN_REGIONS } from './constants';

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  currentRegion = 'Barcha viloyatlar',
  onSelectRegion,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const activeRegion = searchParams.get('region') || currentRegion;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (region: string) => {
    setIsOpen(false);
    if (onSelectRegion) {
      onSelectRegion(region);
    }
    const params = new URLSearchParams(location.search);
    if (region === 'Barcha viloyatlar') {
      params.delete('region');
    } else {
      params.set('region', region);
    }
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className={cn('relative shrink-0', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 h-9 sm:h-9 min-h-[38px] px-2.5 sm:px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-mono font-medium transition-all cursor-pointer shadow-2xs select-none outline-none focus-visible:ring-2 focus-visible:ring-[#D95D1E]/30"
        title="Viloyat bo‘yicha filtr"
      >
        <MapPin className="w-3.5 h-3.5 text-[#D95D1E] shrink-0" />
        <span className="truncate max-w-[100px] sm:max-w-[125px] xl:max-w-[150px]">
          {activeRegion}
        </span>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-slate-400 transition-transform duration-150 shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Yetkazib berish hududlari"
          className="absolute left-0 sm:left-auto sm:right-0 mt-1.5 w-56 max-h-80 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-xl z-50 py-1 font-mono text-xs text-slate-700 animate-in fade-in-50 zoom-in-95"
        >
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
            Yetkazib berish hududi:
          </div>
          {UZBEKISTAN_REGIONS.map((region) => {
            const isSelected = activeRegion === region;
            return (
              <button
                key={region}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(region)}
                className={cn(
                  'w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer',
                  isSelected ? 'text-[#D95D1E] font-bold bg-orange-50' : 'text-slate-700'
                )}
              >
                <span>{region}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#D95D1E]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
