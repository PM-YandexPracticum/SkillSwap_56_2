import { Button } from '../Button'
import ChevronDownIcon from '../icons/assets/chevron-down.svg?react'

import { ArrowButtonProps } from './type'
import styles from './ArrowButton.module.css'

export const ArrowButton = ({ isOpen, onClick, children, ...props }: ArrowButtonProps) => {
  const arrowClassName = [styles.arrow, isOpen ? styles.arrowOpen : ''].filter(Boolean).join(' ')

  return (
    <Button
      onClick={onClick}
      aria-expanded={isOpen}
      rightIcon={<ChevronDownIcon className={arrowClassName} aria-hidden="true" />}
      {...props}
    >
      {children}
    </Button>
  )
}
