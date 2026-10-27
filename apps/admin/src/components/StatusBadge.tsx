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
          container: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-black',
          dot: 'bg-emerald-400',
          defaultText: customLabel || normalized
        };

      case 'PENDING':
      case 'PENDING_REVIEW':
      case 'ON_ROUTE':
        return {
          container: 'bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 font-bold',
          dot: 'bg-[#FFB800] animate-pulse',
          defaultText: customLabel || normalized
        };

      case 'BLOCKED':
      case 'REJECTED':
      case 'FAILED':
      case 'CANCELLED':
        return {
          container: 'bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold',
          dot: 'bg-rose-400',
          defaultText: customLabel || normalized
        };

      case 'LOW_STOCK':
      case 'MAINTENANCE':
        return {
          container: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold',
          dot: 'bg-amber-400',
          defaultText: customLabel || normalized
        };

      default:
        return {
          container: 'bg-[#0F2547] text-sky-200 border border-[#1E3A6D]',
          dot: 'bg-sky-400',
          defaultText: customLabel || normalized
        };
    }
  };

  const badge = getBadgeStyle();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase rounded-full transition-all ${badge.container} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
      <span>{badge.defaultText}</span>
    </span>
  );
};
