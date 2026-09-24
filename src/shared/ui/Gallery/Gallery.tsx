import { useCallback, useEffect, useMemo, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import ChevronRightIcon from '@/shared/ui/icons/assets/chevron-right.svg?react'

import styles from '@/shared/ui/Gallery/Gallery.module.css'

export type GalleryImage = {
  src: string
  alt: string
}

export interface GalleryProps {
  images: GalleryImage[]
  previewCount?: number
  className?: string
}

export const Gallery = ({ images, previewCount = 3, className = '' }: GalleryProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const galleryClassName = [styles.gallery, className].filter(Boolean).join(' ')

  const handleSelect = useCallback(() => {
    if (!emblaApi) {
      return
    }

    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) {
      return
    }

    handleSelect()
    emblaApi.on('select', handleSelect)
    emblaApi.on('reInit', handleSelect)

    return () => {
      emblaApi.off('select', handleSelect)
      emblaApi.off('reInit', handleSelect)
    }
  }, [emblaApi, handleSelect])

  const previews = useMemo(() => {
    if (images.length <= 1) {
      return []
    }

    const count = Math.min(previewCount, images.length - 1)

    return Array.from({ length: count }, (_, offset) => {
      const imageIndex = (selectedIndex + offset + 1) % images.length

      return {
        image: images[imageIndex],
        imageIndex,
      }
    })
  }, [images, previewCount, selectedIndex])

  const hiddenImagesCount = Math.max(images.length - previews.length - 1, 0)

  if (images.length === 0) {
    return null
  }

  return (
    <div className={galleryClassName}>
      <div className={styles.main}>
        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.slides}>
            {images.map((image, index) => (
              <div className={styles.slide} key={`${image.src}-${index}`}>
                <img className={styles.mainImage} src={image.src} alt={image.alt} />
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              className={`${styles.arrowButton} ${styles.arrowButtonLeft}`}
              type="button"
              aria-label="Предыдущее фото"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronRightIcon className={styles.arrowLeft} aria-hidden="true" />
            </button>
            <button
              className={`${styles.arrowButton} ${styles.arrowButtonRight}`}
              type="button"
              aria-label="Следующее фото"
              onClick={() => emblaApi?.scrollNext()}
            >
              <ChevronRightIcon aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {previews.length > 0 && (
        <div className={styles.previews} aria-label="Превью фотографий">
          {previews.map(({ image, imageIndex }, previewIndex) => {
            const showCounter = previewIndex === previews.length - 1 && hiddenImagesCount > 0

            return (
              <button
                className={styles.previewButton}
                type="button"
                key={`${image.src}-${imageIndex}`}
                aria-label={`Показать фото ${imageIndex + 1}`}
                onClick={() => emblaApi?.scrollTo(imageIndex)}
              >
                <img className={styles.previewImage} src={image.src} alt="" aria-hidden="true" />
                {showCounter && <span className={styles.counter}>+{hiddenImagesCount}</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
