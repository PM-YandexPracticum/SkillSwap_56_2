import { useEffect, useState, type CSSProperties } from 'react'

import styles from './RoundImage.module.css'

interface RoundImageProps {
  src: string | null
  name: string
  size: number
}

function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join('')

  return initials.toLocaleUpperCase('ru-RU') || '?'
}

export const RoundImage = ({ src, name, size }: RoundImageProps) => {
  const [isImageFailed, setIsImageFailed] = useState(false)
  const showImage = Boolean(src) && !isImageFailed
  const style = { '--round-image-size': `${size}px` } as CSSProperties

  useEffect(() => {
    setIsImageFailed(false)
  }, [src])

  return (
    <div className={styles.root} style={style} aria-label={name}>
      {showImage ? (
        <img
          className={styles.image}
          src={src ?? undefined}
          alt={name}
          onError={() => setIsImageFailed(true)}
        />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {getInitials(name)}
        </span>
      )}
    </div>
  )
}
