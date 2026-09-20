import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

import type { RegistrationFormValues } from '@/features/auth/registration/model/types'

export const REGISTRATION_DEFAULT_VALUES: RegistrationFormValues = {
  email: '',
  password: '',
  confirmPassword: '',

  avatar: null,
  name: '',
  birthDate: '',
  gender: '',
  city: '',
  learningCategory: '',
  learningSubcategory: '',

  teachSkill: '',
  learnSkill: '',
}

export function loadRegistrationDraft(): RegistrationFormValues {
  try {
    const rawDraft = localStorage.getItem(
      LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT,
    )

    if (!rawDraft) {
      return {
        ...REGISTRATION_DEFAULT_VALUES,
      }
    }

    const draft = JSON.parse(
      rawDraft,
    ) as Partial<RegistrationFormValues>

    return {
      ...REGISTRATION_DEFAULT_VALUES,
      ...draft,
      // File нельзя надёжно восстановить из localStorage. Строку оставляем,
      // чтобы компонент поддерживал сохранённый URL, если он появится позже.
      avatar:
        typeof draft.avatar === 'string'
          ? draft.avatar
          : null,
    }
  } catch {
    return {
      ...REGISTRATION_DEFAULT_VALUES,
    }
  }
}

export function saveRegistrationDraft(
  values: RegistrationFormValues,
): void {
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT,
    JSON.stringify({
      ...values,
      // File живёт в react-hook-form и не теряется при переходе «Назад».
      // В localStorage сам File не сериализуем.
      avatar:
        typeof values.avatar === 'string'
          ? values.avatar
          : null,
    }),
  )
}

export function clearRegistrationDraft(): void {
  localStorage.removeItem(
    LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT,
  )
}
