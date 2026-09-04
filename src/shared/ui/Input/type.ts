import {ReactNode} from 'react';

export interface InputProps {
value?: string; // управляемый компонент
defaultValue?: string; //неуправляемый компонент
onChange?: (value: string) => void;// функция обратного вызова при изменении значения инпута
placeholder?: string;// плейсхолдер
type?:string;// тип инпута (text, password, email)
disabled?: boolean;// отключить инпут
className?: string;// кастомный класс
rightElement?: ReactNode;// справа от инпута (иконка, кнопка)
leftElement?: ReactNode;// слева от инпута (иконка, кнопка)
label?: string;  //email  пароль
error?: string;  //неверный email  пароль
helperText?: string;  //введите email  введите пароль 
multiline?: boolean; // многострочный инпут
rows?: number; // количество строк для многострочного инпута
heightTextarea ?: string; // высота текстовой зоны (для многострочного инпута)

}