'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating a concise summary of identified risk factors
 * and a rationale for the assigned risk level for a Key Population.
 *
 * - generateRiskAssessmentSummary - An asynchronous function to generate the risk assessment summary.
 * - GenerateRiskAssessmentSummaryInput - The input type for the generateRiskAssessmentSummary function.
 * - GenerateRiskAssessmentSummaryOutput - The return type for the generateRiskAssessmentSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateRiskAssessmentSummaryInputSchema = z.object({
  identifiedRiskFactors: z.array(z.string()).describe('A list of identified risk factors for the Key Population. Each item should be a descriptive phrase or sentence.'),
  assignedRiskLevel: z.enum(['Low', 'Medium', 'High']).describe('The assigned risk level for the Key Population (Low, Medium, or High).'),
});
export type GenerateRiskAssessmentSummaryInput = z.infer<typeof GenerateRiskAssessmentSummaryInputSchema>;

const GenerateRiskAssessmentSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the identified risk factors.'),
  rationale: z.string().describe('A clear rationale explaining why the assigned risk level is appropriate based on the identified risk factors.'),
});
export type GenerateRiskAssessmentSummaryOutput = z.infer<typeof GenerateRiskAssessmentSummaryOutputSchema>;

export async function generateRiskAssessmentSummary(input: GenerateRiskAssessmentSummaryInput): Promise<GenerateRiskAssessmentSummaryOutput> {
  return generateRiskAssessmentSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'riskAssessmentSummaryPrompt',
  input: { schema: GenerateRiskAssessmentSummaryInputSchema },
  output: { schema: GenerateRiskAssessmentSummaryOutputSchema },
  prompt: `You are an AI assistant designed to help Community Health Mobilizers (CHMs) and Peer Educators (PEs) understand risk assessments for Key Populations.

Based on the following identified risk factors and the assigned risk level, generate a concise summary of the risk factors and provide a clear rationale for the assigned risk level.

Identified Risk Factors:
{{#each identifiedRiskFactors}}- {{{this}}}
{{/each}}

Assigned Risk Level: {{{assignedRiskLevel}}}`, 
});

const generateRiskAssessmentSummaryFlow = ai.defineFlow(
  {
    name: 'generateRiskAssessmentSummaryFlow',
    inputSchema: GenerateRiskAssessmentSummaryInputSchema,
        outputSchema: GenerateRiskAssessmentSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
