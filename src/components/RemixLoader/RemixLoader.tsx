'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './RemixLoader.module.css';

const messages = [
  'Reading the artwork...',
  'Understanding the style...',
  'Applying your changes...',
  'Almost there...',
];

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        left: `${10 + Math.random() * 80}%`,
        animationDelay: `${Math.random() * 4}s`,
        animationDuration: `${3 + Math.random() * 3}s`,
        width: `${4 + Math.random() * 4}px`,
        height: `${4 + Math.random() * 4}px`,
        opacity: 0.4 + Math.random() * 0.4,
      })),
    [],
  );

  return (
    <div className={styles.particles}>
      {particles.map((style, i) => (
        <span key={i} className={styles.particle} style={style} />
      ))}
    </div>
  );
}

export function RemixLoader() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.overlay}>
      {/* Particles */}
      <Particles />

      {/* Cycling text */}
      <p className={styles.message} key={msgIndex}>
        {messages[msgIndex]}
      </p>
    </div>
  );
}
