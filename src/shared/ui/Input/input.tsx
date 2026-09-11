import React from 'react'
import styles from './input.module.css'
import { InputProps } from './type'
import clsx from 'clsx'

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      multiline = false,
      rows,
      heightTextarea = '',
      id,
      onChange,
      className = '',
      ...rest
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange?.(e.target.value)
    }

    const generatedId = React.useId()
    const inputId = id || generatedId // генерирует id для связки разных id

    const errorId = `${inputId}-error` // для чтения helper и error  под полями
    const helperId = `${inputId}-helper`

    return (
       <div className={`${styles.inputWrapper} ${className} `}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        {/* При фокусе внутри срабатывает стилизация :focus-within */}
        <div
          className={clsx(
            styles.inputContainer,
            { [styles.errorContainer]: Boolean(error) },
            heightTextarea,
          )}
        >
          {leftElement && <div className={styles.leftElement}>{leftElement}</div>}

          {multiline ? (
            <textarea
              id={inputId}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              rows={rows}
              className={styles.textarea}
              onChange={handleChange}
              {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : helperText ? helperId : undefined}
            />
          ) : (
            <input
              id={inputId}
              ref={ref as React.Ref<HTMLInputElement>}
              className={styles.input}
              onChange={handleChange}
              {...rest}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : helperText ? helperId : undefined}
            />
          )}

          {rightElement && <div className={styles.rightElement}>{rightElement}</div>}
        </div>

        {error && (
          <span id={errorId} className={styles.errorText}>
            {error}
          </span>
        )}
        {helperText && !error && (
          <span id={helperId} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
