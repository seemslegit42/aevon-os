
"use client";
import React, { useState, type ElementType } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  MagicWandIcon,
} from '@/components/icons';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  microAppName: z.string().min(3, "App name must be at least 3 characters"),
  microAppFunctionality: z.string().min(20, "Functionality description must be at least 20 characters"),
  targetAudience: z.string().min(10, "Target audience description must be at least 10 characters"),
  keyFeatures: z.string().min(10, "Please list key features, separated by commas (e.g., Feature 1, Feature 2)"),
});

type AppDescriptionFormValues = z.infer<typeof formSchema>;

interface ArmoryAppDisplay {
  id: string;
  name: string;
  icon: ElementType; // Placeholder, actual icon might differ
  aiGeneratedDesc?: string;
  tags: string[];
}

const ArmoryCardContent: React.FC = () => {
  const [apps, setApps] = useState<ArmoryAppDisplay[]>([]); // Simplified for card context
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<AppDescriptionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { microAppName: "", microAppFunctionality: "", targetAudience: "", keyFeatures: "" },
  });

  const handleGenerateDescription = async (values: AppDescriptionFormValues) => {
    setIsGenerating(true);
    setGeneratedDescription(null); 

    try {
      const response = await fetch('/api/ai/app-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }
      
      if (!response.body) throw new Error('Response body is null');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let currentDescription = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        currentDescription += decoder.decode(value, { stream: true });
        setGeneratedDescription(currentDescription);
      }
    } catch (error) {
      console.error("Error generating app description:", error);
      let errorMessage = "Failed to generate app description.";
      if (error instanceof Error) errorMessage = error.message;
      setGeneratedDescription(null);
      toast({ variant: "destructive", title: "Generation Error", description: errorMessage });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <ScrollArea className="h-full pr-2">
      <div className="space-y-6">
        <h3 className="font-headline text-lg text-primary dark:text-primary-foreground mt-2 mb-3">Featured Micro-Apps</h3>
        {apps.length === 0 ? (
          <Card className="glassmorphism-panel">
            <CardContent className="pt-4">
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No micro-apps currently featured in the Armory.</p>
                <p className="text-xs text-muted-foreground mt-1">Use the form below to describe a new one.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* App listing would go here if apps state had data */}
          </div>
        )}

        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Have a micro-app idea? Use our AI to generate a compelling marketplace description.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateDescription)} className="space-y-4">
              <FormField control={form.control} name="microAppName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-primary">App Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Sales Forecaster AI" {...field} className="text-sm" /></FormControl>
                  <FormMessage className="text-xs"/>
                </FormItem>
              )} />
              <FormField control={form.control} name="microAppFunctionality" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-primary">Functionality</FormLabel>
                  <FormControl><Textarea placeholder="Describe what your app does..." {...field} rows={2} className="text-sm" /></FormControl>
                  <FormMessage className="text-xs"/>
                </FormItem>
              )} />
              <FormField control={form.control} name="targetAudience" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-primary">Target Audience</FormLabel>
                  <FormControl><Input placeholder="e.g., Sales teams in SMBs" {...field} className="text-sm" /></FormControl>
                  <FormMessage className="text-xs"/>
                </FormItem>
              )} />
              <FormField control={form.control} name="keyFeatures" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-primary">Key Features (comma-separated)</FormLabel>
                  <FormControl><Input placeholder="e.g., AI predictions, Data viz" {...field} className="text-sm" /></FormControl>
                  <FormMessage className="text-xs"/>
                </FormItem>
              )} />
              <Button type="submit" disabled={isGenerating} size="sm" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {isGenerating ? 'Generating...' : 'Generate Description'}
                <MagicWandIcon className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </Form>

          {generatedDescription && (
            <Card className="mt-4 glassmorphism-panel">
              <CardHeader className="py-2">
                <CardTitle className="text-md font-headline text-primary">AI-Generated Description:</CardTitle>
              </CardHeader>
              <CardContent className="pt-1 pb-3">
                <ScrollArea className="h-24"><p className="text-xs text-foreground whitespace-pre-wrap">{generatedDescription}</p></ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ArmoryCardContent;
