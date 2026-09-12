import { fireEvent, render, screen } from '@testing-library/react'

import { ListSkillsFilter } from './ListSkillsFilter'

const categories = [
  {
    id: 'business-career',
    title: 'Бизнес и карьера',
    skills: [
      { id: 'marketing', title: 'Маркетинг и реклама' },
      { id: 'time-management', title: 'Тайм-менеджмент' },
    ],
  },
  {
    id: 'foreign-languages',
    title: 'Иностранные языки',
    skills: [{ id: 'english', title: 'Английский' }],
  },
]

const fetchMock = jest.fn()
const onChange = jest.fn()

beforeEach(() => {
  Object.defineProperty(globalThis, 'fetch', {
    writable: true,
    configurable: true,
    value: fetchMock,
  })

  fetchMock.mockResolvedValue({ ok: true, json: async () => categories })
  onChange.mockClear()
})

afterEach(() => {
  fetchMock.mockReset()
})

describe('ListSkillsFilter', () => {
  test('загружает категории и держит навыки свёрнутыми', async () => {
    render(<ListSkillsFilter value={[]} onChange={onChange} />)

    expect(await screen.findByRole('checkbox', { name: 'Бизнес и карьера' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Тайм-менеджмент' })).not.toBeInTheDocument()
  })

  test('раскрывает навыки категории', async () => {
    render(<ListSkillsFilter value={[]} onChange={onChange} />)

    fireEvent.click(await screen.findByRole('button', { name: 'Развернуть «Бизнес и карьера»' }))

    expect(screen.getByRole('checkbox', { name: 'Тайм-менеджмент' })).toBeInTheDocument()
  })

  test('выбор категории отдаёт наверх id всех её навыков', async () => {
    render(<ListSkillsFilter value={[]} onChange={onChange} />)

    fireEvent.click(await screen.findByRole('checkbox', { name: 'Бизнес и карьера' }))

    expect(onChange).toHaveBeenCalledWith(['marketing', 'time-management'])
  })

  test('категория в промежуточном состоянии, когда выбрана часть навыков', async () => {
    render(<ListSkillsFilter value={['marketing']} onChange={onChange} items={categories} />)

    const category = await screen.findByRole('checkbox', { name: 'Бизнес и карьера' })

    expect(category).not.toBeChecked()
    expect(category).toBePartiallyChecked()
  })

  test('сообщает об ошибке загрузки', async () => {
    fetchMock.mockResolvedValue({ ok: false })

    render(<ListSkillsFilter value={[]} onChange={onChange} />)

    expect(await screen.findByText('Не удалось загрузить навыки')).toBeInTheDocument()
  })

  test('не рисует «Все категории», пока прятать нечего', async () => {
    render(<ListSkillsFilter value={[]} onChange={onChange} items={categories} />)

    expect(screen.queryByRole('button', { name: 'Все категории' })).not.toBeInTheDocument()
  })
})
