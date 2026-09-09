import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import UserCircleIcon from '../icons/assets/user-circle.svg?react';
import styles from './RoundImage.module.css';

const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ');

export type RoundImageSize = 'sm' | 'smd' | 'md' | 'lg' | 'xl';

interface RoundImageProps {
  src?: string | null;
  icon?: ReactNode;
  bgColor?: string;
  alt: string;
  size?: RoundImageSize;
  className?: string;
}

export const RoundImage = ({
  src,
  icon,
  bgColor,
  alt,
  size = 'md',
  className
}: RoundImageProps) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

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
          {icon ? icon : <UserCircleIcon className={styles.fallbackIcon} />}
        </div>
      )}
    </div>
  );
};
