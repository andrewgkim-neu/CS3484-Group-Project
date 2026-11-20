// Lok Ye: search and profiles.
// Replace each it.todo with a real test as you build the page. See auth.test.jsx
// for an example. Rename describe blocks to match your Part 4 requirement IDs.

import { describe, it } from 'vitest'

describe('Alumni search', () => {
  it.todo('filters results by major')
  it.todo('filters results by keyword')
  it.todo('filters results by company')
  it.todo('filters results by job role')
  it.todo('shows an empty state when nothing matches')
})

describe('Profile page', () => {
  it.todo("shows the user's profile details")
  it.todo('Message button goes to /chat/:userId')
  it.todo('Schedule Coffee button goes to /schedule/:userId (students viewing alumni only)')
  it.todo('shows a not-found message for an unknown user id')
})

describe('My profile / edit profile', () => {
  it.todo("shows the logged-in user's own profile")
  it.todo('saves edits and shows them on the profile')
  it.todo('cancelling discards changes')
})
