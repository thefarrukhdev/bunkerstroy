import React from 'react';
import { cn } from '../utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  rivetAccents?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  rivetAccents = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative bg-[#1A1D20] border border-[#33373B] rounded-2xl p-5 text-[#F5F5F2] shadow-lg',
        rivetAccents && 'overflow-hidden',
        className
      )}
      {...props}
    >
      {rivetAccents && (
        <>
          <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#51504A] border border-[#222528]" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#51504A] border border-[#222528]" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#51504A] border border-[#222528]" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#51504A] border border-[#222528]" />
        </>
      )}
      {children}
    </div>
  );
};
