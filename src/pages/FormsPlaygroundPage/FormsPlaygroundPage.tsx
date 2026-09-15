import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { AvatarUpload, DatePicker, FileUpload, Select, type SelectOption } from '@/shared/ui/form'

import styles from './FormsPlaygroundPage.module.css'

interface PlaygroundForm {
  // Тумблеры стенда лежат в той же форме, чтобы не плодить useState
  disabled: boolean
  required: boolean

  avatar: File | string | null
  city: string
  category: string
  birthDate: string
  images: File[]
}

const CITY_OPTIONS: SelectOption[] = [
  { value: 'moscow', label: 'Москва' },
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'kazan', label: 'Казань' },
  { value: 'novosibirsk', label: 'Новосибирск' },
  { value: 'ekb', label: 'Екатеринбург' },
  { value: 'sochi', label: 'Сочи (disabled-пункт)', disabled: true },
]

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'programming', label: 'Программирование' },
  { value: 'design', label: 'Дизайн' },
  { value: 'languages', label: 'Языки' },
  { value: 'music', label: 'Музыка' },
  { value: 'sport', label: 'Спорт' },
  { value: 'cooking', label: 'Кулинария' },
  { value: 'photo', label: 'Фото и видео' },
  { value: 'business', label: 'Бизнес' },
  { value: 'other', label: 'Другое' },
]

const IMAGE_ACCEPT = {
  'image/jpeg': [],
  'image/png': [],
  'image/webp': [],
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024

const MIN_BIRTH_DATE = new Date(1900, 0, 1)
const MAX_BIRTH_DATE = new Date()

const DEFAULT_VALUES: PlaygroundForm = {
  disabled: false,
  required: false,
  avatar: null,
  city: '',
  category: '',
  birthDate: '',
  images: [],
}

// File не сериализуется в JSON — показываем то, что реально пригодится при отправке
const replacer = (_key: string, value: unknown) => {
  if (value instanceof File) {
    return `File(${value.name}, ${value.type || 'без типа'}, ${value.size} Б)`
  }

  return value
}

export default function FormsPlaygroundPage() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isDirty, isSubmitted },
  } = useForm<PlaygroundForm>({
    mode: 'onTouched',
    defaultValues: DEFAULT_VALUES,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  const values = watch()
  const { disabled, required } = values

  const requiredRule = required ? { required: 'Обязательное поле' } : undefined

  const errorMessages = Object.fromEntries(
    Object.entries(errors).map(([key, error]) => [key, error?.message ?? 'invalid']),
  )

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Обёртки над библиотеками для форм</h1>

        <p className={styles.subtitle}>
          Временный стенд для ревью ветки. Все пять компонентов сидят в одной react-hook-form —
          справа видно, что именно уйдёт в submit.
        </p>

        <div className={styles.toggles}>
          <label className={styles.toggle}>
            <input type="checkbox" {...register('disabled')} />
            <span>disabled</span>
          </label>

          <label className={styles.toggle}>
            <input type="checkbox" {...register('required')} />
            <span>required-правила</span>
          </label>
        </div>
      </header>

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit(() => undefined)} noValidate>
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>AvatarUpload</h2>

            <p className={styles.hint}>
              Клик или drag-and-drop. Принимает jpeg/png/webp до 2 МБ — брось PDF или большой файл,
              чтобы увидеть ошибку.
            </p>

            <AvatarUpload
              name="avatar"
              control={control}
              label="Аватар"
              disabled={disabled}
              maxSize={MAX_IMAGE_SIZE}
              rules={requiredRule}
            />
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Select</h2>

            <p className={styles.hint}>
              Radix Select. Проверь клавиатуру: Enter открывает, стрелки листают, буква прыгает к
              пункту, Esc закрывает.
            </p>

            <div className={styles.row}>
              <Select
                name="city"
                control={control}
                label="Город"
                placeholder="Не указан"
                options={CITY_OPTIONS}
                disabled={disabled}
                rules={requiredRule}
              />

              <Select
                name="category"
                control={control}
                label="Категория навыка"
                placeholder="Выберите категорию"
                options={CATEGORY_OPTIONS}
                disabled={disabled}
                rules={requiredRule}
              />
            </div>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>DatePicker</h2>

            <p className={styles.hint}>
              Маска дд.мм.гггг плюс react-day-picker. Набери 31.02.2000 — ошибка попадёт в errors, и
              форма станет невалидной. В календаре выбор применяется по «Выбрать», «Отменить»
              закрывает без изменений.
            </p>

            <DatePicker
              name="birthDate"
              control={control}
              label="Дата рождения"
              disabled={disabled}
              minDate={MIN_BIRTH_DATE}
              maxDate={MAX_BIRTH_DATE}
              rules={requiredRule}
            />
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>FileUpload</h2>

            <p className={styles.hint}>
              До 5 изображений по 2 МБ. Выбери несколько файлов, потом ещё раз — список заменится, а
              не дополнится.
            </p>

            <FileUpload
              name="images"
              control={control}
              label="Изображения навыка"
              accept={IMAGE_ACCEPT}
              maxFiles={5}
              maxSize={MAX_IMAGE_SIZE}
              disabled={disabled}
              rules={requiredRule}
            />
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Modal</h2>

            <p className={styles.hint}>
              Обычный useState снаружи, форма о модалке не знает. Проверь Esc, клик по оверлею и Tab
              внутри: фокус не должен уходить наружу.
            </p>

            <Modal
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
              title="Предложить обмен"
              description="Заголовок и описание рисует сам компонент, остальное — children."
              trigger={<Button variant="secondary">Открыть модалку</Button>}
            >
              <p className={styles.modalText}>
                Внутри модалки обычный children. Состояние живёт в useState страницы, в values формы
                его нет.
              </p>

              <div className={styles.modalActions}>
                <Button variant="primary">Отправить</Button>
                <Button variant="tertiary">Отменить</Button>
              </div>
            </Modal>
          </section>

          <div className={styles.actions}>
            <Button type="submit">Submit</Button>

            <Button type="button" variant="secondary" onClick={() => reset(DEFAULT_VALUES)}>
              Reset
            </Button>
          </div>
        </form>

        <aside className={styles.inspector}>
          <h2 className={styles.inspectorTitle}>Состояние формы</h2>

          <ul className={styles.flags}>
            <li>isValid: {String(isValid)}</li>
            <li>isDirty: {String(isDirty)}</li>
            <li>isSubmitted: {String(isSubmitted)}</li>
          </ul>

          <h3 className={styles.sectionTitle}>values</h3>

          <pre className={styles.code}>{JSON.stringify(values, replacer, 2)}</pre>

          <h3 className={styles.sectionTitle}>errors</h3>

          <pre className={styles.code}>{JSON.stringify(errorMessages, null, 2)}</pre>

          <h3 className={styles.sectionTitle}>На что смотреть</h3>

          <ul className={styles.notes}>
            <li>
              DatePicker проверяет дату через rules — невалидная дата видна в errors и роняет
              isValid.
            </li>
            <li>Ошибки FileUpload и AvatarUpload всё ещё живут в локальном useState.</li>
            <li>Из FileUpload нельзя убрать отдельный файл, из AvatarUpload — картинку.</li>
            <li>У FileUpload и AvatarUpload label — span, он не связан с input.</li>
            <li>Modal больше не обёртка над формой — принимает open и onOpenChange.</li>
            <li>Reset очищает Select и дату; превью аватара пока остаётся.</li>
          </ul>
        </aside>
      </div>
    </div>
  )
}
