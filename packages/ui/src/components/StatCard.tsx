import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../utils';

export interface StatTrendObject {
  value: string | number;
  isPositive?: boolean | 'positive' | 'negative' | 'neutral';
  label?: string;
}

export type StatTrend = string | StatTrendObject;

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  value: React.ReactNode;
  unit?: string;
  subtitle?: React.ReactNode;
  trend?: StatTrend;
  icon?: React.ReactNode;
  variant?: 'default' | 'amber' | 'cyan' | 'green' | 'red';
  rivetAccents?: boolean;
  chamfered?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  className,
  title,
  value,
  unit,
  subtitle,
  trend,
  icon,
  variant = 'default',
  rivetAccents = false,
  chamfered = false,
  ...props
}) => {
  const valueColorStyles = {
    default: 'text-bunker-text-primary',
    amber: 'text-bunker-amber-500',
    cyan: 'text-bunker-status-cyan',
    green: 'text-bunker-status-green',
    red: 'text-bunker-status-red'
  };

  const iconBgStyles = {
    default: 'bg-bunker-surface-2 border-bunker-border-strong text-bunker-text-secondary',
    amber: 'bg-bunker-amber-500/15 border-bunker-amber-500/30 text-bunker-amber-500',
    cyan: 'bg-bunker-status-cyan/15 border-bunker-status-cyan/30 text-bunker-status-cyan',
    green: 'bg-bunker-status-green/15 border-bunker-status-green/30 text-bunker-status-green',
    red: 'bg-bunker-status-red/15 border-bunker-status-red/30 text-bunker-status-red'
  };

  return (
    <div
      className={cn(
        'relative bg-bunker-surface-1 border border-bunker-border-strong rounded-2xl p-5 shadow-lg flex flex-col justify-between font-mono transition-all',
        chamfered && 'chamfer-tab-corner rounded-lg',
        className
      )}
      {...props}
    >
      {/* Rivet Accents */}
      {rivetAccents && (
        <>
          <div className="industrial-rivet absolute top-2.5 left-2.5" />
          <div className="industrial-rivet absolute top-2.5 right-2.5" />
        </>
      )}

      {/* Header: Title and optional Icon */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-bunker-text-secondary">
          {title}
        </span>
        {icon && (
          <div
            className={cn(
              'w-8 h-8 rounded-xl border flex items-center justify-center shrink-0',
              iconBgStyles[variant]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="mt-3 flex items-baseline gap-1.5 flex-wrap">
        <span className={cn('text-2xl sm:text-3xl font-black tracking-tight', valueColorStyles[variant])}>
          {value}
        </span>
        {unit && (
          <span className="text-xs font-bold text-bunker-text-muted uppercase">
            {unit}
          </span>
        )}
      </div>

      {/* Footer: Trend and Subtitle */}
      {(trend || subtitle) && (() => {
        const parsedTrend: StatTrendObject | null =
          typeof trend === 'string'
            ? {
                value: trend,
                isPositive: trend.trim().startsWith('+')
                  ? true
                  : trend.trim().startsWith('-')
                  ? false
                  : 'neutral'
              }
            : trend || null;

        const isPos = parsedTrend?.isPositive === true || parsedTrend?.isPositive === 'positive';
        const isNeg = parsedTrend?.isPositive === false || parsedTrend?.isPositive === 'negative';
        const isNeu = parsedTrend?.isPositive === 'neutral';

        return (
          <div className="mt-3 pt-2.5 border-t border-bunker-border-subtle flex items-center justify-between text-xs gap-2 flex-wrap">
            {parsedTrend && (
              <div
                className={cn(
                  'inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-full border',
                  isPos && 'bg-bunker-status-green/15 border-bunker-status-green/30 text-bunker-status-green',
                  isNeg && 'bg-bunker-status-red/15 border-bunker-status-red/30 text-bunker-status-red',
                  isNeu && 'bg-bunker-surface-2 border-bunker-border-strong text-bunker-text-muted'
                )}
              >
                {isPos && <ArrowUpRight className="w-3.5 h-3.5" />}
                {isNeg && <ArrowDownRight className="w-3.5 h-3.5" />}
                {isNeu && <Minus className="w-3.5 h-3.5" />}
                <span>{parsedTrend.value}</span>
                {parsedTrend.label && (
                  <span className="text-[10px] opacity-80 font-normal">
                    {parsedTrend.label}
                  </span>
                )}
              </div>
            )}

            {subtitle && (
              <span className="text-[11px] text-bunker-text-muted truncate">
                {subtitle}
              </span>
            )}
          </div>
        );
      })()}
    </div>
  );
};
