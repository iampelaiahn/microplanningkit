
export type RiskLevel = 'Low' | 'Medium' | 'High';

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
};

export type Hotspot = {
  id: string;
  name: string;
  type: 'Facility' | 'Community';
  lat: number;
  lng: number;
  ward: string;
  reachCount: number;
};
