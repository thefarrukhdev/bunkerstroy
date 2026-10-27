import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiStatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  periodLabel?: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

export const KpiStatCard: React.FC<KpiStatCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  periodLabel = "o'tgan oyga nisbatan",
  icon,
  subtitle
}) => {
  return (
    <div className="p-5 rounded-2xl border border-[#1E3A6D] bg-[#0A1931] text-white shadow-md hover:border-[#2E5A9C] transition-all">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-mono font-bold text-sky-200 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-xl bg-[#0F2547] border border-[#1E3A6D] flex items-center justify-center text-[#FFB800] shadow-sm">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-black font-mono tracking-tight text-white font-mono-numbers">
          {value}
        </span>
      </div>

      {(change || subtitle) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs font-mono">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                changeType === 'positive'
                  ? 'text-emerald-400'
                  : changeType === 'negative'
                  ? 'text-rose-400'
                  : 'text-sky-300'
              }`}
            >
              {changeType === 'positive' && <TrendingUp className="w-3.5 h-3.5" />}
              {changeType === 'negative' && <TrendingDown className="w-3.5 h-3.5" />}
              {changeType === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              <span>{change}</span>
            </span>
          )}
          <span className="text-[11px] text-sky-300/80 truncate">
            {subtitle || periodLabel}
          </span>
        </div>
      )}
    </div>
  );
};
