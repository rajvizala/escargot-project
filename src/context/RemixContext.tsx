'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { RemixResult } from '@/types/card';

interface RemixContextValue {
  prompt: string;
  setPrompt: (p: string) => void;
  result: RemixResult | null;
  setResult: (r: RemixResult | null) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

const RemixContext = createContext<RemixContextValue | null>(null);

export function RemixContextProvider({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<RemixResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <RemixContext.Provider
      value={{ prompt, setPrompt, result, setResult, isProcessing, setIsProcessing }}
    >
      {children}
    </RemixContext.Provider>
  );
}

export function useRemixContext() {
  const ctx = useContext(RemixContext);
  if (!ctx) throw new Error('useRemixContext must be used within RemixContextProvider');
  return ctx;
}
