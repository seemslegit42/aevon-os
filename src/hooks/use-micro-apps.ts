
"use client";

import { useMicroAppStore, type MicroApp } from '@/stores/micro-app.store';
import { shallow } from 'zustand/shallow';

// Mock user object - in a real app, this would come from an auth context
const currentUser = {
  name: 'Admin User',
  permissions: ['sales:view', 'analytics:read', 'email:process', 'invoice:extract'], // Has all permissions
};

interface UseMicroAppsOptions {
  tags?: string[];
}

/**
 * Custom hook to get a list of micro-apps, filtered by permissions and optional tags.
 * @param {UseMicroAppsOptions} options - Filtering options for the apps.
 * @returns {MicroApp[]} A memoized array of available micro-apps.
 */
export function useMicroApps(options: UseMicroAppsOptions = {}): MicroApp[] {
  const { tags } = options;
  
  // In a real app, you'd get the current user's permissions from an auth hook/context
  const userPermissions = currentUser.permissions;

  const availableApps = useMicroAppStore(state => {
    // 1. Filter by user permissions
    const permittedApps = state.apps.filter(app => {
      if (!app.permissions || app.permissions.length === 0) {
        return true; // No permissions required
      }
      return app.permissions.every(p => userPermissions.includes(p));
    });

    // 2. Filter by tags if provided
    if (!tags || tags.length === 0) {
      return permittedApps; // No tag filter, return all permitted
    }

    return permittedApps.filter(app =>
      tags.some(tag => app.tags?.includes(tag))
    );
  }, shallow); // Use shallow comparison for performance

  return availableApps;
}
