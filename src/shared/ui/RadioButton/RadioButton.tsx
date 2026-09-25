import { forwardRef } from 'react'
import styles from './RadioButton.module.css'
import { RadioOption, NativeInputProps, RadioButtonStateProps } from './types'

export type RadioButtonProps = RadioButtonStateProps &
  NativeInputProps & {
    option: RadioOption
    className?: string
    name: string
  }

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ option, className, name, ...rest }, ref) => {
    const rootClassName = [styles.root, className].filter(Boolean).join(' ')
    return (
      <label className={rootClassName}>
        <input
          {...rest}
          ref={ref}
          type="radio"
          name={name}
          value={option.value}
          className={styles.radio}
        />
        <span className={styles.text}>{option.title}</span>
      </label>
    )
  },
)

RadioButton.displayName = 'RadioButton'
