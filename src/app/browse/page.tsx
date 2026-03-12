'use client';

import { useState, useEffect } from 'react';
import { cards } from '@/data/cards';
import { Occasion } from '@/types/card';
import { FilterBar } from '@/components/FilterBar/FilterBar';
import { CardTile } from '@/components/CardTile/CardTile';
import { SkeletonCard } from '@/components/SkeletonCard/SkeletonCard';
import styles from './page.module.css';

export default function BrowsePage() {
  const [filter, setFilter] = useState<Occasion | 'all'>('all');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate brief loading to show skeleton loaders
    const timer = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = filter === 'all' ? cards : cards.filter((c) => c.occasion === filter);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Browse Cards</h1>
        <p className={styles.subtitle}>
          Hand-picked from artists you already love — find the one that fits.
        </p>
      </header>

      <div className={styles.filterWrapper}>
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      <div className={styles.grid}>
        {!loaded
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((card) => <CardTile key={card.id} card={card} />)}
      </div>
    </div>
  );
}
