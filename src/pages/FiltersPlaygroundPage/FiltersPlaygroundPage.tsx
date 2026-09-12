import { useState } from 'react'

import { ListCitiesFilter } from '@/features/cities-filter'
import { ListSkillsFilter } from '@/features/skills-filter'
import { RadioGroup } from '@/shared/ui/RadioGroup'

import styles from './FiltersPlaygroundPage.module.css'

const MODE_OPTIONS = [
  { value: 'all', title: 'Всё' },
  { value: 'learn', title: 'Хочу научиться' },
  { value: 'teach', title: 'Могу научить' },
]

const GENDER_OPTIONS = [
  { value: 'any', title: 'Не имеет значения' },
  { value: 'male', title: 'Мужской' },
  { value: 'female', title: 'Женский' },
]

export default function FiltersPlaygroundPage() {
  const [mode, setMode] = useState('all')
  const [gender, setGender] = useState('any')
  const [skills, setSkills] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  return (
    <div className={styles.page}>
      <aside className={styles.panel}>
        <h2 className={styles.panelTitle}>Фильтры</h2>

        <RadioGroup
          name="playground-mode"
          options={MODE_OPTIONS}
          selectedOptionValue={mode}
          onChange={(event) => setMode(event.target.value)}
        />

        <ListSkillsFilter value={skills} onChange={setSkills} />

        <RadioGroup
          name="playground-gender"
          title="Пол автора"
          options={GENDER_OPTIONS}
          selectedOptionValue={gender}
          onChange={(event) => setGender(event.target.value)}
        />

        <ListCitiesFilter value={cities} onChange={setCities} />
      </aside>

      <section className={styles.inspector}>
        <h2 className={styles.inspectorTitle}>Состояние фильтров</h2>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Режим</h3>
          <p className={styles.value}>{mode}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Навыки — выбрано: {skills.length}</h3>
          <p className={styles.value}>{JSON.stringify(skills, null, 2)}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Пол автора</h3>
          <p className={styles.value}>{gender}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Города — выбрано: {cities.length}</h3>
          <p className={styles.value}>{JSON.stringify(cities, null, 2)}</p>
        </div>

        <ul className={styles.notes}>
          <li>Оба списка — один и тот же FilterList: одинаковый вид, одинаковый контракт.</li>
          <li>Выбор в обоих хранится идентификаторами листьев.</li>
          <li>
            «Все категории» не отрисована: категорий шесть из шести, прятать нечего. У городов
            кнопка есть — из пятнадцати показаны пять.
          </li>
        </ul>
      </section>
    </div>
  )
}
