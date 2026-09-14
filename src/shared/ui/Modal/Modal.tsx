import type { ReactElement, ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  Controller,
  type Control,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

import CrossIcon from '../icons/assets/cross.svg?react'
import styles from './Modal.module.css'

export interface ModalProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  name: TName
  control: Control<TFieldValues>
  rules?: ControllerProps<TFieldValues, TName>['rules']
  trigger?: ReactElement
  title: string
  description?: string
  children: ReactNode
  closeLabel?: string
  showCloseButton?: boolean
  className?: string
}

export const Modal = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  trigger,
  title,
  description,
  children,
  closeLabel = 'Закрыть модальное окно',
  showCloseButton = true,
  className = '',
}: ModalProps<TFieldValues, TName>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field }) => (
      <Dialog.Root
        open={Boolean(field.value)}
        onOpenChange={(open) => {
          field.onChange(open)

          if (!open) {
            field.onBlur()
          }
        }}
        modal
      >
        {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

        <Dialog.Portal>
          <Dialog.Overlay
            className={styles.overlay}
            data-modal-overlay
          />

          <Dialog.Content
            className={`${styles.content} ${className}`.trim()}
            onCloseAutoFocus={(event: Event) => {
              if (!trigger) {
                event.preventDefault()
              }
            }}
          >
            <Dialog.Title className={styles.title}>
              {title}
            </Dialog.Title>

            <Dialog.Description
              className={
                description
                  ? styles.description
                  : styles.visuallyHidden
              }
            >
              {description ?? title}
            </Dialog.Description>

            <div className={styles.body}>
              {children}
            </div>

            {showCloseButton && (
              <Dialog.Close asChild>
                <button
                  type="button"
                  className={styles.closeButton}
                  aria-label={closeLabel}
                >
                  <CrossIcon aria-hidden="true" />
                </button>
              </Dialog.Close>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )}
  />
)