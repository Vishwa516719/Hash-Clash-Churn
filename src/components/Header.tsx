import React from 'react';
import { Sun, Moon, UploadCloud, ShieldCheck, Database, Building2 } from 'lucide-react';
import { CompanyProfile } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenUpload: () => void;
  companyProfile: CompanyProfile;
  totalCustomersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenUpload,
  companyProfile,
  totalCustomersCount,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-zinc-800/80 dark:bg-[#09090B]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* Swiss minimalist geometric logo mark */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white shadow-sm ring-1 ring-zinc-900/10 dark:bg-zinc-100 dark:text-zinc-950 dark:ring-white/10">
              <span className="font-mono text-sm font-bold tracking-tighter">HC</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
                  Hash Clash Churn
                </span>
                <span className="hidden font-mono text-[11px] text-zinc-600 dark:text-zinc-300 sm:inline-block">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
                Churn Prediction Agent
              </p>
            </div>
          </div>

          <div className="hidden h-5 w-[1px] bg-zinc-200 dark:bg-zinc-800 md:block" />

          {/* Status Pill: Agent Active */}
          <div
            id="agent-status-pill"
            className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-medium tracking-tight">Agent: Active</span>
          </div>

          {/* Company / Source Pill */}
          {companyProfile.companyName && (
            <div className="hidden items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 lg:flex">
              <Building2 className="h-3.5 w-3.5 text-zinc-400" />
              <span className="font-medium text-zinc-800 dark:text-zinc-200">{companyProfile.companyName}</span>
              {companyProfile.fileName && (
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  • {companyProfile.fileName}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Replace File / Upload New Excel Button */}
          <button
            id="btn-replace-upload-file"
            onClick={onOpenUpload}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 shadow-xs transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-800 dark:bg-[#18181B] dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
            title="Replace current dataset with another Excel or CSV file"
          >
            <UploadCloud className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
            <span className="hidden sm:inline">Replace File / Upload New Excel</span>
            <span className="sm:hidden">Upload</span>
          </button>

          {/* CRITICAL REQUIREMENT 1: Persistent Light/Dark mode toggle (Sun/Moon switch) */}
          <button
            id="theme-toggle-switch"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-xs transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-[#18181B] dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-zinc-700 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
