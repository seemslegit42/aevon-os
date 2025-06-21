// src/components/icons/LoaderIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';
import { RefreshCwIcon } from './RefreshCwIcon';
import { cn } from '@/lib/utils';

export const LoaderIcon: React.FC<IconProps> = ({ className, ...props }) => (
    <RefreshCwIcon className={cn('animate-spin', className)} {...props} />
);
