// Small display helpers shared across pages.

import { ROLES } from '../constants'

export function fullName(user) {
  return user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : ''
}

/** "Senior SWE at Google" for alumni, "Computer Science · Class of 2027" for students. */
export function userHeadline(user) {
  if (!user) return ''
  if (user.role === ROLES.ALUMNI) {
    return [user.currentTitle, user.currentCompany].filter(Boolean).join(' at ')
  }
  return [user.major, user.gradYear && `Class of ${user.gradYear}`].filter(Boolean).join(' · ')
}

/** "Mon, Nov 24, 9:00 AM" in the viewer's time zone. */
export function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** "9:00 AM" */
export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

/** "just now", "5m ago", "3h ago", "2d ago", or a date for older items. */
export function timeAgo(iso) {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 7 * 86400) return `${Math.floor(seconds / 86400)}d ago`
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
