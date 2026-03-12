'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './BeforeAfterSlider.module.css';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  width: number;
  height: number;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  width,
  height,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [toggled, setToggled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Mobile tap-to-toggle
  const handleTap = () => {
    if (isDragging) return;
    if (window.matchMedia('(max-width: 767px)').matches) {
      setToggled((prev) => !prev);
      setPosition(toggled ? 50 : 0);
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ aspectRatio: `${width}/${height}` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleTap}
      role="img"
      aria-label={`Before and after comparison: ${beforeAlt} vs ${afterAlt}`}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={afterSrc}
          alt={afterAlt}
          width={width}
          height={height}
          className={styles.image}
        />
      </div>
      <div
        className={styles.imageWrapper}
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          width={width}
          height={height}
          className={styles.image}
        />
      </div>
      <div className={styles.divider} style={{ left: `${position}%` }}>
        <div className={styles.handle} />
      </div>
      <span className={styles.label} style={{ left: '8px' }}>
        Before
      </span>
      <span className={styles.label} style={{ right: '8px' }}>
        After
      </span>
    </div>
  );
}
