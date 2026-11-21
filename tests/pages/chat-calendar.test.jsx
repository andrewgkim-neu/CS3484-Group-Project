// Christina: messaging, referral requests, coffee chats, and calendar.
// Each describe/it name starts with its requirement ID from docs/REQUIREMENTS.md.
// Replace each it.todo with a real test as you build the page. See auth.test.jsx
// for an example.

import { describe, it } from 'vitest'

describe('F-F1–F-F7 Messages and chat thread', () => {
  it.todo('F-F1: lists conversations most recent first, with name, preview, and time')
  it.todo('F-F2: Search conversations filters the list by name')
  it.todo('F-F3: no conversations shows "No conversations yet" and a Find alumni link')
  it.todo('F-F4: clicking a conversation opens its thread scrolled to the newest message')
  it.todo('F-E2: /chat/:userId opens (or creates) the conversation with that user')
  it.todo('F-F5: sending a message shows it in the thread and clears the input')
  it.todo('F-F5: Send is disabled for an empty or whitespace-only message')
  it.todo('F-F6: a failed send shows "Failed to send" with Retry and Delete')
  it.todo("F-F7: clicking the other person's name opens their profile")
})

describe('F-F8–F-F9 Referral requests', () => {
  it.todo('F-F8: student sends a referral request and a Pending card appears for both users')
  it.todo('F-F8: a request missing company or role is not sent and shows a field error')
  it.todo('F-F9: alum Accept/Decline updates the status for both users and hides the buttons')
})

// Only alumni send coffee-chat invites; students accept or decline (prototype finding TF2).
describe('F-G1–F-G5 Coffee chat invites', () => {
  it.todo('F-G1: alum opens /schedule/:studentId and sees date, time, duration, description, link')
  it.todo('F-G2: no date/time, a past time, or an overlapping time shows Invite Error')
  it.todo('F-G3: a valid invite shows a Request Pending card for both users; alum can cancel it')
  it.todo('F-G4: student Accept confirms and adds the chat to both calendars')
  it.todo('F-G4: student Decline marks it declined and creates no calendar entry')
  it.todo('F-G5: students see no Schedule Coffee Chat control anywhere')
})

describe('F-H1–F-H4 Calendar', () => {
  it.todo('F-H1: shows the current month with confirmed chats; ‹ / › change month')
  it.todo('F-H2: clicking a chat opens a details dialog; Esc closes it and returns focus')
  it.todo('F-H3: Cancel chat + confirm removes it from both calendars; Keep leaves it')
  it.todo('F-H4: alum clicking a day opens Schedule Coffee Chat with that date filled in')
})
