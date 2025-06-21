
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

// Define a local schema since the central one is being cleared.
const AppDescriptionInputSchema = z.object({
  microAppName: z.string().min(3, "App name must be at least 3 characters"),
  microAppFunctionality: z.string().min(20, "Functionality description must be at least 20 characters"),
  targetAudience: z.string().min(10, "Target audience description must be at least 10 characters"),
  keyFeatures: z.string().min(10, "Please list key features, separated by commas (e.g., Feature 1, Feature 2)"),
});
type AppDescriptionFormValues = z.infer<typeof AppDescriptionInputSchema>;

interface ArmoryAppDisplay {
  id: string;
  name: string;
  icon: ElementType; // Placeholder, actual icon might differ
  aiGeneratedDesc?: string;
  tags: string[];
}

const ArmoryCardContent: React.FC = () => {
  const [apps, setApps] = useState<ArmoryAppDisplay[]>([]); // Simplified for card context
  const { toast } = useToast();

  const form = useForm<AppDescriptionFormValues>({
    resolver: zodResolver(AppDescriptionInputSchema),
    defaultValues: { microAppName: "", microAppFunctionality: "", targetAudience: "", keyFeatures: "" },
  });

  const handleGenerateDescription = async (values: AppDescriptionFormValues) => {
    // This functionality is disabled as Genkit is not used in this project.
    toast({ 
        variant: "destructive", 
        title: "Feature Disabled", 
        description: "AI description generation is not configured for this application." 
    });
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
            Have a micro-app idea? Describe its features below.
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
              <Button type="submit" disabled={true} size="sm" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                Generate Description (Disabled)
                <MagicWandIcon className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ArmoryCardContent;
