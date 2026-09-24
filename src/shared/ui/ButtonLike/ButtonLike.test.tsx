import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ButtonLike } from './ButtonLike'

describe('ButtonLike', () => {
  test('отображает кнопку с aria-pressed в зависимости от isLiked', () => {
    render(<ButtonLike isLiked={false} onClick={jest.fn()} />)

    const button = screen.getByRole('button')

    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  test('установляет aria-pressed="true" когда isLiked=true', () => {
    render(<ButtonLike isLiked onClick={jest.fn()} />)

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  test('вызывает onClick при клике', async () => {
    const handleClick = jest.fn()
    render(<ButtonLike isLiked={false} onClick={handleClick} />)

    await userEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('передаёт aria-label', () => {
    render(<ButtonLike isLiked={false} onClick={jest.fn()} label="Добавить в избранное" />)

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Добавить в избранное')
  })

  test('отображает иконку', () => {
    render(<ButtonLike isLiked={false} onClick={jest.fn()} />)

    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument()
  })
})
