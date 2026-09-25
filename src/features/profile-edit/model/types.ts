import type { Gender } from '@/shared/types'

export interface ProfileFormValues {
  email: string
  name: string
  birthDate: string
  gender: Gender
  city: string
  about: string
  avatar: File | string | null
}
