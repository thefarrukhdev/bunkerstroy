import React from 'react';

export type StatusType =
  | 'ACTIVE'
  | 'VERIFIED'
  | 'PAID'
  | 'COMPLETED'
  | 'AVAILABLE'
  | 'PENDING'
  | 'PENDING_REVIEW'
  | 'ON_ROUTE'
  | 'BLOCKED'
  | 'REJECTED'
  | 'FAILED'
  | 'CANCELLED'
  | 'LOW_STOCK'
  | 'MAINTENANCE';

interface StatusBadgeProps {
  status: StatusType | string;
  customLabel?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  customLabel,
  className = ''
}) => {
  const normalized = status.toUpperCase();

  const getBadgeStyle = () => {
    switch (normalized) {
      case 'ACTIVE':
      case 'VERIFIED':
      case 'PAID':
      case 'COMPLETED':
      case 'AVAILABLE':
        return {
          container: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold',
          dot: 'bg-emerald-600',
          defaultText: customLabel || normalized
        };

      case 'PENDING':
      case 'PENDING_REVIEW':
      case 'ON_ROUTE':
        return {
          container: 'bg-orange-50 text-[#D95D1E] border border-orange-200 font-bold',
          dot: 'bg-[#D95D1E] animate-pulse',
          defaultText: customLabel || normalized
        };

      case 'BLOCKED':
      case 'REJECTED':
      case 'FAILED':
      case 'CANCELLED':
        return {
          container: 'bg-rose-50 text-rose-700 border border-rose-200 font-bold',
          dot: 'bg-rose-600',
          defaultText: customLabel || normalized
        };

      case 'LOW_STOCK':
      case 'MAINTENANCE':
        return {
          container: 'bg-amber-50 text-amber-800 border border-amber-200 font-bold',
          dot: 'bg-amber-600',
          defaultText: customLabel || normalized
        };

      default:
        return {
          container: 'bg-slate-100 text-slate-700 border border-slate-200',
          dot: 'bg-slate-400',
          defaultText: customLabel || normalized
        };
    }
  };

  const badge = getBadgeStyle();

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-mono tracking-wider uppercase rounded-md transition-all ${badge.container} ${className}`}
    >
      <span>{badge.defaultText}</span>
    </span>
  );
};
