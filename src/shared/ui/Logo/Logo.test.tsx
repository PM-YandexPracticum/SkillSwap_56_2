import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { Logo } from './Logo'

test('рендерит логотип со ссылкой на главную', () => {
  render(<Logo />, { wrapper: MemoryRouter })

  expect(screen.getByText('SkillSwap')).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: 'SkillSwap — на главную' }),
  ).toHaveAttribute('href', '/')
})
