'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card } from '@/types/card';
import { useCardContext } from '@/context/CardContext';
import styles from './CardTile.module.css';

interface CardTileProps {
  card: Card;
}

export function CardTile({ card }: CardTileProps) {
  const router = useRouter();
  const { setSelectedCard } = useCardContext();

  const handleClick = async () => {
    setSelectedCard(card);

    // Fire analytics event (non-blocking)
    fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: card.id }),
    }).catch(() => {
      // Analytics failure is non-critical
    });

    router.push(`/card/${card.id}`);
  };

  return (
    <button className={styles.tile} onClick={handleClick} aria-label={`View ${card.title} by ${card.artist}`}>
      <div className={styles.imageWrapper}>
        <Image
          src={card.imageUrl}
          alt={card.alt}
          width={320}
          height={440}
          loading="lazy"
          className={styles.image}
        />
        {card.isRemixable && (
          <span className={styles.remixBadge} aria-label="Remixable with AI">
            ✦
          </span>
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.artist}>{card.artist}</span>
        <span className={`${styles.occasionPill} ${styles[card.occasion]}`}>
          {card.occasion}
        </span>
      </div>
    </button>
  );
}
