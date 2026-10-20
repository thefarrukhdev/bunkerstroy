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
          <label htmlFor={selectId} className="block text-xs font-semibold text-theme-muted uppercase tracking-wider">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={`w-full appearance-none pl-3.5 pr-9 py-2 text-xs bg-theme-main text-theme-main border rounded-xl transition-all duration-150 focus:outline-none focus:ring-1 cursor-pointer ${
              error
                ? 'border-[#F38BA8] focus:border-[#F38BA8] focus:ring-[#F38BA8]/40'
                : 'border-theme focus:border-[#89B4FA] focus:ring-[#89B4FA]/40'
            } ${disabled ? 'opacity-40 cursor-not-allowed bg-theme-card-subtle' : ''} ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-theme-card text-theme-main">
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown className="w-4 h-4 text-theme-subtle absolute right-3 pointer-events-none" />
        </div>

        {error ? (
          <p className="text-[11px] text-[#F38BA8] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-theme-subtle">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
