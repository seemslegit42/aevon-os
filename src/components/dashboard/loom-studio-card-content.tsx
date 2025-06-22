
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoomOrchestrationIcon, ChevronDownIcon } from '@/components/icons';

/**
 * @deprecated This component is deprecated. Loom Studio has been promoted to a standalone page.
 * This component now serves as a placeholder and informational link.
 * See /src/app/loom-studio/page.tsx for the new implementation.
 */
const LoomStudioCardContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <LoomOrchestrationIcon className="w-12 h-12 text-primary mb-4" />
      <h3 className="font-semibold text-lg text-foreground">Loom Studio</h3>
      <p className="text-sm text-muted-foreground my-2">
        This application has been upgraded to a standalone page for enhanced functionality.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link href="/loom-studio">
          Go to Loom Studio <ChevronDownIcon className="ml-2 h-4 w-4 -rotate-90" />
        </Link>
      </Button>
    </div>
  );
};

export default LoomStudioCardContent;
