import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SortSelect } from './SortSelect'

describe('SortSelect', () => {
  test('закрыт по умолчанию и показывает текущую опцию', () => {
    render(<SortSelect value="newest" onChange={jest.fn()} />)

    const button = screen.getByRole('button', { name: /Сначала новые/ })

    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  test('по клику открывает список и отдаёт выбранную опцию наверх', async () => {
    const onChange = jest.fn()
    render(<SortSelect value="newest" onChange={onChange} />)

    const button = screen.getByRole('button', { name: /Сначала новые/ })
    await userEvent.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('option', { name: 'По популярности' }))

    expect(onChange).toHaveBeenCalledWith('popular')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  test('помечает выбранную опцию aria-selected', async () => {
    render(<SortSelect value="popular" onChange={jest.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: /По популярности/ }))

    expect(screen.getByRole('option', { name: 'По популярности' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('option', { name: 'Сначала новые' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  })

  test('закрывается по Escape', async () => {
    render(<SortSelect value="newest" onChange={jest.fn()} />)

    const button = screen.getByRole('button', { name: /Сначала новые/ })
    await userEvent.click(button)
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  test('закрывается по клику вне списка', async () => {
    render(<SortSelect value="newest" onChange={jest.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: /Сначала новые/ }))
    fireEvent.mouseDown(document.body)

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  test('после выбора повторный клик снова открывает список', async () => {
    render(<SortSelect value="newest" onChange={jest.fn()} />)

    const button = screen.getByRole('button', { name: /Сначала новые/ })
    await userEvent.click(button)
    await userEvent.click(screen.getByRole('option', { name: 'По популярности' }))
    await userEvent.click(button)

    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })
})
