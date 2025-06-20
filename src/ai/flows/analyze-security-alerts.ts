
'use server';
/**
 * @fileOverview A security alert analysis AI agent using Vercel AI SDK and Groq.
 *
 * - analyzeSecurityAlerts - A function that handles the security alerts analysis process.
 * - AnalyzeSecurityAlertsInput - The input type for the analyzeSecurityAlerts function.
 * - AnalyzeSecurityAlertsOutput - The return type for the analyzeSecurityAlerts function.
 */

import { günstigerLLM, createOpenAI } from 'ai';
import { generateText } from 'ai';

// Ensure you have GROQ_API_KEY in your .env file
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export interface AnalyzeSecurityAlertsInput {
  alertDetails: string;
}

export interface AnalyzeSecurityAlertsOutput {
  summary: string;
}

export async function analyzeSecurityAlerts(input: AnalyzeSecurityAlertsInput): Promise<AnalyzeSecurityAlertsOutput> {
  const prompt = `You are an AI-powered security expert specializing in analyzing security alerts.

You will receive detailed information about security alerts and your task is to provide a plain English summary that is easy to understand for non-technical users.

The summary should include potential threats, recommended responses, and any other relevant information that can help the user quickly understand and respond to the alerts.

Alert Details: ${input.alertDetails}

Provide only the summary as a string.`;

  const { text } = await generateText({
    model: groq('mixtral-8x7b-32768'), // Or any other Groq model
    prompt: prompt,
  });

  return { summary: text };
}
