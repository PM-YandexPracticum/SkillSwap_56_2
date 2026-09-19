import { AuthLayout } from '@/app/layouts/AuthLayout'
import {
  REGISTRATION_STEPS,
  useRegistrationFlow,
} from '@/features/auth/registration'

import LightBulbIllustration from '@/shared/ui/icons/assets/light-bulb.svg?react'
import SchoolBoardIllustration from '@/shared/ui/icons/assets/school-board.svg?react'
import UserInfoIllustration from '@/shared/ui/icons/assets/user-info.svg?react'

const STEP_INFO = [
  {
    illustration:
      LightBulbIllustration,

    title:
      'Добро пожаловать в SkillSwap!',

    description:
      'Создайте аккаунт, чтобы начать обмениваться знаниями и навыками.',
  },

  {
    illustration:
      UserInfoIllustration,

    title:
      'Расскажите немного о себе',

    description:
      'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },

  {
    illustration:
      SchoolBoardIllustration,

    title:
      'Расскажите о навыках',

    description:
      'Укажите, чему вы можете научить и чему хотите научиться сами.',
  },
] as const

export const RegistrationLayout =
  () => {
    const {
      currentStepIndex,
      clearDraft,
    } = useRegistrationFlow()

    const safeStepIndex =
      Math.max(
        0,
        currentStepIndex,
      )

    return (
      <AuthLayout
        current={
          safeStepIndex + 1
        }
        total={
          REGISTRATION_STEPS.length
        }
        info={
          STEP_INFO[
            safeStepIndex
          ]
        }
        onClose={clearDraft}
      />
    )
  }