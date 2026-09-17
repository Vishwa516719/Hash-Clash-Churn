import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AnalyzingOverlay } from './components/AnalyzingOverlay';
import { KpiMetrics } from './components/KpiMetrics';
import { FilterBar } from './components/FilterBar';
import { CustomerTile } from './components/CustomerTile';
import { CustomerDrawer } from './components/CustomerDrawer';
import { RiskDonutChart } from './components/RiskDonutChart';
import { RootDriversBarGraph } from './components/RootDriversBarGraph';
import { ToastContainer, ToastMessage } from './components/Toast';
import { DEMO_CUSTOMERS } from './data/demoDataset';
import { parseCustomerFile } from './utils/fileParser';
import { getCustomerPrimaryDriver } from './utils/driverClassifier';
import { CustomerRecord, CompanyProfile, RiskFilter, SortOption, RetentionOffer, RiskTier, RootDriverCategory } from './types';
import { SearchX, UploadCloud, Loader2, RotateCcw, X, Filter } from 'lucide-react';
import { supabase } from './lib/supabase';
import { fetchCustomersForCompany, saveCustomersForCompany } from './lib/customerService';

export default function App() {
  // CRITICAL REQUIREMENT 1: Persistent Light/Dark mode toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('retention_theme');
    if (saved) return saved === 'dark';
    return true; // Default to sleek matte dark mode for modern enterprise aesthetic
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('retention_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('retention_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Workflow states: 'auth' -> 'upload_onboarding' -> 'analyzing' -> 'dashboard'
  const [workflowState, setWorkflowState] = useState<'auth' | 'upload_onboarding' | 'analyzing' | 'dashboard'>('auth');
  
  // Is modal open for dataset replacement from dashboard
  const [isReplacingFile, setIsReplacingFile] = useState(false);

  // Loading state when fetching company customer records
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  // Pending dataset while analyzing animation runs
  const [pendingDataset, setPendingDataset] = useState<{
    customers: CustomerRecord[];
    fileName: string;
  } | null>(null);

  // Authenticated company profile
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    companyName: '',
    workEmail: '',
    industry: 'Entertainment & Media',
    teamSize: '51-200 accounts',
  });

  // Active customer records - initialized to EMPTY for real authenticated sessions
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);

  // Check existing Supabase session on app launch
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const { data: profileData } = await supabase
            .from('company_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          const profile: CompanyProfile = {
            id: session.user.id,
            companyName: profileData?.company_name || 'Hash Clash Churn Workspace',
            workEmail: profileData?.work_email || session.user.email || '',
            industry: profileData?.industry || 'Entertainment & Media',
            teamSize: profileData?.active_accounts_range || '51-200 accounts',
            activeAccountsRange: profileData?.active_accounts_range || '51-200 accounts',
            createdAt: profileData?.created_at,
            lastLoginAt: profileData?.last_login_at,
          };

          setCompanyProfile(profile);

          // Query customers filtered strictly by authenticated user's ID
          setIsLoadingCustomers(true);
          const userCustomers = await fetchCustomersForCompany(session.user.id);
          setCustomers(userCustomers);
          setIsLoadingCustomers(false);

          setWorkflowState('dashboard');
        } catch (err) {
          console.error('Failed restoring user session data:', err);
          setIsLoadingCustomers(false);
        }
      }
    });
  }, []);

  // Active selected customer for the right-hand slide-over drawer
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<RiskFilter>('all');
  const [selectedDriver, setSelectedDriver] = useState<RootDriverCategory | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('risk_desc');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'error', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Step 1: Sign up handler -> DO NOT jump directly to dashboard, advance to Step 2
  const handleCompleteSignUp = (profile: CompanyProfile) => {
    setCompanyProfile(profile);
    setCustomers([]); // Fresh real user account has 0 customer records initially
    setWorkflowState('upload_onboarding');
  };

  // Step 1: Login handler
  const handleLogIn = async (profile: CompanyProfile) => {
    setCompanyProfile(profile);

    // DEMO ACCOUNT SEPARATION:
    // If the user signed in as the quick demo admin, load the isolated DEMO_CUSTOMERS dataset
    if (profile.id === 'demo-sandbox' || profile.id === 'demo-admin-id') {
      setCustomers(DEMO_CUSTOMERS);
      setWorkflowState('dashboard');
      addToast('info', 'Demo Sandbox Loaded', 'Logged into isolated sandbox environment.');
      return;
    }

    // Real authenticated user: Query supabase customers table filtered strictly by user.id
    if (profile.id) {
      setIsLoadingCustomers(true);
      try {
        const userCustomers = await fetchCustomersForCompany(profile.id);
        setCustomers(userCustomers);
      } catch (err: any) {
        console.error('Error fetching customers on login:', err);
        addToast('error', 'Database Query Error', 'Could not load your saved customer dataset.');
        setCustomers([]);
      } finally {
        setIsLoadingCustomers(false);
      }
    } else {
      setCustomers([]);
    }

    setWorkflowState('dashboard');
    addToast('success', 'Session Initialized', `Signed in as ${profile.workEmail}`);
  };

  // Step 2: File Upload handler (.xlsx, .xls, .csv)
  const handleFileUpload = async (file: File) => {
    try {
      const result = await parseCustomerFile(file);
      setPendingDataset(result);
      setCompanyProfile((prev) => ({ ...prev, fileName: file.name }));
      setIsReplacingFile(false);
      setWorkflowState('analyzing');
    } catch (err: any) {
      addToast('error', 'File Ingestion Error', err?.message || 'Failed to parse file.');
    }
  };

  // Step 2: "Or Load Demo Dataset" link
  const handleLoadDemoData = () => {
    setPendingDataset({
      customers: DEMO_CUSTOMERS,
      fileName: 'enterprise_b2b_demo_telemetry.xlsx',
    });
    setCompanyProfile((prev) => ({
      ...prev,
      fileName: 'enterprise_b2b_demo_telemetry.xlsx',
    }));
    setIsReplacingFile(false);
    setWorkflowState('analyzing');
  };

  // Analyzing animation completion handler
  const handleAnalyzingComplete = async () => {
    if (pendingDataset) {
      const incomingCustomers = pendingDataset.customers;
      setCustomers(incomingCustomers);

      // If user is authenticated with a real Supabase UUID (not demo sandbox), persist rows to Supabase
      if (companyProfile.id && companyProfile.id !== 'demo-sandbox' && companyProfile.id !== 'demo-admin-id') {
        try {
          const savedRows = await saveCustomersForCompany(incomingCustomers, companyProfile.id);
          setCustomers(savedRows);
          addToast('success', 'Database Synchronized', `${savedRows.length} customer records saved to your private account.`);
        } catch (saveErr: any) {
          console.warn('Could not save customers to Supabase:', saveErr);
          addToast('info', 'Local Cache Active', 'Dataset processed locally. Verify Supabase write permissions if needed.');
        }
      }

      setPendingDataset(null);
    }
    setWorkflowState('dashboard');
    addToast('success', 'Retention Model Initialized', 'Customer telemetry parsed and churn probabilities computed.');
  };

  // CRITICAL REQUIREMENT 4: Deploy retention offer
  const handleDeployOffer = async (customerId: string, offer: RetentionOffer) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              retentionStatus: 'deployed',
              deployedOfferTitle: offer.title,
              deployedAt: new Date().toLocaleTimeString(),
            }
          : c
      )
    );

    // Update in Supabase if real user session
    if (companyProfile.id && companyProfile.id !== 'demo-sandbox' && companyProfile.id !== 'demo-admin-id') {
      try {
        await supabase
          .from('customers')
          .update({ retention_status: 'deployed' })
          .eq('id', customerId)
          .eq('company_id', companyProfile.id);
      } catch (err) {
        console.warn('Could not update offer status in Supabase:', err);
      }
    }

    const targetCustomer = customers.find((c) => c.id === customerId);
    addToast(
      'success',
      'Retention Offer Deployed',
      `"${offer.title}" sent to ${targetCustomer?.name || 'customer'} via automated channel.`
    );
  };

  // Filter and sort customer directory
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.plan.toLowerCase().includes(q)
      );
    }

    // Filter by risk tier
    if (selectedRisk !== 'all') {
      result = result.filter((c) => c.riskTier === selectedRisk);
    }

    // Filter by root churn driver (from bar chart)
    if (selectedDriver) {
      result = result.filter((c) => getCustomerPrimaryDriver(c) === selectedDriver);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'risk_desc') return b.churnProbability - a.churnProbability;
      if (sortBy === 'risk_asc') return a.churnProbability - b.churnProbability;
      if (sortBy === 'spend_desc') return b.monthlySpend - a.monthlySpend;
      if (sortBy === 'tenure_desc') return b.tenureMonths - a.tenureMonths;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [customers, searchQuery, selectedRisk, selectedDriver, sortBy]);

  // Counts for pills
  const counts = useMemo(() => {
    return {
      all: customers.length,
      high: customers.filter((c) => c.riskTier === 'high').length,
      medium: customers.filter((c) => c.riskTier === 'medium').length,
      low: customers.filter((c) => c.riskTier === 'low').length,
    };
  }, [customers]);

  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors dark:bg-[#09090B] dark:text-zinc-100">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* STEP 1: AUTHENTICATION MODAL */}
      {workflowState === 'auth' && (
        <AuthModal
          onCompleteSignUp={handleCompleteSignUp}
          onLogIn={handleLogIn}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onErrorToast={(title, msg) => addToast('error', title, msg)}
          onSuccessToast={(title, msg) => addToast('success', title, msg)}
        />
      )}

      {/* STEP 2: FILE UPLOAD ONBOARDING SCREEN/MODAL */}
      {(workflowState === 'upload_onboarding' || isReplacingFile) && (
        <OnboardingModal
          onFileUpload={handleFileUpload}
          onLoadDemoData={handleLoadDemoData}
          isReplacing={isReplacingFile}
          onCancelReplace={() => setIsReplacingFile(false)}
        />
      )}

      {/* STEP 2.5: SLEEK ANALYZING OVERLAY ANIMATION */}
      {workflowState === 'analyzing' && (
        <AnalyzingOverlay
          onComplete={handleAnalyzingComplete}
          fileName={pendingDataset?.fileName || companyProfile.fileName}
        />
      )}

      {/* STEP 3 & 4: MAIN DASHBOARD & DIRECTORY */}
      {workflowState === 'dashboard' && (
        <div className="flex min-h-screen flex-col">
          {/* Navigation & Header */}
          <Header
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
            onOpenUpload={() => setIsReplacingFile(true)}
            companyProfile={companyProfile}
            totalCustomersCount={customers.length}
          />

          {/* Main Dashboard Body */}
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-8">
            {/* Dashboard Subheader with contextual summary */}
            <div className="flex flex-col justify-between gap-4 border-b border-zinc-200/80 pb-6 dark:border-zinc-800/80 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                    Enterprise Workspace
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <span className="font-mono text-xs text-zinc-600 dark:text-zinc-300">
                    Model: XGBoost-Survival
                  </span>
                </div>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                  Customer Churn Prediction Agent
                </h1>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 sm:text-sm">
                  Continuous behavioral risk detection and automated AI retention strategies across monitored accounts.
                </p>
              </div>

              {/* Quick actions / dataset switcher */}
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setCustomers([]);
                    setCompanyProfile({
                      companyName: '',
                      workEmail: '',
                      industry: 'Entertainment & Media',
                      teamSize: '51-200 accounts',
                    });
                    setWorkflowState('auth');
                    addToast('info', 'Signed Out', 'You have been signed out of Hash Clash Churn.');
                  }}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-[#18181B] dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Sign Out / Switch Account
                </button>
              </div>
            </div>

            {/* CRITICAL REQUIREMENT 3 - KPI Metric Cards */}
            <section id="dashboard-kpi-section">
              <KpiMetrics customers={customers} />
            </section>

            {/* ANALYTICAL VISUAL PANEL (CHART ROW DIRECTLY BENEATH KPI CARDS) */}
            <section id="analytics-visual-panel" className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Card 1: 1. RISK TIER SEGMENTATION (Donut Chart) */}
              <RiskDonutChart
                customers={customers}
                selectedRisk={selectedRisk === 'all' ? null : (selectedRisk as RiskTier)}
                onSelectRisk={(tier) => {
                  setSelectedRisk(tier || 'all');
                }}
              />

              {/* Card 2: 2. ROOT DRIVERS ("WHY LEAVING") (Horizontal Bar Graph) */}
              <RootDriversBarGraph
                customers={customers}
                selectedDriver={selectedDriver}
                onSelectDriver={(driver) => {
                  setSelectedDriver(driver);
                }}
              />
            </section>

            {/* 4. CUSTOMER IDENTIFICATION QUEUE & FILTERING */}
            <section id="customer-identification-queue" className="space-y-4 pt-2">
              {/* Section Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200/80 pb-3 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 font-mono text-xs font-bold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                    4
                  </div>
                  <div>
                    <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-zinc-950 dark:text-white">
                      4. Customer Identification Queue
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Dynamic customer action queue with real-time risk triage and intervention drawer
                    </p>
                  </div>
                </div>

                {/* Queue Summary Badge */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    Showing {filteredCustomers.length} of {customers.length} accounts
                  </span>
                </div>
              </div>

              {/* Active Filter Status Tag Indicator */}
              {(selectedRisk !== 'all' || selectedDriver !== null || searchQuery.trim() !== '') && (
                <div
                  id="active-filter-status-banner"
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-100/80 px-3.5 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900/90"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-zinc-600 uppercase tracking-wider dark:text-zinc-300">
                      <Filter className="h-3 w-3" />
                      Active Filters:
                    </span>

                    {/* Risk Tier Tag */}
                    {selectedRisk !== 'all' && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white px-2.5 py-0.5 text-xs font-semibold text-zinc-900 shadow-2xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                        <span>Risk: {selectedRisk.toUpperCase()}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedRisk('all')}
                          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                          title="Clear risk filter"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    {/* Root Driver Tag */}
                    {selectedDriver && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white px-2.5 py-0.5 text-xs font-semibold text-zinc-900 shadow-2xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                        <span>Driver: {selectedDriver}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedDriver(null)}
                          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                          title="Clear driver filter"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    {/* Search Term Tag */}
                    {searchQuery.trim() && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white px-2.5 py-0.5 text-xs font-semibold text-zinc-900 shadow-2xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                        <span>Query: "{searchQuery}"</span>
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                          title="Clear search query"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>

                  {/* Reset All Button */}
                  <button
                    id="btn-reset-all-filters"
                    type="button"
                    onClick={() => {
                      setSelectedRisk('all');
                      setSelectedDriver(null);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset All</span>
                  </button>
                </div>
              )}

              {/* CRITICAL REQUIREMENT 3 - Filter Bar */}
              <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedRisk={selectedRisk}
                onRiskChange={(tier) => {
                  setSelectedRisk(tier);
                }}
                counts={counts}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalFiltered={filteredCustomers.length}
              />

              {/* Column Header Alignment Row for Desktop View */}
              <div className="hidden px-4 py-2 font-mono text-[11px] font-semibold tracking-wider text-zinc-600 uppercase dark:text-zinc-300 sm:flex sm:items-center sm:justify-between">
                <div className="flex-1">CUSTOMER ACCOUNT & ID</div>
                <div className="flex items-center gap-6 text-right">
                  <div className="w-36">ACTIVE TENURE</div>
                  <div className="w-32">MONTHLY SPEND</div>
                  <div className="w-44 text-right pr-6">CHURN PROBABILITY</div>
                </div>
              </div>

              {/* Customer Directory Layout: Stacked horizontal tiles (row-by-row) */}
              <div
                id="customer-directory-list"
                className="flex flex-col space-y-2.5"
              >
                {isLoadingCustomers ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white py-20 text-center dark:border-zinc-800 dark:bg-[#18181B]">
                    <Loader2 className="h-7 w-7 animate-spin text-zinc-500 dark:text-zinc-400" />
                    <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Loading your customer telemetry...
                    </h3>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                      Querying encrypted database scoped to your workspace.
                    </p>
                  </div>
                ) : customers.length === 0 ? (
                  /* Zero customer records empty state */
                  <div
                    id="empty-dataset-state"
                    className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center shadow-xs dark:border-zinc-800 dark:bg-[#18181B]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                      <UploadCloud className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      No customer records found
                    </h3>
                    <p className="mt-1 max-w-md text-xs text-zinc-600 dark:text-zinc-300">
                      Please upload your customer dataset to initialize predictions.
                    </p>
                    <button
                      id="btn-empty-state-upload"
                      type="button"
                      onClick={() => setIsReplacingFile(true)}
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.99] dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                    >
                      <UploadCloud className="h-4 w-4" />
                      <span>Upload Dataset</span>
                    </button>
                  </div>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <CustomerTile
                      key={customer.id}
                      customer={customer}
                      isSelected={selectedCustomerId === customer.id}
                      onClick={() => setSelectedCustomerId(customer.id)}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white py-16 text-center dark:border-zinc-800 dark:bg-[#18181B]">
                    <SearchX className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
                    <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      No matching accounts found
                    </h3>
                    <p className="mt-1 max-w-sm text-xs text-zinc-600 dark:text-zinc-300">
                      No customers matched your filter query "{searchQuery}". Try clearing filters or searching by another ID.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedRisk('all');
                        setSelectedDriver(null);
                      }}
                      className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            </section>
          </main>

          {/* Minimalist Nordic Footer */}
          <footer className="mt-auto border-t border-zinc-200/80 bg-white py-6 text-center text-xs text-zinc-600 transition-colors dark:border-zinc-800/80 dark:bg-[#09090B] dark:text-zinc-300">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Hash Clash Churn</span>
                <span>•</span>
                <span>Nordic Enterprise Churn Prediction</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-zinc-600 dark:text-zinc-300">
                <span>Model Latency: 14ms</span>
                <span>•</span>
                <span>Inference Precision: 94.2%</span>
                <span>•</span>
                <button
                  onClick={() => setIsReplacingFile(true)}
                  className="hover:underline text-zinc-600 dark:text-zinc-300"
                >
                  Upload New Dataset
                </button>
              </div>
            </div>
          </footer>

          {/* CRITICAL REQUIREMENT 4 - Customer Detail & Retention Drawer */}
          <CustomerDrawer
            customer={selectedCustomer}
            isOpen={Boolean(selectedCustomerId)}
            onClose={() => setSelectedCustomerId(null)}
            onDeployOffer={handleDeployOffer}
          />
        </div>
      )}
    </div>
  );
}
