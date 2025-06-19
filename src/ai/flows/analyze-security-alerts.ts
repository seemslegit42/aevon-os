// This is an AI-powered Security Alerts Analyzer.

'use server';

/**
 * @fileOverview A security alert analysis AI agent.
 *
 * - analyzeSecurityAlerts - A function that handles the security alerts analysis process.
 * - AnalyzeSecurityAlertsInput - The input type for the analyzeSecurityAlerts function.
 * - AnalyzeSecurityAlertsOutput - The return type for the analyzeSecurityAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSecurityAlertsInputSchema = z.object({
  alertDetails: z
    .string()
    .describe('Detailed information about the security alerts.'),
});
export type AnalyzeSecurityAlertsInput = z.infer<typeof AnalyzeSecurityAlertsInputSchema>;

const AnalyzeSecurityAlertsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A plain English summary of the security alerts, including potential threats and recommended responses.'
    ),
});
export type AnalyzeSecurityAlertsOutput = z.infer<typeof AnalyzeSecurityAlertsOutputSchema>;

export async function analyzeSecurityAlerts(input: AnalyzeSecurityAlertsInput): Promise<AnalyzeSecurityAlertsOutput> {
  return analyzeSecurityAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSecurityAlertsPrompt',
  input: {schema: AnalyzeSecurityAlertsInputSchema},
  output: {schema: AnalyzeSecurityAlertsOutputSchema},
  prompt: `You are an AI-powered security expert specializing in analyzing security alerts.

You will receive detailed information about security alerts and your task is to provide a plain English summary that is easy to understand for non-technical users.

The summary should include potential threats, recommended responses, and any other relevant information that can help the user quickly understand and respond to the alerts.

Alert Details: {{{alertDetails}}}`,
});

const analyzeSecurityAlertsFlow = ai.defineFlow(
  {
    name: 'analyzeSecurityAlertsFlow',
    inputSchema: AnalyzeSecurityAlertsInputSchema,
    outputSchema: AnalyzeSecurityAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
