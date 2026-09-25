import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { resetCitiesCache } from '@/entities/city'
import { resetSkillCategoriesCache } from '@/entities/skill'
import { DEFAULT_FILTERS, type CatalogFilters } from '@/entities/user'

import { ActiveFilters } from './ActiveFilters'

const cities = [{ id: 'moscow', title: 'Москва' }]
const categories = [
  {
    id: 'foreign-languages',
    title: 'Иностранные языки',
    skills: [{ id: 'english', title: 'Английский' }],
  },
]

const fetchMock = jest.fn()

beforeEach(() => {
  resetCitiesCache()
  resetSkillCategoriesCache()

  Object.defineProperty(globalThis, 'fetch', {
    writable: true,
    configurable: true,
    value: fetchMock,
  })

  fetchMock.mockImplementation((url: string) =>
    Promise.resolve({
      ok: true,
      json: async () => (url.includes('cities') ? cities : categories),
    }),
  )
})

afterEach(() => {
  fetchMock.mockReset()
})

const activeFilters: CatalogFilters = {
  ...DEFAULT_FILTERS,
  type: 'learn',
  gender: 'male',
  skills: ['english'],
  cities: ['moscow'],
}

describe('ActiveFilters', () => {
  test('ничего не рисует и не грузит справочники без активных фильтров', () => {
    const { container } = render(<ActiveFilters filters={DEFAULT_FILTERS} onChange={jest.fn()} />)

    expect(container).toBeEmptyDOMElement()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('показывает количество фильтров и чипсы с названиями из справочников', async () => {
    render(<ActiveFilters filters={activeFilters} onChange={jest.fn()} />)

    expect(await screen.findByText('Фильтры (4)')).toBeInTheDocument()
    expect(screen.getByText('Хочу научиться')).toBeInTheDocument()
    expect(screen.getByText('Мужской')).toBeInTheDocument()
    expect(await screen.findByText('Английский')).toBeInTheDocument()
    expect(screen.getByText('Москва')).toBeInTheDocument()
  })

  test('показывает id, если справочник ещё не отдал название', () => {
    render(
      <ActiveFilters
        filters={{ ...DEFAULT_FILTERS, skills: ['unknown'], cities: ['unknown-city'] }}
        onChange={jest.fn()}
      />,
    )

    expect(screen.getByText('unknown')).toBeInTheDocument()
    expect(screen.getByText('unknown-city')).toBeInTheDocument()
  })

  test('снятие чипа навыка отдаёт фильтры без него', async () => {
    const onChange = jest.fn()
    render(<ActiveFilters filters={activeFilters} onChange={onChange} />)

    await userEvent.click(await screen.findByRole('button', { name: 'Убрать навык из фильтра' }))

    expect(onChange).toHaveBeenCalledWith({ ...activeFilters, skills: [] })
  })

  test('снятие чипа города отдаёт фильтры без него', async () => {
    const onChange = jest.fn()
    render(<ActiveFilters filters={activeFilters} onChange={onChange} />)

    await userEvent.click(await screen.findByRole('button', { name: 'Убрать город из фильтра' }))

    expect(onChange).toHaveBeenCalledWith({ ...activeFilters, cities: [] })
  })

  test('снятие чипа типа возвращает значение по умолчанию', async () => {
    const onChange = jest.fn()
    render(<ActiveFilters filters={activeFilters} onChange={onChange} />)

    await userEvent.click(await screen.findByRole('button', { name: 'Убрать фильтр по типу' }))

    expect(onChange).toHaveBeenCalledWith({ ...activeFilters, type: DEFAULT_FILTERS.type })
  })

  test('снятие чипа пола возвращает значение по умолчанию', async () => {
    const onChange = jest.fn()
    render(<ActiveFilters filters={activeFilters} onChange={onChange} />)

    await userEvent.click(await screen.findByRole('button', { name: 'Убрать фильтр по полу' }))

    expect(onChange).toHaveBeenCalledWith({ ...activeFilters, gender: DEFAULT_FILTERS.gender })
  })

  test('кнопка «Сбросить» отдаёт фильтры по умолчанию', async () => {
    const onChange = jest.fn()
    render(<ActiveFilters filters={activeFilters} onChange={onChange} />)

    await userEvent.click(await screen.findByRole('button', { name: /Сбросить/ }))

    expect(onChange).toHaveBeenCalledWith(DEFAULT_FILTERS)
  })
})
