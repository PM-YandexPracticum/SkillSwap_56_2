export interface RegistrationFormValues {
  email: string
  password: string
  confirmPassword: string

  name: string
  birthDate: string
  city: string

  skillName: string
  skillCategory: string
  skillSubcategory: string
  skillDescription: string
  skillImages: File[]
}