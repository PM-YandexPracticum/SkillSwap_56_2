import { ArrowButtonProps } from './type'
import { Button } from '../Button'
import arrowIcon from '../icons/assets/arrow-square-right.svg'
import styles from './ArrowButton.module.css'

export const ArrowButton = ({ isOpen, onClick, children, ...props }: ArrowButtonProps) => {
  return (
    <Button
      onClick={onClick}
      aria-expanded={isOpen}
      rightIcon={
        <img
          src={arrowIcon}
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
          alt="кнопка выпадающего списка"
         
        />
      }
      {...props}
    >
      {children}
    </Button>
  )
}
