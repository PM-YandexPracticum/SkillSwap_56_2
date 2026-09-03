import React, { useState } from 'react'
import styles from './input.module.css'
import { InputProps } from './type'

export const Input = ({
  value,
  defaultValue,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  className='',
  label,
  error,
  helperText,
  leftElement,
  rightElement
}: InputProps) => {
 
 
 
 
 
 
 
 
 
 
 
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputContainer}> 
      {leftElement && <div className={styles.leftElement}>{leftElement}</div>}

  


      <input
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
            className={styles.input}
      />
      {rightElement && <div className={styles.rightElement}>{rightElement}</div>}
      </div>
      {error && <span className={styles.error}>{error}</span>}
      {helperText && <span className={styles.helperText}>{helperText}</span>}
    </div>
  )
}
