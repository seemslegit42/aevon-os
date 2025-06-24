
"use client";

import React from 'react';
import CyberHealthGauge from './cyber-health-gauge';

const AegisSecurityComponent: React.FC = () => {
  return (
    <div className="h-full w-full flex items-center justify-center p-4 bg-transparent">
      <CyberHealthGauge />
    </div>
  );
};

export default AegisSecurityComponent;
