import { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import EditIcon from '@/shared/ui/icons/assets/edit.svg?react'
import GalleryEditIcon from '@/shared/ui/icons/assets/gallery-edit.svg?react'

import { getAuthUser, updateAuthUser } from '@/features/auth/model/authUtils'
import { useCities } from '@/entities/city'
import { toDisplayDate, toIsoDate } from '@/shared/lib/helpers'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/form/Select'
import { DatePicker } from '@/shared/ui/form/DatePicker'
import { AvatarUpload } from '@/shared/ui/form/AvatarUpload'
import { Button } from '@/shared/ui/Button'

import { profileSchema } from '../model/schema'
import type { ProfileFormValues } from '../model/types'

import styles from './ProfileEditForm.module.css'

const genderOptions = [
  {
    value: 'male',
    label: 'Мужской',
  },
  {
    value: 'female',
    label: 'Женский',
  },
]

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result as string)
    }

    reader.onerror = () => {
      reject(new Error('Не удалось загрузить изображение'))
    }

    reader.readAsDataURL(file)
  })

export const ProfileEditForm = () => {
  const [user] = useState(getAuthUser)

  const { cities, status: citiesStatus } = useCities()

  const [successMessage, setSuccessMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  const cityOptions = cities.map((city) => ({
    value: city.title,
    label: city.title,
  }))

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),

    defaultValues: {
      email: user?.email ?? '',
      name: user?.name ?? '',
      birthDate: toDisplayDate(user?.birthDate ?? ''),
      gender: user?.gender,
      city: user?.city ?? '',
      about: user?.about ?? '',
      avatar: user?.avatarUrl ?? null,
    },
  })

  useEffect(() => {
    if (isDirty) {
      setSuccessMessage('')
    }
  }, [isDirty])

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setSuccessMessage('')
      setSubmitError('')

      const avatarUrl =
        values.avatar instanceof File ? await fileToDataUrl(values.avatar) : values.avatar

      const updatedUser = updateAuthUser({
        email: values.email,
        name: values.name,
        birthDate: toIsoDate(values.birthDate),
        gender: values.gender,
        city: values.city,
        about: values.about,
        avatarUrl,
      })

      if (!updatedUser) {
        throw new Error('Пользователь не найден')
      }

      reset({
        ...values,
        avatar: avatarUrl,
      })

      setSuccessMessage('Изменения сохранены')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Не удалось сохранить изменения')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.content}>
        <div className={styles.fields}>
          <Input
            label="Почта"
            error={errors.email?.message}
            readOnly
            rightElement={<EditIcon aria-hidden="true" />}
            {...register('email')}
          />

          <button type="button" className={styles.changePassword}>
            Изменить пароль
          </button>

          <Input
            label="Имя"
            error={errors.name?.message}
            rightElement={<EditIcon aria-hidden="true" />}
            {...register('name')}
          />

          <div className={styles.row}>
            <DatePicker
              name="birthDate"
              control={control}
              label="Дата рождения"
              maxDate={new Date()}
              className={styles.rowField}
            />

            <Select
              name="gender"
              control={control}
              label="Пол"
              options={genderOptions}
              placeholder="Выберите пол"
              className={styles.rowField}
            />
          </div>

          <Select
            name="city"
            control={control}
            label="Город"
            options={cityOptions}
            placeholder={citiesStatus ?? 'Выберите город'}
            disabled={Boolean(citiesStatus)}
          />

          <Input
            label="О себе"
            multiline
            rows={4}
            error={errors.about?.message}
            rightElement={<EditIcon aria-hidden="true" />}
            {...register('about')}
          />

          <div className={styles.message}>
            {successMessage && (
              <p className={styles.success} role="status">
                {successMessage}
              </p>
            )}

            {submitError && (
              <p className={styles.error} role="alert">
                {submitError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            className={styles.saveButton}
            disabled={!isDirty || isSubmitting}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>

        <div className={styles.avatar}>
          <AvatarUpload
            name="avatar"
            control={control}
            size="xxl"
            maxSize={1024 * 1024}
            alt={user?.name ?? 'Аватар пользователя'}
            icon={<GalleryEditIcon />}
          />
        </div>
      </div>
    </form>
  )
}
