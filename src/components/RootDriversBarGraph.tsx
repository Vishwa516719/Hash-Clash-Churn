import React from 'react';
import { CustomerRecord, RootDriverCategory } from '../types';
import { calculateDriverDistribution } from '../utils/driverClassifier';
import { BarChart3, RotateCcw, Filter, Flame } from 'lucide-react';

interface RootDriversBarGraphProps {
  customers: CustomerRecord[];
  selectedDriver: RootDriverCategory | null;
  onSelectDriver: (driver: RootDriverCategory | null) => void;
}

export const RootDriversBarGraph: React.FC<RootDriversBarGraphProps> = ({
  customers,
  selectedDriver,
  onSelectDriver,
}) => {
  const driverDistribution = calculateDriverDistribution(customers);

  const handleBarClick = (driver: RootDriverCategory) => {
    if (selectedDriver === driver) {
      onSelectDriver(null); // Click active bar resets filter
    } else {
      onSelectDriver(driver);
    }
  };

  // Max percentage to scale the horizontal bar (ensure at least 40% axis as requested)
  const maxAxisPct = 40;

  // Custom accent styling based on driver category
  const getDriverColor = (driver: RootDriverCategory, isSelected: boolean) => {
    switch (driver) {
      case 'Pricing / Unexpected Fees':
        return isSelected
          ? 'bg-rose-500 text-white'
          : 'bg-rose-500/80 hover:bg-rose-500';
      case 'Slow Customer Support':
        return isSelected
          ? 'bg-amber-500 text-white'
          : 'bg-amber-500/80 hover:bg-amber-500';
      case 'Feature Gaps':
        return isSelected
          ? 'bg-indigo-500 text-white'
          : 'bg-indigo-500/80 hover:bg-indigo-500';
      case 'Drop in Login Activity':
        return isSelected
          ? 'bg-purple-500 text-white'
          : 'bg-purple-500/80 hover:bg-purple-500';
      case 'Bugs / Platform Crashes':
        return isSelected
          ? 'bg-red-600 text-white'
          : 'bg-red-600/80 hover:bg-red-600';
      default:
        return 'bg-zinc-600';
    }
  };

  return (
    <div
      id="card-root-drivers-feature-importance"
      className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all dark:border-zinc-800 dark:bg-[#18181B]"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              2. ROOT DRIVERS ("WHY LEAVING")
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Quantified Driver Impact & Feature Importance
            </p>
          </div>
        </div>

        {selectedDriver && (
          <button
            id="btn-clear-driver-filter"
            onClick={() => onSelectDriver(null)}
            className="flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            title="Reset driver filter"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear Filter</span>
          </button>
        )}
      </div>

      {/* Horizontal Bar Chart Body */}
      <div className="flex flex-col space-y-3.5 py-4">
        {driverDistribution.map((item, idx) => {
          const isSelected = selectedDriver === item.driver;
          const isDimmed = selectedDriver !== null && !isSelected;
          // Scale bar relative to 40% scale cap (or 100% if exceeds)
          const barWidth = Math.min(100, Math.max(8, (item.percentage / maxAxisPct) * 100));

          return (
            <div
              key={item.driver}
              id={`driver-row-${idx}`}
              onClick={() => handleBarClick(item.driver)}
              className={`group cursor-pointer rounded-lg p-2 transition-all ${
                isSelected
                  ? 'bg-zinc-100 dark:bg-zinc-800/80 ring-1 ring-zinc-900 dark:ring-zinc-100'
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
              }`}
              style={{ opacity: isDimmed ? 0.4 : 1 }}
            >
              {/* Row Label & Metric */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                    0{idx + 1}
                  </span>
                  <span
                    className={`font-medium ${
                      isSelected
                        ? 'text-zinc-950 dark:text-white font-semibold'
                        : 'text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white'
                    }`}
                  >
                    {item.driver}
                  </span>
                  {idx === 0 && (
                    <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 text-[9px] font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      <Flame className="h-2.5 w-2.5" /> Primary Threat
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {item.count} {item.count === 1 ? 'acct' : 'accts'}
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Bar Fill Track */}
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getDriverColor(
                    item.driver,
                    isSelected
                  )}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Horizontal Axis Scale (0% to 40%) */}
        <div className="pt-2">
          <div className="flex justify-between border-t border-zinc-200/80 pt-1.5 font-mono text-[10px] text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
            <span>0%</span>
            <span>10%</span>
            <span>20%</span>
            <span>30%</span>
            <span className="text-zinc-600 dark:text-zinc-300 font-semibold">40% Impact Threshold</span>
          </div>
        </div>
      </div>

      {/* Footer Helper Note */}
      <div className="flex items-center justify-between border-t border-zinc-100 pt-2 text-[11px] text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <Filter className="h-3 w-3" />
          Click any horizontal bar to isolate matching cohort
        </span>
        {selectedDriver && (
          <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[180px]">
            Filtered: {selectedDriver}
          </span>
        )}
      </div>
    </div>
  );
};
