
import type { ElementType } from 'react';

// Placeholder type definition for a node in the Loom workflow.
// You can expand this to match your Loom Studio's data model.
export interface NodeState {
  id: string;
  label: string;
  icon: ElementType;
  status: 'idle' | 'running' | 'completed' | 'failed';
  isCondition?: boolean;
  output?: any | null;
  error?: string | null;
}
