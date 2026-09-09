import { ChangeEventHandler, ComponentPropsWithoutRef } from 'react'

export interface RadioOption {
  title: string
  value: string
}

export type NativeInputProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'name' | 'defaultChecked' | 'checked' | 'value'
>

type ControlledRadioButtonProps = {
  checked: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
  defaultChecked?: never
}

type UncontrolledRadioButtonProps = {
  defaultChecked?: boolean
  checked?: never
}

export type RadioButtonStateProps = ControlledRadioButtonProps | UncontrolledRadioButtonProps
