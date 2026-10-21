import React, { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  sizeVariant?: 'sm' | 'md' | 'lg';
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      sizeVariant = 'md',
      options,
      children,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}` : `select-${generatedId.replace(/:/g, '')}`);

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5 pr-8',
      md: 'text-sm px-3.5 py-2.5 pr-10',
      lg: 'text-base px-4 py-3 pr-11'
    };

    const chevronSizes = {
      sm: 'right-2.5 w-3.5 h-3.5',
      md: 'right-3 w-4 h-4',
      lg: 'right-3.5 w-5 h-5'
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-bunker-text-primary uppercase tracking-wider font-mono select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full bg-bunker-input border rounded-xl text-bunker-text-primary outline-none transition-all duration-150 appearance-none cursor-pointer',
              'focus:ring-1 focus:ring-bunker-amber-500/50',
              error
                ? 'border-bunker-status-red text-bunker-status-red focus:border-bunker-status-red focus:ring-bunker-status-red/50'
                : 'border-bunker-border-strong hover:border-bunker-border-active/60 focus:border-bunker-amber-500',
              disabled && 'opacity-50 cursor-not-allowed bg-bunker-surface-2',
              sizeStyles[sizeVariant],
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-bunker-surface-1 text-bunker-text-primary py-1"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <ChevronDown
            className={cn(
              'absolute pointer-events-none text-bunker-text-muted transition-transform',
              chevronSizes[sizeVariant]
            )}
            aria-hidden="true"
          />
        </div>

        {error && (
          <p id={`${selectId}-error`} className="text-xs text-bunker-status-red font-mono flex items-center gap-1">
            <span aria-hidden="true">⚠</span>
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p id={`${selectId}-helper`} className="text-xs text-bunker-text-muted font-mono">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
