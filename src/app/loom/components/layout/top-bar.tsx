'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { generateLoomWorkflow } from '@/lib/ai/loom-flow';
import { useBeepChatStore } from '@/stores/beep-chat.store';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { BrainCircuit, Search, Settings, UserCircle, Menu, FolderKanban, FileText, BookMarked, Eye, ShieldQuestion, LayoutGrid, Settings2, Bot, ListOrdered, Terminal, Loader2 } from 'lucide-react';
import type { PanelVisibility, AiGeneratedFlowData, ConsoleMessage, AvatarState } from '@/types/loom'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface AiFlowGeneratorFormProps {
    onFlowGenerated: (data: AiGeneratedFlowData) => void; 
    addConsoleMessage: (type: ConsoleMessage['type'], text: string, swarmId?: string) => void;
}

const FormSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
});

const AiFlowGeneratorForm = ({ onFlowGenerated, addConsoleMessage }: AiFlowGeneratorFormProps) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { prompt: "" },
    });

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        setIsLoading(true);
        addConsoleMessage('info', `Generating new workflow from prompt: "${values.prompt}"`);

        try {
            const result = await generateLoomWorkflow({ prompt: values.prompt });
            onFlowGenerated({
                ...result,
                message: 'Workflow generated successfully by AI.',
                error: false,
                userInput: values.prompt,
            });
            form.reset();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Flow Generation Failed', description: error.message });
            onFlowGenerated({
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
                                    className="bg-card/70 border-border/50 h-10 pl-4 pr-10"
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

const BeepStatusIndicator = () => {
    const avatarState = useBeepChatStore(state => state.avatarState);

    const statusConfig: Record<AvatarState, { text: string; color: string; }> = {
        idle: { text: "Idle", color: "bg-muted-foreground/50" },
        listening: { text: "Listening", color: "bg-green-500 animate-pulse" },
        thinking: { text: "Thinking", color: "bg-purple-500 animate-pulse" },
        tool_call: { text: "Executing", color: "bg-yellow-500" },
        security_alert: { text: "Security Alert", color: "bg-red-500 animate-pulse" },
        speaking_neutral: { text: "Speaking", color: "bg-blue-500" },
        speaking_helpful: { text: "Speaking", color: "bg-green-400" },
        speaking_insightful: { text: "Speaking", color: "bg-purple-400" },
        speaking_cautious: { text: "Speaking", color: "bg-yellow-400" },
    };
    
    const currentStatus = statusConfig[avatarState] || statusConfig.idle;

    return (
         <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/40 rounded-full px-2 py-1 bg-card/60" title={`BEEP Status: ${currentStatus.text}`}>
            <Bot className="h-4 w-4 text-primary/80" />
            <span className={cn("h-2 w-2 rounded-full transition-colors", currentStatus.color)}></span>
        </div>
    );
};


interface TopBarProps {
  onFlowGenerated: (data: AiGeneratedFlowData) => void; 
  addConsoleMessage: (type: ConsoleMessage['type'], text: string, swarmId?: string) => void;
  panelVisibility: PanelVisibility;
  togglePanel: (panel: keyof PanelVisibility) => void;
  isMobile: boolean;
  anyMobilePanelOpen: boolean;
  onOpenTemplateSelector: () => void; 
}

export function TopBar({ onFlowGenerated, addConsoleMessage, panelVisibility, togglePanel, isMobile, anyMobilePanelOpen, onOpenTemplateSelector }: TopBarProps) {
  const showAiForm = !isMobile || !anyMobilePanelOpen; 
  const { toast } = useToast();

  const handleComingSoon = (featureName: string) => {
    toast({
      title: "Coming Soon!",
      description: `${featureName} feature is under development.`,
    });
    addConsoleMessage('info', `User clicked on coming soon feature: ${featureName}`);
  };

  const desktopPanelToggleItems = [
    { panel: 'palette' as keyof PanelVisibility, label: 'Palette', icon: <LayoutGrid className="mr-2 h-4 w-4" /> },
    { panel: 'inspector' as keyof PanelVisibility, label: 'Inspector', icon: <Settings2 className="mr-2 h-4 w-4" /> },
    { panel: 'agentHub' as keyof PanelVisibility, label: 'Agent Hub', icon: <Bot className="mr-2 h-4 w-4" /> },
    { panel: 'actionConsole' as keyof PanelVisibility, label: 'Action Console', icon: <ShieldQuestion className="mr-2 h-4 w-4" /> },
    { panel: 'timeline' as keyof PanelVisibility, label: 'Timeline', icon: <ListOrdered className="mr-2 h-4 w-4" /> },
    { panel: 'console' as keyof PanelVisibility, label: 'Console', icon: <Terminal className="mr-2 h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 shadow-sm backdrop-blur-lg sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 md:gap-4">
        {isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-1">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleComingSoon("Projects")} className="cursor-pointer">
                 <FolderKanban className="mr-2 h-4 w-4" /> Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onOpenTemplateSelector} className="cursor-pointer">
                 <BookMarked className="mr-2 h-4 w-4" /> Templates
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleComingSoon("Documentation")} className="cursor-pointer">
                 <FileText className="mr-2 h-4 w-4" /> Docs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleComingSoon("Agent Context")} className="cursor-pointer">
                 <UserCircle className="mr-2 h-4 w-4" /> Agent Context
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleComingSoon("Settings")} className="cursor-pointer">
                 <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <BrainCircuit className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-xl md:text-2xl font-semibold text-foreground">
          Loom Studio
        </h1>
        <div className="hidden md:block">
            <BeepStatusIndicator />
        </div>
        <Separator orientation="vertical" className={`h-8 ${isMobile ? 'hidden' : 'block'}`} />
        <nav className={`items-center gap-1 ${isMobile ? 'hidden' : 'flex md:flex'}`}>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent" onClick={() => handleComingSoon("Projects")}>
            Projects
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent-foreground hover:bg-accent/20" onClick={onOpenTemplateSelector}>
            <BookMarked className="mr-1.5 h-4 w-4"/> Templates
          </Button>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent-foreground hover:bg-accent/20">
                <Eye className="mr-1.5 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Toggle Panels</DropdownMenuLabel>
              {desktopPanelToggleItems.map(item => (
                 <DropdownMenuCheckboxItem
                    key={item.panel}
                    checked={panelVisibility[item.panel]}
                    onCheckedChange={() => togglePanel(item.panel)}
                    className="cursor-pointer"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent" onClick={() => handleComingSoon("Documentation")}>
            Docs
          </Button>
        </nav>
      </div>

      <div className={`flex flex-1 items-center justify-center px-1 sm:px-2 md:px-4 transition-opacity duration-300 ${showAiForm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="w-full max-w-xl">
         <AiFlowGeneratorForm onFlowGenerated={onFlowGenerated} addConsoleMessage={addConsoleMessage} />
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-3">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent" title="Command Palette" onClick={() => handleComingSoon("Command Palette")}>
          <Search className="h-5 w-5" />
          <span className="sr-only">Command Palette</span>
        </Button>
        {!isMobile && (
          <>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent" title="Agent Context" onClick={() => handleComingSoon("Agent Context")}>
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Agent Context</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent" title="Settings" onClick={() => handleComingSoon("Settings")}>
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
