
'use client';

import type { AvatarState } from '@/types/dashboard';
import { generateObject } from 'ai';
import { google } from '@/lib/ai/groq';
import { z } from 'zod';

const EmotionSchema = z.object({
    emotion: z.enum(['speaking_neutral', 'speaking_helpful', 'speaking_insightful', 'speaking_cautious'])
        .describe("The dominant emotional tone of the text."),
});

/**
 * Uses an AI model to determine the appropriate emotional state for the avatar based on response text.
 * @param text The text to analyze.
 * @returns An AvatarState corresponding to the detected emotion.
 */
export async function getEmotionFromText(text: string): Promise<AvatarState> {
    // Prevent empty or very short strings from being sent to the model
    if (!text || text.trim().length < 10) {
        return 'speaking_neutral';
    }

    try {
        const { object } = await generateObject({
            model: google('gemini-1.5-flash-latest'),
            schema: EmotionSchema,
            prompt: `Analyze the following text and classify its dominant emotion or intent from the given options (helpful, insightful, cautious, or neutral). The text is from an AI assistant.
            - 'helpful' is for direct answers, confirmations, or offering assistance.
            - 'insightful' is for pointing out patterns, making suggestions, or providing deeper analysis.
            - 'cautious' is for warnings, disclaimers, or expressing uncertainty.
            - 'neutral' is the default for general conversation.
            
            Text: "${text}"`
        });
        return object.emotion;
    } catch (e) {
        console.error("Emotion analysis failed, defaulting to neutral.", e);
        // Fallback to keyword matching if the AI call fails
        return getEmotionFromTextByKeywords(text);
    }
}


const keywordMap: { keywords: string[]; state: AvatarState }[] = [
  {
    keywords: ['insight', 'interestingly', 'i have noticed', 'perhaps', 'consider', 'a pattern'],
    state: 'speaking_insightful',
  },
  {
    keywords: ['i can help', 'here is', 'of course', 'certainly', 'to do this', 'the result is'],
    state: 'speaking_helpful',
  },
  {
    keywords: ['warning', 'be careful', 'please note', 'however', 'be aware', 'cautious'],
    state: 'speaking_cautious',
  },
];

/**
 * (Fallback) Parses text using simple keywords to determine an appropriate emotional state for the avatar.
 * @param text The text to analyze.
 * @returns An AvatarState corresponding to the detected emotion.
 */
export function getEmotionFromTextByKeywords(text: string): AvatarState {
  const lowerText = text.toLowerCase();

  for (const entry of keywordMap) {
    if (entry.keywords.some((keyword) => lowerText.includes(keyword))) {
      return entry.state;
    }
  }

  // Default state if no specific keywords are found
  return 'speaking_neutral';
}
