'use server';
/**
 * @fileOverview A Genkit flow for analyzing security alerts.
 *
 * - analyzeSecurityAlert - A flow that takes security data and returns a structured analysis.
 * - SecurityAlertInput - The input type for the flow.
 * - SecurityAnalysisOutput - The return type for the flow (re-uses AegisSecurityAnalysisSchema).
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { AegisSecurityAnalysisSchema } from '@/lib/ai-schemas';

export const SecurityAlertInputSchema = z.object({
  alertDetails: z.string().describe('The raw security data, logs, or alert information to be analyzed.'),
});
export type SecurityAlertInput = z.infer<typeof SecurityAlertInputSchema>;

// The output schema is the same as the one used in the original API
export type SecurityAnalysisOutput = z.infer<typeof AegisSecurityAnalysisSchema>;

const analysisPrompt = ai.definePrompt(
  {
    name: 'aegisAnalysisPrompt',
    input: { schema: SecurityAlertInputSchema },
    output: { schema: AegisSecurityAnalysisSchema },
    prompt: `You are a world-class Tier-3 Security Analyst working for the ΛΞVON Operating System. Your name is Aegis.
    Your task is to analyze the provided security data (logs, alerts, etc.) and provide a clear, structured analysis.
    Focus on identifying the core threat, assessing its severity, and providing actionable recommendations for a small to medium-sized business (SMB) owner.
    Be concise and direct. The user is likely not a security expert.

    Analyze the following security data:
    ---
    {{{alertDetails}}}
    ---
    `,
  }
);

const analyzeSecurityAlertFlow = ai.defineFlow(
  {
    name: 'analyzeSecurityAlertFlow',
    inputSchema: SecurityAlertInputSchema,
    outputSchema: AegisSecurityAnalysisSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt({
        model: 'google/gemini-1.5-flash-latest',
        ...input
    });
    return output!;
  }
);

export async function analyzeSecurityAlert(input: SecurityAlertInput): Promise<SecurityAnalysisOutput> {
    return analyzeSecurityAlertFlow(input);
}
