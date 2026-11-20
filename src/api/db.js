// In-memory "database" for the fake API.
//
// - Seeded from the JSON files in src/data.
// - Persisted to localStorage so changes survive a page refresh.
// - If anyone edits a JSON seed file, the stored copy is thrown away and
//   re-seeded automatically (see SEED_VERSION).
//
// Pages and components should NEVER import from this file or from src/data.
// Use the functions exported from src/api instead.

import students from '../data/students.json'
import alumni from '../data/alumni.json'
import posts from '../data/posts.json'
import conversations from '../data/conversations.json'
import availability from '../data/availability.json'
import meetings from '../data/meetings.json'

const STORAGE_KEY = 'hc:db'
// No artificial delay when running automated tests.
const IS_TEST = import.meta.env.MODE === 'test'
const SIMULATED_LATENCY_MS = 200

function buildSeed() {
  return structuredClone({
    users: [...students, ...alumni],
    posts,
    conversations,
    availability,
    meetings,
  })
}

// Cheap string hash so we can detect when the seed files changed.
function hash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

const SEED_VERSION = hash(JSON.stringify(buildSeed()))

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const stored = JSON.parse(raw)
      if (stored.version === SEED_VERSION) return stored.data
    }
  } catch {
    // Corrupt or unavailable storage: fall through and re-seed.
  }
  return buildSeed()
}

let data = load()
const listeners = new Set()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SEED_VERSION, data }))
  } catch {
    // Storage full or blocked (private mode): keep working in memory.
  }
}

/** Direct access to the live tables. Only API modules should call this. */
export function db() {
  return data
}

/** Call after every mutation: persists and notifies subscribers. */
export function commit() {
  persist()
  listeners.forEach((fn) => fn())
}

/** Subscribe to any data change. Returns an unsubscribe function. */
export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Wipe all local changes and go back to the JSON seed data. */
export function resetDb() {
  data = buildSeed()
  commit()
}

/** Wait a bit so loading states are visible, like a real network call. */
export function delay(ms = SIMULATED_LATENCY_MS) {
  if (IS_TEST) return Promise.resolve()
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Return a deep copy so callers can't mutate the database by accident. */
export function clone(value) {
  return value === undefined ? undefined : structuredClone(value)
}

export function newId(prefix) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

export function now() {
  return new Date().toISOString()
}

export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Strip private fields before a user object leaves the API. */
export function toPublicUser(user) {
  if (!user) return null
  // eslint-disable-next-line no-unused-vars
  const { password, ...rest } = user
  return clone(rest)
}

export function findUser(id) {
  return data.users.find((u) => u.id === id)
}

export function requireUser(id) {
  const user = findUser(id)
  if (!user) throw new ApiError(`User ${id} not found`, 404)
  return user
}
