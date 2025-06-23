
/**
 * @fileOverview Defines the data structures for the avatar telemetry system.
 */

/**
 * Represents a single logged event related to the BEEP avatar's state or actions.
 */
export interface AvatarEvent {
  /** A unique identifier for this specific event log. */
  id: string;
  
  /** An ISO 8601 formatted timestamp of when the event occurred. */
  timestamp: string;

  /** The high-level category of the event being logged. */
  eventType: 'avatarStateChange' | 'toolExecution' | 'ttsEmotionSet';

  /** 
   * A string signature representing the specific emotional or functional state.
   * e.g., 'thinking', 'security_alert', 'tool:success', 'tool:error'.
   */
  emotionSignature: string;

  /** An optional object for additional, unstructured context about the event. */
  metadata?: {
    toolName?: string;
    messageId?: string;
    toolCallId?: string;
    details?: string;
    [key: string]: any;
  };
}
