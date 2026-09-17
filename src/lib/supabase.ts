import { createClient, SupabaseClient } from '@supabase/supabase-js';

function formatSupabaseUrl(url?: string | null): string {
  const fallback = 'https://ddkmpukimpqpjqhivchq.supabase.co';
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim().replace(/^["']|["']$/g, '');
  if (!trimmed || trimmed === 'MY_SUPABASE_URL' || trimmed === 'undefined') return fallback;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/\/+$/, '');
  }
  if (/^[a-z0-9-]+$/i.test(trimmed)) {
    return `https://${trimmed}.supabase.co`;
  }
  if (trimmed.includes('.')) {
    return `https://${trimmed.replace(/\/+$/, '')}`;
  }
  return fallback;
}

function formatSupabaseKey(key?: string | null): string {
  const fallback = 'sb_publishable_7VP6lQqgVzdqalq6Zli5Bg_XOgQwvJ1';
  if (!key || typeof key !== 'string') return fallback;
  const trimmed = key.trim().replace(/^["']|["']$/g, '');
  if (!trimmed || trimmed === 'MY_SUPABASE_KEY' || trimmed === 'undefined') return fallback;
  return trimmed;
}

const rawUrl =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  'https://ddkmpukimpqpjqhivchq.supabase.co';

const rawKey =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_7VP6lQqgVzdqalq6Zli5Bg_XOgQwvJ1';

export const SUPABASE_URL = formatSupabaseUrl(rawUrl);
export const SUPABASE_ANON_KEY = formatSupabaseKey(rawKey);

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface CompanyProfileRow {
  id: string; // UUID matching auth.users.id
  company_name: string;
  work_email: string;
  industry: string;
  active_accounts_range: string;
  created_at?: string;
  last_login_at?: string;
}

export interface SupabaseCustomerRow {
  id?: string;
  company_id: string; // UUID matching auth.users.id
  customer_name: string;
  tenure_months: number;
  monthly_spend: number;
  churn_probability: number;
  risk_tier: string;
  contract_type?: string;
  retention_status?: string;
  created_at?: string;
}

