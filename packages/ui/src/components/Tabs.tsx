import React, { createContext, useContext, useState } from 'react';
import { cn } from '../utils';

export type TabsVariant = 'standard' | 'chamfer' | 'pills';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
}

export const Tabs: React.FC<TabsProps> = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = 'standard',
  className,
  children,
  ...props
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = (val: string) => {
    if (!isControlled) {
      setUncontrolledValue(val);
    }
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, variant }}>
      <div className={cn('w-full space-y-4', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList: React.FC<TabsListProps> = ({ className, children, ...props }) => {
  const context = useContext(TabsContext);
  const variant = context?.variant || 'standard';

  const variantStyles = {
    standard: 'flex border-b border-bunker-border-strong gap-2',
    chamfer: 'flex gap-2 overflow-x-auto no-scrollbar',
    pills: 'inline-flex items-center gap-1 bg-bunker-surface-2 p-1 rounded-xl border border-bunker-border-strong text-xs font-mono'
  };

  return (
    <div
      role="tablist"
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export interface TabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabTrigger: React.FC<TabTriggerProps> = ({
  className,
  value,
  children,
  disabled,
  onClick,
  ...props
}) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabTrigger must be used within a Tabs component');
  }

  const { value: activeValue, onValueChange, variant } = context;
  const isActive = activeValue === value;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onValueChange(value);
    onClick?.(e);
  };

  const variantTriggerStyles = {
    standard: cn(
      'px-4 py-2.5 text-xs font-mono font-bold transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer',
      isActive
        ? 'border-bunker-amber-500 text-bunker-amber-500'
        : 'border-transparent text-bunker-text-secondary hover:text-bunker-text-primary hover:border-bunker-border-strong'
    ),
    chamfer: cn(
      'chamfer-tab px-4 py-2 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer select-none rounded-xl',
      isActive
        ? 'bg-bunker-amber-500 text-white shadow-xs'
        : 'bg-bunker-surface-1 text-bunker-text-secondary border border-bunker-border-subtle hover:text-bunker-text-primary hover:bg-bunker-surface-hover'
    ),
    pills: cn(
      'px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none',
      isActive
        ? 'bg-bunker-surface-1 text-bunker-amber-500 shadow-xs'
        : 'text-bunker-text-secondary hover:text-bunker-text-primary'
    )
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        variantTriggerStyles[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsTrigger = TabTrigger;

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  className,
  value,
  children,
  ...props
}) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  const { value: activeValue } = context;
  if (activeValue !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn('animate-in fade-in duration-200 outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
};
