import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { RiskFilter, SortOption } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedRisk: RiskFilter;
  onRiskChange: (filter: RiskFilter) => void;
  counts: {
    all: number;
    high: number;
    medium: number;
    low: number;
  };
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedRisk,
  onRiskChange,
  counts,
  sortBy,
  onSortChange,
  totalFiltered,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Minimal Search & Risk Filter Pills */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Minimal Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
          <input
            id="input-customer-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter by name, ID..."
            className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-8 text-xs text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-900 dark:border-zinc-800 dark:bg-[#18181B] dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2 rounded p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Risk Filter Pills: [All] [High Risk] [Medium Risk] [Low Risk] */}
        <div className="flex flex-wrap items-center gap-1.5" id="risk-filter-pills">
          <button
            id="filter-pill-all"
            type="button"
            onClick={() => onRiskChange('all')}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              selectedRisk === 'all'
                ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
                : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-[#18181B] dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800'
            }`}
          >
            <span>All</span>
            <span className={`font-mono text-[10px] ${selectedRisk === 'all' ? 'opacity-80' : 'text-zinc-400 dark:text-zinc-500'}`}>
              {counts.all}
            </span>
          </button>

          <button
            id="filter-pill-high"
            type="button"
            onClick={() => onRiskChange('high')}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              selectedRisk === 'high'
                ? 'border-rose-600 bg-rose-600 text-white shadow-xs dark:border-rose-500 dark:bg-rose-500 dark:text-white'
                : 'border-zinc-200 bg-white text-zinc-600 hover:border-rose-200 hover:bg-rose-50/50 dark:border-zinc-800 dark:bg-[#18181B] dark:text-zinc-400 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/20'
            }`}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span>High Risk</span>
            <span className={`font-mono text-[10px] ${selectedRisk === 'high' ? 'opacity-90' : 'text-zinc-400 dark:text-zinc-500'}`}>
              {counts.high}
            </span>
          </button>

          <button
            id="filter-pill-medium"
            type="button"
            onClick={() => onRiskChange('medium')}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              selectedRisk === 'medium'
                ? 'border-amber-600 bg-amber-600 text-white shadow-xs dark:border-amber-500 dark:bg-amber-500 dark:text-white'
                : 'border-zinc-200 bg-white text-zinc-600 hover:border-amber-200 hover:bg-amber-50/50 dark:border-zinc-800 dark:bg-[#18181B] dark:text-zinc-400 dark:hover:border-amber-900/50 dark:hover:bg-amber-950/20'
            }`}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>Medium Risk</span>
            <span className={`font-mono text-[10px] ${selectedRisk === 'medium' ? 'opacity-90' : 'text-zinc-400 dark:text-zinc-500'}`}>
              {counts.medium}
            </span>
          </button>

          <button
            id="filter-pill-low"
            type="button"
            onClick={() => onRiskChange('low')}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              selectedRisk === 'low'
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs dark:border-emerald-500 dark:bg-emerald-500 dark:text-white'
                : 'border-zinc-200 bg-white text-zinc-600 hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-zinc-800 dark:bg-[#18181B] dark:text-zinc-400 dark:hover:border-emerald-900/50 dark:hover:bg-emerald-950/20'
            }`}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Low Risk</span>
            <span className={`font-mono text-[10px] ${selectedRisk === 'low' ? 'opacity-90' : 'text-zinc-400 dark:text-zinc-500'}`}>
              {counts.low}
            </span>
          </button>
        </div>
      </div>

      {/* Right: Sort Dropdown & Count */}
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
          <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
          <span className="hidden lg:inline text-zinc-600 dark:text-zinc-300">Sort:</span>
          <select
            id="select-sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-800 outline-none transition-colors focus:border-zinc-900 dark:border-zinc-800 dark:bg-[#18181B] dark:text-zinc-200 dark:focus:border-zinc-400"
          >
            <option value="risk_desc">Highest Risk First</option>
            <option value="risk_asc">Lowest Risk First</option>
            <option value="spend_desc">Monthly Spend (High to Low)</option>
            <option value="tenure_desc">Longest Active Tenure</option>
            <option value="name_asc">Customer Name (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
