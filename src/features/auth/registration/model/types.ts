export type RegistrationGender = '' | 'male' | 'female'

export interface RegistrationFormValues {
  email: string
  password: string
  confirmPassword: string

  avatar: File | string | null
  name: string
  birthDate: string
  gender: RegistrationGender
  city: string
  learningCategory: string
  learningSubcategory: string

  skillName: string
  skillCategory: string
  skillSubcategory: string
  skillDescription: string
  skillImages: File[]
}
