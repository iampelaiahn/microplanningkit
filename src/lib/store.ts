
import { StockItem, KPRecord, Hotspot } from './types';

export const INITIAL_STOCK: StockItem[] = [
  { id: '1', name: 'Condoms', quantity: 1500, ward: 'Ward 3' },
  { id: '2', name: 'Lube', quantity: 800, ward: 'Ward 3' },
  { id: '3', name: 'HIVST', quantity: 200, ward: 'Ward 11' },
  { id: '4', name: 'Pregnancy Tests', quantity: 150, ward: 'Ward 12' },
  { id: '5', name: 'Pads (Reusable)', quantity: 300, ward: 'Ward 4' },
  { id: '6', name: 'Pads (Disposable)', quantity: 600, ward: 'Ward 4' },
];

export const INITIAL_KPS: KPRecord[] = [
  { id: 'kp1', uin: 'V-A-80063', riskLevel: 'High', ward: 'Ward 3', lastAssessment: '2023-10-15', verificationStatus: 'Verified', meetingCount: 3 },
  { id: 'kp2', uin: 'M-B-91022', riskLevel: 'Low', ward: 'Ward 11', lastAssessment: '2023-11-01', verificationStatus: 'Pending', meetingCount: 1 },
];

export const INITIAL_HOTSPOTS: Hotspot[] = [
  { id: 'h1', name: 'Mbare Musika', type: 'Community', lat: -17.854, lng: 31.037, ward: 'Ward 3', reachCount: 45 },
  { id: 'h2', name: 'Stodart Clinic', type: 'Facility', lat: -17.859, lng: 31.042, ward: 'Ward 3', reachCount: 120 },
];
