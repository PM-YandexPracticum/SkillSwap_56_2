import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import {
  FormProvider,
  useForm,
  type FieldPath,
} from 'react-hook-form'
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { ValidationError } from 'yup'

import { saveAuthUser } from '@/features/auth/model/authUtils'
import { ROUTES } from '@/shared/lib/constants'

import {
  clearRegistrationDraft,
  loadRegistrationDraft,
  REGISTRATION_DEFAULT_VALUES,
  saveRegistrationDraft,
} from '../model/storage'
import {
  getRegistrationStepIndex,
  REGISTRATION_STEPS,
} from '../model/steps'
import type { RegistrationFormValues } from '../model/types'

interface RegistrationFlowContextValue {
  currentStepIndex: number

  nextStep: () => Promise<void>
  previousStep: () => void
  finishRegistration: () => Promise<void>
}

const RegistrationFlowContext =
  createContext<RegistrationFlowContextValue | null>(
    null,
  )

interface RegistrationProviderProps {
  children?: ReactNode
}

export const RegistrationProvider = ({
  children,
}: RegistrationProviderProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  const completedRef = useRef(false)

  const currentStepIndex =
    getRegistrationStepIndex(
      location.pathname,
    )

  const methods =
    useForm<RegistrationFormValues>({
      defaultValues:
        loadRegistrationDraft(),
      mode: 'onSubmit',
    })

  /**
   * При любом изменении формы сохраняем
   * её в localStorage.
   */
  useEffect(() => {
    const subscription =
      methods.watch((values) => {
        if (completedRef.current) {
          return
        }

        saveRegistrationDraft({
          ...REGISTRATION_DEFAULT_VALUES,
          ...values,
        } as RegistrationFormValues)
      })

    return () =>
      subscription.unsubscribe()
  }, [methods])

  /**
   * Проверяет только один конкретный шаг.
   */
  const validateStep = async (
    stepIndex: number,
  ): Promise<boolean> => {
    const step =
      REGISTRATION_STEPS[stepIndex]

    if (!step) {
      return false
    }

    methods.clearErrors([
      ...step.fields,
    ])

    try {
      await step.schema.validate(
        methods.getValues(),
        {
          abortEarly: false,
        },
      )

      return true
    } catch (error) {
      if (
        !(
          error instanceof
          ValidationError
        )
      ) {
        return false
      }

      const issues =
        error.inner.length > 0
          ? error.inner
          : [error]

      issues.forEach((issue) => {
        if (!issue.path) {
          return
        }

        methods.setError(
          issue.path as FieldPath<RegistrationFormValues>,
          {
            type: 'manual',
            message: issue.message,
          },
        )
      })

      return false
    }
  }

  /**
   * Кнопка "Далее".
   */
  const nextStep = async () => {
    if (
      currentStepIndex < 0 ||
      currentStepIndex >=
        REGISTRATION_STEPS.length - 1
    ) {
      return
    }

    const isValid =
      await validateStep(
        currentStepIndex,
      )

    if (!isValid) {
      return
    }

    navigate(
      REGISTRATION_STEPS[
        currentStepIndex + 1
      ].path,
    )
  }

  /**
   * Кнопка "Назад".
   */
  const previousStep = () => {
    if (currentStepIndex <= 0) {
      return
    }

    navigate(
      REGISTRATION_STEPS[
        currentStepIndex - 1
      ].path,
    )
  }

  /**
   * Последняя отправка формы.
   */
  const finishRegistration =
    async () => {
      if (
        currentStepIndex !==
        REGISTRATION_STEPS.length - 1
      ) {
        return
      }

      const isValid =
        await validateStep(
          currentStepIndex,
        )

      if (!isValid) {
        return
      }

      const values =
        methods.getValues()

      saveAuthUser({
        id: String(Date.now()),
        name: values.name.trim(),
        email: values.email.trim(),
      })

      completedRef.current = true

      clearRegistrationDraft()

      navigate(ROUTES.HOME, {
        replace: true,
      })
    }

  /*
   * Защита от перепрыгивания.
   *
   * Например, пользователь открыл /register/3.
   * Проверяем шаги 1 и 2.
   */
  const firstIncompleteStepIndex =
    currentStepIndex > 0
      ? REGISTRATION_STEPS.slice(
          0,
          currentStepIndex,
        ).findIndex(
          (step) =>
            !step.schema.isValidSync(
              methods.getValues(),
            ),
        )
      : -1

  if (
    firstIncompleteStepIndex !== -1
  ) {
    return (
      <Navigate
        to={
          REGISTRATION_STEPS[
            firstIncompleteStepIndex
          ].path
        }
        replace
      />
    )
  }

  const contextValue: RegistrationFlowContextValue =
    {
      currentStepIndex,
      nextStep,
      previousStep,
      finishRegistration,
    }

  return (
    <FormProvider {...methods}>
      <RegistrationFlowContext.Provider
        value={contextValue}
      >
        {children ?? <Outlet />}
      </RegistrationFlowContext.Provider>
    </FormProvider>
  )
}

export const useRegistrationFlow =
  () => {
    const context = useContext(
      RegistrationFlowContext,
    )

    if (!context) {
      throw new Error(
        'useRegistrationFlow must be used inside RegistrationProvider',
      )
    }

    return context
  }