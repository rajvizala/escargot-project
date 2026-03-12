'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cards } from '@/data/cards';
import { useCardContext } from '@/context/CardContext';
import { ToneSelector } from '@/components/ToneSelector/ToneSelector';
import { Button } from '@/components/Button/Button';
import { Tone } from '@/types/card';
import styles from './page.module.css';

const placeholders: Record<Tone, string> = {
  funny:
    'Congrats on surviving another trip around the sun. The bar was on the floor and you stepped over it.',
  sincere:
    'Thinking of you today and wishing you nothing but the best. You deserve every good thing coming your way.',
  sarcastic:
    "Oh look, another year older. I'd say you're aging like fine wine but let's be honest — it's more like milk.",
};

export default function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { selectedCard, setSelectedCard, message, setMessage, tone, setTone } =
    useCardContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Resolve params and load card if context is empty (direct navigation)
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

  // Auto-expand textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }, [message]);

  if (!selectedCard) return null;

  return (
    <div className={styles.page}>
      {/* Card image — parallax-style top section */}
      <div className={styles.imageSection}>
        <Image
          src={selectedCard.imageUrl}
          alt={selectedCard.alt}
          fill
          priority
          className={styles.cardImage}
        />
      </div>

      {/* Message area */}
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>Write your message</h2>

        <ToneSelector active={tone} onChange={setTone} />

        <div className={styles.textareaWrapper}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholders[tone]}
            maxLength={500}
            rows={3}
          />
          <div className={styles.textareaFooter}>
            <span className={styles.charCount}>{message.length}/500</span>
            <span className={styles.printNote}>
              Escargot prints this exactly as written
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          {selectedCard.isRemixable ? (
            <Link href={`/remix/${selectedCard.id}`}>
              <Button variant="primary" fullWidth>
                Remix This Card →
              </Button>
            </Link>
          ) : (
            <Button
              variant="primary"
              fullWidth
              disabled
              title="This artist hasn't enabled remixing yet"
            >
              Remix This Card →
            </Button>
          )}

          <Link href="/confirmation">
            <Button variant="secondary" fullWidth>
              Send As-Is →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
