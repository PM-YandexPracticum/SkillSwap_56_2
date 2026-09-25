import React from 'react'
import * as RadixSelect from '@radix-ui/react-select'
import {
  Controller,
  type Control,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

import ChevronDownIcon from '../../icons/assets/chevron-down.svg?react'
import styles from './Select.module.css'

const EMPTY_OPTION_VALUE = '__select_empty_option__'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  name: TName
  control: Control<TFieldValues>
  rules?: ControllerProps<TFieldValues, TName>['rules']
  options: SelectOption[]
  label?: string
  placeholder?: string
  emptyOptionLabel?: string
  disabled?: boolean
  className?: string
  contentClassName?: string
  side?: RadixSelect.SelectContentProps['side']
  sideOffset?: number
  avoidCollisions?: boolean
}

export const Select = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  control,
  rules,
  options,
  label,
  placeholder = 'Выберите значение',
  emptyOptionLabel,
  disabled = false,
  className = '',
  contentClassName = '',
  side,
  sideOffset = 4,
  avoidCollisions = true,
}: SelectProps<TFieldValues, TName>) => {
  const generatedId = React.useId()
  const errorId = `${generatedId}-error`

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        // Пустая строка, а не undefined: с undefined Radix переключается в
        // неуправляемый режим и держит старое значение после reset() формы
        const value =
          typeof field.value === 'string'
            ? field.value
            : field.value == null
              ? ''
              : String(field.value)

        const handleValueChange = (nextValue: string) => {
          field.onChange(nextValue === EMPTY_OPTION_VALUE ? '' : nextValue)
        }

        return (
          <div className={`${styles.wrapper} ${className}`.trim()}>
            {label && (
              <label htmlFor={generatedId} className={styles.label}>
                {label}
              </label>
            )}

            <RadixSelect.Root value={value} onValueChange={handleValueChange} disabled={disabled}>
              <RadixSelect.Trigger
                id={generatedId}
                ref={field.ref}
                className={`${styles.trigger} ${
                  fieldState.error ? styles.errorTrigger : ''
                }`.trim()}
                aria-invalid={Boolean(fieldState.error)}
                aria-describedby={fieldState.error ? errorId : undefined}
                onBlur={field.onBlur}
              >
                <RadixSelect.Value placeholder={placeholder} />

                <RadixSelect.Icon className={styles.icon}>
                  <ChevronDownIcon aria-hidden="true" />
                </RadixSelect.Icon>
              </RadixSelect.Trigger>

              <RadixSelect.Portal>
                <RadixSelect.Content
                  className={`${styles.content} ${contentClassName}`.trim()}
                  position="popper"
                  side={side}
                  sideOffset={sideOffset}
                  avoidCollisions={avoidCollisions}
                  collisionPadding={8}
                >
                  <RadixSelect.Viewport className={styles.viewport}>
                    {emptyOptionLabel && (
                      <RadixSelect.Item value={EMPTY_OPTION_VALUE} className={styles.item}>
                        <RadixSelect.ItemText>{emptyOptionLabel}</RadixSelect.ItemText>
                      </RadixSelect.Item>
                    )}

                    {options.map((option) => (
                      <RadixSelect.Item
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        className={styles.item}
                      >
                        <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                      </RadixSelect.Item>
                    ))}
                  </RadixSelect.Viewport>
                </RadixSelect.Content>
              </RadixSelect.Portal>
            </RadixSelect.Root>

            {fieldState.error?.message && (
              <span id={errorId} className={styles.errorText}>
                {fieldState.error.message}
              </span>
            )}
          </div>
        )
      }}
    />
  )
}
