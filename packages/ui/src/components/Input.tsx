import React, { forwardRef, useId } from 'react';
import { cn } from '../utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isMono?: boolean;
  sizeVariant?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isMono = false,
      sizeVariant = 'md',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}` : `input-${generatedId.replace(/:/g, '')}`);
    const inputName = props.name || inputId;

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5',
      md: 'text-sm px-3.5 py-2.5',
      lg: 'text-base px-4 py-3'
    };

    const leftPadding = {
      sm: leftIcon ? 'pl-8' : '',
      md: leftIcon ? 'pl-10' : '',
      lg: leftIcon ? 'pl-11' : ''
    };

    const rightPadding = {
      sm: rightIcon ? 'pr-8' : '',
      md: rightIcon ? 'pr-10' : '',
      lg: rightIcon ? 'pr-11' : ''
    };

    const iconSizes = {
      sm: 'left-2.5 w-3.5 h-3.5',
      md: 'left-3 w-4 h-4',
      lg: 'left-3.5 w-5 h-5'
    };

    const rightIconSizes = {
      sm: 'right-2.5 w-3.5 h-3.5',
      md: 'right-3 w-4 h-4',
      lg: 'right-3.5 w-5 h-5'
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-bunker-text-primary uppercase tracking-wider font-mono select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div
              className={cn(
                'absolute pointer-events-none text-bunker-text-muted flex items-center justify-center',
                iconSizes[sizeVariant]
              )}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={inputName}
            disabled={disabled}
            className={cn(
              'w-full bg-bunker-input border rounded-xl text-bunker-text-primary placeholder-bunker-text-muted outline-none transition-all duration-150 shadow-2xs',
              'focus:ring-2 focus:ring-bunker-amber-500/20',
              error
                ? 'border-bunker-status-red text-bunker-status-red focus:border-bunker-status-red focus:ring-bunker-status-red/20'
                : 'border-bunker-border-strong hover:border-slate-300 focus:border-bunker-amber-500',
              disabled && 'opacity-50 cursor-not-allowed bg-bunker-surface-2',
              isMono && 'font-mono',
              sizeStyles[sizeVariant],
              leftPadding[sizeVariant],
              rightPadding[sizeVariant],
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {rightIcon && (
            <div
              className={cn(
                'absolute text-bunker-text-muted flex items-center justify-center',
                rightIconSizes[sizeVariant]
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-bunker-status-red font-mono flex items-center gap-1">
            <span aria-hidden="true">⚠</span>
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-bunker-text-muted font-mono">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
