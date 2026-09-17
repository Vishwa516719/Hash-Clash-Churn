export type RiskTier = 'high' | 'medium' | 'low';

export interface RetentionOffer {
  id: string;
  title: string;
  description: string;
  discountOrPerk: string;
  estimatedSavings: string;
  recommendedChannel: string;
  targetDriver: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  tenureMonths: number;
  monthlySpend: number;
  totalSpend: number;
  churnProbability: number; // 0 to 100
  riskTier: RiskTier;
  drivers: string[];
  driverWeights?: { driver: string; impact: number }[];
  retentionOffers: RetentionOffer[];
  retentionStatus?: 'none' | 'deployed' | 'in_negotiation' | 'saved';
  lastActivity?: string;
  supportTicketsLast30d?: number;
  npsScore?: number;
  contractType?: 'Month-to-Month' | 'Annual' | '2-Year Enterprise';
  deployedOfferTitle?: string;
  deployedAt?: string;
}

export interface CompanyProfile {
  id?: string;
  companyName: string;
  workEmail: string;
  industry: string;
  teamSize?: string;
  activeAccountsRange?: string;
  fileName?: string;
  uploadedAt?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export type RiskFilter = 'all' | 'high' | 'medium' | 'low';
export type SortOption = 'risk_desc' | 'risk_asc' | 'spend_desc' | 'tenure_desc' | 'name_asc';

export type RootDriverCategory =
  | 'Pricing / Unexpected Fees'
  | 'Slow Customer Support'
  | 'Feature Gaps'
  | 'Drop in Login Activity'
  | 'Bugs / Platform Crashes';

