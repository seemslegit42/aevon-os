
"use client";
import React, { useState, useEffect } from 'react';
import MicroAppCard from '@/components/micro-app-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, PackagePlus, Sparkles, Download, Wand2, Shield, type LucideIcon } from 'lucide-react';
import { generateMicroAppDescription, type GenerateMicroAppDescriptionInput } from '@/ai/flows/generate-micro-app-description';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
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
  keyFeatures: z.string().min(10, "Please list key features, separated by commas"),
});

type AppDescriptionFormValues = z.infer<typeof formSchema>;

interface ArmoryApp {
  id: string;
  name: string;
  icon: LucideIcon;
  shortDesc: string;
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
    setGeneratedDescription(null);
    try {
      const input: GenerateMicroAppDescriptionInput = {
        ...values,
        keyFeatures: values.keyFeatures.split(',').map(f => f.trim()).filter(f => f),
      };
      const result = await generateMicroAppDescription(input);
      setGeneratedDescription(result.description);
      toast({ title: "Description Generated", description: "AI-powered micro-app description created successfully." });
    } catch (error) {
      console.error("Error generating micro-app description:", error);
      setGeneratedDescription("Failed to generate description. Please try again.");
      toast({ variant: "destructive", title: "Generation Error", description: "Could not generate micro-app description." });
    } finally {
      setIsGenerating(false);
    }
  };
  
  useEffect(() => {
    if (apps.length > 0) { 
        const fetchInitialDescriptions = async () => {
          const updatedApps = await Promise.all(apps.map(async (app) => {
            if (!app.aiGeneratedDesc) {
              try {
                const input: GenerateMicroAppDescriptionInput = {
                  microAppName: app.name,
                  microAppFunctionality: `${app.shortDesc} This app is designed to integrate seamlessly with ΛΞVON OS.`,
                  targetAudience: "Small to Medium-sized Businesses using ΛΞVON OS.",
                  keyFeatures: ["Easy Integration", "AI-Powered", ...app.tags],
                };
                const result = await generateMicroAppDescription(input);
                return { ...app, aiGeneratedDesc: result.description };
              } catch (error) {
                console.warn(`Failed to generate description for ${app.name}`, error);
                return { ...app, aiGeneratedDesc: "Description generation pending or failed." }; 
              }
            }
            return app;
          }));
          setApps(updatedApps);
        };
        fetchInitialDescriptions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div className="space-y-8">
      <MicroAppCard
        title="ΛΞVON Λrmory: Expand Your OS"
        icon={ShoppingCart}
        description="Discover, acquire, and manage AI-powered micro-apps and intelligent agents. Enhance your ΛΞVON OS capabilities and tailor the platform to your unique business needs."
      />

      <h2 className="font-headline text-2xl text-primary mt-10 mb-6">Featured Micro-Apps</h2>
      {apps.length === 0 ? (
        <Card className="glassmorphism-panel">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">No micro-apps currently available in the Armory.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <Card key={app.id} className="glassmorphism-panel flex flex-col overflow-hidden">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary flex items-center">
                  <app.icon className="w-6 h-6 mr-2 text-primary" /> {app.name}
                </CardTitle>
                <CardDescription className="text-foreground/80 h-12 overflow-hidden text-ellipsis">
                  {app.aiGeneratedDesc ? app.aiGeneratedDesc.substring(0,100)+'...' : 'Loading description...'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-x-2 mb-3">
                  {app.tags.map(tag => <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{tag}</span>)}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-accent hover:bg-accent/80 text-accent-foreground">
                  <Download className="w-4 h-4 mr-2" /> Get App
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <MicroAppCard title="Publish Your Micro-App" icon={PackagePlus}>
        <p className="text-foreground/80 mb-6">
          Have a micro-app idea? Use our AI to generate a compelling marketplace description.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGenerateDescription)} className="space-y-6">
            <FormField
              control={form.control}
              name="microAppName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary/80">Micro-App Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sales Forecaster AI" {...field} className="bg-background/50 dark:bg-background/50 border-primary/30 focus:ring-accent"/>
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
                  <FormLabel className="text-primary/80">Functionality</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe what your app does..." {...field} rows={3} className="bg-background/50 dark:bg-background/50 border-primary/30 focus:ring-accent"/>
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
                  <FormLabel className="text-primary/80">Target Audience</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sales teams in SMBs" {...field} className="bg-background/50 dark:bg-background/50 border-primary/30 focus:ring-accent"/>
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
                  <FormLabel className="text-primary/80">Key Features (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AI predictions, Data visualization, Report generation" {...field} className="bg-background/50 dark:bg-background/50 border-primary/30 focus:ring-accent"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isGenerating} className="w-full md:w-auto bg-primary hover:bg-primary/80 text-primary-foreground">
              {isGenerating ? 'Generating...' : 'Generate Description'}
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </Form>

        {generatedDescription && (
          <Card className="mt-6 glassmorphism-panel">
            <CardHeader>
              <CardTitle className="text-xl font-headline text-primary">AI-Generated Description:</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">{generatedDescription}</p>
            </CardContent>
          </Card>
        )}
      </MicroAppCard>
    </div>
  );
}
