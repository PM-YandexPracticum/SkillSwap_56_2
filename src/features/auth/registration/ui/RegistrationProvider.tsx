import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { FormProvider, useForm, type FieldPath } from 'react-hook-form'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ValidationError } from 'yup'

import { saveAuthUser } from '@/features/auth/model/authUtils'
import { fetchCities } from '@/api/cities'
import { LOCAL_STORAGE_KEYS, ROUTES } from '@/shared/lib/constants'
import { fileToDataUrl } from '@/shared/lib/fileToDataUrl'
import { toIsoDate } from '@/shared/lib/helpers'

import {
  clearRegistrationDraft,
  loadRegistrationDraft,
  REGISTRATION_DEFAULT_VALUES,
  saveRegistrationDraft,
} from '../model/storage'
import { getRegistrationStepIndex, REGISTRATION_STEPS } from '../model/steps'
import type { RegistrationFormValues } from '../model/types'

interface RegistrationFlowContextValue {
  currentStepIndex: number

  nextStep: () => Promise<void>
  previousStep: () => void
  finishRegistration: () => Promise<void>
  clearDraft: () => void
  isFinishing: boolean
  submitError: string
}

const RegistrationFlowContext = createContext<RegistrationFlowContextValue | null>(null)

interface RegistrationProviderProps {
  children?: ReactNode
}

export const RegistrationProvider = ({ children }: RegistrationProviderProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  const completedRef = useRef(false)
  const submittingRef = useRef(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const currentStepIndex = getRegistrationStepIndex(location.pathname)

  const methods = useForm<RegistrationFormValues>({
    defaultValues: loadRegistrationDraft(),
    mode: 'onSubmit',
  })

  /**
   * При любом изменении формы сохраняем
   * её в localStorage.
   */
  useEffect(() => {
    const subscription = methods.watch((values) => {
      if (completedRef.current) {
        return
      }

      saveRegistrationDraft({
        ...REGISTRATION_DEFAULT_VALUES,
        ...values,
      } as RegistrationFormValues)
    })

    return () => subscription.unsubscribe()
  }, [methods])

  /**
   * Проверяет только один конкретный шаг.
   */
  const validateStep = async (stepIndex: number): Promise<boolean> => {
    const step = REGISTRATION_STEPS[stepIndex]

    if (!step) {
      return false
    }

    methods.clearErrors([...step.fields])

    try {
      await step.schema.validate(methods.getValues(), {
        abortEarly: false,
      })

      return true
    } catch (error) {
      if (!(error instanceof ValidationError)) {
        return false
      }

      const issues = error.inner.length > 0 ? error.inner : [error]

      issues.forEach((issue) => {
        if (!issue.path) {
          return
        }

        methods.setError(issue.path as FieldPath<RegistrationFormValues>, {
          type: 'manual',
          message: issue.message,
        })
      })

      return false
    }
  }

  /**
   * Кнопка "Далее".
   */
  const nextStep = async () => {
    if (currentStepIndex < 0 || currentStepIndex >= REGISTRATION_STEPS.length - 1) {
      return
    }

    const isValid = await validateStep(currentStepIndex)

    if (!isValid) {
      return
    }

    navigate(REGISTRATION_STEPS[currentStepIndex + 1].path)
  }

  /**
   * Кнопка "Назад".
   */
  const previousStep = () => {
    if (currentStepIndex <= 0) {
      return
    }

    navigate(REGISTRATION_STEPS[currentStepIndex - 1].path)
  }

  /**
   * Последняя отправка формы.
   */
  const finishRegistration = async () => {
    if (
      submittingRef.current ||
      completedRef.current ||
      currentStepIndex !== REGISTRATION_STEPS.length - 1
    ) {
      return
    }

    submittingRef.current = true
    setIsFinishing(true)
    setSubmitError('')

    try {
      for (let stepIndex = 0; stepIndex < REGISTRATION_STEPS.length; stepIndex += 1) {
        if (!(await validateStep(stepIndex))) {
          navigate(REGISTRATION_STEPS[stepIndex].path)
          return
        }
      }

      const values = methods.getValues()
      const [cities, avatarUrl, skillImages] = await Promise.all([
        fetchCities(),
        values.avatar instanceof File ? fileToDataUrl(values.avatar) : values.avatar,
        Promise.all(values.skillImages.map(fileToDataUrl)),
      ])
      const city = cities.find((item) => item.id === values.city)

      if (!city) {
        throw new Error('Не удалось найти выбранный город. Выберите город заново.')
      }

      const skills = [
        {
          skillName: values.skillName.trim(),
          skillCategory: values.skillCategory,
          skillSubcategory: values.skillSubcategory,
          skillDescription: values.skillDescription.trim(),
          skillImages,
        },
      ]
      const previousSkills = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SKILLS)

      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SKILLS, JSON.stringify(skills))

      try {
        saveAuthUser({
          id: String(Date.now()),
          name: values.name.trim(),
          email: values.email.trim(),
          birthDate: toIsoDate(values.birthDate),
          gender: values.gender || undefined,
          city: city.title,
          about: '',
          avatarUrl,
          learningCategory: values.learningCategory,
          learningSubcategory: values.learningSubcategory,
        })
      } catch (error) {
        // При неудачной записи профиля сохраняем навык предыдущего пользователя.
        if (previousSkills === null) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_SKILLS)
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SKILLS, previousSkills)
        }
        throw error
      }

      completedRef.current = true
      clearRegistrationDraft()
      navigate(ROUTES.HOME, {
        replace: true,
        state: { registrationSuccess: true },
      })
    } catch {
      setSubmitError('Не удалось завершить регистрацию. Попробуйте ещё раз.')
    } finally {
      submittingRef.current = false
      setIsFinishing(false)
    }
  }

  /*
   * Защита от перепрыгивания.
   *
   * Например, пользователь открыл /register/3.
   * Проверяем шаги 1 и 2.
   */
  const firstIncompleteStepIndex =
    currentStepIndex > 0
      ? REGISTRATION_STEPS.slice(0, currentStepIndex).findIndex(
          (step) => !step.schema.isValidSync(methods.getValues()),
        )
      : -1

  if (firstIncompleteStepIndex !== -1) {
    return <Navigate to={REGISTRATION_STEPS[firstIncompleteStepIndex].path} replace />
  }

  const contextValue: RegistrationFlowContextValue = {
    currentStepIndex,
    nextStep,
    previousStep,
    finishRegistration,
    clearDraft: clearRegistrationDraft,
    isFinishing,
    submitError,
  }

  return (
    <FormProvider {...methods}>
      <RegistrationFlowContext.Provider value={contextValue}>
        {children ?? <Outlet />}
      </RegistrationFlowContext.Provider>
    </FormProvider>
  )
}

export const useRegistrationFlow = () => {
  const context = useContext(RegistrationFlowContext)

  if (!context) {
    throw new Error('useRegistrationFlow must be used inside RegistrationProvider')
  }

  return context
}
