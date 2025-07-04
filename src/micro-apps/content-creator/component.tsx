
"use client"

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormData } from './schemas';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { type ContentGeneration } from '@/lib/ai-schemas';
import { Zap, Copy, FileText, ShieldAlert } from 'lucide-react';
import { useBeepChat } from '@/hooks/use-beep-chat';

const ContentCreatorComponent: React.FC = () => {
  const { toast } = useToast();
  const [generatedContent, setGeneratedContent] = useState<ContentGeneration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWaitingForContent, setIsWaitingForContent] = useState(false);
  const { append: beepAppend, messages: beepMessages, isLoading: isBeepLoading } = useBeepChat();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      contentType: 'Blog Post',
      tone: 'Professional',
    },
  });

  const onSubmit = async (values: FormData) => {
    setError(null);
    setGeneratedContent(null);
    setIsWaitingForContent(true);
    
    const prompt = `Generate a ${values.contentType} about "${values.topic}" with a ${values.tone} tone.`;
    beepAppend({ role: 'user', content: prompt });
  };
  
  useEffect(() => {
    if (isBeepLoading || !isWaitingForContent) return;

    const lastMessage = beepMessages[beepMessages.length - 1];
    if (lastMessage?.role === 'tool' && lastMessage.name === 'generateMarketingContent') {
      try {
        const result = JSON.parse(lastMessage.content) as ContentGeneration;
        if (result.body && result.title) {
          setGeneratedContent(result);
        } else {
          setError('The AI returned an unexpected format for the content.');
        }
      } catch(e) {
        setError('Failed to parse content from the AI response.');
      } finally {
        setIsWaitingForContent(false);
      }
    }
  }, [isBeepLoading, isWaitingForContent, beepMessages]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to Clipboard' });
  };

  const isLoading = isBeepLoading && isWaitingForContent;

  const ResultDisplay = () => {
      if (isLoading) {
          return (
              <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
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
          )
      }
      
      if (generatedContent) {
          return (
              <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-headline text-primary">{generatedContent.title}</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(generatedContent.title)}>
                        <Copy />
                    </Button>
                  </div>
                  <div className="w-full max-w-none relative">
                    <Textarea readOnly value={generatedContent.body} className="w-full h-48 bg-muted/30" />
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => handleCopy(generatedContent.body)}>
                        <Copy />
                    </Button>
                  </div>
              </div>
          );
      }

      return (
          <div className="text-center text-muted-foreground p-8">
              <FileText className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-4">Your generated content will appear here.</p>
          </div>
      )
  }

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/3 md:border-r border-border/30 pr-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'The future of AI in business'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Blog Post">Blog Post</SelectItem>
                      <SelectItem value="Tweet">Tweet</SelectItem>
                      <SelectItem value="Marketing Email">Marketing Email</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone of Voice</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                      <SelectItem value="Humorous">Humorous</SelectItem>
                      <SelectItem value="Persuasive">Persuasive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full btn-gradient-primary-secondary" disabled={isLoading}>
                <Zap />
              {isLoading ? 'Generating...' : 'Generate Content'}
            </Button>
          </form>
        </Form>
      </div>

      <div className="flex-grow md:w-2/3">
        <ScrollArea className="h-full">
            <div className="p-4">
              <ResultDisplay />
            </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ContentCreatorComponent;

    