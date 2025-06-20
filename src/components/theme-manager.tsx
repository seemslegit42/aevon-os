// This component is no longer used as the application is dark mode only.
// It now acts as a simple pass-through for children.
import React from 'react';

export default function ThemeManager({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
