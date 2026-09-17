import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CustomerRecord, RiskTier } from '../types';
import { PieChart, Filter, RotateCcw } from 'lucide-react';

interface RiskDonutChartProps {
  customers: CustomerRecord[];
  selectedRisk: RiskTier | null;
  onSelectRisk: (tier: RiskTier | null) => void;
}

export const RiskDonutChart: React.FC<RiskDonutChartProps> = ({
  customers,
  selectedRisk,
  onSelectRisk,
}) => {
  const [hoveredTier, setHoveredTier] = useState<RiskTier | null>(null);

  const total = customers.length;
  const highCount = customers.filter((c) => c.riskTier === 'high').length;
  const mediumCount = customers.filter((c) => c.riskTier === 'medium').length;
  const lowCount = customers.filter((c) => c.riskTier === 'low').length;

  const highPct = total > 0 ? Math.round((highCount / total) * 100) : 0;
  const mediumPct = total > 0 ? Math.round((mediumCount / total) * 100) : 0;
  // Adjust lowPct to ensure they sum to 100 if non-empty
  const lowPct = total > 0 ? Math.max(0, 100 - highPct - mediumPct) : 0;

  // Donut geometry configuration
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2; // (180 - 24) / 2 = 78
  const center = size / 2; // 90
  const circumference = 2 * Math.PI * radius; // ~490.09

  // Segments calculation
  const segments: {
    tier: RiskTier;
    label: string;
    threshold: string;
    count: number;
    percentage: number;
    strokeColor: string;
    hoverColor: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }[] = [
    {
      tier: 'high',
      label: 'High Risk',
      threshold: '70–100%',
      count: highCount,
      percentage: highPct,
      strokeColor: '#F43F5E', // Rose/Coral Red
      hoverColor: '#FB7185',
      bgColor: 'bg-rose-500/10',
      textColor: 'text-rose-700 dark:text-rose-400',
      borderColor: 'border-rose-500/30',
    },
    {
      tier: 'medium',
      label: 'Medium Risk',
      threshold: '40–69%',
      count: mediumCount,
      percentage: mediumPct,
      strokeColor: '#F59E0B', // Amber / Orange
      hoverColor: '#FBBF24',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-700 dark:text-amber-400',
      borderColor: 'border-amber-500/30',
    },
    {
      tier: 'low',
      label: 'Low Risk',
      threshold: '0–39%',
      count: lowCount,
      percentage: lowPct,
      strokeColor: '#10B981', // Emerald Green
      hoverColor: '#34D399',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      borderColor: 'border-emerald-500/30',
    },
  ];

  // Calculate stroke-dasharray and stroke-dashoffset for SVG
  let cumulativeFraction = 0;
  const renderedSlices = segments.map((seg) => {
    const fraction = total > 0 ? seg.count / total : 0;
    const dashLength = fraction * circumference;
    const gapLength = circumference - dashLength;
    const offset = -cumulativeFraction * circumference;
    cumulativeFraction += fraction;

    return {
      ...seg,
      dashLength,
      gapLength,
      offset,
    };
  });

  const activeSegment = segments.find((s) => s.tier === (hoveredTier || selectedRisk));

  const handleSliceClick = (tier: RiskTier) => {
    if (selectedRisk === tier) {
      onSelectRisk(null); // Deselect on clicking active slice
    } else {
      onSelectRisk(tier);
    }
  };

  return (
    <div
      id="card-risk-tier-segmentation"
      className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all dark:border-zinc-800 dark:bg-[#18181B]"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <PieChart className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              1. RISK TIER SEGMENTATION
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Interactive Donut Cohort Breakdown
            </p>
          </div>
        </div>

        {selectedRisk && (
          <button
            onClick={() => onSelectRisk(null)}
            className="flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            title="Reset risk filter"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear Filter</span>
          </button>
        )}
      </div>

      {/* Chart Canvas & Center Stat */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-5">
        <div className="relative flex items-center justify-center">
          <svg
            width={size}
            height={size}
            className="-rotate-90 transform"
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background Base Ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-zinc-100 dark:text-zinc-800/60"
            />

            {/* Interactive Slices */}
            {total > 0 &&
              renderedSlices.map((slice) => {
                const isSelected = selectedRisk === slice.tier;
                const isHovered = hoveredTier === slice.tier;
                const stroke = isHovered ? slice.hoverColor : slice.strokeColor;
                const isDimmed = selectedRisk !== null && !isSelected;

                return (
                  <circle
                    key={slice.tier}
                    id={`donut-slice-${slice.tier}`}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={stroke}
                    strokeWidth={isSelected || isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={`${slice.dashLength} ${slice.gapLength}`}
                    strokeDashoffset={slice.offset}
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      opacity: isDimmed ? 0.35 : 1,
                      filter: isSelected ? 'drop-shadow(0px 0px 6px rgba(0,0,0,0.3))' : 'none',
                    }}
                    onMouseEnter={() => setHoveredTier(slice.tier)}
                    onMouseLeave={() => setHoveredTier(null)}
                    onClick={() => handleSliceClick(slice.tier)}
                  />
                );
              })}
          </svg>

          {/* Donut Center Display */}
          <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
            {activeSegment ? (
              <>
                <span className={`text-2xl font-bold tracking-tight ${activeSegment.textColor}`}>
                  {activeSegment.percentage}%
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {activeSegment.label}
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  {activeSegment.count} accounts
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {total}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  ACCOUNTS
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  100% Monitored
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend Summary Badges */}
        <div className="flex flex-col gap-2.5 w-full sm:w-auto">
          {segments.map((seg) => {
            const isSelected = selectedRisk === seg.tier;
            return (
              <button
                key={seg.tier}
                id={`legend-badge-${seg.tier}`}
                type="button"
                onClick={() => handleSliceClick(seg.tier)}
                onMouseEnter={() => setHoveredTier(seg.tier)}
                onMouseLeave={() => setHoveredTier(null)}
                className={`flex items-center justify-between gap-4 rounded-lg border px-3 py-2 text-left transition-all ${
                  isSelected
                    ? `${seg.borderColor} ${seg.bgColor} ring-1 ring-zinc-900 dark:ring-zinc-100`
                    : 'border-zinc-200/80 bg-zinc-50/70 hover:border-zinc-300 hover:bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.strokeColor }}
                  />
                  <div>
                    <span className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {seg.label}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                      ({seg.threshold})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-mono text-xs font-bold ${seg.textColor}`}>
                    {seg.percentage}%
                  </span>
                  <span className="block font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                    {seg.count} {seg.count === 1 ? 'cust' : 'custs'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Helper Note */}
      <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-2 text-[11px] text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <Filter className="h-3 w-3" />
          Click any slice or badge to filter queue
        </span>
        {selectedRisk && (
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            Filtered: {selectedRisk.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};
