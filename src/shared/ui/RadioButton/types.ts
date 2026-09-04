import { ComponentPropsWithoutRef } from "react"

export interface RadioOption {
  title: string
  value: string
}

export type NativeInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'name'>
