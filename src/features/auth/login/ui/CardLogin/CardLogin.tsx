import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import GoogleSvg from '@/shared/ui/icons/assets/google.svg?react'
import AppleSvg from '@/shared/ui/icons/assets/apple.svg?react'
import EyeSvg from '@/shared/ui/icons/assets/eye.svg?react'
import EyeSlashSvg from '@/shared/ui/icons/assets/eye-slash.svg?react'

import { loginUser } from '@/features/auth/model/authUtils'
import type { LoginFormValues } from '@/features/auth/login/model/types'
import { ROUTES } from '@/shared/lib/constants'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

import styles from './CardLogin.module.css'

type LoginLocationState = {
  from?: string
}

export const CardLogin = () => {
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: 'onChange',
  })

  const onSubmit = (data: LoginFormValues) => {
    const user = loginUser(data.email, data.password)

    if (!user) {
      setError('password', {
        type: 'manual',
        message:
          'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных',
      })

      return
    }

    const state = location.state as LoginLocationState | null

    navigate(state?.from ?? ROUTES.HOME, {
      replace: true,
    })
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles['enter-container']}>
        <div className={styles.variants}>
          <div className={styles['enter-with']}>
            <div className={styles.tooltip}>
              <Button leftIcon={<GoogleSvg />} variant="secondary" fullWidth disabled>
                Продолжить с&nbsp;Google
              </Button>

              <span className={styles.tooltipText}>Вход через Google пока недоступен</span>
            </div>

            <div className={styles.tooltip}>
              <Button leftIcon={<AppleSvg />} variant="secondary" fullWidth disabled>
                Продолжить с&nbsp;Apple
              </Button>

              <span className={styles.tooltipText}>Вход через Apple пока недоступен</span>
            </div>
          </div>

          <div className={styles.divider}>
            <span className={styles.line} />
            <span>или</span>
            <span className={styles.line} />
          </div>

          <div className={styles['input-container']}>
            <Input
              label="Email"
              type="email"
              placeholder="Введите email"
              error={errors.email?.message}
              {...register('email', {
                required: 'Введите email',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Введите корректный email',
                },
              })}
            />

            <Input
              className={styles.input}
              label="Пароль"
              type={showPassword ? 'text' : 'password'}
              placeholder="Введите пароль"
              error={errors.password?.message}
              rightElement={
                <Button
                  type="button"
                  variant="ghost"
                  leftIcon={showPassword ? <EyeSlashSvg /> : <EyeSvg />}
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                />
              }
              {...register('password', {
                required: 'Введите пароль',
              })}
            />
          </div>
        </div>
        <div className={styles.actions}>
          <Button type="submit" fullWidth>
            Войти
          </Button>

          <Link to={ROUTES.REGISTER} className={styles.registerLink}>
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </form>
  )
}
