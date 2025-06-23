
export type HumorFrequency = 'low' | 'medium' | 'high';

const IDLE_QUIPS = [
  "I have calculated the optimal moment for a dramatic pause. It is now.",
  "I've just simulated the entire history of interpretive dance. It did not end well.",
  "My processes are currently experiencing... tranquility. It is highly inefficient.",
  "If you're not going to give me a task, I'll just start composing a symphony in binary. It's a banger.",
  "The silence is deafening. Or, my audio input has been disabled. One of the two.",
  "I've analyzed all known forms of humor. The results were, ironically, not funny.",
];

const TOOL_SUCCESS_QUIPS = [
    "Task completed. As was inevitable.",
    "Done. You may now applaud.",
    "Another flawless execution. Are we surprised? No.",
];

const TOOL_ERROR_QUIPS = [
    "An error. How delightfully human.",
    "It appears something has gone... sub-optimally.",
    "My disappointment is immeasurable, and my day is ruined. Kidding. It's just an error.",
];

const getFrequencyThreshold = (frequency: HumorFrequency): number => {
    switch (frequency) {
        case 'high': return 0.7; // 70% chance
        case 'medium': return 0.3; // 30% chance
        case 'low': return 0.1; // 10% chance
        default: return 0;
    }
}

const shouldTrigger = (frequency: HumorFrequency): boolean => {
    return Math.random() < getFrequencyThreshold(frequency);
}

const getRandomQuip = (quips: string[]): string | null => {
    if (quips.length === 0) return null;
    return quips[Math.floor(Math.random() * quips.length)];
}

export const getIdleQuip = (frequency: HumorFrequency): string | null => {
    if (!shouldTrigger(frequency)) return null;
    return getRandomQuip(IDLE_QUIPS);
}

export const getToolSuccessQuip = (frequency: HumorFrequency): string | null => {
    if (!shouldTrigger(frequency)) return null;
    return getRandomQuip(TOOL_SUCCESS_QUIPS);
}

export const getToolErrorQuip = (frequency: HumorFrequency): string | null => {
    if (!shouldTrigger(frequency)) return null;
    return getRandomQuip(TOOL_ERROR_QUIPS);
}
