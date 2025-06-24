
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vinFormSchema, type VinFormData } from './schemas';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Zap, Copy, FileText, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useBeepChat } from '@/hooks/use-beep-chat';
import type { VinComplianceResult } from '@/lib/ai-schemas';

const VinComplianceComponent: React.FC = () => {
    const { toast } = useToast();
    const [result, setResult] = useState<VinComplianceResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isWaitingForResult, setIsWaitingForResult] = useState(false);
    const { append: beepAppend, messages: beepMessages, isLoading: isBeepLoading } = useBeepChat();

    const form = useForm<VinFormData>({
        resolver: zodResolver(vinFormSchema),
        defaultValues: {
            manufacturerId: '1A9',
            trailerType: 'Flatbed',
            modelYear: new Date().getFullYear(),
            plantCode: 'D',
        },
    });

    const onSubmit = (values: VinFormData) => {
        setError(null);
        setResult(null);
        setIsWaitingForResult(true);
        const prompt = `Generate a VIN for a ${values.trailerType} trailer, model year ${values.modelYear}, from plant ${values.plantCode} with manufacturer ID ${values.manufacturerId}.`;
        beepAppend({ role: 'user', content: prompt });
    };
    
    useEffect(() => {
        if (isBeepLoading || !isWaitingForResult) return;

        const lastMessage = beepMessages[beepMessages.length - 1];
        if (lastMessage?.role === 'tool' && lastMessage.name === 'generateVin') {
            try {
                const toolResult = JSON.parse(lastMessage.content) as VinComplianceResult;
                if (toolResult.vin && toolResult.complianceDocument) {
                    setResult(toolResult);
                } else {
                    setError('The AI returned an unexpected format for the VIN data.');
                }
            } catch (e) {
                setError('Failed to parse VIN data from the AI response.');
            } finally {
                setIsWaitingForResult(false);
            }
        }
    }, [isBeepLoading, isWaitingForResult, beepMessages]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied to Clipboard' });
    };
    
    const isLoading = isBeepLoading && isWaitingForResult;

    const ResultDisplay = () => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-destructive p-4">
                    <ShieldAlert className="mx-auto h-8 w-8 mb-2" />
                    <h4 className="font-semibold">Generation Failed</h4>
                    <p className="text-xs">{error}</p>
                </div>
            );
        }

        if (result) {
            return (
                <div className="space-y-4">
                    <div>
                        <Label className="text-xs text-muted-foreground">Generated VIN</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input readOnly value={result.vin} className="font-mono text-lg h-12 bg-muted/30" />
                            <Button variant="ghost" size="icon" onClick={() => handleCopy(result.vin)}><Copy /></Button>
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Compliance Document Summary</Label>
                        <Textarea readOnly value={result.complianceDocument} rows={6} className="mt-1 bg-muted/30" />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">VIN Breakdown</Label>
                        <div className="mt-1 grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
                            <div className="p-2 bg-muted/30 rounded-md">
                                <p className="text-[0.7rem] text-muted-foreground">WMI</p>
                                <p className="font-mono text-sm">{result.breakdown.wmi}</p>
                            </div>
                            <div className="p-2 bg-muted/30 rounded-md">
                                <p className="text-[0.7rem] text-muted-foreground">VDS</p>
                                <p className="font-mono text-sm">{result.breakdown.vds}</p>
                            </div>
                             <div className="p-2 bg-muted/30 rounded-md">
                                <p className="text-[0.7rem] text-muted-foreground">Check Digit</p>
                                <p className="font-mono text-sm">{result.checkDigit}</p>
                            </div>
                             <div className="p-2 bg-muted/30 rounded-md">
                                <p className="text-[0.7rem] text-muted-foreground">Year/Plant</p>
                                <p className="font-mono text-sm">{result.breakdown.yearCode}{result.breakdown.plantCode}</p>
                            </div>
                             <div className="p-2 bg-muted/30 rounded-md">
                                <p className="text-[0.7rem] text-muted-foreground">Sequence</p>
                                <p className="font-mono text-sm">{result.breakdown.sequentialNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        
        return (
            <div className="text-center text-muted-foreground p-8 h-full flex flex-col items-center justify-center">
                <ShieldCheck className="mx-auto h-12 w-12 opacity-50 text-primary" />
                <p className="mt-4">Fill out the form to generate a compliant VIN.</p>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-4 p-4">
            <div className="w-full md:w-1/3 md:border-r border-border/30 pr-4">
                <h3 className="text-lg font-headline mb-4">VIN Generation Parameters</h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="manufacturerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Manufacturer ID (WMI)</FormLabel>
                                    <FormControl><Input placeholder="e.g., 1A9" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="trailerType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trailer Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="Flatbed">Flatbed</SelectItem>
                                            <SelectItem value="Enclosed">Enclosed</SelectItem>
                                            <SelectItem value="Gooseneck">Gooseneck</SelectItem>
                                            <SelectItem value="Utility">Utility</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="modelYear"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model Year</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="plantCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plant Code</FormLabel>
                                        <FormControl><Input placeholder="e.g., D" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="w-full btn-gradient-primary-secondary" disabled={isLoading}>
                            <Zap />
                            {isLoading ? 'Generating...' : 'Generate Compliant VIN'}
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="flex-grow md:w-2/3">
                <ScrollArea className="h-full">
                    <div className="p-4"><ResultDisplay /></div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default VinComplianceComponent;
