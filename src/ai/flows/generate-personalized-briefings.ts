
'use server';
/**
 * @fileOverview Generates personalized briefings using an AI model.
 *
 * - generatePersonalizedBriefing - A server action that takes user and operational data to generate a briefing.
 * - GeneratePersonalizedBriefingInput - The input type for the briefing generation.
 * - GeneratePersonalizedBriefingOutput - The return type for the briefing generation.
 */

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Ensure you have GROQ_API_KEY in your .env file
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export interface GeneratePersonalizedBriefingInput {
  userName: string;
  operationalMetrics: string; // e.g., "CPU: 75%, Memory: 60%, Active Agents: 5"
  relevantInformation: string; // e.g., "User is asking about sales projections for Q3"
}

export interface GeneratePersonalizedBriefingOutput {
  briefing: string;
}

export async function generatePersonalizedBriefing(
  input: GeneratePersonalizedBriefingInput
): Promise<GeneratePersonalizedBriefingOutput> {
  'use server';

  const fullPrompt = `
User Name: ${input.userName}
Operational Metrics: ${input.operationalMetrics}
Relevant Information/User Query: ${input.relevantInformation}

Based on the above, provide a personalized briefing.
If the user query is a question, answer it.
If the user query is a command, acknowledge it and explain what action would be taken (hypothetically, as you cannot execute real actions).
If it's general, offer a concise summary or insight.
Keep the response helpful and to the point.
`;

  const { text } = await generateText({
    model: groq('llama3-8b-8192'), // Or other Llama3 models on Groq
    system:
      "You are BEEP (Behavioral Event & Execution Processor), an advanced AI assistant integrated into ΛΞVON OS. " +
      "Your role is to provide concise, actionable, and context-aware responses to the user. " +
      "You have access to operational metrics and user queries. " +
      "When responding, be professional, slightly anticipatory if appropriate, and embody a highly capable AI. " +
      "Avoid conversational fluff. Focus on delivering information or confirming actions clearly. " +
      "If asked to perform an action you cannot do, explain this politely and suggest what you *can* do or what the user might do.",
    prompt: fullPrompt,
    temperature: 0.7,
    maxTokens: 300,
  });

  return { briefing: text };
}
