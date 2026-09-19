import { fireEvent, render, screen } from '@testing-library/react'

import { resetCitiesCache } from '@/entities/city'

import { ListCitiesFilter } from './ListCitiesFilter'

const cities = [
  { id: 'moscow', title: 'Москва' },
  { id: 'spb', title: 'Санкт-Петербург' },
  { id: 'novosibirsk', title: 'Новосибирск' },
  { id: 'yekaterinburg', title: 'Екатеринбург' },
  { id: 'kazan', title: 'Казань' },
  { id: 'nizhny-novgorod', title: 'Нижний Новгород' },
]

const fetchMock = jest.fn()
const onChange = jest.fn()

beforeEach(() => {
  resetCitiesCache()

  Object.defineProperty(globalThis, 'fetch', {
    writable: true,
    configurable: true,
    value: fetchMock,
  })

  fetchMock.mockResolvedValue({ ok: true, json: async () => cities })
  onChange.mockClear()
})

afterEach(() => {
  fetchMock.mockReset()
})

describe('ListCitiesFilter', () => {
  test('загружает города и показывает первые пять', async () => {
    render(<ListCitiesFilter value={[]} onChange={onChange} />)

    expect(await screen.findByRole('checkbox', { name: 'Москва' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Казань' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Нижний Новгород' })).not.toBeInTheDocument()
  })

  test('показывает остальные города по кнопке', async () => {
    render(<ListCitiesFilter value={[]} onChange={onChange} />)

    await screen.findByRole('checkbox', { name: 'Москва' })
    fireEvent.click(screen.getByRole('button', { name: 'Все города' }))

    expect(screen.getByRole('checkbox', { name: 'Нижний Новгород' })).toBeInTheDocument()
  })

  test('отдаёт выбор наверх идентификаторами', async () => {
    render(<ListCitiesFilter value={[]} onChange={onChange} />)

    fireEvent.click(await screen.findByRole('checkbox', { name: 'Москва' }))

    expect(onChange).toHaveBeenCalledWith(['moscow'])
  })

  test('отражает выбор, пришедший снаружи', async () => {
    render(<ListCitiesFilter value={['moscow']} onChange={onChange} />)

    expect(await screen.findByRole('checkbox', { name: 'Москва' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Казань' })).not.toBeChecked()
  })

  test('сообщает об ошибке загрузки', async () => {
    fetchMock.mockResolvedValue({ ok: false })

    render(<ListCitiesFilter value={[]} onChange={onChange} />)

    expect(await screen.findByText('Не удалось загрузить города')).toBeInTheDocument()
  })
})
