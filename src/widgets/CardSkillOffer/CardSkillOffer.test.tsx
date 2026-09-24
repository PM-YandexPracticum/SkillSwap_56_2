import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useEmblaCarousel from 'embla-carousel-react'

import { CardSkillOffer, type CardSkillOfferProps } from './CardSkillOffer'

jest.mock('embla-carousel-react')

const useEmblaCarouselMock = useEmblaCarousel as jest.MockedFunction<typeof useEmblaCarousel>

type EmblaApi = NonNullable<ReturnType<typeof useEmblaCarousel>[1]>

const createEmblaApi = () =>
  ({
    selectedScrollSnap: jest.fn(() => 0),
    scrollPrev: jest.fn(),
    scrollNext: jest.fn(),
    scrollTo: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  }) as unknown as EmblaApi

const images = [
  { src: '/image-1.jpg', alt: 'Фото 1' },
  { src: '/image-2.jpg', alt: 'Фото 2' },
  { src: '/image-3.jpg', alt: 'Фото 3' },
]

const renderCard = (props: Partial<CardSkillOfferProps> = {}) =>
  render(
    <CardSkillOffer
      title="Игра на барабанах"
      category="Творчество и искусство"
      subcategory="Музыка и звук"
      description="Научу основам ритма"
      images={images}
      {...props}
    />,
  )

describe('CardSkillOffer', () => {
  beforeEach(() => {
    useEmblaCarouselMock.mockReturnValue([jest.fn(), createEmblaApi()] as unknown as ReturnType<
      typeof useEmblaCarousel
    >)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('рендерит заголовок, категорию и описание', () => {
    renderCard()

    expect(screen.getByRole('heading', { name: 'Игра на барабанах' })).toBeInTheDocument()
    expect(screen.getByText('Творчество и искусство / Музыка и звук')).toBeInTheDocument()
    expect(screen.getByText('Научу основам ритма')).toBeInTheDocument()
  })

  test('по клику на лайк вызывает onLikeToggle', async () => {
    const user = userEvent.setup()
    const onLikeToggle = jest.fn()

    renderCard({ onLikeToggle })

    await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }))

    expect(onLikeToggle).toHaveBeenCalledTimes(1)
  })

  test('в избранном показывает активный лайк', () => {
    renderCard({ isLiked: true })

    expect(screen.getByRole('button', { name: 'Убрать из избранного' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  test('рендерит кнопки шеринга, меню и предложения обмена', () => {
    renderCard()

    expect(screen.getByRole('button', { name: 'Поделиться' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ещё действия' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Предложить обмен' })).toBeInTheDocument()
  })
})
