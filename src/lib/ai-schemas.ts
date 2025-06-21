
/**
 * @fileOverview Defines Zod schemas and TypeScript types for AI interactions.
 * This file centralizes all data structures used for AI interactions,
 * allowing them to be shared between server-side API routes and client-side components.
 */
import { z } from 'zod';

// Schemas for analyze-security
export const SecurityAlertInputSchema = z.object({
  alertDetails: z.string().describe('The raw security alert data, logs, or error messages.'),
});
export type SecurityAlertInput = z.infer<typeof SecurityAlertInputSchema>;

export const SecurityAlertOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the security alert.'),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The assessed severity level of the alert.'),
  potentialThreats: z.array(z.string()).describe('A list of potential threats identified from the alert data.'),
  recommendedActions: z.array(z.string()).describe('A list of recommended actions to mitigate the threats.'),
});
export type SecurityAlertOutput = z.infer<typeof SecurityAlertOutputSchema>;


// Schemas for generate-app-description
export const AppDescriptionInputSchema = z.object({
  microAppName: z.string().min(3, "App name must be at least 3 characters"),
  microAppFunctionality: z.string().min(20, "Functionality description must be at least 20 characters"),
  targetAudience: z.string().min(10, "Target audience description must be at least 10 characters"),
  keyFeatures: z.string().min(10, "Please list key features, separated by commas (e.g., Feature 1, Feature 2)"),
});
export type AppDescriptionInput = z.infer<typeof AppDescriptionInputSchema>;
