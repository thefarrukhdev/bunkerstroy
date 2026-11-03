import React from 'react';
import { Link } from 'react-router-dom';
import { HardHat } from 'lucide-react';
import { cn, RealTelegramLogo, RealInstagramLogo, RealPhoneLogo } from '@bunkerstroy/ui';
import { BrandLogoProps } from './types';
import { OFFICIAL_CHANNELS } from './constants';

export const BrandLogo: React.FC<BrandLogoProps> = ({
  onClick,
  showSocialsOnDesktop = false,
  className
}) => {
  return (
    <div className={cn('flex items-center gap-3 shrink-0', className)}>
      <Link
        to="/"
        onClick={onClick}
        className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0 py-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[#D95D1E]/40 rounded-xl"
        aria-label="BunkerStroy Asosiy sahifa"
      >
        {/* Clean Terracotta Logo Container */}
        <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-xl bg-[#D95D1E] flex items-center justify-center text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
          <HardHat className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white stroke-[2.2]" />
        </div>

        {/* Brand Name & Subtitle */}
        <div className="flex flex-col">
          <span className="font-heading font-black text-base sm:text-lg lg:text-xl tracking-tight text-slate-900 leading-none">
            <span className="text-[#D95D1E]">BUNKER</span>STROY
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-mono font-medium tracking-[0.14em] text-slate-500 uppercase mt-1 leading-none hidden min-[400px]:block">
            Sanoat Xaridlari B2B &amp; B2C
          </span>
        </div>
      </Link>

      {/* Official Social & Contact Channels (Desktop only) */}
      {showSocialsOnDesktop && (
        <div className="hidden xl:flex items-center gap-1.5 pl-3 border-l border-slate-200">
          <a
            href={OFFICIAL_CHANNELS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            title="BunkerStroy Telegram kanali (@bunkerstroy_uz)"
          >
            <RealTelegramLogo className="w-5.5 h-5.5" />
          </a>
          <a
            href={OFFICIAL_CHANNELS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            title="BunkerStroy Instagram (@bunkerstroy.uz)"
          >
            <RealInstagramLogo className="w-5.5 h-5.5" />
          </a>
          <a
            href={`tel:${OFFICIAL_CHANNELS.phoneRaw}`}
            className="w-7 h-7 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            title={`Dispetcherlik qo‘ng‘irog‘i: ${OFFICIAL_CHANNELS.phone}`}
          >
            <RealPhoneLogo className="w-5.5 h-5.5" />
          </a>
        </div>
      )}
    </div>
  );
};
