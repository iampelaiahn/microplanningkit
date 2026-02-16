import { z } from 'zod';

/**
 * @fileOverview Consolidated Zod schemas for the Sentinel Mbare Microplanning Kit.
 * These schemas provide both runtime validation and TypeScript types.
 */

export const RiskLevelSchema = z.enum(['Low', 'Medium', 'High', 'Unknown']);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const KPTypeSchema = z.enum(['FSW', 'MSW', 'TG', 'PWUD', 'PWID', 'HRM']);
export type KPType = z.infer<typeof KPTypeSchema>;

export const RelationshipStrengthSchema = z.enum(['Weak', 'Moderate', 'Strong', 'Critical']);
export type RelationshipStrength = z.infer<typeof RelationshipStrengthSchema>;

export const PersonTypeSchema = z.enum(['Peer Leader', 'Influencer', 'KP Member']);
export type PersonType = z.infer<typeof PersonTypeSchema>;

export const CommoditiesSchema = z.object({
  mc: z.number().default(0).describe('Male Condoms'),
  fc: z.number().default(0).describe('Female Condoms'),
  lube: z.number().default(0).describe('Lubricants'),
  hivstDistributed: z.number().default(0).describe('HIV Self-Test Kits Distributed'),
  hivstNegative: z.number().default(0),
  hivstPositive: z.number().default(0),
  pregDistributed: z.number().default(0).describe('Pregnancy Tests Distributed'),
  pregNegative: z.number().default(0),
  pregPositive: z.number().default(0),
  padsReusable: z.number().default(0),
  padsDisposable: z.number().default(0),
});

export const OutreachVisitSchema = z.object({
  peerEducatorId: z.string(),
  peerEducatorName: z.string(),
  uin: z.string().describe('Unique Identifier of the peer'),
  visitDate: z.string(),
  riskLevel: RiskLevelSchema,
  isRegisteredAtClinic: z.boolean(),
  commodities: CommoditiesSchema,
  topicsDiscussed: z.array(z.string()),
  aiSummary: z.string().optional(),
  aiActions: z.array(z.string()).optional(),
  timestamp: z.string(),
});
export type OutreachVisit = z.infer<typeof OutreachVisitSchema>;

export const HotspotProfileSchema = z.object({
  peerEducatorId: z.string(),
  siteName: z.string(),
  hotspotName: z.string(),
  ward: z.string(),
  area: z.string(),
  cluster: z.string(),
  profilingDate: z.string(),
  microplanner: z.string(),
  lat: z.number(),
  lng: z.number(),
  typology: z.array(z.string()),
  populationData: z.record(z.object({
    a1: z.number().describe('Age 18-24'),
    a2: z.number().describe('Age 25-35'),
    a3: z.number().describe('Age 36+'),
    total: z.number()
  })),
  services: z.object({
    condoms: z.boolean(),
    lube: z.boolean(),
    clinicDistance: z.number(),
    kpFriendly: z.boolean(),
  }),
  structural: z.object({
    police: z.string(),
    violence: z.string(),
    stigma: z.string(),
  }),
  aiAnalysis: z.string().optional(),
  aiRecommendations: z.array(z.string()).optional(),
  priorityLevel: z.string(),
  timestamp: z.string(),
});
export type HotspotProfile = z.infer<typeof HotspotProfileSchema>;

export const StockItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  facility: z.enum(['Matapi Youth Hub', 'Edith Opperman Clinic', 'Warehouse']),
  totalReceived: z.number(),
  totalDispensed: z.number(),
  currentStock: z.number(),
});
export type StockItem = z.infer<typeof StockItemSchema>;

export const SocialNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: PersonTypeSchema,
  influenceScore: z.number().min(0).max(100),
  ward: z.string(),
  x: z.number().optional().describe('X coordinate percentage for map layout'),
  y: z.number().optional().describe('Y coordinate percentage for map layout'),
});
export type SocialNode = z.infer<typeof SocialNodeSchema>;

export const TrustBridgeSchema = z.object({
  from: z.string().describe('Source Node ID'),
  to: z.string().describe('Target Node ID'),
  strength: RelationshipStrengthSchema,
});
export type TrustBridge = z.infer<typeof TrustBridgeSchema>;
