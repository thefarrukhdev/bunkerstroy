import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', id, disabled, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 font-mono">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-bold text-sky-200 uppercase tracking-wider">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={`w-full appearance-none pl-3.5 pr-9 py-2.5 sm:py-2 text-base sm:text-xs min-h-[44px] sm:min-h-0 bg-[#071326] text-white border rounded-xl transition-all duration-150 focus:outline-none focus:ring-1 cursor-pointer ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/40'
                : 'border-[#1E3A6D] focus:border-[#FFB800] focus:ring-[#FFB800]/40'
            } ${disabled ? 'opacity-40 cursor-not-allowed bg-[#0A1931]' : ''} ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-[#0A1931] text-white">
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown className="w-4 h-4 text-sky-300 absolute right-3 pointer-events-none" />
        </div>

        {error ? (
          <p className="text-[11px] text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-sky-300/80">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
