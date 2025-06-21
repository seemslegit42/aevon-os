'use server';
/**
 * @fileOverview Defines a function for analyzing security alerts.
 * This is a mock implementation to remove the Genkit dependency.
 *
 * - analyzeSecurityAlert - A mock function that simulates the analysis.
 */

import type { SecurityAlertInput, SecurityAlertOutput } from '@/ai/schemas';

/**
 * Mock implementation to remove Genkit dependency and fix build.
 * Returns a mock response to allow the UI to function without a real AI backend.
 */
export async function analyzeSecurityAlert(input: SecurityAlertInput): Promise<SecurityAlertOutput> {
  console.log("Mock analyzeSecurityAlert called with input:", input);
  return new Promise(resolve => setTimeout(() => {
    resolve({
        summary: "This is a mock analysis. The AI backend has been disconnected to resolve a build issue.",
        potentialThreats: ["Mock Threat: Unauthorized access attempt", "Mock Threat: Data exfiltration"],
        recommendedActions: ["Mock Action: Isolate the affected system", "Mock Action: Review firewall rules"],
    });
  }, 1000));
}
