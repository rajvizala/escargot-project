'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Card, Tone } from '@/types/card';

interface CardContextValue {
  selectedCard: Card | null;
  setSelectedCard: (card: Card | null) => void;
  message: string;
  setMessage: (msg: string) => void;
  tone: Tone;
  setTone: (tone: Tone) => void;
}

const CardContext = createContext<CardContextValue | null>(null);

export function CardContextProvider({ children }: { children: ReactNode }) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<Tone>('sincere');

  return (
    <CardContext.Provider
      value={{ selectedCard, setSelectedCard, message, setMessage, tone, setTone }}
    >
      {children}
    </CardContext.Provider>
  );
}

export function useCardContext() {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error('useCardContext must be used within CardContextProvider');
  return ctx;
}
