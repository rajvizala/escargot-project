'use client';

import { Occasion } from '@/types/card';
import styles from './FilterBar.module.css';

const occasions: { label: string; value: Occasion | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Birthday', value: 'birthday' },
  { label: 'Sympathy', value: 'sympathy' },
  { label: 'Congrats', value: 'congrats' },
  { label: 'Friendship', value: 'friendship' },
  { label: 'Funny', value: 'funny' },
  { label: 'Love', value: 'love' },
];

interface FilterBarProps {
  active: Occasion | 'all';
  onChange: (value: Occasion | 'all') => void;
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <nav className={styles.bar} aria-label="Filter cards by occasion">
      {occasions.map((o) => (
        <button
          key={o.value}
          className={`${styles.pill} ${active === o.value ? styles.active : ''}`}
          onClick={() => onChange(o.value)}
          aria-pressed={active === o.value}
        >
          {o.label}
        </button>
      ))}
    </nav>
  );
}
