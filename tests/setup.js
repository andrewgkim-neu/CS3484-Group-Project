// Runs before every test file (configured in vite.config.js).

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { resetMockData } from '../src/api'

// Freeze "now" so date-based logic (upcoming slots, timeAgo) gives the same
// results no matter when the tests run. Only Date is faked; timers stay real.
export const TEST_NOW = '2026-11-19T12:00:00.000Z'

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(TEST_NOW))
  localStorage.clear() // logs everyone out
  resetMockData() // back to the JSON seed data
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
