import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { FilterList } from './FilterList'
import type { FilterItem } from './types'

const cities: FilterItem[] = [
  { id: 'moscow', title: 'Москва' },
  { id: 'spb', title: 'Санкт-Петербург' },
  { id: 'kazan', title: 'Казань' },
]

const categories: FilterItem[] = [
  {
    id: 'business',
    title: 'Бизнес и карьера',
    children: [
      { id: 'marketing', title: 'Маркетинг' },
      { id: 'sales', title: 'Продажи' },
    ],
  },
]

const onChange = jest.fn()

/** Список управляемый, поэтому в тестах ему нужен владелец состояния */
const Controlled = ({ items, ...props }: { items: FilterItem[]; visibleCount?: number }) => {
  const [value, setValue] = useState<string[]>([])

  return (
    <FilterList
      title="Город"
      showAllLabel="Показать все"
      items={items}
      value={value}
      onChange={(next) => {
        onChange(next)
        setValue(next)
      }}
      {...props}
    />
  )
}

beforeEach(() => {
  onChange.mockClear()
})

describe('FilterList', () => {
  test('прячет пункты сверх visibleCount и показывает их по кнопке', () => {
    render(<Controlled items={cities} visibleCount={2} />)

    expect(screen.getByRole('checkbox', { name: 'Москва' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Казань' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Показать все' }))

    expect(screen.getByRole('checkbox', { name: 'Казань' })).toBeInTheDocument()
  })

  test('не рисует кнопку, когда прятать нечего', () => {
    render(<Controlled items={cities} visibleCount={3} />)

    expect(screen.queryByRole('button', { name: 'Показать все' })).not.toBeInTheDocument()
  })

  test('отдаёт наверх идентификатор выбранного пункта', () => {
    render(<Controlled items={cities} />)

    fireEvent.click(screen.getByRole('checkbox', { name: 'Москва' }))

    expect(onChange).toHaveBeenCalledWith(['moscow'])
  })

  test('выбор родителя выбирает все вложенные пункты', () => {
    render(<Controlled items={categories} />)

    fireEvent.click(screen.getByRole('checkbox', { name: 'Бизнес и карьера' }))

    expect(onChange).toHaveBeenCalledWith(['marketing', 'sales'])
  })

  test('родитель в промежуточном состоянии, когда выбрана часть вложенных', () => {
    render(<Controlled items={categories} />)

    fireEvent.click(screen.getByRole('button', { name: 'Развернуть «Бизнес и карьера»' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Маркетинг' }))

    const parent = screen.getByRole('checkbox', { name: 'Бизнес и карьера' })

    expect(parent).not.toBeChecked()
    expect(parent).toBePartiallyChecked()
  })

  test('показывает спиннер вместо текста статуса во время загрузки', () => {
    render(
      <FilterList
        title="Город"
        items={cities}
        value={[]}
        onChange={onChange}
        status="Загрузка…"
        isLoading
      />,
    )

    expect(screen.getByRole('status', { name: 'Загрузка...' })).toBeInTheDocument()
    expect(screen.queryByText('Загрузка…')).not.toBeInTheDocument()
  })

  test('разворачивает вложенный список по стрелке', () => {
    render(<Controlled items={categories} />)

    expect(screen.queryByRole('checkbox', { name: 'Маркетинг' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Развернуть «Бизнес и карьера»' }))

    expect(screen.getByRole('checkbox', { name: 'Маркетинг' })).toBeInTheDocument()
  })
})
