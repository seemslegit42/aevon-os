
"use client";

import React, { useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import eventBus from '@/lib/event-bus';
import type { TextCategory, InvoiceData } from '@/lib/ai-schemas';
import { MailIcon, ZapIcon } from '@/components/icons';

const sampleEmail = `
Subject: Your Latest Invoice from Chronos Dynamics

Hi Team,

Please find attached Invoice #CD-2024-991 for your recent purchase of temporal displacement units.

Details:
- 5x Chroniton Field Emitters @ $2,500.00 each = $12,500.00
- Service Fee: $500.00

Total Amount Due: $13,000.00
Due Date: 2024-08-30

Best,
Quantum Supplies Inc.
`;


// --- API Helper Functions ---

async function categorizeText(text: string): Promise<TextCategory> {
    const response = await fetch('/api/ai/categorize-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Categorization API failed');
    }
    return response.json();
}

async function extractInvoiceData(text: string): Promise<InvoiceData> {
    const response = await fetch('/api/ai/extract-invoice-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Extraction API failed');
    }
    return response.json();
}


// --- Component ---

const EmailProcessorApp: React.FC = () => {
    const [inputText, setInputText] = useState(sampleEmail);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categoryResult, setCategoryResult] = useState<TextCategory | null>(null);
    const [invoiceResult, setInvoiceResult] = useState<InvoiceData | null>(null);
    const { toast } = useToast();

    const handleProcessEmail = useCallback(async () => {
        if (!inputText.trim()) {
            toast({ variant: "destructive", title: "Input Required", description: "Please provide email text to process." });
            return;
        }

        setIsLoading(true);
        setError(null);
        setCategoryResult(null);
        setInvoiceResult(null);
        eventBus.emit('orchestration:log', { task: 'Email Processing Started', status: 'success', details: `Analyzing ${inputText.length} characters.` });

        try {
            // Step 1: Categorize Text
            const categoryData = await categorizeText(inputText);
            setCategoryResult(categoryData);
            eventBus.emit('orchestration:log', { task: 'Email Categorized', status: 'success', details: `Category: ${categoryData.category}` });

            // Step 2: Extract Invoice Data if applicable
            if (categoryData.isMatch && categoryData.category === 'Invoice') {
                const invoiceData = await extractInvoiceData(inputText);
                setInvoiceResult(invoiceData);
                eventBus.emit('orchestration:log', { task: 'Invoice Data Extracted', status: 'success', details: invoiceData.summary });
            }
             eventBus.emit('orchestration:log', { task: 'Email Processing Finished', status: 'success', details: 'Analysis complete.' });

        } catch (err: any) {
            setError(err.message);
            toast({ variant: "destructive", title: "Processing Failed", description: err.message });
            eventBus.emit('orchestration:log', { task: 'Email Processing Failed', status: 'failure', details: err.message });
        } finally {
            setIsLoading(false);
        }
    }, [inputText, toast]);

    const LoadingSkeleton = () => (
        <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
    );
    
    const ResultDisplay = () => (
        <div className="space-y-4">
            {categoryResult && (
                 <Card className="bg-background/30">
                    <CardHeader>
                        <CardTitle className="text-base text-primary">Analysis Result</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm pt-0">
                        <p><strong>Category:</strong> {categoryResult.category}</p>
                        {invoiceResult && (
                            <>
                                <p><strong>Invoice #:</strong> {invoiceResult.invoiceNumber || 'N/A'}</p>
                                <p><strong>Amount:</strong> {invoiceResult.amount ? `$${invoiceResult.amount.toFixed(2)}` : 'N/A'}</p>
                                <p><strong>Due Date:</strong> {invoiceResult.dueDate || 'N/A'}</p>
                                <p><strong>AI Summary:</strong> {invoiceResult.summary}</p>
                            </>
                        )}
                        {!invoiceResult && categoryResult.category !== 'Invoice' && (
                            <p className="text-muted-foreground">This does not appear to be an invoice, so no data was extracted.</p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );

    return (
        <div className="p-2 h-full flex flex-col gap-4">
            <div className="flex-shrink-0">
                <Textarea
                    placeholder="Paste email content here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={8}
                    className="bg-input border-input text-xs"
                    disabled={isLoading}
                />
            </div>
            <div className="flex-shrink-0">
                <Button onClick={handleProcessEmail} disabled={isLoading} className="w-full btn-gradient-primary-secondary">
                    <ZapIcon className="mr-2"/>
                    {isLoading ? 'Processing...' : 'Process Email with AI'}
                </Button>
            </div>
            <div className="flex-grow min-h-0 overflow-y-auto pr-2">
                 {isLoading && <LoadingSkeleton />}
                 {!isLoading && (categoryResult || error) && (
                     error ? <p className="text-destructive text-center">{error}</p> : <ResultDisplay />
                 )}
                 {!isLoading && !categoryResult && !error && (
                     <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                         <MailIcon className="w-12 h-12 mb-3 opacity-50"/>
                         <p>Ready to process email content.</p>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default EmailProcessorApp;
