import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { ProfileSidebar } from './ProfileSidebar'

const renderSidebar = (path = '/profile/personal') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ProfileSidebar />
    </MemoryRouter>,
  )

describe('ProfileSidebar', () => {
  it('рендерит все пункты меню личного кабинета', () => {
    renderSidebar()

    expect(screen.getAllByRole('link')).toHaveLength(5)
    expect(screen.getByRole('link', { name: 'Заявки' })).toHaveAttribute(
      'href',
      '/profile/requests',
    )
    expect(screen.getByRole('link', { name: 'Личные данные' })).toHaveAttribute(
      'href',
      '/profile/personal',
    )
  })

  it('подсвечивает активный пункт', () => {
    renderSidebar('/profile/favorites')

    expect(screen.getByRole('link', { name: 'Избранное' })).toHaveClass('itemActive')
    expect(screen.getByRole('link', { name: 'Личные данные' })).not.toHaveClass('itemActive')
  })
})
