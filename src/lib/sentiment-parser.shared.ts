
import type { AvatarState } from '@/types/dashboard';

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
