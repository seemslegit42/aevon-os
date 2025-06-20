
"use client";
import React, { useState, useEffect, type ElementType } from 'react';
import MicroAppCard from '@/components/micro-app-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  CreditCardIcon as ShoppingCartIcon,
  PlusSquareIcon as PackagePlusIcon,
  MagicWandIcon as SparklesIcon,
  DownloadIcon,
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

interface ArmoryApp {
  id: string;
  name: string;
  icon: ElementType;
  aiGeneratedDesc?: string;
  tags: string[];
}

const initialApps: ArmoryApp[] = []; 

export default function ArmoryPage() {
  const [apps, setApps] = useState<ArmoryApp[]>(initialApps);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<AppDescriptionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      microAppName: "",
      microAppFunctionality: "",
      targetAudience: "",
      keyFeatures: "",
    },
  });

  const handleGenerateDescription = async (values: AppDescriptionFormValues) => {
    setIsGenerating(true);
    setGeneratedDescription(""); 

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
      
      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setGeneratedDescription((prev) => (prev || "") + chunk);
      }

    } catch (error) {
      console.error("Error generating app description:", error);
      let errorMessage = "Failed to generate app description.";
       if (error instanceof Error) {
          errorMessage = error.message;
      }
      setGeneratedDescription(null);
      toast({ variant: "destructive", title: "Generation Error", description: errorMessage });
    } finally {
      setIsGenerating(false);
    }
  };
  

  return (
    <div className="space-y-8">
      <MicroAppCard
        title="ΛΞVON Λrmory: Expand Your OS"
        icon={ShoppingCartIcon}
        description="Discover, acquire, and manage AI-powered micro-apps and intelligent agents. Enhance your ΛΞVON OS capabilities and tailor the platform to your unique business needs."
      />

      <h2 className="font-headline text-2xl text-primary mt-10 mb-6">Featured Micro-Apps</h2>
      {apps.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <p className="text-muted-foreground">No micro-apps currently available in the Armory.</p>
              <p className="text-muted-foreground text-sm mt-2">Use the form below to define and describe a new micro-app.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <Card key={app.id} className="flex flex-col overflow-hidden">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary flex items-center">
                  <app.icon className="w-6 h-6 mr-2 text-primary" /> {app.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground h-12 overflow-hidden text-ellipsis">
                  {app.aiGeneratedDesc ? app.aiGeneratedDesc.substring(0,100)+(app.aiGeneratedDesc.length > 100 ? '...' : '') : 'Description not available.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-x-2 mb-3">
                  {app.tags.map(tag => <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{tag}</span>)}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-accent hover:bg-accent/80 text-accent-foreground">
                  <DownloadIcon className="w-4 h-4 mr-2" /> Get App
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <MicroAppCard title="Publish Your Micro-App" icon={PackagePlusIcon}>
        <p className="text-muted-foreground mb-6">
          Have a micro-app idea? Use our AI to generate a compelling marketplace description.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGenerateDescription)} className="space-y-6">
            <FormField
              control={form.control}
              name="microAppName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Micro-App Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sales Forecaster AI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="microAppFunctionality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Functionality</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe what your app does..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Target Audience</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sales teams in SMBs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keyFeatures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Key Features (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AI predictions, Data visualization, Report generation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isGenerating} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              {isGenerating ? 'Generating...' : 'Generate Description'}
              <SparklesIcon className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </Form>

        {generatedDescription && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-headline text-primary">AI-Generated Description:</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-40"> 
                <p className="text-foreground whitespace-pre-wrap">{generatedDescription}</p>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </MicroAppCard>
    </div>
  );
}
