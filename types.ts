// Fix: Import `ReactElement` to resolve the "Cannot find namespace 'JSX'" error.
import type { ReactElement } from 'react';

export interface Skill {
  name: string;
  icon: ReactElement;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  liveUrl?: string;
  sourceUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: number;
}