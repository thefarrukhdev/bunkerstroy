import React from 'react';
import { cn } from '../utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  rivetAccents?: boolean;
  chamfered?: boolean;
  subtle?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  rivetAccents = false,
  chamfered = false,
  subtle = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative bg-bunker-surface-1 border rounded-2xl p-5 text-bunker-text-primary shadow-xs hover:shadow-md transition-all',
        subtle ? 'border-bunker-border-subtle' : 'border-bunker-border-strong',
        chamfered && 'chamfer-tab-corner rounded-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
