
"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, RotateCw } from 'lucide-react';
import { useLayoutStore } from '@/stores/layout.store';

interface Props {
  children: ReactNode;
  itemId: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const FallbackUI = ({ error, onReload, onClose }: { error?: Error, onReload: () => void, onClose: () => void }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center bg-destructive/10 text-destructive">
            <ShieldAlert className="w-12 h-12 mb-4" />
            <h3 className="text-lg font-headline text-destructive-foreground mb-2">Component Error</h3>
            <p className="text-sm text-destructive-foreground/80 mb-4">
              This window has encountered an unrecoverable error.
            </p>
            {error && (
              <details className="text-xs p-2 bg-black/20 rounded-md w-full text-left max-h-24 overflow-auto">
                <summary className="cursor-pointer">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
              </details>
            )}
            <div className="flex items-center gap-4 mt-6">
                <Button variant="outline" onClick={onReload} className="border-destructive/50 text-destructive hover:bg-destructive/20 hover:text-destructive"><RotateCw /> Reload Window</Button>
                <Button variant="destructive" onClick={onClose}>Close Window</Button>
            </div>
        </div>
    );
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in micro-app:", error, errorInfo);
  }

  private handleReload = () => {
    // We can reset our own error state, but the reload action will trigger the remount
    this.setState({ hasError: false, error: undefined });
    useLayoutStore.getState().reloadApp(this.props.itemId);
  }
  
  private handleClose = () => {
    useLayoutStore.getState().closeItem(this.props.itemId);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <FallbackUI 
            error={this.state.error}
            onReload={this.handleReload}
            onClose={this.handleClose}
        />
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
