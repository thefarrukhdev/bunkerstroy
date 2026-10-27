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
          <label htmlFor={inputId} className="block text-xs font-bold text-sky-200 uppercase tracking-wider">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-sky-300 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            name={inputName}
            ref={ref}
            disabled={disabled}
            className={`w-full py-2 text-xs bg-[#071326] text-white border rounded-xl transition-all duration-150 placeholder:text-sky-300/40 focus:outline-none focus:ring-1 ${
              leftIcon ? 'pl-9' : 'pl-3.5'
            } ${rightAction ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/40'
                : 'border-[#1E3A6D] focus:border-[#FFB800] focus:ring-[#FFB800]/40'
            } ${disabled ? 'opacity-40 cursor-not-allowed bg-[#0A1931]' : ''} ${className}`}
            {...props}
          />

          {rightAction && <div className="absolute right-2.5 flex items-center">{rightAction}</div>}
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

Input.displayName = 'Input';
