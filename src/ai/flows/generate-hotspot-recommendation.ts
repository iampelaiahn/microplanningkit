'use server';
/**
 * @fileOverview A Genkit flow for generating microplanning recommendations for health hotspots.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HotspotRecommendationInputSchema = z.object({
  hotspotName: z.string(),
  typology: z.array(z.string()),
  totalEstimatedPopulation: z.number(),
  riskFlags: z.array(z.string()),
  barriers: z.string(),
  serviceGaps: z.array(z.string()),
});
export type HotspotRecommendationInput = z.infer<typeof HotspotRecommendationInputSchema>;

const HotspotRecommendationOutputSchema = z.object({
  analysis: z.string().describe('A summary analysis of the hotspot status.'),
  recommendations: z.array(z.string()).describe('List of specific microplanning recommendations.'),
  priorityLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The priority for follow-up.'),
});
export type HotspotRecommendationOutput = z.infer<typeof HotspotRecommendationOutputSchema>;

export async function generateHotspotRecommendation(input: HotspotRecommendationInput): Promise<HotspotRecommendationOutput> {
  return generateHotspotRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'hotspotRecommendationPrompt',
  input: { schema: HotspotRecommendationInputSchema },
  output: { schema: HotspotRecommendationOutputSchema },
  prompt: `You are an expert in Community Health Microplanning for Key Populations.
Analyze the following hotspot data and provide programmatic insights and actionable recommendations.

Hotspot: {{{hotspotName}}}
Typology: {{#each typology}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Estimated Population: {{{totalEstimatedPopulation}}}
Identified Risk Flags: {{#each riskFlags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Service Gaps: {{#each serviceGaps}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Structural Barriers: {{{barriers}}}

Based on this, suggest specific outreach strategies, supply chain adjustments (condoms/lube), and clinical referral improvements.`,
});

const generateHotspotRecommendationFlow = ai.defineFlow(
  {
    name: 'generateHotspotRecommendationFlow',
    inputSchema: HotspotRecommendationInputSchema,
    outputSchema: HotspotRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
