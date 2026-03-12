'use client';

import { Button } from '@/components/Button/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '60dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
        Something went wrong
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', opacity: 0.7 }}>
        {error.message || 'An unexpected error occurred.'}
      </p>
      <Button variant="primary" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
