import { render } from '@testing-library/react'
import { ArrowButton } from './ArrowButton'

jest.mock('../icons/assets/arrow-square-right.svg', () => 'test-file-stub')
describe('ArrowButton', () => {
  test('отображает текст и обрабатывает клик', () => {
    const handleClick = jest.fn()

    const { getByText, getByRole } = render(
      <ArrowButton isOpen={false} onClick={handleClick}>
        Все навыки
      </ArrowButton>,
    )

    expect(getByText('Все навыки')).toBeInTheDocument()

    getByRole('button').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('передает aria-expanded=true при открытии', () => {
    const { getByRole } = render(
      <ArrowButton isOpen={true} onClick={() => {}}>
        Все навыки
      </ArrowButton>,
    )

    expect(getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })
})
