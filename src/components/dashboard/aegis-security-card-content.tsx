
"use client";
import React from 'react';
import CyberHealthGauge from '@/components/dashboard/aegis/cyber-health-gauge';
import PhishingResiliencePanel from '@/components/dashboard/aegis/phishing-resilience-panel';
import CloudSecurityPanel from '@/components/dashboard/aegis/cloud-security-panel';
import EDRSummaryPanel from '@/components/dashboard/aegis/edr-summary-panel';

const AegisSecurityCardContent: React.FC = () => {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-shrink-0 flex justify-center">
        <CyberHealthGauge />
      </div>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-0">
        <PhishingResiliencePanel />
        <CloudSecurityPanel />
        <EDRSummaryPanel />
      </div>
    </div>
  );
};

export default AegisSecurityCardContent;
