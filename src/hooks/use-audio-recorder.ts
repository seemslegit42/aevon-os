
import { useState, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UseAudioRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  inputNode: GainNode | null;
}

export function useAudioRecorder({ onTranscriptionComplete, inputNode }: UseAudioRecorderProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const handleTranscription = useCallback(async (audioBlob: Blob) => {
    setIsTranscribing(true);
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');

    try {
      const response = await fetch('/api/ai/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Transcription failed");
      }

      const { text } = await response.json();
      if (text) {
        onTranscriptionComplete(text);
      } else {
        toast({ variant: "destructive", title: "Transcription Failed", description: "Could not understand audio. Please try again." });
      }
    } catch (error) {
      console.error("Transcription error:", error);
      let errorMessage = "Failed to transcribe audio.";
      if (error instanceof Error) errorMessage = error.message;
      toast({ variant: "destructive", title: "Transcription Error", description: errorMessage });
    } finally {
      setIsTranscribing(false);
    }
  }, [onTranscriptionComplete, toast]);

  const startRecording = useCallback(async () => {
    if (!inputNode) {
      toast({ variant: "destructive", title: "Audio Error", description: "Audio context not ready." });
      return;
    }
    audioContextRef.current = inputNode.context as AudioContext;
    await audioContextRef.current.resume();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(inputNode);
      micSourceNodeRef.current = source;

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        micSourceNodeRef.current?.disconnect();
        micSourceNodeRef.current = null;
        handleTranscription(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({ variant: "destructive", title: "Microphone Error", description: "Could not access microphone." });
    }
  }, [inputNode, toast, handleTranscription]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
  };
}
