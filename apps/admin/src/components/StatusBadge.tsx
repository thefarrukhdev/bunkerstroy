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
          container: 'bg-[#A6E3A1]/15 text-[#A6E3A1] border border-[#A6E3A1]/30 font-bold',
          dot: 'bg-[#A6E3A1]',
          defaultText: customLabel || normalized
        };

      case 'PENDING':
      case 'PENDING_REVIEW':
      case 'ON_ROUTE':
        return {
          container: 'bg-[#F9E2AF]/15 text-[#F9E2AF] border border-[#F9E2AF]/30 font-medium',
          dot: 'bg-[#F9E2AF] animate-pulse',
          defaultText: customLabel || normalized
        };

      case 'BLOCKED':
      case 'REJECTED':
      case 'FAILED':
      case 'CANCELLED':
        return {
          container: 'bg-[#F38BA8]/15 text-[#F38BA8] border border-[#F38BA8]/30 font-medium',
          dot: 'bg-[#F38BA8]',
          defaultText: customLabel || normalized
        };

      case 'LOW_STOCK':
      case 'MAINTENANCE':
        return {
          container: 'bg-[#FAB387]/15 text-[#FAB387] border border-[#FAB387]/30 font-bold',
          dot: 'bg-[#FAB387]',
          defaultText: customLabel || normalized
        };

      default:
        return {
          container: 'bg-theme-card-subtle text-theme-muted border border-theme',
          dot: 'bg-neutral-500',
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
