'use client';

import { Tone } from '@/types/card';
import styles from './ToneSelector.module.css';

const tones: { label: string; value: Tone }[] = [
  { label: 'Funny', value: 'funny' },
  { label: 'Sincere', value: 'sincere' },
  { label: 'Sarcastic', value: 'sarcastic' },
];

interface ToneSelectorProps {
  active: Tone;
  onChange: (tone: Tone) => void;
}

export function ToneSelector({ active, onChange }: ToneSelectorProps) {
  return (
    <div className={styles.row} role="radiogroup" aria-label="Message tone">
      {tones.map((t) => (
        <button
          key={t.value}
          role="radio"
          aria-checked={active === t.value}
          className={`${styles.pill} ${active === t.value ? styles.active : ''}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
