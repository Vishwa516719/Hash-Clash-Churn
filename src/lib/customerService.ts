import { supabase, SupabaseCustomerRow } from './supabase';
import { CustomerRecord } from '../types';
import { calculateRiskTier, generateDriversAndOffers } from '../utils/fileParser';

/**
 * Hydrates a SupabaseCustomerRow from the database into a rich CustomerRecord
 * used by the frontend components.
 */
export function hydrateCustomerRecord(
  row: SupabaseCustomerRow,
  index: number = 0
): CustomerRecord {
  const customerId = row.id || `CUST-${String(index + 101).padStart(4, '0')}`;
  const rawName = row.customer_name || `Account ${index + 1}`;
  const probability = Math.round(Number(row.churn_probability) || 0);
  const tenure = Math.round(Number(row.tenure_months) || 12);
  const monthlySpend = Math.round(Number(row.monthly_spend) * 100) / 100 || 120;
  const totalSpend = Math.round(monthlySpend * tenure * 100) / 100;
  const contractType = row.contract_type === 'Month-to-Month' ? 'Month-to-Month' : 'Annual';
  const riskTier = (row.risk_tier as any) || calculateRiskTier(probability);
  const tickets = Math.max(1, probability >= 70 ? 4 : probability >= 40 ? 2 : 1);

  const { drivers, offers } = generateDriversAndOffers(
    rawName,
    tenure,
    monthlySpend,
    contractType,
    tickets,
    probability
  );

  return {
    id: customerId,
    name: rawName,
    email: `${rawName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    company: `${rawName.split(' ')[0]} Enterprises`,
    plan: monthlySpend > 300 ? 'Enterprise Pro' : monthlySpend > 150 ? 'Growth' : 'Standard',
    tenureMonths: tenure,
    monthlySpend,
    totalSpend,
    churnProbability: probability,
    riskTier,
    contractType,
    supportTicketsLast30d: tickets,
    lastActivity: `${(index % 5) + 1} days ago`,
    npsScore: probability > 70 ? 4 : 9,
    drivers,
    retentionOffers: offers,
    retentionStatus: (row.retention_status as any) || 'none',
  };
}

/**
 * Maps a front-end CustomerRecord into the schema columns of the Supabase `customers` table
 */
export function toSupabaseCustomerRow(
  customer: CustomerRecord,
  companyId: string
): SupabaseCustomerRow {
  return {
    company_id: companyId,
    customer_name: customer.name,
    tenure_months: customer.tenureMonths,
    monthly_spend: customer.monthlySpend,
    churn_probability: customer.churnProbability,
    risk_tier: customer.riskTier,
    contract_type: customer.contractType || 'Annual',
    retention_status: customer.retentionStatus || 'none',
  };
}

/**
 * Fetches customers for a given company_id from Supabase
 */
export async function fetchCustomersForCompany(companyId: string): Promise<CustomerRecord[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('company_id', companyId)
    .order('churn_probability', { ascending: false });

  if (error) {
    console.error('Error querying customers for company_id:', companyId, error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return (data as SupabaseCustomerRow[]).map((row, idx) => hydrateCustomerRecord(row, idx));
}

/**
 * Saves or updates customer records for a specific company_id in Supabase
 */
export async function saveCustomersForCompany(
  customers: CustomerRecord[],
  companyId: string
): Promise<CustomerRecord[]> {
  // If companyId is demo-sandbox, do not write to real database
  if (companyId === 'demo-sandbox' || companyId === 'demo-admin-id') {
    return customers;
  }

  // First, remove existing records for this company if replacing/inserting new dataset
  try {
    await supabase.from('customers').delete().eq('company_id', companyId);
  } catch (delErr) {
    console.warn('Could not clear old customer records:', delErr);
  }

  const rowsToInsert = customers.map((c) => toSupabaseCustomerRow(c, companyId));

  const { data, error } = await supabase
    .from('customers')
    .insert(rowsToInsert)
    .select();

  if (error) {
    console.error('Error inserting customer rows into Supabase:', error);
    throw error;
  }

  if (data && data.length > 0) {
    return (data as SupabaseCustomerRow[]).map((row, idx) => hydrateCustomerRecord(row, idx));
  }

  return customers;
}
