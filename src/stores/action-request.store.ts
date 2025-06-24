
"use client";

import { create } from 'zustand';
import type { ActionRequest } from '@/types/loom';

interface ActionRequestState {
  requests: ActionRequest[];
  addActionRequest: (request: Omit<ActionRequest, 'id' | 'timestamp' | 'status'>) => ActionRequest;
  resolveActionRequest: (requestId: string, status: ActionRequest['status'], responseDetails?: string) => void;
}

export const useActionRequestStore = create<ActionRequestState>((set, get) => ({
  requests: [],

  addActionRequest: (request) => {
    const newRequest: ActionRequest = {
      ...request,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      status: 'pending',
    };
    set(state => ({ requests: [newRequest, ...state.requests] }));
    return newRequest;
  },

  // In this model, "resolving" simply removes it from the pending UI.
  // The actual response logic is handled by the component that calls this.
  resolveActionRequest: (requestId, status, responseDetails) => {
    set(state => ({
      requests: state.requests.filter(req => req.id !== requestId),
    }));
  },
}));
