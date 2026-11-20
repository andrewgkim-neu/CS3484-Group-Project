// Christina: messaging, referral requests, and calendar.
// Replace each it.todo with a real test as you build the page. See auth.test.jsx
// for an example. Rename describe blocks to match your Part 4 requirement IDs.

import { describe, it } from 'vitest'

describe('Chat', () => {
  it.todo('lists conversations, most recent first')
  it.todo('opens the thread with the user from the URL')
  it.todo('sends a message and shows it in the thread')
  it.todo('does not send an empty message')
})

describe('Referral requests', () => {
  it.todo('student can send a referral request with company, role, job link, and resume')
  it.todo('alum sees Accept and Decline buttons on a pending request')
  it.todo('accepting or declining updates the request status for both users')
})

describe('Calendar', () => {
  it.todo('shows upcoming meetings for the logged-in user')
  it.todo('alum can add and remove availability slots')
  it.todo('either participant can cancel a meeting')
})

describe('Schedule coffee', () => {
  it.todo("shows the alum's open time slots")
  it.todo('booking a slot adds the meeting to both calendars')
  it.todo('a booked slot is no longer offered to other students')
})
