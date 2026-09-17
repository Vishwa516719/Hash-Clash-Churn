import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Mail, Lock, ArrowRight, Sun, Moon, Loader2, AlertCircle } from 'lucide-react';
import { CompanyProfile } from '../types';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onCompleteSignUp: (profile: CompanyProfile) => void;
  onLogIn: (profile: CompanyProfile) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onErrorToast?: (title: string, message: string) => void;
  onSuccessToast?: (title: string, message: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onCompleteSignUp,
  onLogIn,
  isDarkMode,
  onToggleTheme,
  onErrorToast,
  onSuccessToast,
}) => {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  // Sign up state - inputs completely empty on load
  const [companyName, setCompanyName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [password, setPassword] = useState('');
  const [industry, setIndustry] = useState('Entertainment & Media');
  const [activeAccountsRange, setActiveAccountsRange] = useState('51-200 accounts');

  // Login state - inputs completely empty on load
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getCleanErrorMessage = (err: any): string => {
    const msg: string = err?.message || err?.error_description || '';
    const lower = msg.toLowerCase();
    if (lower.includes('already registered') || lower.includes('user already exists') || lower.includes('already exists')) {
      return 'Account already exists. Please log in with your email and password.';
    }
    if (lower.includes('invalid login credentials') || lower.includes('invalid email or password')) {
      return 'Invalid email or password. Please verify your credentials.';
    }
    if (lower.includes('password should be at least')) {
      return 'Password must be at least 6 characters long.';
    }
    if (lower.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    return msg || 'An unexpected error occurred. Please try again.';
  };

  // Sign Up Submit Handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!companyName.trim()) {
      setErrorMessage('Please enter your company name.');
      return;
    }
    if (!workEmail.trim()) {
      setErrorMessage('Please enter your work email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Call supabase.auth.signUp() with work_email and password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: workEmail.trim(),
        password: password,
        options: {
          data: {
            company_name: companyName.trim(),
            industry,
            active_accounts_range: activeAccountsRange,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      const user = authData?.user;
      if (!user) {
        throw new Error('Registration failed to return user data.');
      }

      const now = new Date().toISOString();

      // 2. Immediately after successful registration, insert a record into the company_profiles table
      const { error: profileError } = await supabase
        .from('company_profiles')
        .insert([
          {
            id: user.id,
            company_name: companyName.trim(),
            work_email: workEmail.trim(),
            industry: industry,
            active_accounts_range: activeAccountsRange,
            created_at: now,
            last_login_at: now,
          },
        ]);

      if (profileError) {
        console.warn('Profile table insert note (will fallback):', profileError.message);
      }

      onSuccessToast?.('Account Created', `Company profile registered for ${companyName.trim()}`);

      // 3. Transition the user smoothly to Step 2 (Dataset Upload Screen)
      onCompleteSignUp({
        id: user.id,
        companyName: companyName.trim(),
        workEmail: workEmail.trim(),
        industry,
        teamSize: activeAccountsRange,
        activeAccountsRange: activeAccountsRange,
        createdAt: now,
        lastLoginAt: now,
      });
    } catch (err: any) {
      const cleanMsg = getCleanErrorMessage(err);
      setErrorMessage(cleanMsg);
      onErrorToast?.('Sign Up Failed', cleanMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Log In Submit Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your work email.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Authenticate the user session via supabase.auth.signInWithPassword()
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (authError) {
        throw authError;
      }

      const user = authData?.user;
      if (!user) {
        throw new Error('Sign in failed to retrieve authenticated user.');
      }

      const now = new Date().toISOString();

      // 2. Update the last_login_at column in company_profiles matching id = user.id
      try {
        await supabase
          .from('company_profiles')
          .update({ last_login_at: now })
          .eq('id', user.id);
      } catch (updErr) {
        console.warn('Could not update last_login_at:', updErr);
      }

      // 3. Fetch the company's profile information
      let resolvedProfile: CompanyProfile = {
        id: user.id,
        companyName: 'Hash Clash Churn Workspace',
        workEmail: user.email || loginEmail.trim(),
        industry: 'Entertainment & Media',
        teamSize: '51-200 accounts',
        activeAccountsRange: '51-200 accounts',
        lastLoginAt: now,
      };

      try {
        const { data: profileData } = await supabase
          .from('company_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileData) {
          resolvedProfile = {
            id: user.id,
            companyName: profileData.company_name || 'Hash Clash Churn Workspace',
            workEmail: profileData.work_email || user.email || loginEmail.trim(),
            industry: profileData.industry || 'Entertainment & Media',
            teamSize: profileData.active_accounts_range || '51-200 accounts',
            activeAccountsRange: profileData.active_accounts_range || '51-200 accounts',
            createdAt: profileData.created_at,
            lastLoginAt: now,
          };
        }
      } catch (fetchErr) {
        console.warn('Could not query company_profiles row:', fetchErr);
      }

      onSuccessToast?.('Welcome Back', `Authenticated as ${resolvedProfile.companyName}`);

      // Route them directly to the main dashboard
      onLogIn(resolvedProfile);
    } catch (err: any) {
      const cleanMsg = getCleanErrorMessage(err);
      setErrorMessage(cleanMsg);
      onErrorToast?.('Authentication Failed', cleanMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    onLogIn({
      id: 'demo-sandbox',
      companyName: 'Acme Media & Entertainment (Demo Sandbox)',
      workEmail: 'admin@hashclashchurn.com',
      industry: 'Entertainment & Media',
      teamSize: '51-200 accounts',
      activeAccountsRange: '51-200 accounts',
      lastLoginAt: new Date().toISOString(),
    });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-zinc-50 px-4 py-12 transition-colors dark:bg-[#09090B]">
      {/* Background architectural grid lines */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] dark:opacity-20" />

      {/* Persistent Theme Toggle in top right */}
      <div className="absolute right-6 top-6 z-20">
        <button
          id="auth-theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-xs transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-[#18181B] dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-zinc-700" />
          )}
        </button>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm ring-1 ring-zinc-900/10 dark:bg-zinc-100 dark:text-zinc-950 dark:ring-white/10">
            <span className="font-mono text-sm font-bold tracking-tighter">HC</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Hash Clash Churn
          </h1>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
            Autonomous Customer Churn Prediction & Retention Engine
          </p>
        </div>

        {/* Minimalist Card */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors dark:border-zinc-800 dark:bg-[#18181B] sm:p-8">
          {/* Minimalist Tabs: Sign Up vs Log In */}
          <div className="mb-6 flex rounded-lg border border-zinc-200 bg-zinc-100/70 p-1 dark:border-zinc-800 dark:bg-zinc-900/70">
            <button
              id="tab-btn-signup"
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold tracking-tight transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100'
              }`}
            >
              Sign Up
            </button>
            <button
              id="tab-btn-login"
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold tracking-tight transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100'
              }`}
            >
              Log In
            </button>
          </div>

          {/* Minimalist Error Alert */}
          {errorMessage && (
            <div
              id="auth-error-banner"
              className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-300"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'signup' ? (
              <motion.form
                key="signup-form"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleSignUpSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Company Name
                  </label>
                  <div className="relative mt-1">
                    <Building2 className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      id="signup-company-name"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Media Corp"
                      disabled={isLoading}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-3 text-xs text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus:bg-white disabled:opacity-60 dark:border-zinc-700/80 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:bg-[#18181B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Work Email
                  </label>
                  <div className="relative mt-1">
                    <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      id="signup-work-email"
                      type="email"
                      required
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="name@company.com"
                      disabled={isLoading}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-3 text-xs text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus:bg-white disabled:opacity-60 dark:border-zinc-700/80 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:bg-[#18181B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Industry
                    </label>
                    <select
                      id="signup-industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      disabled={isLoading}
                      className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-2.5 py-2 text-xs text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus:bg-white disabled:opacity-60 dark:border-zinc-700/80 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:bg-[#18181B]"
                    >
                      <option value="Entertainment & Media">Entertainment & Media</option>
                      <option value="Audio & Streaming">Audio & Streaming</option>
                      <option value="B2B SaaS / Cloud">B2B SaaS / Cloud</option>
                      <option value="FinTech & Banking">FinTech & Banking</option>
                      <option value="E-Commerce">E-Commerce</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Logistics">Logistics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Active Accounts
                    </label>
                    <select
                      id="signup-team-size"
                      value={activeAccountsRange}
                      onChange={(e) => setActiveAccountsRange(e.target.value)}
                      disabled={isLoading}
                      className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-2.5 py-2 text-xs text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus:bg-white disabled:opacity-60 dark:border-zinc-700/80 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:bg-[#18181B]"
                    >
                      <option value="1-50 accounts">1 - 50 accounts</option>
                      <option value="51-200 accounts">51 - 200 accounts</option>
                      <option value="201-1000 accounts">201 - 1,000 accounts</option>
                      <option value="1000+ enterprise">1,000+ enterprise</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      id="signup-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-3 text-xs text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus:bg-white disabled:opacity-60 dark:border-zinc-700/80 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:bg-[#18181B]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="btn-signup-submit"
                    type="submit"
                    disabled={isLoading}
                    className="group flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-white dark:text-zinc-950" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <>
                        <span>Create Company Account</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-center text-[11px] text-zinc-600 dark:text-zinc-300">
                    Step 1 of 2: Proceed to customer dataset upload
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleLoginSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Work Email
                  </label>
                  <div className="relative mt-1">
                    <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@company.com"
                      disabled={isLoading}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-3 text-xs text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus:bg-white disabled:opacity-60 dark:border-zinc-700/80 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:bg-[#18181B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      id="login-password"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-3 text-xs text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus:bg-white disabled:opacity-60 dark:border-zinc-700/80 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:bg-[#18181B]"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    id="btn-login-submit"
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-white dark:text-zinc-950" />
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In to Workspace</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    id="btn-demo-quick-login"
                    type="button"
                    onClick={handleQuickDemoAdmin}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 text-xs font-medium text-zinc-700 transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Quick Sign In as Demo Admin
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
