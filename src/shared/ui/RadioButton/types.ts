import { ChangeEventHandler, ComponentPropsWithoutRef } from 'react'

export interface RadioOption {
  title: string
  value: string
}

export type NativeInputProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'name' | 'defaultChecked' | 'checked' | 'value'
>

export type ControlledRadioButtonProps = {
  checked: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
  defaultChecked?: never
}

export type UncontrolledRadioButtonProps = {
  defaultChecked?: boolean
  checked?: never
}

export type RadioButtonStateProps = ControlledRadioButtonProps | UncontrolledRadioButtonProps

export const isControlledRadioButton = (
  props: RadioButtonStateProps,
): props is ControlledRadioButtonProps => props.checked !== undefined
