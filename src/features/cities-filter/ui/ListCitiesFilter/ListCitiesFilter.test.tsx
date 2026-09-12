import { fireEvent, render, screen } from '@testing-library/react'

import { ListCitiesFilter } from './ListCitiesFilter'

const cities = [
  { id: '1', title: 'Москва' },
  { id: '2', title: 'Санкт-Петербург' },
  { id: '3', title: 'Новосибирск' },
  { id: '4', title: 'Екатеринбург' },
  { id: '5', title: 'Казань' },
  { id: '6', title: 'Нижний Новгород' },
]

const fetchMock = jest.fn()

describe('ListCitiesFilter', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'fetch', {
      writable: true,
      configurable: true,
      value: fetchMock,
    })

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => cities,
    })
  })

  afterEach(() => {
    fetchMock.mockReset()
  })

  test('показывает первые пять городов', async () => {
    render(<ListCitiesFilter />)

    expect(await screen.findByRole('checkbox', { name: 'Москва' })).toBeInTheDocument()

    expect(screen.getByRole('checkbox', { name: 'Санкт-Петербург' })).toBeInTheDocument()

    expect(screen.getByRole('checkbox', { name: 'Новосибирск' })).toBeInTheDocument()

    expect(screen.getByRole('checkbox', { name: 'Екатеринбург' })).toBeInTheDocument()

    expect(screen.getByRole('checkbox', { name: 'Казань' })).toBeInTheDocument()

    expect(screen.queryByRole('checkbox', { name: 'Нижний Новгород' })).not.toBeInTheDocument()
  })

  test('показывает остальные города после нажатия на кнопку', async () => {
    render(<ListCitiesFilter />)

    await screen.findByRole('checkbox', { name: 'Москва' })

    const button = screen.getByRole('button', {
      name: 'Все города',
    })

    fireEvent.click(button)

    expect(screen.getByRole('checkbox', { name: 'Нижний Новгород' })).toBeInTheDocument()
  })

  test('позволяет выбрать город', async () => {
    render(<ListCitiesFilter />)

    const checkbox = await screen.findByRole('checkbox', {
      name: 'Москва',
    })

    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)

    expect(checkbox).toBeChecked()
  })
})
