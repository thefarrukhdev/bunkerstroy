import React from 'react';

export interface CurrentUser {
  stir?: string;
  companyName?: string;
  displayName?: string;
  email?: string;
  role?: string;
  phone?: string;
  [key: string]: any;
}

export interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  currentUser: CurrentUser | null;
  onLogout: () => void;
}

export interface CabinetOption {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  badgeColor: string;
  isAdmin?: boolean;
  isDedicatedApp?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

export interface RegionSelectorProps {
  currentRegion?: string;
  onSelectRegion?: (region: string) => void;
  className?: string;
}

export interface BrandLogoProps {
  onClick?: () => void;
  showSocialsOnDesktop?: boolean;
  className?: string;
}

export interface NavbarSearchProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSearchComplete?: () => void;
}

export interface CartButtonProps {
  count: number;
  onClick: () => void;
  className?: string;
}

export interface CabinetSwitcherProps {
  currentUser: CurrentUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  className?: string;
}

export interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount: number;
  onOpenCart: () => void;
  currentUser: CurrentUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}
