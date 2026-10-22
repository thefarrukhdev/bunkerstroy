import React from 'react';
import { cn } from '../utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rect',
  width,
  height,
  style,
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    rect: 'h-24 w-full rounded-xl',
    circle: 'rounded-full aspect-square'
  };

  const computedStyle: React.CSSProperties = {
    ...style,
    width: width !== undefined ? width : style?.width,
    height: height !== undefined ? height : style?.height
  };

  return (
    <div
      aria-hidden="true"
      style={computedStyle}
      className={cn(
        'bg-bunker-surface-2 animate-pulse border border-bunker-border-subtle/50 relative overflow-hidden',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
};
