// Aidan: sign up, sign in, and onboarding.
// Each describe/it name starts with its requirement ID from docs/REQUIREMENTS.md.
// Replace each it.todo with a real test as you build the page.
//
// Example of a real page test:
//
//   import { screen } from '@testing-library/react'
//   import userEvent from '@testing-library/user-event'
//   import { currentPath, renderApp } from '../helpers/renderApp'
//
//   it('F-A1: logs in with valid credentials and goes to /home', async () => {
//     renderApp('/login')
//     await userEvent.type(await screen.findByLabelText('Email'), 'alex.chen@northeastern.edu')
//     await userEvent.type(screen.getByLabelText('Password'), 'password')
//     await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))
//     await waitFor(() => expect(currentPath()).toBe('/home'))
//   })

import { describe, it } from 'vitest'

describe('F-A1–F-A3 Login', () => {
  it.todo('F-A1: logs in with valid credentials and goes to /home')
  it.todo('F-A2: shows "Wrong email or password", stays on /login, and keeps the email')
  it.todo('F-A3: returns to the page the user originally tried to visit')
})

describe('F-A4–F-A6 Create account', () => {
  it.todo('F-A4: asks "Student / Alumni" and opens the matching account form')
  it.todo('F-A5: shows a field error for a non-@northeastern.edu email')
  it.todo('F-A6: names the failed password rule (length, special character, mismatch)')
})

describe('F-A7 Email verification', () => {
  it.todo('F-A7: rejects a wrong code with a visible error')
  it.todo('F-A7: accepts the mock code and goes to step 1 of the right onboarding flow')
})

describe('F-A8 Reset password', () => {
  it.todo('F-A8: a valid new password returns to login with "Password updated"')
  it.todo('F-A8: a mismatch or rule failure shows Reset Error and stays on the form')
})

describe('F-B1–F-B8 Onboarding', () => {
  it.todo('F-B1: Back returns to the previous step with entered values kept')
  it.todo('F-B2: Next with an empty required field stays on the step and shows the error')
  it.todo('F-B3: student completes 3 steps, profile is saved, lands on /home')
  it.todo('F-B4: alum completes 5 steps, profile is saved, lands on /home')
  it.todo('F-B5: + Add Experience adds an entry and Remove deletes one')
  it.todo('F-B6: networking status is a radio group with one choice and descriptions')
  it.todo('F-B7: links use a "Platform" label and reject URLs without http(s)://')
  it.todo('F-B8: a non-PDF or >5 MB resume shows Upload Error; a PDF shows its file name')
})
