// App-wide constants. Import from here instead of hard-coding strings in pages.

export const APP_NAME = 'Husky Connect'

export const ROLES = {
  STUDENT: 'student',
  ALUMNI: 'alumni',
}

export const NU_EMAIL_DOMAIN = '@northeastern.edu'

// The fake email-verification flow accepts this code for every address.
export const MOCK_VERIFICATION_CODE = '123456'

export const MAJORS = [
  'Biology',
  'Business Administration',
  'Chemical Engineering',
  'Civil Engineering',
  'Computer Engineering',
  'Computer Science',
  'Cybersecurity',
  'Data Science',
  'Design',
  'Economics',
  'Electrical Engineering',
  'Health Science',
  'Mathematics',
  'Mechanical Engineering',
  'Nursing',
  'Physics',
  'Political Science',
  'Psychology',
]

export const NETWORKING_STATUSES = [
  { value: 'open_to_referrals', label: 'Open to referrals', tone: 'success' },
  { value: 'open_to_chat', label: 'Open to chat', tone: 'info' },
  { value: 'not_available', label: 'Not available', tone: 'neutral' },
]

export const POST_TYPES = [
  { value: 'referral', label: 'Referral' },
  { value: 'hiring', label: 'Hiring' },
  { value: 'advice', label: 'Advice' },
  { value: 'event', label: 'Event' },
]

export const MESSAGE_TYPES = {
  TEXT: 'text',
  REFERRAL_REQUEST: 'referral_request',
}

export const REFERRAL_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
}

export function networkingStatusLabel(value) {
  return NETWORKING_STATUSES.find((s) => s.value === value)?.label ?? value
}
