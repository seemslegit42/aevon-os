
"use client";
import React from 'react';
import { cn } from '@/lib/utils';

interface BeepAvatarProps {
    isThinking: boolean;
}

/**
 * A pure CSS-based animated avatar for BEEP.
 * This replaces the previous three.js implementation to resolve
 * persistent build errors related to module resolution.
 */
const BeepAvatar: React.FC<BeepAvatarProps> = ({ isThinking }) => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-transparent p-4">
            <div className={cn('beep-avatar-orb', isThinking && 'thinking')}>
                <div className="beep-avatar-orb-core" />
                <div className="beep-avatar-orb-glow" />
                <div className="beep-avatar-orb-spikes" />
            </div>
        </div>
    );
};

export default BeepAvatar;
