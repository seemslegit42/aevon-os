"use client";

import ArmoryComponent from '@/micro-apps/armory/component';

// This page acts as the route entry point for the self-contained Armory micro-app.
// It cleanly separates the routing concern from the application logic.
export default function ArmoryPage() {
  return <ArmoryComponent />;
}
