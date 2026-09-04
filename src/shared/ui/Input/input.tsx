import React from 'react'
import styles from './input.module.css'
import { InputProps } from './type'

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      placeholder,
      type = 'text',
      disabled = false,
      className = '',
      heightTextarea = '',
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      multiline = false,
      rows,
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange?.(e.target.value)
    }

    return (
      <div className={`${styles.inputWrapper} ${className} `}>
        {label && <label className={styles.label}>{label}</label>}

        {/* При фокусе внутри срабатывает стилизация :focus-within */}
        <div
          className={`${styles.inputContainer} ${error ? styles.errorContainer : ''} ${heightTextarea} `}
        >
          {leftElement && <div className={styles.leftElement}>{leftElement}</div>}

          {multiline ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>} // Ref прокинут в textarea
              value={value}
              defaultValue={defaultValue}
              onChange={handleChange}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={styles.textarea}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>} // Ref прокинут в input
              type={type}
              value={value}
              defaultValue={defaultValue}
              onChange={handleChange}
              placeholder={placeholder}
              disabled={disabled}
              className={styles.textarea}
            />
          )}

          {rightElement && <div className={styles.rightElement}>{rightElement}</div>}
        </div>

        {error && <span className={styles.errorText}>{error}</span>}
        {helperText && <span className={styles.helperText}>{helperText}</span>}
      </div>
    )
  },
)

// Хорошая практика для компонентов с forwardRef в React
Input.displayName = 'Input'
