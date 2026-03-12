'use client';

import { useEffect, useState } from 'react';
import styles from './DeliveryTimeline.module.css';

const steps = [
  { label: 'Printed', day: 'Day 1', icon: 'P' },
  { label: 'Mailed', day: 'Day 3', icon: 'M' },
  { label: 'Delivered', day: 'Day 5', icon: 'D' },
];

export function DeliveryTimeline() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    steps.forEach((_, i) => {
      setTimeout(() => setVisibleCount(i + 1), 800 + i * 400);
    });
  }, []);

  return (
    <div className={styles.timeline}>
      {steps.map((step, i) => (
        <div
          key={step.label}
          className={`${styles.step} ${i < visibleCount ? styles.visible : ''}`}
        >
          <div className={styles.iconCircle}>
            <span className={styles.icon}>{step.icon}</span>
            {i < visibleCount && <span className={styles.check}>✓</span>}
          </div>
          <div className={styles.text}>
            <span className={styles.label}>{step.label}</span>
            <span className={styles.day}>{step.day}</span>
          </div>
          {i < steps.length - 1 && <div className={styles.connector} />}
        </div>
      ))}
    </div>
  );
}
