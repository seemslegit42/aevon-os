import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateNodeId = (type: string, title: string, index: number | string): string => {
  const cleanedTitle = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `${type}-${cleanedTitle.slice(0, 15)}-${index}`;
};
