
export type RiskLevel = 'Low' | 'Medium' | 'High';

export type StockItem = {
  id: string;
  name: string;
  facility: 'Matapi Youth Hub' | 'Edith Opperman Clinic' | 'Warehouse';
  totalReceived: number;
  totalDispensed: number;
  currentStock: number;
  ward: 'Ward 3' | 'Ward 4' | 'Ward 11' | 'Ward 12';
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
