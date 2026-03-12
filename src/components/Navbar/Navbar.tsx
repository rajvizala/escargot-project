import Link from 'next/link';
import styles from './Navbar.module.css';

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.brand}>
        <svg className={styles.icon} viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <circle cx="16" cy="20" r="10" fill="var(--color-brand)" opacity="0.15" />
          <path
            d="M16 10c-4 0-7 3-7 7 0 3 2.5 5 5 5h4c2.5 0 5-2 5-5 0-4-3-7-7-7Z"
            stroke="var(--color-brand)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M13 12c-1-3-4-4-6-3"
            stroke="var(--color-brand)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M19 12c1-3 4-4 6-3"
            stroke="var(--color-brand)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Escargot
      </Link>
    </nav>
  );
}
