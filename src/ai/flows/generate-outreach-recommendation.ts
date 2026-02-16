
'use server';
/**
 * @fileOverview A Genkit flow for generating weekly outreach recommendations and follow-ups.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OutreachRecommendationInputSchema = z.object({
  uin: z.string(),
  visitDate: z.string(),
  riskLevel: z.string(),
  commoditiesDistributed: z.number(),
  isRegisteredAtClinic: z.boolean(),
});
export type OutreachRecommendationInput = z.infer<typeof OutreachRecommendationInputSchema>;

const OutreachRecommendationOutputSchema = z.object({
  summary: z.string().describe('A summary of the outreach performance for this peer.'),
  actions: z.array(z.string()).describe('List of recommended microplanning actions.'),
  followUpPriority: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The priority for follow-up.'),
});
export type OutreachRecommendationOutput = z.infer<typeof OutreachRecommendationOutputSchema>;

export async function generateOutreachRecommendation(input: OutreachRecommendationInput): Promise<OutreachRecommendationOutput> {
  return generateOutreachRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'outreachRecommendationPrompt',
  input: { schema: OutreachRecommendationInputSchema },
  output: { schema: OutreachRecommendationOutputSchema },
  prompt: `You are an AI assistant for Community Health Microplanning.
Analyze this weekly outreach visit and provide follow-up recommendations.

Peer UIN: {{{uin}}}
Visit Date: {{{visitDate}}}
Risk Level: {{{riskLevel}}}
Commodities Distributed: {{{commoditiesDistributed}}}
Clinic Linkage Status: {{#if isRegisteredAtClinic}}Registered{{else}}NOT REGISTERED{{/if}}

Based on microplanning rules:
- High risk peers need weekly contact.
- Peers not registered at clinic need urgent linkage support.
- Commodity distribution should match risk level needs.

Suggest specific next steps for the peer educator.`,
});

const generateOutreachRecommendationFlow = ai.defineFlow(
  {
    name: 'generateOutreachRecommendationFlow',
    inputSchema: OutreachRecommendationInputSchema,
    outputSchema: OutreachRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
