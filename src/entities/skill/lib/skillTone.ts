import type { TagTone } from '@/shared/ui/Tag'

const CATEGORY_TONES: Record<string, TagTone> = {
  'Бизнес и карьера': 'blue',
  'Творчество и искусство': 'pink',
  'Иностранные языки': 'lilac',
  'Образование и развитие': 'yellow',
  'Дом и уют': 'beige',
  'Здоровье и лайфстайл': 'mint',
}

export const getSkillTone = (category: string): TagTone => CATEGORY_TONES[category] ?? 'neutral'
