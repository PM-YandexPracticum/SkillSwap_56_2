import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

import type { RegistrationFormValues } from './types'

export const REGISTRATION_DEFAULT_VALUES: RegistrationFormValues = {
  email: '',
  password: '',
  confirmPassword: '',

  name: '',
  birthDate: '',
  city: '',

  skillName: '',
  skillCategory: '',
  skillSubcategory: '',
  skillDescription: '',
  skillImages: [],
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

      // File нельзя восстановить из localStorage
      // как настоящий объект File после F5.
      skillImages: [],
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

      // Остальные данные третьего шага сохраняются.
      // Сами File в localStorage не сериализуем.
      skillImages: [],
    }),
  )
}

export function clearRegistrationDraft(): void {
  localStorage.removeItem(
    LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT,
  )
}