import {
  render,
  screen,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'

import { Modal } from './Modal'

interface FormValues {
  isOpen: boolean
}

const TestModal = () => {
  const { control } =
    useForm<FormValues>({
      defaultValues: {
        isOpen: false,
      },
    })

  return (
    <Modal
      name="isOpen"
      control={control}
      title="Редактирование профиля"
      trigger={
        <button type="button">
          Открыть
        </button>
      }
    >
      <button type="button">
        Первая кнопка
      </button>

      <button type="button">
        Вторая кнопка
      </button>
    </Modal>
  )
}

describe('Modal', () => {
  test(
    'рендерится в portal',
    async () => {
      const user =
        userEvent.setup()

      const { container } =
        render(<TestModal />)

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Открыть',
          },
        ),
      )

      const dialog =
        screen.getByRole(
          'dialog',
          {
            name:
              'Редактирование профиля',
          },
        )

      expect(
        dialog,
      ).toBeInTheDocument()

      expect(
        container.querySelector(
          '[role="dialog"]',
        ),
      ).toBeNull()

      expect(
        document.body,
      ).toContainElement(dialog)
    },
  )

  test(
    'закрывается по Esc',
    async () => {
      const user =
        userEvent.setup()

      render(<TestModal />)

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Открыть',
          },
        ),
      )

      expect(
        screen.getByRole(
          'dialog',
        ),
      ).toBeInTheDocument()

      await user.keyboard(
        '{Escape}',
      )

      expect(
        screen.queryByRole(
          'dialog',
        ),
      ).not.toBeInTheDocument()
    },
  )

  test(
    'закрывается по клику на overlay',
    async () => {
      const user =
        userEvent.setup()

      render(<TestModal />)

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Открыть',
          },
        ),
      )

      const overlay =
        document.querySelector(
          '[data-modal-overlay]',
        )

      expect(
        overlay,
      ).toBeInTheDocument()

      await user.click(
        overlay as Element,
      )

      expect(
        screen.queryByRole(
          'dialog',
        ),
      ).not.toBeInTheDocument()
    },
  )

  test(
    'удерживает фокус внутри модального окна',
    async () => {
      const user =
        userEvent.setup()

      render(<TestModal />)

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Открыть',
          },
        ),
      )

      const dialog =
        screen.getByRole(
          'dialog',
        )

      for (
        let index = 0;
        index < 6;
        index += 1
      ) {
        await user.tab()

        expect(
          dialog,
        ).toContainElement(
          document.activeElement as HTMLElement,
        )
      }
    },
  )
})