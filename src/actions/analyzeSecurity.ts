
'use server';

import { generateObject } from 'ai';
import { google } from '@/lib/ai/groq';
import { AegisSecurityAnalysisSchema, type AegisSecurityAnalysis } from '@/lib/ai-schemas';

/**
 * A server action to perform security analysis using a dedicated AI model.
 * This provides a structured, reliable way to get analysis data without
 * going through the conversational agent, ensuring consistent output format.
 * @param alertDetails - The stringified JSON of the security alert.
 * @returns A promise that resolves to the structured security analysis.
 */
export async function analyzeSecurityAlert(alertDetails: string): Promise<AegisSecurityAnalysis> {
  try {
    const { object: analysis } = await generateObject({
        model: google('gemini-1.5-flash-latest'),
        schema: AegisSecurityAnalysisSchema,
        prompt: `You are a senior security analyst for the Aegis defense system. Your role is to analyze security alerts, determine their severity, identify the threats, and recommend clear, actionable steps for mitigation.

Analyze the following security alert data:
---
${alertDetails}
---

Based on your analysis, provide a structured response with a summary, severity, identified threats, and suggested actions.`
    });

    return analysis;
  } catch (error) {
      console.error("Error in analyzeSecurityAlert server action:", error);
      throw new Error("The AI model failed to produce a valid analysis.");
  }
}
