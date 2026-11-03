import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { cn } from '@bunkerstroy/ui';
import { NavbarSearchProps } from './types';

export const NavbarSearch: React.FC<NavbarSearchProps> = ({
  className,
  placeholder = 'Material, sement, armatura, g‘isht...',
  autoFocus = false,
  onSearchComplete
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('query') || searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchTerm.trim()) {
      params.set('query', searchTerm.trim());
    } else {
      params.delete('query');
    }
    navigate(`/?${params.toString()}`);
    if (onSearchComplete) onSearchComplete();
  };

  const handleClear = () => {
    setSearchTerm('');
    const params = new URLSearchParams(location.search);
    params.delete('query');
    navigate(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative flex items-center', className)}>
      <Search className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      <input
        id="marketplace-nav-search"
        name="query"
        type="text"
        autoComplete="off"
        autoFocus={autoFocus}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        aria-label="Qurilish mollari qidiruvi"
        className="w-full h-9 sm:h-9 pl-8 pr-7 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#D95D1E] focus:ring-2 focus:ring-[#D95D1E]/10 text-base sm:text-xs font-sans text-slate-900 placeholder-slate-400 outline-none transition-colors shadow-2xs"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Qidiruvni tozalash"
          className="absolute right-2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 rounded-md hover:bg-slate-200/60 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </form>
  );
};
