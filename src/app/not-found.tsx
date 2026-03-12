import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '60dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
        Page not found
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', opacity: 0.7 }}>
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--color-green-700)',
          fontWeight: 600,
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
