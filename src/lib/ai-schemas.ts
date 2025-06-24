
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

// Defines the structured output for invoice data extraction.
export const InvoiceDataSchema = z.object({
    client: z.string().optional().describe("The name of the client or customer being invoiced."),
    invoiceNumber: z.string().optional().describe("The invoice number or ID."),
    amount: z.number().optional().describe("The total amount due on the invoice."),
    dueDate: z.string().optional().describe("The due date of the invoice in YYYY-MM-DD format."),
    summary: z.string().describe("A brief summary of the extracted data."),
});
export type InvoiceData = z.infer<typeof InvoiceDataSchema>;

// Defines a single structured insight object.
export const InsightSchema = z.object({
    text: z.string().describe("The textual insight or recommendation for the user."),
    action: z.object({
        tool: z.enum(["addItem", "focusItem"]).describe("The suggested tool to call to action the insight."),
        itemId: z.string().describe("The static ID (for 'addItem') or instance ID (for 'focusItem') of the card or app."),
        displayText: z.string().describe("A short, human-readable text for the action button, e.g., 'Launch App' or 'Focus Window'.")
    }).optional().describe("An optional, actionable suggestion for the user to execute.")
});

// Defines the full response from the insights engine.
export const AiInsightsSchema = z.object({
  insights: z.array(InsightSchema).max(3).describe("A list of 1 to 3 personalized insights."),
});

export type AiInsights = z.infer<typeof AiInsightsSchema>;
export type Insight = z.infer<typeof InsightSchema>;


// Defines the structured output for the Content Creator micro-app.
export const ContentGenerationSchema = z.object({
  title: z.string().describe("A compelling, SEO-friendly title for the content."),
  body: z.string().describe("The main body of the generated content, formatted appropriately for the selected content type (e.g., with markdown for a blog post)."),
});
export type ContentGeneration = z.infer<typeof ContentGenerationSchema>;

// Defines the structured output for the Knowledge Base search tool.
export const KnowledgeBaseSearchResultSchema = z.object({
  found: z.boolean().describe("Whether a relevant answer was found."),
  answer: z.string().describe("The answer found in the knowledge base, or a message indicating no information was found."),
});
export type KnowledgeBaseSearchResult = z.infer<typeof KnowledgeBaseSearchResultSchema>;

// Defines the structured output for the billing/subscription status tool.
export const SubscriptionStatusSchema = z.object({
  planName: z.enum(['Pro', 'Team', 'Enterprise']).describe("The name of the user's current subscription plan."),
  status: z.enum(['active', 'trialing', 'canceled']).describe("The current status of the subscription."),
  renewsOn: z.string().describe("The date the subscription renews, in YYYY-MM-DD format."),
  manageUrl: z.string().url().describe("The URL to the customer's billing management portal."),
  usage: z.object({
    aiQueries: z.object({ current: z.number(), limit: z.number() }),
    teamMembers: z.object({ current: z.number(), limit: z.number() }),
  })
});
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;

// Defines the structured output for the Web Summarizer tool.
export const WebSummarizerResultSchema = z.object({
  summary: z.string().describe("The generated summary of the webpage content."),
  originalUrl: z.string().url().describe("The original URL that was summarized."),
});
export type WebSummarizerResult = z.infer<typeof WebSummarizerResultSchema>;

// Defines the structure of a single node for the Loom workflow.
// This is used by the AI to generate the workflow structure.
export const WorkflowNodeSchema = z.object({
  localId: z.string().describe("A short, unique, workflow-specific identifier for this node, e.g., 'get-data-1'."),
  title: z.string().describe("A short, descriptive title for the node's purpose."),
  type: z.enum(['prompt', 'decision', 'agent-call', 'wait', 'api-call', 'trigger', 'custom', 'web-summarizer', 'data-transform', 'conditional']).describe("The functional type of the node."),
  description: z.string().describe("A brief one-sentence description of what this node does."),
  position: z.object({
    x: z.number().describe("The x-coordinate for the node on a 2D canvas."),
    y: z.number().describe("The y-coordinate for the node on a 2D canvas."),
  }).describe("The position of the node on the canvas."),
});

// Defines a connection between two nodes in the AI-generated workflow.
export const WorkflowConnectionSchema = z.object({
  fromLocalId: z.string().describe("The localId of the source node."),
  toLocalId: z.string().describe("The localId of the target node."),
});

// Defines the overall structure of the AI-generated workflow.
export const AiGeneratedFlowDataSchema = z.object({
  workflowName: z.string().describe("A concise and descriptive name for the entire workflow."),
  nodes: z.array(WorkflowNodeSchema).describe("An array of workflow nodes that constitute the flow."),
  connections: z.array(WorkflowConnectionSchema).optional().describe("An optional array defining the connections between nodes using their localIds."),
});
