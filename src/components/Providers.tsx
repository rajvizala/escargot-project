'use client';

import { ReactNode } from 'react';
import { CardContextProvider } from '@/context/CardContext';
import { RemixContextProvider } from '@/context/RemixContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CardContextProvider>
      <RemixContextProvider>{children}</RemixContextProvider>
    </CardContextProvider>
  );
}
