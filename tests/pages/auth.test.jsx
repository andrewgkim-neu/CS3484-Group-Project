// Aidan: sign up, sign in, and onboarding.
// Replace each it.todo with a real test as you build the page. Rename the
// describe blocks to match your requirement IDs from the Part 4 spec (e.g. "FR-2.1").
//
// Example of a real page test:
//
//   import { screen } from '@testing-library/react'
//   import userEvent from '@testing-library/user-event'
//   import { currentPath, renderApp } from '../helpers/renderApp'
//
//   it('logs in with valid credentials', async () => {
//     renderApp('/login')
//     await userEvent.type(await screen.findByLabelText('Email'), 'alex.chen@northeastern.edu')
//     await userEvent.type(screen.getByLabelText('Password'), 'password')
//     await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
//     await waitFor(() => expect(currentPath()).toBe('/home'))
//   })

import { describe, it } from 'vitest'

describe('Login page', () => {
  it.todo('logs in with valid credentials and goes to /home')
  it.todo('shows an error message for a wrong password')
  it.todo('returns to the page the user originally tried to visit')
})

describe('Sign up page', () => {
  it.todo('lets the user choose student or alum')
  it.todo('shows an error for a non-@northeastern.edu email')
  it.todo('creates the account and goes to /verify')
})

describe('Email verification', () => {
  it.todo('rejects a wrong code with a visible error')
  it.todo('accepts the mock code and goes to the right onboarding flow')
})

describe('Student onboarding', () => {
  it.todo('requires grad year and major')
  it.todo('lets the user add and remove work history entries')
  it.todo('shows the uploaded resume file name')
  it.todo('saves answers and goes to /home')
})

describe('Alumni onboarding', () => {
  it.todo('requires job title and major')
  it.todo('lets the user add skills as tags')
  it.todo('lets the user pick a networking status')
  it.todo('validates LinkedIn / social links as URLs')
  it.todo('saves answers and goes to /home')
})
