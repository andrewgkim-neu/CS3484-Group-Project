// Kevin: home page and alumni posts.
// Each describe/it name starts with its requirement ID from docs/REQUIREMENTS.md.
// Replace each it.todo with a real test as you build the page. See auth.test.jsx
// for an example.

import { describe, it } from 'vitest'

describe('F-C1–F-C5 Student home', () => {
  it.todo('F-C1: shows up to 6 suggested alumni, each with the reason it was suggested')
  it.todo('F-C2: the › arrow shows the next set of recommendations')
  it.todo('F-C3: shows the Open Referrals feed newest first, with company and apply-by date')
  it.todo('F-C4: clicking an alum card opens /profile/:id; Message on a post opens /chat/:authorId')
  it.todo('F-C5: Enter in the home search bar opens /search?q=… with results filtered')
  it.todo('shows an empty state when there are no suggestions')
})

describe('F-C6 Alumni home', () => {
  it.todo('F-C6: lists pending referral requests')
  it.todo('F-C6: lists recent conversations')
  it.todo('lists upcoming coffee chats')
})

describe('F-C7 Create post', () => {
  it.todo('F-C7: an empty title or body shows field errors and nothing is posted')
  it.todo('F-C7: publishes the post and shows it at the top of the feed')
})

describe('Landing page', () => {
  it.todo('shows Log in and Sign up calls to action to logged-out visitors')
})
