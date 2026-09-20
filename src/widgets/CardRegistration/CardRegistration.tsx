import GoogleSvg from '@/shared/ui/icons/assets/google.svg?react'
import AppleSvg from '@/shared/ui/icons/assets/apple.svg?react'
import EyeSvg from '@/shared/ui/icons/assets/eye.svg?react'
import EyeSlashSvg from '@/shared/ui/icons/assets/eye-slash.svg?react'
import { Button } from '@/shared/ui/Button'
import styles from './CardRegistration.module.css'
import { useForm } from 'react-hook-form'
import { Input } from '@/shared/ui/Input'
import { useState } from 'react'

type FormData = {
  email: string
  password: string
}

export const CardRegistration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
  })

  const onSubmit = () => {
    //заглушка, поменять при отправке формы
  }

  const [showPassword, setShowPassword] = useState(false)
  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles['enter-container']}>
        <div className={styles.variants}>
          <div className={styles['enter-with']}>
            <div className={styles.tooltip}>
              <Button
                className={styles.button}
                leftIcon={<GoogleSvg />}
                variant="secondary"
                fullWidth
                disabled
              >
                Продолжить с&nbsp;Google
              </Button>

              <span className={styles.tooltipText}>Вход через Google пока недоступен</span>
            </div>

            <div className={styles.tooltip}>
              <Button
                className={styles.button}
                leftIcon={<AppleSvg />}
                variant="secondary"
                fullWidth
                disabled
              >
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
          <div className={styles['enter-login']}>
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
                placeholder="Придумайте надёжный пароль"
                helperText="Пароль должен содержать не менее 8 знаков"
                error={errors.password?.message}
                rightElement={
                  <Button
                    type="button"
                    variant="ghost"
                    leftIcon={showPassword ? <EyeSlashSvg /> : <EyeSvg />}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  />
                }
                {...register('password', {
                  required: 'Введите пароль',
                  minLength: {
                    value: 8,
                    message: 'Пароль должен содержать не менее 8 знаков',
                  },
                })}
              />
            </div>
          </div>
        </div>
        <Button type="submit" fullWidth>
          Далее
        </Button>
      </div>
    </form>
  )
}
