// Lok Ye: search and profiles.
// Each describe/it name starts with its requirement ID from docs/REQUIREMENTS.md.
// Replace each it.todo with a real test as you build the page. See auth.test.jsx
// for an example.

import { describe, it } from 'vitest'

describe('F-D1–F-D9 Alumni search', () => {
  it.todo('F-D1: a keyword matches name, title, company, major, bio, or skills')
  it.todo('F-D2: the Major filter shows only alumni with that major')
  it.todo('F-D3: Combined major shows only alumni whose degree includes both majors')
  it.todo('F-D4: Company and Job role match current or past positions')
  it.todo('F-D5: filters combine with AND and the "N alumni found" count updates')
  it.todo('F-D6: no matches shows "No alumni match your filters", Clear filters, and suggestions')
  it.todo('F-D7: Clear filters resets every filter and shows all alumni')
  it.todo('F-D8: Back from a profile restores the same filters and results')
  it.todo('F-D9: each card shows name, avatar, title, company, major, year, and status')
})

describe('F-E1–F-E5 Profile page', () => {
  it.todo(
    'F-E1: student viewing an alum sees Send Message with its description, and no Schedule button',
  )
  it.todo('F-E2: Send Message opens /chat/:alumId')
  it.todo(
    'F-E3: alum viewing a student sees Schedule Coffee Chat, which opens /schedule/:studentId',
  )
  it.todo('F-E4: a hidden alum profile shows "This alum has made their profile private"')
  it.todo('F-E5: an unknown id shows "We couldn\'t find that profile" with a link to Search')
})

describe('F-E6–F-E11 My profile and editing', () => {
  it.todo('F-E6: every section on /me has a visible text "Edit <Section>" button')
  it.todo('F-E7: View/Edit Profile in the menu and Edit Profile Here in Settings both open /me')
  it.todo('F-E8: Save shows the new values and "Saved", and the change persists after reload')
  it.todo('F-E9: saving with an empty required field shows the error and keeps other edits')
  it.todo('F-E10: Cancel with unsaved changes asks "Discard changes?"')
  it.todo('F-E11: a saved name change updates the nav bar without a reload')
})

describe('F-D10 (nice-to-have) Alumni search for students', () => {
  it.todo('F-D10: an alum can search students by major, graduation year, and skills')
})
