
"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldCheckIcon as AegisIcon } from '@/components/icons';
import CyberHealthGauge from '@/components/dashboard/aegis/cyber-health-gauge';
import PhishingResiliencePanel from '@/components/dashboard/aegis/phishing-resilience-panel';
import CloudSecurityPanel from '@/components/dashboard/aegis/cloud-security-panel';
import EDRSummaryPanel from '@/components/dashboard/aegis/edr-summary-panel';

export default function AegisSecurityPage() {
  return (
    <div className="flex flex-col h-full p-4 md:p-6 space-y-6">
      <div className="flex-shrink-0 flex flex-col items-center text-center">
        <AegisIcon className="w-12 h-12 mb-2 text-primary" />
        <h1 className="text-4xl font-bold font-headline text-primary-foreground">
          Aegis Command Center
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          Your simple, real-time security overview.
        </p>
      </div>
      
      <div className="flex-shrink-0 flex justify-center">
        <CyberHealthGauge />
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PhishingResiliencePanel />
        <CloudSecurityPanel />
        <EDRSummaryPanel />
      </div>

      <div className="text-center mt-auto pt-4">
        <Button size="lg" asChild className="btn-gradient-primary-accent">
          <Link href="/">Return to Main Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
