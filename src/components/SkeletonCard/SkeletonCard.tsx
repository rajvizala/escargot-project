import styles from './SkeletonCard.module.css';

export function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.image} />
      <div className={styles.info}>
        <div className={styles.line} style={{ width: '60%' }} />
        <div className={styles.pill} />
      </div>
    </div>
  );
}
