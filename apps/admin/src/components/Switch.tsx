import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = ''
}) => {
  return (
    <label className={`flex items-start gap-3 cursor-pointer select-none ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative inline-flex items-center mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-[#0F2547] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#071326] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white peer-checked:after:bg-[#071326] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border border-[#1E3A6D] peer-checked:bg-[#FFB800] peer-checked:border-[#FFB800]" />
      </div>

      {(label || description) && (
        <div className="text-xs font-mono">
          {label && <div className="font-bold text-white">{label}</div>}
          {description && <div className="text-sky-200 text-[11px] mt-0.5 leading-relaxed">{description}</div>}
        </div>
      )}
    </label>
  );
};
