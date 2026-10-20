import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightAction, className = '', disabled, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 font-mono">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-theme-muted uppercase tracking-wider">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-theme-subtle pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full py-2 text-xs bg-theme-main text-theme-main border rounded-xl transition-all duration-150 placeholder:text-theme-subtle focus:outline-none focus:ring-1 ${
              leftIcon ? 'pl-9' : 'pl-3.5'
            } ${rightAction ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-[#F38BA8] focus:border-[#F38BA8] focus:ring-[#F38BA8]/40'
                : 'border-theme focus:border-[#89B4FA] focus:ring-[#89B4FA]/40'
            } ${disabled ? 'opacity-40 cursor-not-allowed bg-theme-card-subtle' : ''} ${className}`}
            {...props}
          />

          {rightAction && <div className="absolute right-2.5 flex items-center">{rightAction}</div>}
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

Input.displayName = 'Input';
