import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, FileSpreadsheet, FileText, CheckCircle2, AlertCircle, ArrowRight, Download, X, Sparkles } from 'lucide-react';
import { SAMPLE_CSV_CONTENT } from '../data/demoDataset';

interface OnboardingModalProps {
  onFileUpload: (file: File) => void;
  onLoadDemoData: () => void;
  isReplacing?: boolean;
  onCancelReplace?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  onFileUpload,
  onLoadDemoData,
  isReplacing = false,
  onCancelReplace,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndProcessFile = (file: File) => {
    setErrorMsg(null);
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!isValid) {
      setErrorMsg('Invalid file format. Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.');
      return;
    }

    onFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'hash_clash_churn_sample_customers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs transition-opacity">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl transition-colors dark:border-zinc-800 dark:bg-[#18181B] sm:p-8"
      >
        {/* Close Button if replacing dataset */}
        {isReplacing && onCancelReplace && (
          <button
            onClick={onCancelReplace}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Step Indicator */}
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-950">
            2
          </span>
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            {isReplacing ? 'Dataset Replacement' : 'Onboarding Step 2 of 2'}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-2xl">
            Welcome to Hash Clash Churn. Upload Your Customer Data.
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-sm">
            Upload an Excel (.xlsx) or CSV file containing your customer database to initialize the churn prediction agent.
          </p>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          id="file-dropzone"
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? 'border-zinc-900 bg-zinc-100/80 dark:border-zinc-300 dark:bg-zinc-800/80'
              : 'border-zinc-300 bg-zinc-50/60 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/40 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-input-element"
          />

          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-xs transition-transform group-hover:scale-105 dark:border-zinc-700 dark:bg-zinc-800">
            <UploadCloud className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
          </div>

          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 sm:text-sm">
            <span className="underline decoration-zinc-400 underline-offset-4">Click to browse</span> or drag and drop customer file
          </p>
          <p className="mt-1 font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
            Supported formats: .xlsx, .xls, .csv (up to 50MB)
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-mono text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              <FileSpreadsheet className="h-3 w-3" /> .XLSX
            </span>
            <span className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-mono text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              <FileSpreadsheet className="h-3 w-3" /> .XLS
            </span>
            <span className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-mono text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              <FileText className="h-3 w-3" /> .CSV
            </span>
          </div>
        </div>

        {/* Error notification if wrong file type */}
        {errorMsg && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* CRITICAL REQUIREMENT 2: Prominent "Or Load Demo Dataset" link */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800 sm:flex-row">
          <button
            id="btn-load-demo-dataset"
            type="button"
            onClick={onLoadDemoData}
            className="group inline-flex items-center gap-2 text-xs font-semibold text-zinc-950 underline decoration-zinc-400 underline-offset-4 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:decoration-zinc-600 dark:hover:text-zinc-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>Or Load Demo Dataset</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Quick template download */}
          <button
            type="button"
            onClick={handleDownloadSample}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-200"
            title="Download formatted sample CSV template to test upload"
          >
            <Download className="h-3 w-3" />
            <span>Sample template (.csv)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
