import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getUser } from '../../src/api'
import { ProfileCard } from '../../src/components'
import { renderWithRouter } from '../helpers/renderApp'

describe('ProfileCard', () => {
  it('F-D9: shows an alum’s name, title, company, major, and networking status', async () => {
    renderWithRouter(<ProfileCard user={await getUser('a1')} />)
    expect(screen.getByRole('heading', { name: 'Maria Gonzalez' })).toBeInTheDocument()
    expect(screen.getByText('Senior Software Engineer at Google')).toBeInTheDocument()
    expect(screen.getByText('Computer Science')).toBeInTheDocument()
    expect(screen.getByText('Open to referrals')).toBeInTheDocument()
  })

  it('shows a student’s major and class year', async () => {
    renderWithRouter(<ProfileCard user={await getUser('s1')} />)
    expect(screen.getByText('Computer Science · Class of 2027')).toBeInTheDocument()
  })

  it('F-D9: links the name to the person’s profile page', async () => {
    renderWithRouter(<ProfileCard user={await getUser('a1')} />)
    expect(screen.getByRole('link', { name: 'Maria Gonzalez' })).toHaveAttribute(
      'href',
      '/profile/a1',
    )
  })

  it('limits the number of skills shown', async () => {
    renderWithRouter(<ProfileCard user={await getUser('a1')} maxSkills={2} />)
    expect(screen.getByText('+2 more')).toBeInTheDocument()
  })
})
