
"use client";

import { useState, useEffect, useCallback } from 'react';

/**
 * A simple hook to play audio elements.
 * It manages a single Audio object to prevent multiple sounds from overlapping.
 * @param {string} src - The path to the sound file.
 */
export const useSound = (src: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // This effect runs only on the client
    const audioInstance = new Audio(src);
    setAudio(audioInstance);
  }, [src]);

  const play = useCallback(() => {
    if (audio) {
      // Rewind to the start and play
      audio.currentTime = 0;
      audio.play().catch(error => {
        // Autoplay can be blocked by the browser, log error if it fails
        console.error("Audio playback failed:", error);
      });
    }
  }, [audio]);

  return play;
};
