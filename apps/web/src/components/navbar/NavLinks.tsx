import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@bunkerstroy/ui';
import { NAV_LINKS } from './constants';

export interface NavLinksProps {
  className?: string;
  onLinkClick?: () => void;
}

export const NavLinks: React.FC<NavLinksProps> = ({ className, onLinkClick }) => {
  return (
    <nav
      className={cn('flex items-center gap-1 xl:gap-1.5 text-xs font-mono font-bold', className)}
      aria-label="Asosiy bo‘limlar navigatsiyasi"
    >
      {NAV_LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.id}
            to={link.path}
            end={link.exact}
            onClick={onLinkClick}
            className={({ isActive }) =>
              cn(
                'px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[#D95D1E]/40',
                isActive
                  ? 'bg-orange-50 text-[#D95D1E] border border-orange-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              )
            }
          >
            <Icon className="w-3.5 h-3.5 text-[#D95D1E] shrink-0" />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
