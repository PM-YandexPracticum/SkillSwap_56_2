import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

import {
  clearRegistrationDraft,
  loadRegistrationDraft,
  REGISTRATION_DEFAULT_VALUES,
  saveRegistrationDraft,
} from './storage'
import type { RegistrationFormValues } from './types'

const draft: RegistrationFormValues = {
  ...REGISTRATION_DEFAULT_VALUES,
  email: 'user@example.com',
  password: '12345678',
}

beforeEach(() => {
  localStorage.clear()
})

test('возвращает значения по умолчанию, если черновика нет', () => {
  expect(loadRegistrationDraft()).toEqual(REGISTRATION_DEFAULT_VALUES)
})

test('сохраняет и восстанавливает черновик', () => {
  saveRegistrationDraft(draft)

  expect(loadRegistrationDraft()).toEqual(draft)
  expect(localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT)).not.toBeNull()
})

test('дополняет неполный черновик значениями по умолчанию', () => {
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT,
    JSON.stringify({ email: 'user@example.com' }),
  )

  expect(loadRegistrationDraft()).toEqual({
    ...REGISTRATION_DEFAULT_VALUES,
    email: 'user@example.com',
  })
})

test('возвращает значения по умолчанию при повреждённом JSON', () => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT, '{broken')

  expect(loadRegistrationDraft()).toEqual(REGISTRATION_DEFAULT_VALUES)
})

test('удаляет черновик', () => {
  saveRegistrationDraft(draft)

  clearRegistrationDraft()

  expect(localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_DRAFT)).toBeNull()
})
