import { RadioOption, RadioButton, NativeInputProps } from '../RadioButton'
import { ChangeEventHandler, forwardRef, useId } from 'react'
import styles from './RadioGroup.module.css'

type ControlledProps = {
  defaultOptionValue?: never
  selectedOptionValue: string
  onChange: ChangeEventHandler<HTMLInputElement>
}

type UncontrolledProps = {
  defaultOptionValue?: string
  selectedOptionValue?: never
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export type RadioGroupProps = (ControlledProps | UncontrolledProps) & {
  options: RadioOption[]
  title?: string
  className?: string
  name: string
} & NativeInputProps

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    { options, title, className, name, defaultOptionValue, selectedOptionValue, onChange, ...rest },
    ref,
  ) => {
    const rootClassName = [styles.root, className].filter(Boolean).join(' ')
    const isControlled = selectedOptionValue !== undefined
    const titleId = useId()

    return (
      <div
        className={rootClassName}
        ref={ref}
        role="radiogroup"
        aria-labelledby={title ? titleId : undefined}
      >
        {title && (
          <p id={titleId} className={styles.title}>
            {title}
          </p>
        )}
        <div className={styles.options}>
          {isControlled
            ? options.map((option) => (
                <RadioButton
                  key={option.value}
                  name={name}
                  option={option}
                  checked={selectedOptionValue === option.value}
                  onChange={onChange}
                  {...rest}
                />
              ))
            : options.map((option) => (
                <RadioButton
                  key={option.value}
                  name={name}
                  option={option}
                  defaultChecked={defaultOptionValue === option.value}
                  onChange={onChange}
                  {...rest}
                />
              ))}
        </div>
      </div>
    )
  },
)

RadioGroup.displayName = 'RadioGroup'
