import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loadUsers } from '@/entities/user/model/usersSlice'
import { CardMain } from '@/widgets/CardMain'
import { CardSkillOffer } from '@/widgets/CardSkillOffer'
import { SectionCards } from '@/widgets/SectionCards'
import type { GalleryImage } from '@/shared/ui/Gallery'

import styles from './SkillPage.module.css'

const SKELETON_COUNT = 3
const SIMILAR_LIMIT = 3

/** Заглушка галереи — пока нет реальных фото в сторе */
const MOCK_GALLERY: GalleryImage[] = [
  { src: '/skills/skill-1.avif', alt: 'Фото 1' },
  { src: '/skills/skill-2.avif', alt: 'Фото 2' },
  { src: '/skills/skill-3.avif', alt: 'Фото 3' },
  { src: '/skills/skill-4.avif', alt: 'Фото 4' },
  { src: '/skills/skill-5.avif', alt: 'Фото 5' },
  { src: '/skills/skill-6.avif', alt: 'Фото 6' },
  { src: '/skills/skill-7.avif', alt: 'Фото 7' },
]

export default function SkillPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()

  const users = useAppSelector((state) => state.users.users)
  const status = useAppSelector((state) => state.users.status)
  const error = useAppSelector((state) => state.users.error)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadUsers())
    }
  }, [dispatch, status])

  const user = users.find((u) => u.id === id)

  if (status === 'idle' || status === 'loading') {
    return (
      <div className={styles.page}>
        <SectionCards title="Загрузка…" users={[]} status="loading" skeletonCount={1} />
        <SectionCards
          title="Похожие предложения"
          users={[]}
          status="loading"
          skeletonCount={SKELETON_COUNT}
        />
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className={styles.page}>
        <SectionCards
          title="Ошибка"
          users={[]}
          status="failed"
          errorMessage={error ?? 'Не удалось загрузить пользователей'}
        />
      </div>
    )
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>Пользователь не найден</p>
      </div>
    )
  }

  const similarUsers = users
    .filter((u) => u.id !== user.id && u.teachSkill.category === user.teachSkill.category)
    .slice(0, SIMILAR_LIMIT)

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <CardMain user={user} />

        <CardSkillOffer
          title={user.teachSkill.title}
          category={user.teachSkill.category}
          subcategory={user.teachSkill.title}
          description={`Привет! Меня зовут ${user.name}. С радостью поделюсь знаниями по навыку «${user.teachSkill.title}». Пиши — договоримся об обмене!`}
          images={MOCK_GALLERY}
        />
      </div>

      <SectionCards title="Похожие предложения" users={similarUsers} status="succeeded" />
    </div>
  )
}
