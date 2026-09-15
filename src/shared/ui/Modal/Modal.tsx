import type { ReactElement, ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import CrossIcon from '../icons/assets/cross.svg?react'
import styles from './Modal.module.css'

export interface ModalProps {
  /** Управляемый режим: открытость держит вызывающая сторона */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Неуправляемый режим: модалку открывает и закрывает сам trigger */
  defaultOpen?: boolean
  trigger?: ReactElement
  title: string
  description?: string
  children: ReactNode
  closeLabel?: string
  showCloseButton?: boolean
  className?: string
}

export const Modal = ({
  open,
  onOpenChange,
  defaultOpen,
  trigger,
  title,
  description,
  children,
  closeLabel = 'Закрыть модальное окно',
  showCloseButton = true,
  className = '',
}: ModalProps) => (
  <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal>
    {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} data-modal-overlay />

      <Dialog.Content
        className={`${styles.content} ${className}`.trim()}
        onCloseAutoFocus={(event: Event) => {
          if (!trigger) {
            event.preventDefault()
          }
        }}
      >
        <Dialog.Title className={styles.title}>{title}</Dialog.Title>

        {/* Описание рисуем только когда оно есть: дублировать заголовок в aria нечего,
            Radix сам проставляет aria-describedby лишь при наличии Description */}
        {description && (
          <Dialog.Description className={styles.description}>{description}</Dialog.Description>
        )}

        <div className={styles.body}>{children}</div>

        {showCloseButton && (
          <Dialog.Close asChild>
            <button type="button" className={styles.closeButton} aria-label={closeLabel}>
              <CrossIcon aria-hidden="true" />
            </button>
          </Dialog.Close>
        )}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)
