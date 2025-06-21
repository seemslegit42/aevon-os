
import type { ElementType } from 'react';

export interface NodeState {
  id: string;
  label: string;
  icon: ElementType;
  status: 'idle' | 'running' | 'completed' | 'failed';
  isCondition?: boolean;
  output?: any | null;
  error?: string | null;
}
