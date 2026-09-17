import React from 'react';
import { ChevronRight, ShieldCheck, Clock, DollarSign, ArrowUpRight, AlertCircle } from 'lucide-react';
import { CustomerRecord } from '../types';
import { getCustomerPrimaryDriver } from '../utils/driverClassifier';

interface CustomerTileProps {
  customer: CustomerRecord;
  onClick: () => void;
  isSelected?: boolean;
}

export const CustomerTile: React.FC<CustomerTileProps> = ({
  customer,
  onClick,
  isSelected = false,
}) => {
  // Badge styling depending on risk tier
  const renderRiskBadge = () => {
    if (customer.riskTier === 'high') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-300">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span>{customer.churnProbability}% High Risk</span>
        </span>
      );
    }
    if (customer.riskTier === 'medium') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span>{customer.churnProbability}% Medium Risk</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span>{customer.churnProbability}% Low Risk</span>
      </span>
    );
  };

  return (
    <div
      id={`customer-tile-${customer.id}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative flex w-full cursor-pointer flex-col gap-3 rounded-xl border p-4 shadow-xs transition-all sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
        isSelected
          ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900 dark:border-zinc-100 dark:bg-zinc-800/80 dark:ring-zinc-100'
          : 'border-zinc-200/90 bg-white hover:border-zinc-300 hover:bg-zinc-50/70 hover:shadow-xs dark:border-zinc-800 dark:bg-[#18181B] dark:hover:border-zinc-700 dark:hover:bg-[#202024]'
      }`}
    >
      {/* Column 1: Customer Name & ID */}
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        {/* Subtle avatar badge with initials */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-semibold ${
            customer.riskTier === 'high'
              ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300'
              : customer.riskTier === 'medium'
              ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300'
              : 'border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
          }`}
        >
          {customer.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold tracking-tight text-zinc-950 group-hover:text-zinc-900 dark:text-white">
              {customer.name}
            </h4>
            <span className="font-mono text-xs text-zinc-600 dark:text-zinc-300">
              • #{customer.id}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <span className="truncate">{customer.company}</span>
            <span>•</span>
            <span className="shrink-0 font-medium text-zinc-600 dark:text-zinc-300">{customer.plan}</span>
            <span className="hidden xl:inline text-zinc-300 dark:text-zinc-700">•</span>
            <span className="hidden xl:inline-flex items-center gap-1 font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
              <span className="h-1 w-1 rounded-full bg-zinc-400" />
              {getCustomerPrimaryDriver(customer)}
            </span>
          </div>
        </div>
      </div>

      {/* Aligned Columns Container for desktop */}
      <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-2 sm:flex sm:items-center sm:gap-6 sm:border-t-0 sm:pt-0 sm:text-right dark:border-zinc-800">
        {/* Column 2: Tenure / Duration of Service */}
        <div className="sm:w-36">
          <span className="block font-mono text-[11px] text-zinc-600 dark:text-zinc-300 sm:hidden">
            TENURE
          </span>
          <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
            {customer.tenureMonths} Months active
          </span>
          <span className="block text-[11px] text-zinc-600 dark:text-zinc-300">
            {customer.contractType || 'Annual'}
          </span>
        </div>

        {/* Column 3: Monthly Spend */}
        <div className="sm:w-32">
          <span className="block font-mono text-[11px] text-zinc-600 dark:text-zinc-300 sm:hidden">
            SPEND
          </span>
          <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            ${customer.monthlySpend.toFixed(2)} / mo
          </span>
          <span className="block text-[11px] text-zinc-600 dark:text-zinc-300">
            ${customer.totalSpend.toLocaleString()} LTV
          </span>
        </div>

        {/* Column 4: Churn Probability Badge */}
        <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:w-44 sm:justify-end">
          <div className="flex flex-col items-start sm:items-end gap-1">
            {renderRiskBadge()}
            {customer.retentionStatus === 'deployed' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                <span>Offer Deployed</span>
              </span>
            )}
          </div>

          {/* Subtle chevron arrow "→" */}
          <div className="ml-3 flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-200">
            <span className="font-mono text-sm font-semibold">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};
