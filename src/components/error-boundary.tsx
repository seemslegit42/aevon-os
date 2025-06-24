
"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Warning } from 'phosphor-react';
import { useLayoutStore } from '@/stores/layout.store';

interface Props {
  children: ReactNode;
  itemId: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const FallbackUI = ({ error, onRetry, onClose }: { error?: Error, onRetry: () => void, onClose: () => void }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center bg-destructive/10 text-destructive">
            <Warning className="w-12 h-12 mb-4" />
            <h3 className="text-lg font-headline text-destructive-foreground mb-2">Something Went Wrong</h3>
            <p className="text-sm text-destructive-foreground/80 mb-4">
              This component has encountered an error. You can try to reload it or close this window.
            </p>
            {error && (
              <details className="text-xs p-2 bg-black/20 rounded-md w-full text-left max-h-24 overflow-auto">
                <summary className="cursor-pointer">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
              </details>
            )}
            <div className="flex items-center gap-4 mt-6">
                <Button variant="destructive" onClick={onRetry}>Retry</Button>
                <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/20 hover:text-destructive" onClick={onClose}>Close Window</Button>
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

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };
  
  private handleClose = () => {
    useLayoutStore.getState().closeItem(this.props.itemId);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <FallbackUI 
            error={this.state.error}
            onRetry={this.handleRetry}
            onClose={this.handleClose}
        />
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
