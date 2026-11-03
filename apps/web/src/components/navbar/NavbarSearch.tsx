import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { cn } from '@bunkerstroy/ui';
import { NavbarSearchProps } from './types';

export const NavbarSearch: React.FC<NavbarSearchProps> = ({
  className,
  placeholder = 'Material, sement, armatura, g‘isht yoki zavod...',
  autoFocus = false,
  onSearchComplete
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('query') || searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  // Sync state if URL query changes externally
  useEffect(() => {
    const q = searchParams.get('query') || searchParams.get('q') || '';
    setSearchTerm(q);
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchTerm.trim()) {
      params.set('query', searchTerm.trim());
    } else {
      params.delete('query');
    }

    // Always navigate to /catalog with search query so products can be viewed immediately
    const targetPath = location.pathname === '/catalog' ? '/catalog' : '/catalog';
    navigate(`${targetPath}?${params.toString()}`);
    if (onSearchComplete) onSearchComplete();
  };

  const handleClear = () => {
    setSearchTerm('');
    const params = new URLSearchParams(location.search);
    params.delete('query');
    params.delete('q');
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'group relative flex items-center w-full h-10 rounded-xl bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:border-[#D95D1E] focus-within:ring-2 focus-within:ring-[#D95D1E]/15 transition-all shadow-2xs',
        className
      )}
      role="search"
    >
      <div className="pl-3 pr-2 text-slate-400 group-focus-within:text-[#D95D1E] transition-colors pointer-events-none">
        <Search className="w-4 h-4" />
      </div>

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
        className="flex-1 w-full h-full bg-transparent text-xs sm:text-sm font-sans text-slate-900 placeholder-slate-400 outline-none pr-2"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Qidiruvni tozalash"
          className="p-1 mr-1 text-slate-400 hover:text-slate-700 cursor-pointer rounded-md hover:bg-slate-200/60 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      <button
        type="submit"
        aria-label="Qidirish"
        className="h-8 px-3.5 mr-1 rounded-lg bg-[#D95D1E] hover:bg-[#B43B06] active:scale-98 text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
      >
        <span className="hidden sm:inline">Qidirish</span>
        <Search className="w-3.5 h-3.5 sm:hidden" />
      </button>
    </form>
  );
};
