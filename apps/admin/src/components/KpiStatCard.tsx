import React from 'react';
import { StatCard } from '@bunkerstroy/ui';

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
    <StatCard
      title={title}
      value={value}
      icon={icon}
      subtitle={subtitle || (change ? periodLabel : undefined)}
      trend={
        change
          ? {
              value: change,
              isPositive: changeType === 'positive' ? true : changeType === 'negative' ? false : 'neutral'
            }
          : undefined
      }
    />
  );
};
