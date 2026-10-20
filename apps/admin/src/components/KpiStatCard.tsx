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
    <div className="p-5 rounded-2xl border border-theme bg-theme-card text-theme-main shadow-xs transition-colors">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-mono font-semibold text-theme-muted uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-xl bg-theme-card-subtle border border-theme flex items-center justify-center text-[#89B4FA]">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-black font-mono tracking-tight text-theme-main">
          {value}
        </span>
      </div>

      {(change || subtitle) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs font-mono">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                changeType === 'positive'
                  ? 'text-[#A6E3A1]'
                  : changeType === 'negative'
                  ? 'text-[#F38BA8]'
                  : 'text-theme-muted'
              }`}
            >
              {changeType === 'positive' && <TrendingUp className="w-3.5 h-3.5" />}
              {changeType === 'negative' && <TrendingDown className="w-3.5 h-3.5" />}
              {changeType === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              <span>{change}</span>
            </span>
          )}
          <span className="text-[11px] text-theme-subtle truncate">
            {subtitle || periodLabel}
          </span>
        </div>
      )}
    </div>
  );
};
