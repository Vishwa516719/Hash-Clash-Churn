import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface AnalyzingOverlayProps {
  onComplete: () => void;
  fileName?: string;
}

const STEPS = [
  'Parsing columns...',
  'Calculating churn probabilities...',
  'Identifying risk factors...',
  'Synthesizing AI retention strategies...'
];

export const AnalyzingOverlay: React.FC<AnalyzingOverlayProps> = ({
  onComplete,
  fileName,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // 600ms per step = sleek ~2.4 second total animation
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-2xl transition-colors dark:border-zinc-800 dark:bg-[#18181B]"
      >
        {/* Subtle geometric radar or minimalist spinner */}
        <div className="mb-6 flex justify-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 shadow-inner dark:border-zinc-800 dark:bg-zinc-900">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-900 dark:text-zinc-100" />
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Hash Clash Churn Agent Processing
          </h3>
          <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-300">
            {fileName ? `Analyzing ${fileName}` : 'Processing customer dataset'}
          </p>
        </div>

        {/* Stepped Status Checklist */}
        <div className="mt-6 space-y-2.5 rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/50">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={step}
                className={`flex items-center gap-3 text-xs transition-colors ${
                  isDone
                    ? 'text-zinc-900 font-medium dark:text-zinc-100'
                    : isCurrent
                    ? 'text-zinc-900 font-semibold dark:text-zinc-100'
                    : 'text-zinc-400 dark:text-zinc-600'
                }`}
              >
                <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  )}
                </div>
                <span className="font-mono tracking-tight">{step}</span>
              </div>
            );
          })}
        </div>

        {/* Minimal Progress Bar */}
        <div className="mt-6">
          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <motion.div
              className="h-full bg-zinc-900 dark:bg-zinc-100"
              initial={{ width: '10%' }}
              animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
              transition={{ ease: 'easeOut', duration: 0.4 }}
            />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] text-zinc-600 dark:text-zinc-300">
            <span>MODEL: XGBOOST-SURVIVAL-V2</span>
            <span>{Math.round(((currentStepIndex + 1) / STEPS.length) * 100)}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
