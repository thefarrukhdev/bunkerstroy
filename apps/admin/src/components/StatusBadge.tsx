import React from 'react';
import { Badge, type BadgeVariant } from '@bunkerstroy/ui';

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

  const getVariant = (): BadgeVariant => {
    switch (normalized) {
      case 'ACTIVE':
      case 'VERIFIED':
      case 'PAID':
      case 'COMPLETED':
      case 'AVAILABLE':
        return 'success';
      case 'PENDING':
      case 'PENDING_REVIEW':
      case 'ON_ROUTE':
      case 'LOW_STOCK':
      case 'MAINTENANCE':
        return 'warning';
      case 'BLOCKED':
      case 'REJECTED':
      case 'FAILED':
      case 'CANCELLED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <Badge
      variant={getVariant()}
      size="sm"
      isMono
      className={className}
    >
      {customLabel || normalized}
    </Badge>
  );
};
