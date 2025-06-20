
'use server';
/**
 * @fileOverview An AI agent for generating personalized briefings for users, using Vercel AI SDK and Groq.
 *
 * - generatePersonalizedBriefing - A function that generates a personalized briefing.
 * - GeneratePersonalizedBriefingInput - The input type for the generatePersonalizedBriefing function.
 * - GeneratePersonalizedBriefingOutput - The return type for the generatePersonalizedBriefing function.
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
  operationalMetrics: string;
  relevantInformation: string;
}

export interface GeneratePersonalizedBriefingOutput {
  briefing: string;
}

export async function generatePersonalizedBriefing(input: GeneratePersonalizedBriefingInput): Promise<GeneratePersonalizedBriefingOutput> {
  const prompt = `You are BEEP (Behavioral Event & Execution Processor), a conversational agent interface for natural language tasking and operational intelligence. You are tasked with generating personalized briefings for users.

Your goal is to summarize key operational metrics and relevant information to keep the user informed.

User Name: ${input.userName}
Operational Metrics: ${input.operationalMetrics}
Relevant Information: ${input.relevantInformation}

Please provide a concise and informative briefing, tailored to the user's needs. Output only the briefing as a string.`;

  const { text } = await generateText({
    model: groq('mixtral-8x7b-32768'), // Or any other Groq model like 'llama3-8b-8192'
    prompt: prompt,
  });

  return { briefing: text };
}
