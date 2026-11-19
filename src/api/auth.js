// Auth + session. Pretends to be a server that sets a session cookie:
// the logged-in user's id is kept in localStorage.
//
// Pages should usually go through useSession() (src/context/SessionContext.jsx)
// rather than calling these directly, so the nav bar etc. stay in sync.

import { MOCK_VERIFICATION_CODE, NU_EMAIL_DOMAIN, ROLES } from '../constants'
import { ApiError, commit, db, delay, findUser, newId, now, requireUser, toPublicUser } from './db'

const SESSION_KEY = 'hc:session'

function setSessionUserId(id) {
  try {
    if (id) localStorage.setItem(SESSION_KEY, id)
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}

function getSessionUserId() {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

function normalizeEmail(email) {
  return String(email ?? '')
    .trim()
    .toLowerCase()
}

export function isNortheasternEmail(email) {
  const e = normalizeEmail(email)
  return e.endsWith(NU_EMAIL_DOMAIN) && e.length > NU_EMAIL_DOMAIN.length
}

/** Returns the logged-in user, or null. */
export async function getCurrentUser() {
  await delay(50)
  const id = getSessionUserId()
  return id ? toPublicUser(findUser(id)) : null
}

/** Throws ApiError on bad credentials. */
export async function login(email, password) {
  await delay()
  const user = db().users.find((u) => u.email === normalizeEmail(email))
  if (!user || user.password !== password) {
    throw new ApiError('Incorrect email or password', 401)
  }
  setSessionUserId(user.id)
  return toPublicUser(user)
}

export async function logout() {
  await delay(50)
  setSessionUserId(null)
}

/**
 * Create a new account and log in as it.
 * The account starts with emailVerified: false and onboarded: false.
 * @param {{ email: string, password: string, firstName: string, lastName: string, role: 'student'|'alumni' }} input
 */
export async function signup({ email, password, firstName, lastName, role }) {
  await delay()
  const normalized = normalizeEmail(email)
  if (!isNortheasternEmail(normalized)) {
    throw new ApiError(`Please use your ${NU_EMAIL_DOMAIN} email address`)
  }
  if (!password || password.length < 8) {
    throw new ApiError('Password must be at least 8 characters')
  }
  if (![ROLES.STUDENT, ROLES.ALUMNI].includes(role)) {
    throw new ApiError('Choose whether you are a student or an alum')
  }
  if (db().users.some((u) => u.email === normalized)) {
    throw new ApiError('An account with that email already exists', 409)
  }

  const user = {
    id: newId(role === ROLES.STUDENT ? 's' : 'a'),
    role,
    email: normalized,
    password,
    firstName: firstName?.trim() ?? '',
    lastName: lastName?.trim() ?? '',
    pronouns: '',
    gradYear: null,
    major: '',
    bio: '',
    skills: [],
    links: {},
    emailVerified: false,
    onboarded: false,
    createdAt: now(),
    ...(role === ROLES.STUDENT
      ? { minor: '', targetCompanies: [], targetRoles: [], workHistory: [], resume: null }
      : {
          currentTitle: '',
          currentCompany: '',
          location: '',
          jobHistory: [],
          networkingStatus: 'open_to_chat',
        }),
  }
  db().users.push(user)
  commit()
  setSessionUserId(user.id)
  return toPublicUser(user)
}

/** Pretend to email a code. The code is always MOCK_VERIFICATION_CODE. */
export async function sendVerificationCode(email) {
  await delay()
  if (!isNortheasternEmail(email)) {
    throw new ApiError(`Please use your ${NU_EMAIL_DOMAIN} email address`)
  }
  return { sent: true }
}

/** Marks the user's email as verified if the code is correct. */
export async function verifyEmail(userId, code) {
  await delay()
  const user = requireUser(userId)
  if (String(code).trim() !== MOCK_VERIFICATION_CODE) {
    throw new ApiError('That code is incorrect')
  }
  user.emailVerified = true
  commit()
  return toPublicUser(user)
}

/** Save onboarding answers and mark the account as onboarded. */
export async function completeOnboarding(userId, profile) {
  await delay()
  const user = requireUser(userId)
  // eslint-disable-next-line no-unused-vars
  const { id, role, email, password, ...safe } = profile ?? {}
  Object.assign(user, safe, { onboarded: true })
  commit()
  return toPublicUser(user)
}

/** DEV ONLY: log in as any user without a password (used by the dev toolbar). */
export async function devLoginAs(userId) {
  await delay(50)
  const user = requireUser(userId)
  setSessionUserId(user.id)
  return toPublicUser(user)
}
