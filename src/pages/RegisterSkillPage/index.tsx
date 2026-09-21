import { useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { fetchSkillCategories } from '@/api/skills'
import { useRegistrationFlow, type RegistrationFormValues } from '@/features/auth/registration'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { FileUpload, Select } from '@/shared/ui/form'
import type { SkillCategory } from '@/shared/types'

import styles from './RegisterSkillPage.module.css'

export default function RegisterSkillPage() {
  const {
    register,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>()

  const { finishRegistration, previousStep, isFinishing, submitError } = useRegistrationFlow()

  const [categories, setCategories] = useState<SkillCategory[]>([])

  const [isLoading, setIsLoading] = useState(true)

  const [loadError, setLoadError] = useState('')

  const selectedCategory = useWatch({
    control,
    name: 'skillCategory',
  })

  /*
   * Нужен, чтобы при первом открытии страницы
   * не затереть подкатегорию из сохранённого
   * черновика.
   */
  const previousCategoryRef = useRef(selectedCategory)

  /*
   * Загружаем категории исключительно
   * через API проекта.
   */
  useEffect(() => {
    const controller = new AbortController()

    const loadCategories = async () => {
      try {
        setIsLoading(true)
        setLoadError('')

        const data = await fetchSkillCategories(controller.signal)

        setCategories(data)
      } catch {
        if (!controller.signal.aborted) {
          setLoadError('Не удалось загрузить категории навыков')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadCategories()

    return () => controller.abort()
  }, [])

  /*
   * Если пользователь сменил категорию,
   * старая подкатегория больше невалидна.
   *
   * Поэтому очищаем её через RHF.
   */
  useEffect(() => {
    if (previousCategoryRef.current === selectedCategory) {
      return
    }

    previousCategoryRef.current = selectedCategory

    setValue('skillSubcategory', '', {
      shouldDirty: true,
      shouldValidate: false,
    })

    clearErrors('skillSubcategory')
  }, [selectedCategory, setValue, clearErrors])

  /*
   * Категории для нашего существующего Select.
   */
  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.title,
      })),
    [categories],
  )

  /*
   * Подкатегории берём только
   * из выбранной категории.
   */
  const subcategoryOptions = useMemo(() => {
    const category = categories.find((item) => item.id === selectedCategory)

    return (
      category?.skills.map((skill) => ({
        value: skill.id,
        label: skill.title,
      })) ?? []
    )
  }, [categories, selectedCategory])

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={(event) => {
        event.preventDefault()

        void finishRegistration()
      }}
    >
      <h1 className={styles.visuallyHidden}>Регистрация: навыки</h1>

      <div className={styles.fields}>
        <Input
          label="Название навыка"
          placeholder="Введите название вашего навыка"
          error={errors.skillName?.message}
          {...register('skillName')}
        />

        <Select
          name="skillCategory"
          control={control}
          label="Категория навыка, которому можете научить"
          placeholder={isLoading ? 'Загрузка категорий...' : 'Выберите категорию навыка'}
          options={categoryOptions}
          disabled={isLoading || Boolean(loadError)}
        />

        <Select
          name="skillSubcategory"
          control={control}
          label="Подкатегория"
          placeholder="Выберите подкатегорию навыка"
          options={subcategoryOptions}
          disabled={isLoading || !selectedCategory || Boolean(loadError)}
        />

        {loadError && (
          <p className={styles.loadError} role="alert">
            {loadError}
          </p>
        )}

        <Input
          label="Описание"
          placeholder="Коротко опишите, чему можете научить"
          multiline
          rows={3}
          heightTextarea={styles.description}
          error={errors.skillDescription?.message}
          {...register('skillDescription')}
        />

        <FileUpload
          name="skillImages"
          control={control}
          accept={{
            'image/jpeg': [],
            'image/png': [],
            'image/webp': [],
          }}
          maxFiles={5}
          dropzoneText="Перетащите или выберите изображения навыка"
          actionText="Выбрать изображения"
        />
      </div>

      {submitError && (
        <p className={styles.loadError} role="alert">
          {submitError}
        </p>
      )}

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={isFinishing}
          onClick={previousStep}
        >
          Назад
        </Button>

        <Button type="submit" fullWidth disabled={isFinishing}>
          {isFinishing ? 'Сохранение...' : 'Продолжить'}
        </Button>
      </div>
    </form>
  )
}
