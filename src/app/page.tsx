import Link from 'next/link';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider/BeforeAfterSlider';
import { Button } from '@/components/Button/Button';
import styles from './page.module.css';

const examples = [
  {
    before: '/examples/couple-before.png',
    after: '/examples/couple-after.png',
    beforeAlt: 'A generic couple greeting card',
    afterAlt: 'The same card remixed to show two grooms',
    caption: 'Generic couple → Two grooms',
  },
  {
    before: '/examples/dog-before.png',
    after: '/examples/dog-after.png',
    beforeAlt: 'A birthday card featuring a dog',
    afterAlt: 'The same card remixed to feature a cat',
    caption: 'Birthday dog → Birthday cat',
  },
  {
    before: '/examples/generic-before.png',
    after: '/examples/generic-after.png',
    beforeAlt: 'A generic greeting card',
    afterAlt: 'The same card remixed with an Armed Forces tribute',
    caption: 'Generic card → Armed Forces tribute',
  },
];

export default function SplashPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        {/* Snail SVG mark */}
        <svg
          className={styles.snailMark}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Escargot snail mark"
        >
          <circle cx="60" cy="60" r="56" stroke="#1B5E37" strokeWidth="3" fill="#E8F4EC" />
          <path
            d="M38 72c0-16 12-30 28-30s24 10 24 22-8 18-16 18-12-4-12-10 4-8 8-8"
            stroke="#1B5E37"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="36" cy="55" r="3" fill="#1B5E37" />
          <path
            d="M26 72c8 0 12-2 12-2"
            stroke="#1B5E37"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M30 56c-4-8-2-16-2-16"
            stroke="#1B5E37"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M36 56c-2-10 1-18 1-18"
            stroke="#1B5E37"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="28" cy="38" r="2.5" fill="#1B5E37" />
          <circle cx="37" cy="36" r="2.5" fill="#1B5E37" />
        </svg>

        <h1 className={styles.tagline}>Real mail. Ridiculously easy.</h1>

        <p className={styles.contextCopy}>
          Escargot makes sending real, physical cards as easy as texting — but their
          app is iOS only. This prototype brings the experience to Android and the
          web, including the AI-powered Remix feature that lets you personalise any
          card in seconds.
        </p>

        <Link href="/browse">
          <Button variant="primary" className={styles.ctaButton}>
            Browse Cards →
          </Button>
        </Link>
      </section>

      {/* Below the fold — Remix examples */}
      <section className={styles.examples}>
        <h2 className={styles.examplesTitle}>See what Remix can do</h2>
        <div className={styles.examplesGrid}>
          {examples.map((ex) => (
            <div key={ex.caption}>
              <BeforeAfterSlider
                beforeSrc={ex.before}
                afterSrc={ex.after}
                beforeAlt={ex.beforeAlt}
                afterAlt={ex.afterAlt}
                width={320}
                height={440}
              />
              <p className={styles.exampleCaption}>{ex.caption}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
