import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useEmblaCarousel from 'embla-carousel-react'

import { Gallery, type GalleryImage, type GalleryProps } from './Gallery'

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

const images: GalleryImage[] = [
  { src: '/image-1.jpg', alt: 'Фото 1' },
  { src: '/image-2.jpg', alt: 'Фото 2' },
  { src: '/image-3.jpg', alt: 'Фото 3' },
  { src: '/image-4.jpg', alt: 'Фото 4' },
  { src: '/image-5.jpg', alt: 'Фото 5' },
]

const renderGallery = (props: Partial<GalleryProps> = {}) =>
  render(<Gallery images={images} {...props} />)

describe('Gallery', () => {
  let emblaApi: EmblaApi

  beforeEach(() => {
    emblaApi = createEmblaApi()

    useEmblaCarouselMock.mockReturnValue([jest.fn(), emblaApi] as unknown as ReturnType<
      typeof useEmblaCarousel
    >)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('рендерит все фотографии, главная доступна по alt', () => {
    renderGallery()

    expect(screen.getByAltText('Фото 1')).toBeInTheDocument()
    expect(screen.getByAltText('Фото 5')).toBeInTheDocument()
  })

  test('по клику на стрелки листает карусель', async () => {
    const user = userEvent.setup()

    renderGallery()

    await user.click(screen.getByRole('button', { name: 'Следующее фото' }))
    await user.click(screen.getByRole('button', { name: 'Предыдущее фото' }))

    expect(emblaApi.scrollNext).toHaveBeenCalledTimes(1)
    expect(emblaApi.scrollPrev).toHaveBeenCalledTimes(1)
  })

  test('показывает три превью и счётчик скрытых фото', () => {
    renderGallery()

    expect(screen.getAllByRole('button', { name: /Показать фото/ })).toHaveLength(3)
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  test('по клику на превью переходит к выбранному фото', async () => {
    const user = userEvent.setup()

    renderGallery()

    await user.click(screen.getByRole('button', { name: 'Показать фото 3' }))

    expect(emblaApi.scrollTo).toHaveBeenCalledWith(2)
  })

  test('не показывает стрелки и превью, если фото одно', () => {
    renderGallery({ images: [images[0]] })

    expect(screen.queryByRole('button', { name: 'Следующее фото' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Показать фото/ })).not.toBeInTheDocument()
  })

  test('ничего не рендерит без фото', () => {
    const { container } = render(<Gallery images={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
