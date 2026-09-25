import type { GalleryImage } from '@/shared/ui/Gallery'

const GALLERY_SIZE = 7
const IMAGE_SIZE = 800

/** Палитра: фон + цвет текста. */
const PALETTE: Array<{ bg: string; fg: string }> = [
  { bg: '#e7f2f6', fg: '#3b6b8a' },
  { bg: '#f7e7f2', fg: '#8a3b6b' },
  { bg: '#ebe5c5', fg: '#8a7a3b' },
  { bg: '#e9f7e7', fg: '#3b8a5a' },
  { bg: '#eee7f7', fg: '#6b3b8a' },
  { bg: '#f7ebe5', fg: '#8a5a3b' },
  { bg: '#e8ecf7', fg: '#3b5a8a' },
]

/** Стабильный хеш из строки, чтобы один и тот же навык всегда получал одни цвета */
const hashString = (value: string) =>
  [...value].reduce((acc, char) => acc + char.charCodeAt(0), 0)

/** Генерирует SVG-картинку */
const createPlaceholder = (label: string, bg: string, fg: string) => {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${IMAGE_SIZE} ${IMAGE_SIZE}">`,
    `<rect width="${IMAGE_SIZE}" height="${IMAGE_SIZE}" fill="${bg}"/>`,
    `<circle cx="${IMAGE_SIZE / 2}" cy="${IMAGE_SIZE / 2}" r="${IMAGE_SIZE * 0.35}" fill="${fg}" opacity="0.14"/>`,
    `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="${IMAGE_SIZE * 0.38}" fill="${fg}">${label}</text>`,
    `</svg>`,
  ].join('')

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * Возвращает галерею из 7 уникальных картинок для конкретного навыка.
 * Каждый навык (skillId) получает свой набор цветов.
 */
export const getSkillGallery = (skillId: string, skillTitle: string): GalleryImage[] => {
  const base = hashString(skillId)

  return Array.from({ length: GALLERY_SIZE }, (_, index) => {
    const palette = PALETTE[(base + index) % PALETTE.length]

    return {
      src: createPlaceholder(String(index + 1), palette.bg, palette.fg),
      alt: `${skillTitle} — фото ${index + 1}`,
    }
  })
}
