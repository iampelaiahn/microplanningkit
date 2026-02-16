
import { StockItem, KPRecord, Hotspot } from './types';

export const INITIAL_STOCK: StockItem[] = [
  // Matapi Youth Hub
  { id: '1', name: 'Condoms', totalReceived: 12000, totalDispensed: 4000, currentStock: 8000, facility: 'Matapi Youth Hub' },
  { id: '2', name: 'Lube', totalReceived: 5000, totalDispensed: 2800, currentStock: 2200, facility: 'Matapi Youth Hub' },
  { id: '3', name: 'HIVST Kits', totalReceived: 3000, totalDispensed: 1800, currentStock: 1200, facility: 'Matapi Youth Hub' },
  { id: '4', name: 'Pregnancy Tests', totalReceived: 1200, totalDispensed: 750, currentStock: 450, facility: 'Matapi Youth Hub' },
  { id: '5', name: 'Pads (Reusable)', totalReceived: 2500, totalDispensed: 1500, currentStock: 1000, facility: 'Matapi Youth Hub' },
  { id: '6', name: 'Pads (Disposable)', totalReceived: 6000, totalDispensed: 3500, currentStock: 2500, facility: 'Matapi Youth Hub' },
  
  // Edith Opperman Clinic
  { id: '7', name: 'Condoms', totalReceived: 10000, totalDispensed: 3000, currentStock: 7000, facility: 'Edith Opperman Clinic' },
  { id: '8', name: 'Lube', totalReceived: 4500, totalDispensed: 2000, currentStock: 2500, facility: 'Edith Opperman Clinic' },
  { id: '9', name: 'HIVST Kits', totalReceived: 4000, totalDispensed: 1500, currentStock: 2500, facility: 'Edith Opperman Clinic' },
  { id: '10', name: 'Pregnancy Tests', totalReceived: 1500, totalDispensed: 800, currentStock: 700, facility: 'Edith Opperman Clinic' },
  { id: '11', name: 'Pads (Reusable)', totalReceived: 2000, totalDispensed: 1200, currentStock: 800, facility: 'Edith Opperman Clinic' },
  { id: '12', name: 'Pads (Disposable)', totalReceived: 5000, totalDispensed: 3000, currentStock: 2000, facility: 'Edith Opperman Clinic' },
];

export const INITIAL_KPS: KPRecord[] = [
  { id: 'kp1', uin: 'V-A-80063', riskLevel: 'High', ward: 'Ward 3', lastAssessment: '2023-10-15', verificationStatus: 'Verified', meetingCount: 3 },
  { id: 'kp2', uin: 'M-B-91022', riskLevel: 'Low', ward: 'Ward 11', lastAssessment: '2023-11-01', verificationStatus: 'Pending', meetingCount: 1 },
];

export const INITIAL_HOTSPOTS: Hotspot[] = [
  { id: 'h1', name: 'Mbare Musika', type: 'Community', lat: -17.854, lng: 31.037, ward: 'Ward 3', reachCount: 45 },
  { id: 'h2', name: 'Matapi Youth Hub', type: 'Facility', lat: -17.859, lng: 31.042, ward: 'Ward 3', reachCount: 120 },
  { id: 'h3', name: 'Edith Opperman Clinic', type: 'Facility', lat: -17.865, lng: 31.050, ward: 'Ward 11', reachCount: 85 },
];
