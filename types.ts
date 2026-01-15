
export enum VisitType {
  PROSPECTING = 'PROSPECTING', // 新客户拓客
  MAINTENANCE = 'MAINTENANCE', // 老客户维护
  PLANNED = 'PLANNED',       // 拜访计划
}

export interface Contact {
  name: string;
  role: string;
  phone: string;
}

export interface Solution {
  title: string;
  desc: string;
  benefits: string[];
  stats: string;
  icon: string;
}

export interface CaseStudy {
  company: string;
  industry: string;
  desc: string;
  image: string;
}

export interface ScheduledVisit {
  id: string;
  customerId: string;
  customerName: string;
  time: string;
  contactName: string;
  contactPhone: string;
  type: 'phone' | 'in-person';
  status: 'planned' | 'active' | 'completed';
}

export interface HealthDimension {
  name: string;
  score: number;
  status: 'excellent' | 'normal' | 'warning';
}

export interface ExistingCustomer {
  id: string;
  name: string;
  address: string;
  status: string;
  score: number;
  scoreTrend: 'up' | 'down' | 'stable';
  healthDimensions: HealthDimension[];
  briefTip: string;
  industry: string;
  years: number;
  revenue: string;
  employees: string;
  contractStatus: string;
  contacts: Contact[];
  painPoints: {
    current: string[];
    potential: string[];
  };
  solutions: Solution[];
  cases: CaseStudy[];
  scripts: string[];
  signals: {
    behaviorChange: string;
    freqChange: string;
    churnRisk: '低' | '中' | '高';
    renewalSignal: string;
    focus: string;
  };
  actions: {
    direction: string;
    valuePoints: string[];
    nextSteps: string[];
  };
  lastVisit: string;
  nextMilestone: string;
  isFollowUp?: boolean;
}

export interface ProspectCustomer {
  id: string;
  name: string;
  address: string;
  industry: string;
  size: string;
  needIntensity: '强' | '中' | '弱';
  reason: string;
  background: string;
  scenarios: string[];
  painPoints: {
    typical: string[];
    focus: string[];
    concerns: string[];
  };
  solutions: Solution[];
  cases: CaseStudy[];
  nextSteps: string[];
  isFollowUp?: boolean;
}
