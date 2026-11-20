import { describe, expect, it } from 'vitest'
import {
  completeOnboarding,
  getCurrentUser,
  isNortheasternEmail,
  login,
  logout,
  signup,
  verifyEmail,
} from '../../src/api'
import { MOCK_VERIFICATION_CODE } from '../../src/constants'

const newStudent = {
  email: 'new.student@northeastern.edu',
  password: 'password123',
  firstName: 'New',
  lastName: 'Student',
  role: 'student',
}

describe('login / logout', () => {
  it('logs in with the right password and never returns the password', async () => {
    const user = await login('alex.chen@northeastern.edu', 'password')
    expect(user.id).toBe('s1')
    expect(user).not.toHaveProperty('password')
    expect((await getCurrentUser()).id).toBe('s1')
  })

  it('ignores email case and surrounding spaces', async () => {
    const user = await login('  ALEX.CHEN@northeastern.edu ', 'password')
    expect(user.id).toBe('s1')
  })

  it('rejects a wrong password', async () => {
    await expect(login('alex.chen@northeastern.edu', 'wrong')).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
    })
    expect(await getCurrentUser()).toBeNull()
  })

  it('logs out', async () => {
    await login('alex.chen@northeastern.edu', 'password')
    await logout()
    expect(await getCurrentUser()).toBeNull()
  })
})

describe('sign up requires a Northeastern email', () => {
  it.each([
    ['someone@northeastern.edu', true],
    ['SOMEONE@Northeastern.edu', true],
    ['someone@gmail.com', false],
    ['someone@northeastern.edu.evil.com', false],
    ['@northeastern.edu', false],
  ])('isNortheasternEmail(%s) → %s', (email, expected) => {
    expect(isNortheasternEmail(email)).toBe(expected)
  })

  it('rejects a non-Northeastern address', async () => {
    await expect(signup({ ...newStudent, email: 'new@gmail.com' })).rejects.toThrow(
      /northeastern\.edu/,
    )
  })

  it('rejects a short password', async () => {
    await expect(signup({ ...newStudent, password: 'short' })).rejects.toThrow(/8 characters/)
  })

  it('rejects an email that already has an account', async () => {
    await expect(
      signup({ ...newStudent, email: 'alex.chen@northeastern.edu' }),
    ).rejects.toMatchObject({ status: 409 })
  })

  it('creates an unverified, not-onboarded account and logs in as it', async () => {
    const user = await signup(newStudent)
    expect(user).toMatchObject({ role: 'student', emailVerified: false, onboarded: false })
    expect((await getCurrentUser()).id).toBe(user.id)
  })
})

describe('email verification', () => {
  it('rejects a wrong code', async () => {
    const user = await signup(newStudent)
    await expect(verifyEmail(user.id, '000000')).rejects.toThrow(/incorrect/)
  })

  it('accepts the mock code', async () => {
    const user = await signup(newStudent)
    const verified = await verifyEmail(user.id, MOCK_VERIFICATION_CODE)
    expect(verified.emailVerified).toBe(true)
  })
})

describe('onboarding', () => {
  it('saves profile fields and marks the user onboarded', async () => {
    const user = await signup(newStudent)
    const done = await completeOnboarding(user.id, { major: 'Physics', gradYear: 2029 })
    expect(done).toMatchObject({ major: 'Physics', gradYear: 2029, onboarded: true })
  })

  it('cannot change role or email', async () => {
    const user = await signup(newStudent)
    const done = await completeOnboarding(user.id, { role: 'alumni', email: 'x@northeastern.edu' })
    expect(done.role).toBe('student')
    expect(done.email).toBe(newStudent.email)
  })
})
