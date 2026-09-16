import { AuthLayout } from '@/app/layouts/AuthLayout'
import {
  REGISTRATION_STEPS,
  useRegistrationFlow,
} from '@/features/auth/registration'

import lightBulbIllustration from '@/shared/ui/icons/assets/light-bulb.svg'
import schoolBoardIllustration from '@/shared/ui/icons/assets/school-board.svg'
import userInfoIllustration from '@/shared/ui/icons/assets/user-info.svg'

const STEP_INFO = [
  {
    illustration:
      lightBulbIllustration,

    title:
      'Добро пожаловать в SkillSwap!',

    description:
      'Создайте аккаунт, чтобы начать обмениваться знаниями и навыками.',
  },

  {
    illustration:
      userInfoIllustration,

    title:
      'Расскажите о себе',

    description:
      'Добавьте основную информацию, чтобы другим было проще вас узнать.',
  },

  {
    illustration:
      schoolBoardIllustration,

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
      />
    )
  }