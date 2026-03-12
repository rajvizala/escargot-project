'use client';

import Link from 'next/link';
import { useCardContext } from '@/context/CardContext';
import { useRemixContext } from '@/context/RemixContext';
import { Button } from '@/components/Button/Button';
import { DeliveryTimeline } from '@/components/DeliveryTimeline/DeliveryTimeline';
import styles from './page.module.css';

export default function ConfirmationPage() {
  const { selectedCard } = useCardContext();
  const { result } = useRemixContext();

  const downloadRemix = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${result.remixedImage}`;
    link.download = `escargot-remix-${selectedCard?.id ?? 'card'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.page}>
      {/* Animated envelope */}
      <div className={styles.envelopeWrapper}>
        <svg
          className={styles.envelope}
          viewBox="0 0 120 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Envelope floating upward"
        >
          <rect x="10" y="25" width="100" height="65" rx="6" fill="#E8F4EC" stroke="#1B5E37" strokeWidth="2" />
          <path d="M10 31 l50 32 l50-32" stroke="#1B5E37" strokeWidth="2" fill="none" />
          <path d="M10 90 l35-25" stroke="#1B5E37" strokeWidth="1.5" />
          <path d="M110 90 l-35-25" stroke="#1B5E37" strokeWidth="1.5" />
        </svg>
      </div>

      <h1 className={styles.heading}>You&apos;re all set!</h1>

      <p className={styles.copy}>
        In the real Escargot app, this is where the magic happens — they print it,
        stamp it, and mail it for you. This is a prototype, so imagine the warm
        fuzzy feeling of knowing a real card is on its way.
      </p>

      {/* Simulated delivery timeline */}
      <DeliveryTimeline />

      {/* Actions */}
      <div className={styles.actions}>
        {result && (
          <Button variant="primary" fullWidth onClick={downloadRemix}>
            Download your remix
          </Button>
        )}
        <Link href="/browse">
          <Button variant="secondary" fullWidth>
            Browse more cards
          </Button>
        </Link>
      </div>
    </div>
  );
}
