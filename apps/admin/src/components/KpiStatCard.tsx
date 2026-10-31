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
    <div className="p-5 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xs hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#D95D1E] shadow-xs">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-black font-mono tracking-tight text-slate-900 font-mono-numbers">
          {value}
        </span>
      </div>

      {(change || subtitle) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs font-mono">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                changeType === 'positive'
                  ? 'text-emerald-600'
                  : changeType === 'negative'
                  ? 'text-rose-600'
                  : 'text-slate-500'
              }`}
            >
              {changeType === 'positive' && <TrendingUp className="w-3.5 h-3.5" />}
              {changeType === 'negative' && <TrendingDown className="w-3.5 h-3.5" />}
              {changeType === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              <span>{change}</span>
            </span>
          )}
          <span className="text-[11px] text-slate-500 truncate">
            {subtitle || periodLabel}
          </span>
        </div>
      )}
    </div>
  );
};
