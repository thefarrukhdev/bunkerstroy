import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightAction, className = '', disabled, id, name, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id || (label ? `admin-in-${label.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}` : `admin-in-${autoId.replace(/:/g, '')}`);
    const inputName = name || inputId;

    return (
      <div className="w-full space-y-1.5 font-mono">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            name={inputName}
            ref={ref}
            disabled={disabled}
            className={`w-full py-2.5 sm:py-2 text-base sm:text-xs min-h-[44px] sm:min-h-0 bg-slate-50 text-slate-900 border rounded-xl transition-all duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
              leftIcon ? 'pl-10 sm:pl-9' : 'pl-3.5'
            } ${rightAction ? 'pr-11 sm:pr-10' : 'pr-3.5'} ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/40'
                : 'border-slate-200 focus:border-[#D95D1E] focus:ring-[#D95D1E]/20'
            } ${disabled ? 'opacity-40 cursor-not-allowed bg-slate-100' : ''} ${className}`}
            {...props}
          />

          {rightAction && <div className="absolute right-2.5 flex items-center">{rightAction}</div>}
        </div>

        {error ? (
          <p className="text-[11px] text-rose-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
