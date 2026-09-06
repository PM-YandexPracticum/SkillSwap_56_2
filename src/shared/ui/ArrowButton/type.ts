import {ReactNode, ButtonHTMLAttributes} from 'react'



  export type ArrowButtonProps= Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> &{
   isOpen: boolean, 
   onClick:()=> void,
   children:ReactNode


  }

