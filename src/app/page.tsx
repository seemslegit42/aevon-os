
"use client";
import React from 'react';
import Dashboard from './dashboard';

export default function HomePage() {
  return (
    // The main dashboard component is now the entry point of the app.
    // The TopBar is rendered within the main layout to correctly
    // position it above the dashboard canvas.
    <Dashboard />
  );
}
