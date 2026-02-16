
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Unknown';
export type KPType = 'FSW' | 'MSW' | 'TG' | 'PWUD' | 'PWID' | 'HRM';

export type StockItem = {
  id: string;
  name: string;
  facility: 'Matapi Youth Hub' | 'Edith Opperman Clinic' | 'Warehouse';
  totalReceived: number;
  totalDispensed: number;
  currentStock: number;
};

export type DistributionRecord = {
  id: string;
  peerUin: string;
  ward: string;
  facility: string;
  itemName: string;
  quantity: number;
  timestamp: string;
};

export type KPRecord = {
  id: string;
  uin: string;
  riskLevel: RiskLevel;
  ward: string;
  lastAssessment: string;
  verificationStatus: 'Pending' | 'Verified';
  meetingCount: number;
  kpType?: KPType;
  isRegisteredAtClinic?: boolean;
};

export type RelationshipStrength = 'Weak' | 'Moderate' | 'Strong' | 'Critical';
export type PersonType = 'Peer Leader' | 'Influencer' | 'KP Member';

export type Hotspot = {
  id: string;
  name: string;
  type: PersonType;
  lat: number;
  lng: number;
  ward: string;
  reachCount: number;
  relationshipStrength?: RelationshipStrength;
  influenceScore?: number;
  targetGoal?: string;
  contactPerson?: string;
  x?: number; // percentage 0-100
  y?: number; // percentage 0-100
};

export type OutreachVisit = {
  id: string;
  visitDate: string;
  peerName: string;
  uin: string;
  clinicDueDate: string;
  riskLevel: RiskLevel;
  planningMeetingDone: boolean;
  maleCondomsDistributed: number;
  femaleCondomsDistributed: number;
  lubricantsDistributed: number;
  topicsDiscussed: string[];
  referralCode?: string;
  otherSourceOfIncome: boolean;
};
