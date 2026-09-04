import { forwardRef } from 'react'
import styles from './RadioButton.module.css'
import { RadioOption, NativeInputProps } from './types'

interface RadioButtonProps extends NativeInputProps {
  option: RadioOption
  className?: string
  name: string
}

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ option, className, name, ...inputProps }, ref) => {
    const rootClassName = [styles.root, className].filter(Boolean).join(' ')

    return (
      <label className={rootClassName}>
        <input
          {...inputProps}
          name={name}
          ref={ref}
          type="radio"
          value={option.value}
          className={styles.radio}
        />
        <span className={styles.text}>{option.title}</span>
      </label>
    )
  },
)

RadioButton.displayName = 'RadioButton'
