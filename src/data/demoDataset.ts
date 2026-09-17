import { CustomerRecord } from '../types';

export const DEMO_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'CUST-0142',
    name: 'Sarah Jenkins',
    email: 'sarah.j@apexlogistics.com',
    company: 'Apex Logistics Corp',
    plan: 'Enterprise Growth',
    tenureMonths: 8,
    monthlySpend: 112.0,
    totalSpend: 896.0,
    churnProbability: 89,
    riskTier: 'high',
    contractType: 'Month-to-Month',
    supportTicketsLast30d: 5,
    lastActivity: '4 days ago',
    npsScore: 4,
    drivers: [
      'Frequent support tickets (5 tickets filed in last 21 days)',
      'Month-to-month contract vulnerability without annual commitment',
      'Billing spike dispute on recent API overage'
    ],
    driverWeights: [
      { driver: 'Support ticket escalation', impact: 42 },
      { driver: 'Month-to-month contract flexibility', impact: 31 },
      { driver: 'Overage pricing dissatisfaction', impact: 27 }
    ],
    retentionOffers: [
      {
        id: 'offer-1',
        title: 'Enterprise Annual Migration + 20% Rebate',
        description: 'Convert flexible month-to-month into a 12-month lock-in with guaranteed pricing caps on overages.',
        discountOrPerk: '20% off annual upfront + $0 overage cap up to 50k calls',
        estimatedSavings: '$268.80 / year retained margin',
        recommendedChannel: 'Dedicated Executive Sponsor Call & In-App Notice',
        targetDriver: 'Month-to-month contract vulnerability'
      },
      {
        id: 'offer-2',
        title: 'Priority Tier-3 Support SLA & VIP Technical Lead',
        description: 'Assign dedicated Solutions Engineer to resolve recurring logistics API integration tickets within 1 hour.',
        discountOrPerk: 'Dedicated Technical Account Manager (TAM) for 90 days',
        estimatedSavings: 'Direct resolution of 5 active friction points',
        recommendedChannel: 'Direct Slack Connect / Phone Escalation',
        targetDriver: 'Frequent support tickets'
      }
    ]
  },
  {
    id: 'CUST-0219',
    name: 'Marcus Vance',
    email: 'm.vance@nordicfin.se',
    company: 'Nordic FinTech Solutions',
    plan: 'Pro Annual',
    tenureMonths: 14,
    monthlySpend: 340.0,
    totalSpend: 4760.0,
    churnProbability: 76,
    riskTier: 'high',
    contractType: 'Annual',
    supportTicketsLast30d: 3,
    lastActivity: '7 days ago',
    npsScore: 5,
    drivers: [
      '70% drop in core team daily active logins over past 30 days',
      'Approaching contract renewal in 18 days with zero admin activity',
      'Key champion user (VP of Product) departed the organization'
    ],
    driverWeights: [
      { driver: 'Steep activity decline (70%)', impact: 48 },
      { driver: 'Upcoming contract expiration', impact: 32 },
      { driver: 'Loss of internal sponsor', impact: 20 }
    ],
    retentionOffers: [
      {
        id: 'offer-1',
        title: 'Executive Re-Onboarding & Team Renewal Incentive',
        description: 'Offer a complimentary 2-hour workflow audit for the incoming department head and lock in multi-year loyalty rates.',
        discountOrPerk: '15% renewal discount + Free 5 additional team seats',
        estimatedSavings: '$612.00 / year preserved ARR',
        recommendedChannel: 'Executive Sponsor Email + Calendar invite',
        targetDriver: 'Approaching contract renewal'
      },
      {
        id: 'offer-2',
        title: 'Workspace Re-activation Playbook & Automated Training',
        description: 'Deploy tailored in-product checklist to retrain secondary analysts on newly released compliance features.',
        discountOrPerk: 'Free Enterprise Security Add-on ($120/mo value)',
        estimatedSavings: 'Restores daily usage baseline across 12 seats',
        recommendedChannel: 'Direct In-App Guided Walkthrough',
        targetDriver: 'Drop in core daily active logins'
      }
    ]
  },
  {
    id: 'CUST-0304',
    name: 'Elena Rostova',
    email: 'elena@helsinkidata.fi',
    company: 'Helsinki Data Works',
    plan: 'Enterprise Custom',
    tenureMonths: 5,
    monthlySpend: 620.0,
    totalSpend: 3100.0,
    churnProbability: 82,
    riskTier: 'high',
    contractType: 'Month-to-Month',
    supportTicketsLast30d: 7,
    lastActivity: '2 days ago',
    npsScore: 3,
    drivers: [
      'Unresolved data connector latency issue pending for 14 days',
      'Early tenure onboarding friction (<6 months)',
      'Account administrator visited the cancellation FAQ page twice'
    ],
    driverWeights: [
      { driver: 'Latency bottleneck ticket', impact: 50 },
      { driver: 'Visited cancellation documentation', impact: 30 },
      { driver: 'Early tenure vulnerability', impact: 20 }
    ],
    retentionOffers: [
      {
        id: 'offer-1',
        title: 'Immediate Engineering Hotfix & SLA Credit Waiver',
        description: 'Provide an instant $300 platform credit for downtime and assign Head of Infrastructure for live remediation.',
        discountOrPerk: '$300 one-time billing credit + Direct Lead Engineer bridge',
        estimatedSavings: '$7,440 preserved annual contract value',
        recommendedChannel: 'Urgent Video Bridge with Head of Customer Success',
        targetDriver: 'Unresolved data connector latency'
      }
    ]
  },
  {
    id: 'CUST-0411',
    name: 'David Kalu',
    email: 'david@strataflow.co.uk',
    company: 'StrataFlow Systems',
    plan: 'Pro Growth',
    tenureMonths: 11,
    monthlySpend: 185.0,
    totalSpend: 2035.0,
    churnProbability: 71,
    riskTier: 'high',
    contractType: 'Month-to-Month',
    supportTicketsLast30d: 4,
    lastActivity: '9 days ago',
    npsScore: 6,
    drivers: [
      'Exported complete customer list to CSV 48 hours ago',
      'Low mobile app engagement despite high desktop activity',
      'Recent downgrade inquiry sent to billing support'
    ],
    driverWeights: [
      { driver: 'Full database export event', impact: 45 },
      { driver: 'Downgrade inquiry to billing', impact: 35 },
      { driver: 'Feature underutilization', impact: 20 }
    ],
    retentionOffers: [
      {
        id: 'offer-1',
        title: 'Contract Stabilization Package with 2 Free Months',
        description: 'Provide 2 months complimentary service in exchange for committing to an annual agreement.',
        discountOrPerk: '2 months free on 12-month renewal + Downgrade pause',
        estimatedSavings: '$1,850 guaranteed ARR',
        recommendedChannel: 'Billing Concierge Personalized Outreach',
        targetDriver: 'Downgrade inquiry sent to billing'
      }
    ]
  },
  {
    id: 'CUST-0522',
    name: 'Amara Chen',
    email: 'amara.c@luminar.ai',
    company: 'Luminar Cognitive',
    plan: 'Pro Annual',
    tenureMonths: 19,
    monthlySpend: 290.0,
    totalSpend: 5510.0,
    churnProbability: 58,
    riskTier: 'medium',
    contractType: 'Annual',
    supportTicketsLast30d: 2,
    lastActivity: '1 day ago',
    npsScore: 7,
    drivers: [
      'Stagnant seat utilization (only 4 of 10 paid seats currently assigned)',
      'Subscribed to competitive benchmark newsletter',
      'Moderate drop in query volume over weekend cycles'
    ],
    driverWeights: [
      { driver: 'Unassigned paid seat waste', impact: 44 },
      { driver: 'Competitive evaluation interest', impact: 32 },
      { driver: 'Volume flattening', impact: 24 }
    ],
    retentionOffers: [
      {
        id: 'offer-1',
        title: 'Seat Rebalancing & Advanced Analytics Bundle',
        description: 'Restructure plan to 6 seats + unlock premium automation pipelines without raising overall billing.',
        discountOrPerk: 'No-cost tier switch + Automation Hub access included',
        estimatedSavings: 'Eliminates friction of paying for idle seats',
        recommendedChannel: 'CSM Strategy Review',
        targetDriver: 'Stagnant seat utilization'
      }
    ]
  },
  {
    id: 'CUST-0630',
    name: 'Henrik Lindqvist',
    email: 'henrik@stockholmlabs.io',
    company: 'Stockholm Labs AB',
    plan: 'Growth Monthly',
    tenureMonths: 7,
    monthlySpend: 95.0,
    totalSpend: 665.0,
    churnProbability: 49,
    riskTier: 'medium',
    contractType: 'Month-to-Month',
    supportTicketsLast30d: 1,
    lastActivity: '3 days ago',
    npsScore: 7,
    drivers: [
      'Failed payment retry on previous billing cycle (card expiration)',
      'Moderate feature adoption in reporting modules',
      'No integration webhooks configured'
    ],
    driverWeights: [
      { driver: 'Billing retry failure', impact: 50 },
      { driver: 'Zero webhook integrations', impact: 30 },
      { driver: 'Isolated usage pattern', impact: 20 }
    ],
    retentionOffers: [
      {
        id: 'offer-1',
        title: 'Automated Billing Concierge & Free Zapier Integration',
        description: 'Send white-glove payment update link and provide guided 1-click webhook setup.',
        discountOrPerk: '$20 bill credit upon secondary card backup addition',
        estimatedSavings: 'Prevents passive involuntary churn',
        recommendedChannel: 'Automated In-App Notification & Email',
        targetDriver: 'Failed payment retry'
      }
    ]
  },
  {
    id: 'CUST-0745',
    name: 'Clara Oswald',
    email: 'clara@tardismedia.co',
    company: 'Tardis Digital Media',
    plan: 'Enterprise Scale',
    tenureMonths: 22,
    monthlySpend: 540.0,
    totalSpend: 11880.0,
    churnProbability: 45,
    riskTier: 'medium',
    contractType: '2-Year Enterprise',
    supportTicketsLast30d: 2,
    lastActivity: 'Yesterday',
    npsScore: 8,
    drivers: [
      'Usage plateaued near upper quota boundary without upgrading',
      'New team members not completing workspace onboarding',
      'Contract renegotiation scheduled in 60 days'
    ],
    driverWeights: [
      { driver: 'Quota ceiling friction', impact: 45 },
      { driver: 'New member drop-off', impact: 30 },
      { driver: 'Upcoming contract milestone', impact: 25 }
    ],
    retentionOffers: [
      {
        id: 'offer-1',
        title: 'Quota Expansion Grant & Pre-Emptive Renewal Discount',
        description: 'Grant 25% quota buffer immediately with guaranteed rate lock on next renewal term.',
        discountOrPerk: '25% extra quota free + 10% multi-year renewal discount',
        estimatedSavings: '$1,296 / year guaranteed contract expansion',
        recommendedChannel: 'Account Director Direct Call',
        targetDriver: 'Usage plateaued near upper quota boundary'
      }
    ]
  },
  {
    id: 'CUST-0850',
    name: 'Tobias Berg',
    email: 'tobias@nordcloud.no',
    company: 'NordCloud Infrastructure',
    plan: 'Pro Annual',
    tenureMonths: 16,
    monthlySpend: 220.0,
    totalSpend: 3520.0,
    churnProbability: 38,
    riskTier: 'medium',
    contractType: 'Annual',
    supportTicketsLast30d: 1,
    lastActivity: 'Today',
    npsScore: 7,
    drivers: [
      'Occasional weekend API latency warnings',
      'Single user admin bottleneck (no backup manager assigned)',
      'Suboptimal webhook failure handling'
    ],
    driverWeights: [
      { driver: 'Single administrator risk', impact: 40 },
      { driver: 'API latency notices', impact: 35 },
      { driver: 'Webhook alerts', impact: 25 }
    ],
    retentionOffers: [
      {
        id: 'offer-1',
        title: 'Multi-Admin Provisioning & Health Audit',
        description: 'Provide automated permission templates and complimentary infrastructure tuning session.',
        discountOrPerk: 'Free secondary Admin seat license ($40/mo value)',
        estimatedSavings: 'Secures account continuity against single point of failure',
        recommendedChannel: 'In-app Admin Recommendation banner',
        targetDriver: 'Single user admin bottleneck'
      }
    ]
  },
  {
    id: 'CUST-0912',
    name: 'Astrid Lindgren',
    email: 'astrid@scandicpulse.com',
    company: 'Scandic Pulse Retail',
    plan: 'Enterprise Scale',
    tenureMonths: 34,
    monthlySpend: 780.0,
    totalSpend: 26520.0,
    churnProbability: 18,
    riskTier: 'low',
    contractType: '2-Year Enterprise',
    supportTicketsLast30d: 0,
    lastActivity: 'Today',
    npsScore: 10,
    drivers: [
      'High daily login frequency across 28 active users',
      'Strong webhook and custom API integration maturity',
      'Long tenure (>30 months) with zero overdue payments'
    ],
    driverWeights: [
      { driver: 'Deep integration stickiness', impact: 60 },
      { driver: 'High user breadth', impact: 25 },
      { driver: 'Healthy billing history', impact: 15 }
    ],
    retentionOffers: [
      {
        id: 'offer-1',
        title: 'VIP Customer Advisory Board & Beta Access',
        description: 'Invite executive sponsor to early access program for next-generation intelligence modules.',
        discountOrPerk: 'Exclusive beta privileges + annual co-marketing case study',
        estimatedSavings: 'Deepens strategic lock-in for 2027 renewal',
        recommendedChannel: 'Executive Sponsor Quarterly Business Review',
        targetDriver: 'High satisfaction loyalty'
      }
    ]
  },
  {
    id: 'CUST-1025',
    name: 'Julian Thorne',
    email: 'j.thorne@zenithcloud.io',
    company: 'Zenith Cloud Ops',
    plan: 'Pro Annual',
    tenureMonths: 26,
    monthlySpend: 240.0,
    totalSpend: 6240.0,
    churnProbability: 14,
    riskTier: 'low',
    contractType: 'Annual',
    supportTicketsLast30d: 0,
    lastActivity: 'Today',
    npsScore: 9,
    drivers: [
      'Consistent daily usage within optimal quota bands',
      'Recently expanded team from 6 to 12 active seats',
      'Fast positive feedback on last product release'
    ],
    driverWeights: [
      { driver: 'Expansion momentum', impact: 55 },
      { driver: 'Product satisfaction', impact: 30 },
      { driver: 'Consistent cadence', impact: 15 }
    ],
    retentionOffers: [
      {
        id: 'offer-1',
        title: 'Annual Renewal Loyalty Lock with Volume Discount',
        description: 'Lock in current per-seat rate for next 24 months with free API quota ceiling expansion.',
        discountOrPerk: 'Locked grandfathered rate + 10% volume rebate on next tier',
        estimatedSavings: '$576 ARR expansion pipeline',
        recommendedChannel: 'Quarterly Check-in Email',
        targetDriver: 'Expansion momentum'
      }
    ]
  },
  {
    id: 'CUST-1144',
    name: 'Soren Mikkelsen',
    email: 'soren@copenhagenhealth.dk',
    company: 'Copenhagen Health Tech',
    plan: 'Enterprise Growth',
    tenureMonths: 29,
    monthlySpend: 490.0,
    totalSpend: 14210.0,
    churnProbability: 22,
    riskTier: 'low',
    contractType: 'Annual',
    supportTicketsLast30d: 1,
    lastActivity: 'Yesterday',
    npsScore: 9,
    drivers: [
      'HIPAA / GDPR audit logs downloaded and configured',
      'Solid team retention and ongoing data pipelines',
      'Stable month-over-month telemetry'
    ],
    driverWeights: [
      { driver: 'Compliance feature dependency', impact: 50 },
      { driver: 'Consistent telemetry', impact: 30 },
      { driver: 'Low friction tickets', impact: 20 }
    ],
    retentionOffers: [
      {
        id: 'offer-1',
        title: 'Advanced Audit Log Long-Term Archive Add-on',
        description: 'Extend cold-storage audit retention from 1 year to 7 years at subsidized partner rate.',
        discountOrPerk: 'Complimentary 7-year retention module upgrade',
        estimatedSavings: 'Reinforces institutional reliance on Hash Clash Churn platform',
        recommendedChannel: 'Security & Compliance Lead brief',
        targetDriver: 'Compliance dependency'
      }
    ]
  },
  {
    id: 'CUST-1288',
    name: 'Freja Nygard',
    email: 'freja@nordicpay.no',
    company: 'Nordic Pay Systems',
    plan: 'Pro Growth',
    tenureMonths: 15,
    monthlySpend: 175.0,
    totalSpend: 2625.0,
    churnProbability: 26,
    riskTier: 'low',
    contractType: 'Annual',
    supportTicketsLast30d: 0,
    lastActivity: 'Today',
    npsScore: 9,
    drivers: [
      'Daily automated batch jobs run with 99.98% success rate',
      'Regular engagement with analytics dashboards',
      'Active credit card with autopay verified'
    ],
    driverWeights: [
      { driver: 'Automated workflow reliance', impact: 60 },
      { driver: 'Zero billing issues', impact: 25 },
      { driver: 'Healthy telemetry', impact: 15 }
    ],
    retentionOffers: [
      {
        id: 'offer-1',
        title: 'Automation Workflow Performance Booster',
        description: 'Offer free preview of real-time event streaming triggers to replace hourly batches.',
        discountOrPerk: 'Early access to streaming pipeline connector',
        estimatedSavings: 'Accelerates path to Enterprise tier upgrade',
        recommendedChannel: 'Product Newsletter Feature Spotlight',
        targetDriver: 'Workflow automation reliance'
      }
    ]
  }
];

export const SAMPLE_CSV_CONTENT = `Customer Name,Customer ID,Company,Plan,Tenure Months,Monthly Spend,Churn Probability,Contract,Support Tickets Last 30d
Sarah Jenkins,CUST-0142,Apex Logistics Corp,Enterprise Growth,8,112.00,89,Month-to-Month,5
Marcus Vance,CUST-0219,Nordic FinTech Solutions,Pro Annual,14,340.00,76,Annual,3
Elena Rostova,CUST-0304,Helsinki Data Works,Enterprise Custom,5,620.00,82,Month-to-Month,7
David Kalu,CUST-0411,StrataFlow Systems,Pro Growth,11,185.00,71,Month-to-Month,4
Amara Chen,CUST-0522,Luminar Cognitive,Pro Annual,19,290.00,58,Annual,2
Henrik Lindqvist,CUST-0630,Stockholm Labs AB,Growth Monthly,7,95.00,49,Month-to-Month,1
Clara Oswald,CUST-0745,Tardis Digital Media,Enterprise Scale,22,540.00,45,2-Year Enterprise,2
Tobias Berg,CUST-0850,NordCloud Infrastructure,Pro Annual,16,220.00,38,Annual,1
Astrid Lindgren,CUST-0912,Scandic Pulse Retail,Enterprise Scale,34,780.00,18,2-Year Enterprise,0
Julian Thorne,CUST-1025,Zenith Cloud Ops,Pro Annual,26,240.00,14,Annual,0
Soren Mikkelsen,CUST-1144,Copenhagen Health Tech,Enterprise Growth,29,490.00,22,Annual,1
Freja Nygard,CUST-1288,Nordic Pay Systems,Pro Growth,15,175.00,26,Annual,0`;
