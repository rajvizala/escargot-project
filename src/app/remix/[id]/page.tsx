'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cards } from '@/data/cards';
import { useCardContext } from '@/context/CardContext';
import { useRemixContext } from '@/context/RemixContext';
import { Button } from '@/components/Button/Button';
import { RemixLoader } from '@/components/RemixLoader/RemixLoader';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider/BeforeAfterSlider';
import styles from './page.module.css';

const promptChips = [
  'Make it two grooms',
  'Add a wheelchair',
  'Change the dog to a cat',
  'Add Armed Forces tribute',
  'Make the couple interracial',
];

export default function RemixPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { selectedCard, setSelectedCard } = useCardContext();
  const { prompt, setPrompt, result, setResult, isProcessing, setIsProcessing } =
    useRemixContext();
  const router = useRouter();
  const [phase, setPhase] = useState<'input' | 'loading' | 'reveal'>('input');
  const [error, setError] = useState<string | null>(null);

  // Resolve params and load card if context is empty
  useEffect(() => {
    params.then(({ id }) => {
      if (!selectedCard || selectedCard.id !== id) {
        const found = cards.find((c) => c.id === id);
        if (found) setSelectedCard(found);
        else router.replace('/browse');
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, setSelectedCard, router]);

  const handleRemix = async () => {
    if (!selectedCard || !prompt.trim()) return;

    setPhase('loading');
    setIsProcessing(true);
    setError(null);

    try {
      const res = await fetch('/api/remix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: selectedCard.id,
          cardImageUrl: selectedCard.imageUrl,
          prompt: prompt.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Remix failed');
      }

      const data = await res.json();
      setResult(data);
      setPhase('reveal');
    } catch {
      setError('Remix failed — try a different prompt.');
      setPhase('input');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTryAnother = () => {
    setPrompt('');
    setResult(null);
    setPhase('input');
  };

  if (!selectedCard) return null;

  return (
    <div className={styles.page}>
      {/* Loading overlay */}
      {phase === 'loading' && <RemixLoader />}

      {phase === 'reveal' && result ? (
        /* ── Reveal Phase ── */
        <div className={styles.revealSection}>
          <div className={styles.revealCard}>
            <BeforeAfterSlider
              beforeSrc={selectedCard.imageUrl}
              afterSrc={`data:image/png;base64,${result.remixedImage}`}
              beforeAlt={`Original: ${selectedCard.alt}`}
              afterAlt={`Remixed: ${selectedCard.alt}`}
              width={320}
              height={440}
            />
          </div>
          <p className={styles.philosophy}>
            Life is combinatorial. This card is now yours.
          </p>
          <div className={styles.revealActions}>
            <Link href="/confirmation">
              <Button variant="primary" fullWidth>
                Use This Remix
              </Button>
            </Link>
            <Button variant="secondary" fullWidth onClick={handleTryAnother}>
              Try Another Prompt
            </Button>
          </div>
        </div>
      ) : (
        /* ── Input Phase ── */
        <div className={styles.inputSection}>
          {/* Card thumbnail reminder */}
          <div className={styles.thumbnail}>
            <Image
              src={selectedCard.imageUrl}
              alt={selectedCard.alt}
              width={80}
              height={110}
              className={styles.thumbImage}
            />
            <div>
              <p className={styles.thumbTitle}>{selectedCard.title}</p>
              <p className={styles.thumbArtist}>by {selectedCard.artist}</p>
            </div>
          </div>

          {/* Prompt input */}
          <label className={styles.inputLabel} htmlFor="remix-prompt">
            Describe your change
          </label>
          <input
            id="remix-prompt"
            type="text"
            className={styles.promptInput}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Make it two grooms instead of a couple"
          />

          {/* Prompt chips */}
          <div className={styles.chips}>
            {promptChips.map((chip) => (
              <button
                key={chip}
                className={styles.chip}
                onClick={() => setPrompt(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          {/* Remix button */}
          <Button
            variant="primary"
            fullWidth
            onClick={handleRemix}
            disabled={!prompt.trim() || isProcessing}
          >
            Remix →
          </Button>
        </div>
      )}
    </div>
  );
}
