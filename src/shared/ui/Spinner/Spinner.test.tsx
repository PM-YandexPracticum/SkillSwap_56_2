import { render, screen } from '@testing-library/react'

import { Spinner } from './Spinner'

describe('Spinner', () => {
  test('объявляет статус загрузки для скринридеров', () => {
    render(<Spinner />)

    expect(screen.getByRole('status', { name: 'Загрузка...' })).toBeInTheDocument()
  })

  test('применяет размер из пропса', () => {
    render(<Spinner size="lg" />)

    expect(screen.getByRole('status').firstElementChild).toHaveClass('spinner', 'lg')
  })

  test('fullPage добавляет класс на весь экран', () => {
    render(<Spinner fullPage />)

    expect(screen.getByRole('status')).toHaveClass('fullPage')
  })
})
