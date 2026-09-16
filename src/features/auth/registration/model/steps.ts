import { ROUTES } from '@/shared/lib/constants'

import {
  accountStepSchema,
  skillStepSchema,
  userStepSchema,
} from './schemas'

export const REGISTRATION_STEPS = [
  {
    path: ROUTES.REGISTER_ACCOUNT,
    fields: [
      'email',
      'password',
      'confirmPassword',
    ] as const,
    schema: accountStepSchema,
  },

  {
    path: ROUTES.REGISTER_USER,
    fields: [
      'name',
      'birthDate',
      'city',
    ] as const,
    schema: userStepSchema,
  },

  {
    path: ROUTES.REGISTER_SKILL,
    fields: [
      'teachSkill',
      'learnSkill',
    ] as const,
    schema: skillStepSchema,
  },
] as const

const STEP_ALIASES: Record<string, number> = {
  [ROUTES.REGISTER_STEP_1]: 0,
  [ROUTES.REGISTER_STEP_2]: 1,
  [ROUTES.REGISTER_STEP_3]: 2,

  [ROUTES.REGISTER_USER_TYPO]: 1,
}

export function getRegistrationStepIndex(
  pathname: string,
): number {
  const canonicalIndex =
    REGISTRATION_STEPS.findIndex(
      (step) => step.path === pathname,
    )

  if (canonicalIndex !== -1) {
    return canonicalIndex
  }

  return STEP_ALIASES[pathname] ?? -1
}