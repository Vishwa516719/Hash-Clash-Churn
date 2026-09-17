import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  DollarSign,
  Send,
  Check,
  Building2,
  Mail,
  Zap,
  Tag
} from 'lucide-react';
import { CustomerRecord, RetentionOffer } from '../types';

interface CustomerDrawerProps {
  customer: CustomerRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onDeployOffer: (customerId: string, offer: RetentionOffer) => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({
  customer,
  isOpen,
  onClose,
  onDeployOffer,
}) => {
  if (!customer) return null;

  const [selectedOfferIndex, setSelectedOfferIndex] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(customer.retentionStatus === 'deployed');

  const selectedOffer =
    customer.retentionOffers && customer.retentionOffers.length > 0
      ? customer.retentionOffers[selectedOfferIndex] || customer.retentionOffers[0]
      : null;

  const handleDeployClick = () => {
    if (!selectedOffer) return;
    setIsDeploying(true);

    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
      onDeployOffer(customer.id, selectedOffer);
    }, 800);
  };

  // Minimalist Radial Gauge calculation
  // Circle circumference: 2 * PI * r (r = 44 => C ~ 276.46)
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (customer.churnProbability / 100) * circumference;

  const gaugeColor =
    customer.churnProbability >= 70
      ? 'stroke-rose-500'
      : customer.churnProbability >= 31
      ? 'stroke-amber-500'
      : 'stroke-emerald-500';

  const textColor =
    customer.churnProbability >= 70
      ? 'text-rose-600 dark:text-rose-400'
      : customer.churnProbability >= 31
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-emerald-600 dark:text-emerald-400';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs"
          />

          {/* Slide-over Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-zinc-200 bg-white shadow-2xl transition-colors dark:border-zinc-800 dark:bg-[#121215]"
          >
            {/* Drawer Header */}
            <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      #{customer.id}
                    </span>
                    <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                      {customer.plan}
                    </span>
                    {customer.retentionStatus === 'deployed' && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                        <Check className="h-3 w-3" /> Deployed
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-2xl">
                    {customer.name}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600 dark:text-zinc-300">
                    <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
                      <Building2 className="h-3.5 w-3.5" />
                      {customer.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {customer.email}
                    </span>
                  </div>
                </div>

                <button
                  id="btn-close-drawer"
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Account Quick Metrics Bar */}
              <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800/80 dark:bg-zinc-900/50">
                <div>
                  <span className="block font-mono text-[10px] text-zinc-600 dark:text-zinc-300 uppercase">
                    Monthly Spend
                  </span>
                  <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    ${customer.monthlySpend.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-zinc-600 dark:text-zinc-300 uppercase">
                    Total Spend (LTV)
                  </span>
                  <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    ${customer.totalSpend.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-zinc-600 dark:text-zinc-300 uppercase">
                    Active Tenure
                  </span>
                  <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {customer.tenureMonths} mos
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {/* CRITICAL REQUIREMENT 4 - Risk Scorecard: Large minimalist gauge */}
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-[#18181B]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                    Risk Scorecard
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-300">
                    <Zap className="h-3 w-3 text-amber-500" />
                    Agent Real-time Inference
                  </span>
                </div>

                <div className="mt-4 flex flex-col items-center justify-between gap-6 sm:flex-row">
                  {/* Minimalist SVG Radial Gauge */}
                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                    <svg className="h-28 w-28 -rotate-90 transform" viewBox="0 0 100 100">
                      {/* Background track */}
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        className="stroke-zinc-100 dark:stroke-zinc-800"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      {/* Animated value arc */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r={radius}
                        className={gaugeColor}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className={`text-2xl font-bold tracking-tight ${textColor}`}>
                        {customer.churnProbability}%
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-300">
                        RISK
                      </span>
                    </div>
                  </div>

                  {/* Context Metrics */}
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          customer.riskTier === 'high'
                            ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                            : customer.riskTier === 'medium'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            customer.riskTier === 'high'
                              ? 'bg-rose-500'
                              : customer.riskTier === 'medium'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        {customer.riskTier === 'high'
                          ? 'Critical Churn Probability'
                          : customer.riskTier === 'medium'
                          ? 'Elevated Churn Risk'
                          : 'Nominal Account Health'}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {customer.churnProbability >= 70
                        ? `Immediate intervention required. Account telemetry displays significant drop-off velocity and contractual exposure.`
                        : customer.churnProbability >= 31
                        ? `Early warning triggers detected. Account requires proactive nurturing before upcoming renewal cycle.`
                        : `Healthy account with high stickiness and routine active telemetry.`}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-1 sm:justify-start text-[11px] font-mono text-zinc-600 dark:text-zinc-300">
                      <span>NPS: {customer.npsScore || 'N/A'}/10</span>
                      <span>•</span>
                      <span>Tickets (30d): {customer.supportTicketsLast30d || 0}</span>
                      <span>•</span>
                      <span>Last Seen: {customer.lastActivity || 'Recent'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CRITICAL REQUIREMENT 4 - "Why This Customer Is Leaving" (Feature Importance) */}
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-[#18181B]">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                    Why This Customer Is Leaving
                  </h3>
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-300">
                    Feature Importance
                  </span>
                </div>

                {/* Clean bulleted list of 2-3 specific behavioral drivers */}
                <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {customer.drivers.map((driver, idx) => {
                    const weight = customer.driverWeights?.[idx]?.impact || (50 - idx * 15);
                    return (
                      <div key={idx} className="py-2.5 first:pt-1 last:pb-0">
                        <div className="flex items-start gap-2.5">
                          <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                          <div className="flex-1">
                            <p className="text-xs font-medium leading-snug text-zinc-900 dark:text-zinc-100">
                              {driver}
                            </p>
                            {/* Subtle weight / contribution indicator */}
                            <div className="mt-1.5 flex items-center gap-2">
                              <div className="h-1 w-24 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <div
                                  className="h-full rounded-full bg-zinc-700 dark:bg-zinc-300"
                                  style={{ width: `${Math.min(100, weight * 1.8)}%` }}
                                />
                              </div>
                              <span className="font-mono text-[10px] text-zinc-600 dark:text-zinc-300">
                                {weight}% impact factor
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CRITICAL REQUIREMENT 4 - "AI Retention Strategy" */}
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-[#18181B]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
                    <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                      AI Retention Strategy
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-600 dark:text-zinc-300">
                    TAILORED PLAYBOOKS
                  </span>
                </div>

                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                  Actionable, concrete retention offers tailored to counteract active behavioral drivers:
                </p>

                {/* Offer Selection Cards */}
                <div className="mt-4 space-y-3">
                  {customer.retentionOffers.map((offer, idx) => {
                    const isSelected = selectedOfferIndex === idx;
                    return (
                      <div
                        key={offer.id || idx}
                        onClick={() => setSelectedOfferIndex(idx)}
                        className={`cursor-pointer rounded-xl border p-4 transition-all ${
                          isSelected
                            ? 'border-zinc-900 bg-zinc-50/90 ring-1 ring-zinc-900 dark:border-zinc-100 dark:bg-zinc-800/80 dark:ring-zinc-100'
                            : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-800 dark:bg-[#18181B] dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-bold ${
                                isSelected
                                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
                                  : 'border-zinc-300 text-transparent dark:border-zinc-700'
                              }`}
                            >
                              ✓
                            </span>
                            <h4 className="text-xs font-semibold text-zinc-950 dark:text-white">
                              {offer.title}
                            </h4>
                          </div>
                          <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                            Offer #{idx + 1}
                          </span>
                        </div>

                        <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                          {offer.description}
                        </p>

                        <div className="mt-3 grid grid-cols-1 gap-2 rounded-lg border border-zinc-200/70 bg-white p-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-900/60 sm:grid-cols-2">
                          <div>
                            <span className="font-mono text-[10px] text-zinc-600 dark:text-zinc-300 uppercase block">
                              Incentive / Perk
                            </span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-200 text-[11px]">
                              {offer.discountOrPerk}
                            </span>
                          </div>
                          <div>
                            <span className="font-mono text-[10px] text-zinc-600 dark:text-zinc-300 uppercase block">
                              Estimated Outcome
                            </span>
                            <span className="font-medium text-emerald-700 dark:text-emerald-300 text-[11px]">
                              {offer.estimatedSavings}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-300">
                          <Send className="h-3 w-3" />
                          <span>Channel: {offer.recommendedChannel}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CRITICAL REQUIREMENT 4 - Footer Button: High-contrast button "Deploy Retention Offer" */}
            <div className="border-t border-zinc-200 bg-white p-5 transition-colors dark:border-zinc-800 dark:bg-[#121215]">
              <div className="flex flex-col gap-2">
                <button
                  id="btn-deploy-retention-offer"
                  type="button"
                  disabled={isDeploying || !selectedOffer}
                  onClick={handleDeployClick}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    deploySuccess
                      ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-zinc-950 text-white shadow-md hover:bg-zinc-800 active:scale-[0.99] dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white'
                  }`}
                >
                  {isDeploying ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Deploying Retention Sequence...</span>
                    </>
                  ) : deploySuccess ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Retention Offer Deployed to Customer</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Deploy Retention Offer</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-zinc-600 dark:text-zinc-300">
                  {deploySuccess
                    ? 'Automated playbook initialized. Real-time telemetry monitoring customer response.'
                    : 'Dispatches automated retention sequence through verified customer communication channels.'}
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
