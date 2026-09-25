import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, type Control, useFormContext, useWatch } from 'react-hook-form'

import { useCities } from '@/entities/city'
import { useSkillCategories } from '@/entities/skill'
import { useRegistrationFlow, type RegistrationFormValues } from '@/features/auth/registration'
import type { City } from '@/shared/types'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { AvatarUpload, DatePicker, Select, type SelectOption } from '@/shared/ui/form'
import ChevronDownIcon from '@/shared/ui/icons/assets/chevron-down.svg?react'
import CrossIcon from '@/shared/ui/icons/assets/cross.svg?react'
import styles from '@/pages/RegisterUserPage/RegisterUserPage.module.css'

const LOADING_STATUS = 'Загрузка…'

const GENDER_OPTIONS: SelectOption[] = [
  {
    value: 'male',
    label: 'Мужской',
  },
  {
    value: 'female',
    label: 'Женский',
  },
]

const toOptions = <
  T extends {
    id: string
    title: string
  },
>(
  items: T[],
): SelectOption[] =>
  items.map((item) => ({
    value: item.id,
    label: item.title,
  }))

interface CityComboboxProps {
  cities: City[]
  control: Control<RegistrationFormValues>
  disabled?: boolean
  placeholder?: string
}

const CityCombobox = ({
  cities,
  control,
  disabled = false,
  placeholder = 'Не указан',
}: CityComboboxProps) => {
  const selectedCityId = useWatch({
    control,
    name: 'city',
  })
  const selectedCity = useMemo(
    () => cities.find((city) => city.id === selectedCityId),
    [cities, selectedCityId],
  )
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const comboboxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setQuery(selectedCity?.title ?? '')
    }
  }, [isOpen, selectedCity])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!comboboxRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpen])

  const filteredCities = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ru')

    if (!normalizedQuery) {
      return cities
    }

    return cities.filter((city) => city.title.toLocaleLowerCase('ru').includes(normalizedQuery))
  }, [cities, query])

  return (
    <Controller
      name="city"
      control={control}
      render={({ field, fieldState }) => (
        <div className={styles.cityField}>
          <label htmlFor="registration-city" className={styles.fieldLabel}>
            Город
          </label>

          <div ref={comboboxRef} className={styles.cityCombobox}>
            <div
              className={`${styles.cityInputContainer} ${
                fieldState.error ? styles.cityInputError : ''
              } ${isOpen ? styles.cityInputOpen : ''}`.trim()}
            >
              <input
                id="registration-city"
                ref={field.ref}
                className={styles.cityInput}
                value={query}
                placeholder={placeholder}
                disabled={disabled}
                role="combobox"
                aria-expanded={isOpen}
                aria-controls="registration-city-listbox"
                aria-autocomplete="list"
                aria-invalid={Boolean(fieldState.error)}
                onFocus={() => setIsOpen(true)}
                onBlur={() => {
                  field.onBlur()
                  window.setTimeout(() => setIsOpen(false), 0)
                }}
                onChange={(event) => {
                  setQuery(event.target.value)
                  field.onChange('')
                  setIsOpen(true)
                }}
              />

              {query ? (
                <button
                  type="button"
                  className={styles.cityIconButton}
                  aria-label="Очистить город"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setQuery('')
                    field.onChange('')
                    setIsOpen(true)
                  }}
                >
                  <CrossIcon aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.cityIconButton}
                  aria-label="Открыть список городов"
                  tabIndex={-1}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setIsOpen((open) => !open)}
                >
                  <ChevronDownIcon
                    className={`${styles.cityChevron} ${isOpen ? styles.cityChevronOpen : ''}`}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>

            {isOpen && !disabled && (
              <div
                id="registration-city-listbox"
                className={styles.cityList}
                role="listbox"
                aria-label="Города"
              >
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      role="option"
                      aria-selected={city.id === selectedCityId}
                      className={styles.cityOption}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        field.onChange(city.id)
                        setQuery(city.title)
                        setIsOpen(false)
                      }}
                    >
                      {city.title}
                    </button>
                  ))
                ) : (
                  <p className={styles.cityEmpty}>Ничего не найдено</p>
                )}
              </div>
            )}
          </div>

          {fieldState.error?.message && (
            <span className={styles.fieldError}>{fieldState.error.message}</span>
          )}
        </div>
      )}
    />
  )
}

export default function RegisterUserPage() {
  const {
    register,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>()

  const { nextStep, previousStep } = useRegistrationFlow()

  const { cities, status: citiesStatus } = useCities()
  const { categories, status: categoriesStatus } = useSkillCategories()

  const optionsStatuses = [citiesStatus, categoriesStatus]
  const isLoading = optionsStatuses.some((status) => status === LOADING_STATUS)
  const loadError = optionsStatuses.find((status) => status && status !== LOADING_STATUS)

  const selectedCategory = useWatch({
    control,
    name: 'learningCategory',
  })

  const previousCategoryRef = useRef(selectedCategory)

  useEffect(() => {
    if (previousCategoryRef.current !== selectedCategory) {
      setValue('learningSubcategory', '', {
        shouldDirty: true,
      })
      clearErrors('learningSubcategory')
    }

    previousCategoryRef.current = selectedCategory
  }, [clearErrors, selectedCategory, setValue])

  const categoryOptions = useMemo(() => toOptions(categories), [categories])

  const subcategoryOptions = useMemo(
    () => toOptions(categories.find((category) => category.id === selectedCategory)?.skills ?? []),
    [categories, selectedCategory],
  )

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void nextStep()
      }}
    >
      <h1 className={styles.srOnly}>Регистрация: о себе</h1>

      <AvatarUpload name="avatar" control={control} className={styles.avatar} />

      <div className={styles.fields}>
        <Input
          className={styles.plainFocusField}
          label="Имя"
          placeholder="Введите ваше имя"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className={styles.row}>
          <DatePicker
            className={styles.plainFocusField}
            name="birthDate"
            control={control}
            label="Дата рождения"
            placeholder="дд.мм.гггг"
            maxDate={new Date()}
            startYear={1900}
            endYear={new Date().getFullYear()}
            invalidDateMessage="Введите корректную дату рождения"
          />

          <Select
            className={styles.registrationSelect}
            name="gender"
            control={control}
            label="Пол"
            placeholder="Не указан"
            emptyOptionLabel="Не указан"
            options={GENDER_OPTIONS}
            contentClassName={styles.registrationSelectContent}
            side="bottom"
            sideOffset={-1}
            avoidCollisions={false}
          />
        </div>

        <CityCombobox
          cities={cities}
          control={control}
          disabled={isLoading}
          placeholder={isLoading ? 'Загрузка...' : 'Не указан'}
        />

        <Select
          className={styles.registrationSelect}
          name="learningCategory"
          control={control}
          label="Категория навыка, которому хотите научиться"
          placeholder={isLoading ? 'Загрузка...' : 'Выберите категорию'}
          options={categoryOptions}
          disabled={isLoading}
          contentClassName={`${styles.checklistSelectContent} ${styles.registrationSelectContent}`}
          side="bottom"
          sideOffset={-1}
          avoidCollisions={false}
        />

        <Select
          className={styles.registrationSelect}
          name="learningSubcategory"
          control={control}
          label="Подкатегория навыка, которому хотите научиться"
          placeholder="Выберите подкатегорию"
          options={subcategoryOptions}
          disabled={isLoading || !selectedCategory}
          contentClassName={`${styles.checklistSelectContent} ${styles.registrationSelectContent}`}
          side="bottom"
          sideOffset={-1}
          avoidCollisions={false}
        />

        {loadError && (
          <p className={styles.loadError} role="alert">
            {loadError}
          </p>
        )}
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" fullWidth onClick={previousStep}>
          Назад
        </Button>

        <Button type="submit" fullWidth disabled={isLoading}>
          Продолжить
        </Button>
      </div>
    </form>
  )
}
