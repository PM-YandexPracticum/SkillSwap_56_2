import { useState } from 'react';
import styles from './RoundImage.module.css';

const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ');

interface RoundImageProps {
  src?: string | null;
  icon?: React.ReactNode;
  bgColor?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RoundImage = ({
  src,
  icon,
  bgColor,
  alt = '',
  size = 'md',
  className
}: RoundImageProps) => {
  const [hasError, setHasError] = useState(false);

  const showImage = src && !hasError;

  return (
    <div
      className={cn(styles.container, styles[size], className)}
      style={!showImage ? { backgroundColor: bgColor || 'var(--color-bg-secondary)' } : undefined}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className={styles.image}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className={styles.iconWrapper}>
          {/* Если иконка передана, показываем её, иначе дефолтный SVG */}
          {icon ? (
            icon
          ) : (
            <svg
              className={styles.fallbackIcon}
              width="50%"
              height="50%"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};
