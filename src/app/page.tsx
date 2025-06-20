
"use client";
import React from 'react';
import Dashboard from './dashboard';

export default function HomePage() {
  return (
    // The main dashboard component is now the entry point of the app.
    // The TopBar is rendered within the Dashboard component itself
    // to allow for interaction (like opening the command palette).
    <Dashboard />
  );
}
