
'use server';
/**
 * @fileOverview Analyzes security alerts using an AI model.
 *
 * - analyzeSecurityAlerts - A server action that takes security alert details to generate a summary.
 * - AnalyzeSecurityAlertsInput - The input type for the security alert analysis.
 * - AnalyzeSecurityAlertsOutput - The return type for the security alert analysis.
 */

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Ensure you have GROQ_API_KEY in your .env file
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export interface AnalyzeSecurityAlertsInput {
  alertDetails: string; // e.g., logs, error messages, SIEM output
}

export interface AnalyzeSecurityAlertsOutput {
  summary: string;
  potentialThreats?: string[];
  recommendedActions?: string[];
}

export async function analyzeSecurityAlerts(
  input: AnalyzeSecurityAlertsInput
): Promise<AnalyzeSecurityAlertsOutput> {
  'use server';

  const fullPrompt = `
Alert Details:
${input.alertDetails}

Based on the security alert details provided above, please:
1. Provide a concise summary of the event in plain English.
2. Identify potential threats or vulnerabilities indicated by the alert.
3. Suggest recommended actions to mitigate or investigate further.

Keep the response structured and actionable.
If the alert details are insufficient for a full analysis, state that clearly.
`;

  const { text } = await generateText({
    model: groq('llama3-8b-8192'), 
    system:
      "You are Aegis, an AI Security Sentinel. Your role is to analyze security alerts and provide clear, concise, and actionable insights. " +
      "Focus on accuracy and practical advice. Avoid jargon where possible or explain it if necessary.",
    prompt: fullPrompt,
    temperature: 0.5, // Lower temperature for more factual, less creative output
    maxTokens: 500,
  });

  // Basic parsing, a more robust solution might involve structured output from the LLM
  // For now, we assume the LLM will provide a text blob we can use as the summary.
  // A more advanced implementation could ask the LLM to return JSON.
  return { 
    summary: text || "Analysis could not be completed or no summary was generated.",
    // For now, potentialThreats and recommendedActions are part of the text summary.
    // Future improvement: Ask the LLM for structured JSON output.
  };
}
