
"use client";

import React from 'react';
import { useActionRequestStore } from '@/stores/action-request.store';
import { shallow } from 'zustand/shallow';
import { useBeepChatStore } from '@/stores/beep-chat.store';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldQuestion, HelpCircle, MessageSquare, Check, X, Edit3, SendHorizonal } from 'lucide-react';
import type { ActionRequest } from '@/types/loom';


const requestTypeIcons: Record<ActionRequest['requestType'], React.ReactNode> = {
  permission: <ShieldQuestion className="h-4 w-4 text-yellow-400 mr-2 shrink-0" />,
  input: <Edit3 className="h-4 w-4 text-blue-400 mr-2 shrink-0" />,
  clarification: <MessageSquare className="h-4 w-4 text-purple-400 mr-2 shrink-0" />,
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const ActionConsoleCard: React.FC = () => {
    const { requests, resolveActionRequest } = useActionRequestStore(state => ({
        requests: state.requests,
        resolveActionRequest: state.resolveActionRequest,
    }), shallow);

    const { append: beepAppend } = useBeepChatStore.getState();
    const { toast } = useToast();
    const [inputValue, setInputValue] = React.useState<Record<string, string>>({});

    const handleInputChange = (requestId: string, value: string) => {
        setInputValue(prev => ({ ...prev, [requestId]: value }));
    };

    const handleRespond = (requestId: string, responseStatus: 'approved' | 'denied' | 'responded', details?: string) => {
        let userResponseText = `User response for request ${requestId}: ${responseStatus}.`;
        if (responseStatus === 'responded' && details) {
            userResponseText += ` Details: "${details}"`;
        }
        
        beepAppend({ role: 'user', content: userResponseText });
        resolveActionRequest(requestId, responseStatus, details);
        
        toast({ title: 'Response Sent', description: `Your response '${responseStatus}' has been sent to the agent.` });

        if (responseStatus === 'responded') {
            setInputValue(prev => {
                const newState = {...prev};
                delete newState[requestId];
                return newState;
            });
        }
    };
    
    const handleSubmitInput = (request: ActionRequest) => {
        const details = inputValue[request.id] || '';
        handleRespond(request.id, 'responded', details);
    };

    const pendingRequests = requests.filter(r => r.status === 'pending');

    return (
        <ScrollArea className="h-full">
            <div className="p-4">
                {pendingRequests.length === 0 ? (
                    <div className="text-xs text-center py-6 text-muted-foreground h-full flex flex-col justify-center items-center">
                        <ShieldQuestion className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        No pending actions from agents.
                    </div>
                ) : (
                    <ul className="space-y-3">
                    {pendingRequests.map((req) => (
                        <li key={req.id} className="text-xs p-3 rounded-lg bg-card/70 border border-border/40 shadow-sm">
                        <div className="flex items-start justify-between mb-1.5">
                            <div className="flex items-center">
                            {requestTypeIcons[req.requestType] || <HelpCircle className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />}
                            <span className="font-semibold text-foreground/90">{req.agentName}</span>
                            </div>
                            <span className="text-muted-foreground text-[0.7rem]">{formatTime(req.timestamp)}</span>
                        </div>
                        <p className="text-muted-foreground/90 mb-2 text-[0.78rem] leading-snug ml-6">{req.message}</p>
                        
                        <div className="ml-6 flex items-center gap-2">
                            {(req.requestType === 'input' || (req.requestType === 'clarification' && req.requiresInput)) && (
                            <div className="flex items-center gap-2 w-full">
                                <Input
                                type="text"
                                placeholder={req.inputPrompt || "Provide input..."}
                                value={inputValue[req.id] || ''}
                                onChange={(e) => handleInputChange(req.id, e.target.value)}
                                className="h-8 text-xs bg-input/70 flex-grow"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && inputValue[req.id]?.trim()) {
                                        e.preventDefault();
                                        handleSubmitInput(req);
                                    }
                                }}
                                />
                                <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8 flex-shrink-0"
                                onClick={() => handleSubmitInput(req)}
                                disabled={!inputValue[req.id]?.trim()}
                                >
                                <SendHorizonal className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                            )}

                            {req.requestType === 'permission' && (
                                <div className="flex w-full items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="default"
                                    className="flex-1 h-7 text-xs bg-green-600/80 hover:bg-green-500/80 text-white"
                                    onClick={() => handleRespond(req.id, 'approved')}
                                >
                                    <Check className="h-3.5 w-3.5 mr-1" /> Approve
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="flex-1 h-7 text-xs"
                                    onClick={() => handleRespond(req.id, 'denied')}
                                >
                                    <X className="h-3.5 w-3.5 mr-1" /> Deny
                                </Button>
                                </div>
                            )}
                        </div>
                        </li>
                    ))}
                    </ul>
                )}
            </div>
        </ScrollArea>
    );
};

export default ActionConsoleCard;
