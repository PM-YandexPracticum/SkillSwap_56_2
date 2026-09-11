import { render, screen } from '@testing-library/react'

import { InfoCard } from './InfoCard'

test('рендерит иллюстрацию, заголовок и описание', () => {
  const { container } = render(
    <InfoCard
      illustration="/light-bulb.svg"
      title="Добро пожаловать в SkillSwap!"
      description="Обменивайтесь знаниями и навыками"
    />,
  )

  expect(screen.getByRole('heading', { name: 'Добро пожаловать в SkillSwap!' })).toBeInTheDocument()
  expect(screen.getByText('Обменивайтесь знаниями и навыками')).toBeInTheDocument()
  expect(container.querySelector('img')).toHaveAttribute('src', '/light-bulb.svg')
})
