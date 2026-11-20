// Route guards and the role-aware nav bar, tested against the real app.

import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { signup } from '../../src/api'
import { currentPath, renderApp } from '../helpers/renderApp'

const expectPath = (path) => waitFor(() => expect(currentPath()).toBe(path))

describe('route guards', () => {
  it('sends logged-out users to /login', async () => {
    renderApp('/home')
    await expectPath('/login')
  })

  it('sends logged-in users away from /login to /home', async () => {
    renderApp('/login', { as: 's1' })
    await expectPath('/home')
  })

  it('sends unverified users to /verify', async () => {
    const user = await signup({
      email: 'fresh@northeastern.edu',
      password: 'password123',
      role: 'student',
    })
    renderApp('/home', { as: user.id })
    await expectPath('/verify')
  })

  it('sends verified but not-onboarded users to their onboarding flow', async () => {
    const { verifyEmail } = await import('../../src/api')
    const user = await signup({
      email: 'fresh.alum@northeastern.edu',
      password: 'password123',
      role: 'alumni',
    })
    await verifyEmail(user.id, '123456')
    renderApp('/home', { as: user.id })
    await expectPath('/onboarding/alumni')
  })

  it('keeps alumni out of student-only pages', async () => {
    renderApp('/search', { as: 'a1' })
    await expectPath('/home')
  })

  it('keeps students out of alumni-only pages', async () => {
    renderApp('/posts/new', { as: 's1' })
    await expectPath('/home')
  })

  it('passes the :userId URL param through to the chat page', async () => {
    renderApp('/chat/a1', { as: 's1' })
    await expectPath('/chat/a1')
    expect(await screen.findByText('a1')).toBeInTheDocument()
  })

  it('shows a 404 page for unknown URLs', async () => {
    renderApp('/does-not-exist')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})

describe('nav bar', () => {
  const nav = () => screen.getByRole('navigation', { name: 'Main' })

  it('shows Log in / Sign up when logged out', async () => {
    renderApp('/')
    expect(await within(nav()).findByRole('link', { name: 'Sign up' })).toBeInTheDocument()
  })

  it('shows student links for a student', async () => {
    renderApp('/home', { as: 's1' })
    expect(await within(nav()).findByRole('link', { name: 'Find alumni' })).toBeInTheDocument()
    expect(within(nav()).queryByRole('link', { name: 'New post' })).not.toBeInTheDocument()
  })

  it('shows alumni links for an alum', async () => {
    renderApp('/home', { as: 'a1' })
    expect(await within(nav()).findByRole('link', { name: 'New post' })).toBeInTheDocument()
    expect(within(nav()).queryByRole('link', { name: 'Find alumni' })).not.toBeInTheDocument()
  })

  it('logs out and returns to the landing page', async () => {
    renderApp('/home', { as: 's1' })
    await userEvent.click(await within(nav()).findByRole('button', { name: 'Log out' }))
    await expectPath('/')
    expect(localStorage.getItem('hc:session')).toBeNull()
  })

  it('has a skip link to the main content', async () => {
    renderApp('/')
    expect(await screen.findByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#main',
    )
  })
})
