
/**
 * @fileOverview Defines Zod schemas and TypeScript types for AI interactions.
 * This file centralizes all data structures used for AI interactions,
 * allowing them to be shared between server-side API routes and client-side components.
 */
import { z } from 'zod';

// Defines the structured output for the Aegis security analysis feature.
export const AegisSecurityAnalysisSchema = z.object({
  summary: z.string().describe("A concise, one-sentence summary of the security alert analysis."),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']).describe("The assessed severity level of the alert."),
  identifiedThreats: z.array(z.string()).describe("A list of specific threats or vulnerabilities identified from the data."),
  suggestedActions: z.array(z.string()).describe("A list of concrete, actionable steps to mitigate the identified threats."),
});

export type AegisSecurityAnalysis = z.infer<typeof AegisSecurityAnalysisSchema>;
