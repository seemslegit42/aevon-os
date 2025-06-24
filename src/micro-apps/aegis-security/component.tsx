"use client";

import React, { useEffect } from 'react';
import CyberHealthGauge from './cyber-health-gauge';
import { useAegisStore } from './store';

const AegisSecurityComponent: React.FC = () => {
  const simulateUpdate = useAegisStore((state) => state.actions.simulateUpdate);

  // This component now acts as the "controller" for the micro-app's data simulation.
  // It triggers updates to the central Zustand store at a regular interval.
  useEffect(() => {
    // Initial update to have some variance on load
    simulateUpdate();
    
    // Set up a regular interval to simulate incoming data
    const intervalId = setInterval(() => {
      simulateUpdate();
    }, 5000); // Update every 5 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [simulateUpdate]);

  return (
    <div className="h-full w-full flex items-center justify-center p-4 bg-transparent">
      <CyberHealthGauge />
    </div>
  );
};

export default AegisSecurityComponent;
