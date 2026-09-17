import { CustomerRecord, RootDriverCategory } from '../types';

export const ROOT_DRIVER_CATEGORIES: RootDriverCategory[] = [
  'Pricing / Unexpected Fees',
  'Slow Customer Support',
  'Feature Gaps',
  'Drop in Login Activity',
  'Bugs / Platform Crashes',
];

/**
 * Maps a customer's drivers, metrics, and attributes to their primary root churn driver.
 */
export function getCustomerPrimaryDriver(customer: CustomerRecord): RootDriverCategory {
  const driversText = (customer.drivers || []).join(' ').toLowerCase();
  const weightsText = (customer.driverWeights || []).map((w) => w.driver).join(' ').toLowerCase();
  const allText = `${driversText} ${weightsText}`;

  // 1. Slow Customer Support
  if (
    allText.includes('support') ||
    allText.includes('ticket') ||
    allText.includes('sla') ||
    allText.includes('escalat') ||
    (customer.supportTicketsLast30d && customer.supportTicketsLast30d >= 3)
  ) {
    return 'Slow Customer Support';
  }

  // 2. Pricing / Unexpected Fees
  if (
    allText.includes('pricing') ||
    allText.includes('fee') ||
    allText.includes('spend') ||
    allText.includes('billing') ||
    allText.includes('overage') ||
    allText.includes('month-to-month') ||
    allText.includes('dispute') ||
    allText.includes('cost') ||
    allText.includes('rate') ||
    customer.contractType === 'Month-to-Month'
  ) {
    return 'Pricing / Unexpected Fees';
  }

  // 3. Drop in Login Activity
  if (
    allText.includes('login') ||
    allText.includes('activity') ||
    allText.includes('session') ||
    allText.includes('dormant') ||
    allText.includes('stagnant seat') ||
    allText.includes('drop-off') ||
    allText.includes('cadence') ||
    (customer.lastActivity && (customer.lastActivity.includes('days') || customer.lastActivity.includes('week')))
  ) {
    return 'Drop in Login Activity';
  }

  // 4. Bugs / Platform Crashes
  if (
    allText.includes('latency') ||
    allText.includes('bug') ||
    allText.includes('crash') ||
    allText.includes('downtime') ||
    allText.includes('connector') ||
    allText.includes('timeout') ||
    allText.includes('failure')
  ) {
    return 'Bugs / Platform Crashes';
  }

  // 5. Feature Gaps
  if (
    allText.includes('feature') ||
    allText.includes('gap') ||
    allText.includes('missing') ||
    allText.includes('integration') ||
    allText.includes('webhook') ||
    allText.includes('audit') ||
    allText.includes('export') ||
    allText.includes('compliance') ||
    allText.includes('quota')
  ) {
    return 'Feature Gaps';
  }

  // Fallback hash/deterministic assignment based on ID or spend
  const hash = (customer.id || customer.name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ROOT_DRIVER_CATEGORIES[hash % ROOT_DRIVER_CATEGORIES.length];
}

/**
 * Computes the impact percentages and counts of root drivers for a customer cohort.
 */
export function calculateDriverDistribution(customers: CustomerRecord[]): {
  driver: RootDriverCategory;
  count: number;
  percentage: number;
}[] {
  if (customers.length === 0) {
    return ROOT_DRIVER_CATEGORIES.map((driver) => ({
      driver,
      count: 0,
      percentage: 0,
    }));
  }

  const counts: Record<RootDriverCategory, number> = {
    'Pricing / Unexpected Fees': 0,
    'Slow Customer Support': 0,
    'Feature Gaps': 0,
    'Drop in Login Activity': 0,
    'Bugs / Platform Crashes': 0,
  };

  customers.forEach((c) => {
    const driver = getCustomerPrimaryDriver(c);
    counts[driver] = (counts[driver] || 0) + 1;
  });

  const total = customers.length;

  return ROOT_DRIVER_CATEGORIES.map((driver) => ({
    driver,
    count: counts[driver],
    percentage: Math.round((counts[driver] / total) * 100),
  })).sort((a, b) => b.count - a.count || b.percentage - a.percentage);
}
