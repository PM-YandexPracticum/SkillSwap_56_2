import type { SVGProps } from 'react'
import {
  render,
  screen,
} from '@testing-library/react'

import { InfoCard } from '@/shared/ui/InfoCard'

const TestIllustration = (
  props: SVGProps<SVGSVGElement>,
) => (
  <svg
    data-testid="illustration"
    {...props}
  />
)

test('рендерит иллюстрацию, заголовок и описание', () => {
  render(
    <InfoCard
      illustration={TestIllustration}
      title="Добро пожаловать в SkillSwap!"
      description="Обменивайтесь знаниями и навыками"
    />,
  )

  expect(
    screen.getByRole('heading', {
      name: 'Добро пожаловать в SkillSwap!',
    }),
  ).toBeInTheDocument()
  expect(
    screen.getByText(
      'Обменивайтесь знаниями и навыками',
    ),
  ).toBeInTheDocument()
  expect(
    screen.getByTestId('illustration'),
  ).toBeInTheDocument()
})
