import React from 'react';
import { Users, AlertTriangle, DollarSign, ShieldCheck, TrendingDown } from 'lucide-react';
import { CustomerRecord } from '../types';

interface KpiMetricsProps {
  customers: CustomerRecord[];
}

export const KpiMetrics: React.FC<KpiMetricsProps> = ({ customers }) => {
  const totalAccounts = customers.length;
  const highRiskCustomers = customers.filter((c) => c.riskTier === 'high');
  const highRiskCount = highRiskCustomers.length;
  const highRiskPct = totalAccounts > 0 ? Math.round((highRiskCount / totalAccounts) * 100) : 0;

  // Monthly revenue at risk: sum of monthly spend of high risk customers
  const monthlyRevenueAtRisk = highRiskCustomers.reduce((acc, c) => acc + c.monthlySpend, 0);

  // Deployed retention offers count
  const deployedCount = customers.filter((c) => c.retentionStatus === 'deployed').length;
  const savedMonthlyRevenue = customers
    .filter((c) => c.retentionStatus === 'deployed')
    .reduce((acc, c) => acc + c.monthlySpend, 0);

  // Average churn probability
  const avgProbability =
    totalAccounts > 0
      ? Math.round(customers.reduce((acc, c) => acc + c.churnProbability, 0) / totalAccounts)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Monitored Accounts */}
      <div
        id="kpi-total-accounts"
        className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-[#18181B] dark:hover:border-zinc-700"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            Total Monitored Accounts
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {totalAccounts.toLocaleString()}
          </span>
          <span className="text-xs text-zinc-600 dark:text-zinc-300">
            active entities
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-300">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Real-time telemetry ingestion</span>
        </div>
      </div>

      {/* 2. High-Risk Accounts Count */}
      <div
        id="kpi-high-risk-accounts"
        className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-[#18181B] dark:hover:border-zinc-700"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            High-Risk Accounts
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {highRiskCount}
          </span>
          <span className="inline-flex items-center rounded-md border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 font-mono text-xs font-medium text-rose-700 dark:text-rose-300">
            {highRiskPct}% of fleet
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-300">
          <span>Action threshold ≥ 70% probability</span>
        </div>
      </div>

      {/* 3. Monthly Revenue at Risk ($) */}
      <div
        id="kpi-revenue-at-risk"
        className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-[#18181B] dark:hover:border-zinc-700"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            Monthly Revenue at Risk
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            ${monthlyRevenueAtRisk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-zinc-600 dark:text-zinc-300">
            / mo
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-300">
          <span>${(monthlyRevenueAtRisk * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })} annualized ARR exposure</span>
        </div>
      </div>

      {/* 4. Active Retention Deployments / Fleet Average */}
      <div
        id="kpi-retention-saved"
        className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-[#18181B] dark:hover:border-zinc-700"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            Retention Interventions
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {deployedCount}
          </span>
          <span className="text-xs text-zinc-600 dark:text-zinc-300">
            {deployedCount === 1 ? 'offer active' : 'offers active'}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
          {deployedCount > 0 ? (
            <span>${savedMonthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo preserved MRR</span>
          ) : (
            <span className="text-zinc-600 dark:text-zinc-300">Fleet avg churn risk: {avgProbability}%</span>
          )}
        </div>
      </div>
    </div>
  );
};
