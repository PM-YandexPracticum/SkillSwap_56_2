import {ReactNode, InputHTMLAttributes }  from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
onChange?: (value: string) => void;// функция обратного вызова при изменении значения инпута
rightElement?: ReactNode;// справа от инпута (иконка, кнопка)
leftElement?: ReactNode;// слева от инпута (иконка, кнопка)
label?: string;  //email  пароль
error?: string;  //неверный email  пароль
helperText?: string;  //введите email  введите пароль 
multiline?: boolean; // многострочный инпут
rows?: number; // количество строк для многострочного инпута
heightTextarea ?: string; // высота текстовой зоны (для многострочного инпута)
}