import { RadioOption } from '../RadioButton'
import { forwardRef } from 'react'
import { RadioButton, NativeInputProps } from '../RadioButton'
import styles from './RadioGroup.module.css'

type RadioGroupProps = {
  options: RadioOption[]
  name: string
  title?: string
  className?: string
} & NativeInputProps

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ options, title, className, ...optionProps }, ref) => {
    const rootClassName = [styles.root, className].filter(Boolean).join(' ')

    return (
      <div className={rootClassName}>
        {title && <p className={styles.title}>{title}</p>}
        <div className={styles.options}>
          {options.map((option) => (
            <RadioButton key={option.value} ref={ref} option={option} {...optionProps} />
          ))}
        </div>
      </div>
    )
  },
)

RadioGroup.displayName = 'RadioGroup'
