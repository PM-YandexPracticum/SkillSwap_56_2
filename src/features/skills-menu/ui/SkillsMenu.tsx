import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import { CardAreaSkill } from '@/entities/skill'
import { ArrowButton } from '@/shared/ui/ArrowButton'
import book from '@/shared/ui/icons/assets/book.svg'
import briefcase from '@/shared/ui/icons/assets/briefcase.svg'
import global from '@/shared/ui/icons/assets/global.svg'
import home from '@/shared/ui/icons/assets/home.svg'
import lifestyle from '@/shared/ui/icons/assets/lifestyle.svg'
import palette from '@/shared/ui/icons/assets/palette.svg'

import { useSkillCategories } from '../model/useSkillCategories'

import styles from './SkillsMenu.module.css'

const iconMap: Record<string, string> = {
  'business-career': briefcase,
  'creativity-art': palette,
  'foreign-languages': global,
  'education-development': book,
  'home-comfort': home,
  'health-lifestyle': lifestyle,
}

const bgMap: Record<string, string> = {
  'business-career': 'var(--tag-bg-lilac)',
  'creativity-art': 'var(--tag-bg-pink)',
  'foreign-languages': 'var(--tag-bg-yellow)',
  'education-development': 'var(--tag-bg-blue)',
  'home-comfort': 'var(--tag-bg-beige)',
  'health-lifestyle': 'var(--tag-bg-mint)',
}

export const SkillsMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { categories, status } = useSkillCategories()
  const menuRef = useRef<HTMLDivElement>(null)

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={menuRef} className={styles.wrapper}>
      <ArrowButton isOpen={isOpen} onClick={handleToggle} variant="ghost">
        Все навыки
      </ArrowButton>

      <div data-testid="menu" className={clsx(styles.skillsMenu, isOpen && styles.open)}>
        {status && <p className={styles.status}>{status}</p>}
        {categories.map((category) => (
          <CardAreaSkill
            key={category.id}
            title={category.title}
            skills={category.skills.map((item) => item.title)}
            bgColor={bgMap[category.id]}
            icon={<img src={iconMap[category.id]} alt={category.title} />}
          />
        ))}
      </div>
    </div>
  )
}
