// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"

/**
 * @deprecated Sidebar-based navigation is not used in ΛΞVON OS.
 * This component is a standard ShadCN UI component but is intentionally
 * not integrated into the application's layout, as per the UX architecture
 * which centralizes navigation and control within the TopBar.
 */
const DeprecatedSidebarPlaceholder: React.FC = () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      "Warning: The <Sidebar> component (and its related sub-components) " +
      "from src/components/ui/sidebar.tsx is deprecated for use in ΛΞVON OS. " +
      "Navigation and primary UI control are managed by the TopBar."
    );
  }
  return (
    <div 
      style={{ 
        display: 'none', 
        padding: '1rem', 
        border: '1px dashed red', 
        color: 'red', 
        margin: '1rem' 
      }}
      data-deprecated-component="Sidebar"
    >
      Sidebar component is deprecated in this application. See console for details.
    </div>
  );
};

const SidebarProvider = DeprecatedSidebarPlaceholder;
const Sidebar = DeprecatedSidebarPlaceholder;
const SidebarTrigger = DeprecatedSidebarPlaceholder;
const SidebarRail = DeprecatedSidebarPlaceholder;
const SidebarInset = DeprecatedSidebarPlaceholder;
const SidebarInput = DeprecatedSidebarPlaceholder;
const SidebarHeader = DeprecatedSidebarPlaceholder;
const SidebarFooter = DeprecatedSidebarPlaceholder;
const SidebarSeparator = DeprecatedSidebarPlaceholder;
const SidebarContent = DeprecatedSidebarPlaceholder;
const SidebarGroup = DeprecatedSidebarPlaceholder;
const SidebarGroupLabel = DeprecatedSidebarPlaceholder;
const SidebarGroupAction = DeprecatedSidebarPlaceholder;
const SidebarGroupContent = DeprecatedSidebarPlaceholder;
const SidebarMenu = DeprecatedSidebarPlaceholder;
const SidebarMenuItem = DeprecatedSidebarPlaceholder;
const SidebarMenuButton = DeprecatedSidebarPlaceholder;
const SidebarMenuAction = DeprecatedSidebarPlaceholder;
const SidebarMenuBadge = DeprecatedSidebarPlaceholder;
const SidebarMenuSkeleton = DeprecatedSidebarPlaceholder;
const SidebarMenuSub = DeprecatedSidebarPlaceholder;
const SidebarMenuSubItem = DeprecatedSidebarPlaceholder;
const SidebarMenuSubButton = DeprecatedSidebarPlaceholder;

const useSidebar = () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      "Warning: useSidebar hook is part of a deprecated Sidebar component system " +
      "in ΛΞVON OS. Navigation and primary UI control are managed by the TopBar."
    );
  }
  return {
    state: "collapsed" as "expanded" | "collapsed",
    open: false,
    setOpen: () => {},
    openMobile: false,
    setOpenMobile: () => {},
    isMobile: false,
    toggleSidebar: () => {},
  };
};

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
  DeprecatedSidebarPlaceholder as SidebarPlaceholder, // Exporting for clarity if ever needed
};
