import React, { useState, useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  FileQuestion
} from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T | ((row: T) => string);
  pageSize?: number;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  actionsSlot?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'Qidiruv...',
  searchKey,
  pageSize = 10,
  isLoading = false,
  emptyTitle = "Ma'lumot topilmadi",
  emptyDescription = "Qidiruv parametrlarini o'zgartirib ko'ring.",
  actionsSlot
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter Data (Optimized with 300ms Debounce)
  const filteredData = useMemo(() => {
    if (!debouncedSearch.trim()) return data;

    const term = debouncedSearch.toLowerCase().trim();
    return data.filter((row) => {
      if (typeof searchKey === 'function') {
        return searchKey(row).toLowerCase().includes(term);
      }
      if (searchKey) {
        return String(row[searchKey] || '').toLowerCase().includes(term);
      }
      return Object.values(row).some((val) =>
        String(val || '').toLowerCase().includes(term)
      );
    });
  }, [data, debouncedSearch, searchKey]);

  // Sort Data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return sortConfig.direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    setCurrentPage(1);
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  return (
    <div className="w-full flex flex-col rounded-lg border border-theme bg-theme-card overflow-hidden text-theme-main transition-colors">
      {/* Table Toolbar */}
      <div className="p-3 sm:p-4 border-b border-theme flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-theme-header">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-theme-subtle pointer-events-none" />
          <input
            id="admin-datatable-search"
            name="search"
            type="text"
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full pl-9 pr-9 py-2.5 sm:py-2 text-base sm:text-xs min-h-[44px] sm:min-h-0 font-mono bg-theme-main text-theme-main border border-theme rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 transition-all placeholder:text-theme-subtle"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              aria-label="Qidiruvni tozalash"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-theme-subtle hover:text-theme-main cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Optional Actions Slot */}
        {actionsSlot && (
          <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
            {actionsSlot}
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-theme bg-theme-card-subtle text-theme-muted font-mono uppercase tracking-wider text-[11px] whitespace-nowrap">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key, col.sortable)}
                  className={`py-3 px-4 select-none whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:text-theme-main' : ''} ${
                    col.className || ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-theme-subtle">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="w-3 h-3 text-theme-main" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-theme-main" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-theme/40 font-sans">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse bg-theme-card">
                  {columns.map((col) => (
                    <td key={col.key} className="py-3.5 px-4">
                      <div className="h-4 bg-theme-card-subtle rounded-sm w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-theme-card-subtle transition-colors border-b border-theme/60"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`py-3.5 px-4 text-theme-main ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileQuestion className="w-8 h-8 text-theme-subtle" />
                    <p className="text-sm font-semibold text-theme-main font-mono">{emptyTitle}</p>
                    <p className="text-xs text-theme-muted max-w-sm">{emptyDescription}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-theme flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-theme-muted bg-theme-header">
        <div className="flex items-center gap-2">
          <span>
            Jami: <strong className="text-theme-main">{sortedData.length}</strong> ta qator
          </span>
          {searchTerm && (
            <span className="text-theme-subtle">
              (filtr bo'yicha)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span>
            Sahifa <strong className="text-theme-main">{currentPage}</strong> / {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Oldingi sahifa"
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-theme bg-theme-card text-theme-main hover:border-theme-subtle disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Keyingi sahifa"
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-theme bg-theme-card text-theme-main hover:border-theme-subtle disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
