
// This file defines the structure and seed data for avatar visual presets.

export interface AvatarPreset {
  id: 'sentientCore' | 'digitalWabiSabi' | 'ancientGlass';
  name: string;
  description: string;

  // Shader uniforms - colors are in [r, g, b] format (0.0 to 1.0)
  colors: {
    idle: [number, number, number];
    listening: [number, number, number];
    speaking: [number, number, number];
    thinking: [number, number, number];
    tool_call: [number, number, number];
    security_alert: [number, number, number];
  };

  // Physics & Particle parameters
  particleSize: number;
  motionSpeed: number;
  noiseStrength: number;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'sentientCore',
    name: 'Sentient Core',
    description: 'The default, futuristic ΛΞVON OS core. Dynamic, vibrant, and intelligent.',
    colors: {
      idle: [0.5, 0.5, 1.0], // Base for aurora palette
      listening: [0.243, 0.725, 0.569], // Patina Green
      speaking: [0.125, 0.698, 0.667], // Roman Aqua
      thinking: [0.416, 0.051, 0.804], // Imperial Purple
      tool_call: [1.0, 0.84, 0.0], // Gold/Yellow
      security_alert: [0.8, 0.1, 0.1], // Red
    },
    particleSize: 3.5,
    motionSpeed: 1.0,
    noiseStrength: 0.15,
  },
  {
    id: 'digitalWabiSabi',
    name: 'Digital Wabi-Sabi',
    description: 'An organic, imperfect, and calming presence. Embraces natural simplicity.',
    colors: {
      idle: [0.8, 0.7, 0.6], // Warm, earthy base
      listening: [0.4, 0.5, 0.3], // Moss Green
      speaking: [0.3, 0.4, 0.5], // Slate Blue
      thinking: [0.5, 0.45, 0.4], // Muted Clay
      tool_call: [1.0, 1.0, 1.0], // Soft White Flash
      security_alert: [0.9, 0.5, 0.2], // Burnt Orange
    },
    particleSize: 4.0,
    motionSpeed: 0.3,
    noiseStrength: 0.25, // More pronounced, slower noise
  },
  {
    id: 'ancientGlass',
    name: 'Ancient Glass',
    description: 'Crystalline, sharp, and refractive. Light caught in a timeless medium.',
    colors: {
      idle: [0.4, 0.8, 0.8], // Base Teal
      listening: [0.8, 1.0, 0.9], // Bright Mint
      speaking: [0.6, 0.9, 1.0], // Light Cyan
      thinking: [0.3, 0.5, 0.6], // Deep Sea Green
      tool_call: [0.9, 0.9, 1.0], // Bright White/Blue flash
      security_alert: [1.0, 0.7, 0.7], // Rose Quartz Red
    },
    particleSize: 2.5,
    motionSpeed: 0.5,
    noiseStrength: 0.08, // Less noise, more crystalline
  },
];
