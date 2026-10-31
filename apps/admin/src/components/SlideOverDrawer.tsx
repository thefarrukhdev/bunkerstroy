import React from 'react';
import { Drawer } from '@bunkerstroy/ui';

interface SlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string;
}

export const SlideOverDrawer: React.FC<SlideOverDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  widthClass
}) => {
  const getSize = () => {
    if (widthClass?.includes('max-w-xl') || widthClass?.includes('max-w-2xl')) return 'lg';
    if (widthClass?.includes('max-w-sm')) return 'sm';
    return 'md';
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      size={getSize()}
      title={title}
      subtitle={subtitle}
      footer={footer}
    >
      {children}
    </Drawer>
  );
};
