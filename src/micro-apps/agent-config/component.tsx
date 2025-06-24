
"use client";

import React from 'react';
import { useAgentConfigStore, type HumorFrequency } from '@/stores/agent-config.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { shallow } from 'zustand/shallow';

const AgentConfigComponent: React.FC = () => {
    const { isHumorEnabled, humorFrequency, setIsHumorEnabled, setHumorFrequency } = useAgentConfigStore(
        (state) => ({
            isHumorEnabled: state.isHumorEnabled,
            humorFrequency: state.humorFrequency,
            setIsHumorEnabled: state.setIsHumorEnabled,
            setHumorFrequency: state.setHumorFrequency,
        }),
        shallow
    );

    return (
        <div className="p-2 space-y-4 h-full">
            <Card className="glassmorphism-panel h-full">
                <CardHeader>
                    <CardTitle className="font-headline text-primary">BEEP Configuration</CardTitle>
                    <CardDescription>Adjust the personality and behavior of your AI assistant.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4 p-4 border border-border/40 rounded-lg">
                        <h4 className="font-semibold text-foreground">Humor Module</h4>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="humor-switch">Enable Deadpan Humor</Label>
                            <Switch
                                id="humor-switch"
                                checked={isHumorEnabled}
                                onCheckedChange={setIsHumorEnabled}
                            />
                        </div>
                        <div className="space-y-2">
                             <Label>Quip Frequency</Label>
                             <RadioGroup
                                value={humorFrequency}
                                onValueChange={(value: HumorFrequency) => setHumorFrequency(value)}
                                className="flex space-x-4"
                                disabled={!isHumorEnabled}
                             >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="low" id="freq-low" />
                                    <Label htmlFor="freq-low">Low</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="medium" id="freq-medium" />
                                    <Label htmlFor="freq-medium">Medium</Label>
                                </div>
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="high" id="freq-high" />
                                    <Label htmlFor="freq-high">High</Label>
                                </div>
                             </RadioGroup>
                             <p className="text-xs text-muted-foreground">Adjust how often BEEP interjects with dry humor.</p>
                        </div>
                    </div>

                    <div className="space-y-4 p-4 border border-dashed border-border/40 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">More advanced personality tuning options are coming soon.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AgentConfigComponent;
