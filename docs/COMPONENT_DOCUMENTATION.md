# Component Documentation

This document provides an overview and usage guidelines for reusable UI components within the ΛΞVON OS. Components are primarily located in `src/components/` and `src/micro-apps/`.

## General Principles

- Components are built with React and TypeScript.
- Styling is primarily handled by Tailwind CSS, often with utility components from a library like Shadcn/UI.
- Props are typed using TypeScript interfaces or types.
- Efforts are made to ensure components are accessible and adhere to the "Ancient Roman Glass" aesthetic described in `docs/blueprint.md`.

## UI Components (`src/components/ui/`)

These are general-purpose UI elements, often wrappers around or extensions of a base UI library (likely Shadcn/UI).

---

### 1. Button

- **File:** `src/components/ui/button.tsx`
- **Description:** A standard button component with various styling options. It uses `cva` (class variance authority) for variants and sizes, a common pattern in Shadcn/UI.
- **Props (`ButtonProps`):**
    - `variant`: `'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'` (Optional) - Determines the button's visual style. Defaults to `'default'`.
    - `size`: `'default' | 'sm' | 'lg' | 'icon'` (Optional) - Determines the button's size. Defaults to `'default'`.
    - `asChild`: `boolean` (Optional) - If `true`, the component renders its child and passes props to it, rather than rendering a `button` element. Useful for integrating with other components like links. Defaults to `false`.
    - Inherits all standard `React.ButtonHTMLAttributes<HTMLButtonElement>`.
- **Usage Example:**
  ```tsx
  import { Button } from '@/components/ui/button';
  import { Mail } from 'lucide-react'; // Example icon

  const MyActions = () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button onClick={() => alert('Primary action!')}>Submit</Button>
      <Button variant="secondary" onClick={() => alert('Secondary action!')}>
        Cancel
      </Button>
      <Button variant="destructive" size="sm">
        Delete Item
      </Button>
      <Button variant="outline" size="lg">
        Learn More
      </Button>
      <Button variant="ghost">Ghost Button</Button>
      <Button variant="link" asChild>
        <a href="/docs">Documentation Link</a>
      </Button>
      <Button variant="default" size="icon" aria-label="Send Email">
        <Mail />
      </Button>
    </div>
  );
  ```
- **Notes:**
    - The component leverages `@radix-ui/react-slot` for the `asChild` prop functionality.
    - Styling is managed by `class-variance-authority` and `tailwind-merge` (via `cn` from `@/lib/utils`).

---

## BEEP Components (`src/components/beep/`)

Components specifically designed for the BEEP conversational interface.

---

### 1. BeepAvatar3D

- **File:** `src/components/beep/beep-avatar-3d.tsx`
- **Description:** Renders a dynamic 3D particle sphere representing BEEP's avatar. It uses Three.js for 3D rendering, custom GLSL shaders for visual effects, and reacts to audio input/output and BEEP's state. The appearance is also influenced by presets from `AvatarPresetStore`.
- **Props (`BeepAvatar3DProps`):**
    - `inputNode`: `AudioNode | null` - The audio node for BEEP's input (e.g., microphone). Used for visual feedback.
    - `outputNode`: `AudioNode | null` - The audio node for BEEP's output (e.g., speech synthesis). Used for visual feedback.
    - `avatarState`: `AvatarState` - The current state of the BEEP avatar, influencing its appearance and animation.
    - `isWhisperModeEnabled`: `boolean` - If true, applies a "whisper" visual effect (e.g., reduced bloom).
- **`AvatarState` Type (from `src/types/dashboard.ts` - assumed):**
  ```typescript
  export type AvatarState =
    | 'idle'
    | 'listening'
    | 'speaking_neutral'
    | 'thinking'
    | 'tool_call'
    | 'security_alert'
    | 'speaking_helpful'
    | 'speaking_insightful'
    | 'speaking_cautious';
  ```
- **Usage Example:**
  ```tsx
  import BeepAvatar3D from '@/components/beep/beep-avatar-3d';
  import { useBeepContext } from '@/hooks/use-beep-chat'; // Hypothetical context
  import { useState, useEffect } from 'react';
  import type { AvatarState } from '@/types/dashboard'; // Assuming path

  const BeepInterfacePanel = () => {
    // Assuming these are obtained from an audio context or BEEP service
    const [inputAudioNode, setInputAudioNode] = useState<AudioNode | null>(null);
    const [outputAudioNode, setOutputAudioNode] = useState<AudioNode | null>(null);
    const { currentAvatarState, isWhisperActive } = useBeepContext(); // Hypothetical

    // Effect to get AudioNodes (example placeholder)
    useEffect(() => {
      // ... logic to initialize and get audio nodes ...
      // setInputAudioNode(someInputNode);
      // setOutputAudioNode(someOutputNode);
    }, []);

    if (!inputAudioNode || !outputAudioNode) {
      return <div>Loading Audio Resources...</div>;
    }

    return (
      <div style={{ width: '300px', height: '300px' }}>
        <BeepAvatar3D
          inputNode={inputAudioNode}
          outputNode={outputAudioNode}
          avatarState={currentAvatarState}
          isWhisperModeEnabled={isWhisperActive}
        />
      </div>
    );
  };
  ```
- **Notes:**
    - Depends on `THREE` (Three.js), and various Three.js addons for post-processing (`EffectComposer`, `RenderPass`, `UnrealBloomPass`).
    - Uses `@/lib/analyser` for processing audio data.
    - Vertex and fragment shaders are imported from `@/lib/shaders/beep-3d-sphere-vertex.glsl.ts`.
    - Interacts with `useAvatarPresetStore` from `@/stores/avatar-preset.store` to get visual presets (particle size, motion speed, colors for different states).
    - The component renders into a `div` with the class `bg-avatar-nebula`.
    - The 3D scene includes an IcosahedronGeometry for the particle points and a RingGeometry for a glass-like ring.

---

*(Further components from `src/components/` and `src/micro-apps/` will be documented here, following a similar structure.)*
