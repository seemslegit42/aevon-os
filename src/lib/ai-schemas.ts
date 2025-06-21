
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

// Defines the output for the text categorization feature in Loom Studio.
export const TextCategorySchema = z.object({
    isMatch: z.boolean().describe("Set to true if the text matches the category, otherwise false."),
    category: z.string().describe("The determined category of the text. e.g., 'Invoice', 'General Inquiry', 'Spam'."),
});
export type TextCategory = z.infer<typeof TextCategorySchema>;

// Defines the structured output for invoice data extraction in Loom Studio.
export const InvoiceDataSchema = z.object({
    invoiceNumber: z.string().optional().describe("The invoice number or ID."),
    amount: z.number().optional().describe("The total amount due on the invoice."),
    dueDate: z.string().optional().describe("The due date of the invoice in YYYY-MM-DD format."),
    summary: z.string().describe("A brief summary of the extracted data."),
});
export type InvoiceData = z.infer<typeof InvoiceDataSchema>;

// Defines the structured output for the AI Insights engine.
export const AiInsightsSchema = z.object({
  insights: z.array(z.string().describe("A short, actionable insight or recommendation based on the user's current workspace layout. Maximum of 3 insights.")).max(3),
});
export type AiInsights = z.infer<typeof AiInsightsSchema>;
