
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { generateLoomWorkflow } from '@/lib/ai/loom-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { BrainCircuit, Loader2 } from 'lucide-react';
import type { AiGeneratedFlowData } from '@/types/loom';
import { useLoomStore } from '@/stores/loom.store';
import eventBus from '@/lib/event-bus';

const FormSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
});

export const AiFlowGeneratorForm = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const addConsoleMessage = useLoomStore(state => state.addConsoleMessage);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { prompt: "" },
    });

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        setIsLoading(true);
        addConsoleMessage('info', `Generating new workflow from prompt: "${values.prompt}"`);

        try {
            const result = await generateLoomWorkflow({ prompt: values.prompt });
            const flowData: AiGeneratedFlowData = {
                ...result,
                message: 'Workflow generated successfully by AI.',
                error: false,
                userInput: values.prompt,
            };
            eventBus.emit('loom:flow-generated', flowData);
            form.reset();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Flow Generation Failed', description: error.message });
            eventBus.emit('loom:flow-generated', {
                message: error.message,
                nodes: [],
                connections: [],
                error: true,
                userInput: values.prompt,
                workflowName: "Failed Generation"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-full">
                <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="Describe a workflow for the AI to build..."
                                    className="bg-card/70 border-border/50 h-10 pl-4 pr-10 command-bar-input-aevos-override"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <BrainCircuit className="h-5 w-5" />}
                    <span className="sr-only">Generate Flow</span>
                </Button>
            </form>
        </Form>
    );
};
