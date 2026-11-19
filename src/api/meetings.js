// Coffee chats: alumni publish availability slots, students book one,
// and the booking becomes a meeting on both users' calendars.
//
// All times are ISO 8601 strings in UTC (e.g. "2026-11-24T14:00:00.000Z").
// Format them for display with toLocaleString / Intl.DateTimeFormat.

import { ROLES } from '../constants'
import {
  ApiError,
  clone,
  commit,
  db,
  delay,
  findUser,
  newId,
  now,
  requireUser,
  toPublicUser,
} from './db'

const byStart = (a, b) => a.start.localeCompare(b.start)

/**
 * An alum's slots, soonest first.
 * @param {string} alumniId
 * @param {{ includeBooked?: boolean, includePast?: boolean }} options
 */
export async function getAvailability(
  alumniId,
  { includeBooked = false, includePast = false } = {},
) {
  await delay()
  const nowIso = now()
  return db()
    .availability.filter((s) => s.alumniId === alumniId)
    .filter((s) => includeBooked || !s.isBooked)
    .filter((s) => includePast || s.end > nowIso)
    .sort(byStart)
    .map(clone)
}

/** @param {{ alumniId: string, start: string, end: string }} input */
export async function addAvailabilitySlot({ alumniId, start, end }) {
  await delay()
  if (requireUser(alumniId).role !== ROLES.ALUMNI) {
    throw new ApiError('Only alumni can set availability', 403)
  }
  const startIso = new Date(start).toISOString()
  const endIso = new Date(end).toISOString()
  if (endIso <= startIso) throw new ApiError('End time must be after start time')

  const overlaps = db().availability.some(
    (s) => s.alumniId === alumniId && s.start < endIso && startIso < s.end,
  )
  if (overlaps) throw new ApiError('That time overlaps an existing slot')

  const slot = { id: newId('slot'), alumniId, start: startIso, end: endIso, isBooked: false }
  db().availability.push(slot)
  commit()
  return clone(slot)
}

export async function removeAvailabilitySlot(slotId) {
  await delay()
  const tables = db()
  const slot = tables.availability.find((s) => s.id === slotId)
  if (!slot) throw new ApiError('Slot not found', 404)
  if (slot.isBooked) throw new ApiError('Cancel the meeting before removing a booked slot')
  tables.availability = tables.availability.filter((s) => s.id !== slotId)
  commit()
}

function withPeople(meeting) {
  return {
    ...clone(meeting),
    alumni: toPublicUser(findUser(meeting.alumniId)),
    student: toPublicUser(findUser(meeting.studentId)),
  }
}

/**
 * Meetings the user is part of (as student or alum), soonest first.
 * Each meeting includes `alumni` and `student` user objects.
 * @param {{ includeCancelled?: boolean }} options
 */
export async function getMeetings(userId, { includeCancelled = false } = {}) {
  await delay()
  return db()
    .meetings.filter((m) => m.alumniId === userId || m.studentId === userId)
    .filter((m) => includeCancelled || m.status !== 'cancelled')
    .sort(byStart)
    .map(withPeople)
}

/**
 * Student books an open slot. Marks the slot as booked and returns the meeting.
 * @param {{ slotId: string, studentId: string, topic?: string, location?: string }} input
 */
export async function createMeeting({ slotId, studentId, topic = '', location = 'Zoom' }) {
  await delay()
  if (requireUser(studentId).role !== ROLES.STUDENT) {
    throw new ApiError('Only students can book coffee chats', 403)
  }
  const slot = db().availability.find((s) => s.id === slotId)
  if (!slot) throw new ApiError('That time slot no longer exists', 404)
  if (slot.isBooked) throw new ApiError('That time slot was just booked by someone else', 409)

  slot.isBooked = true
  const meeting = {
    id: newId('mt'),
    slotId,
    alumniId: slot.alumniId,
    studentId,
    start: slot.start,
    end: slot.end,
    topic: topic.trim(),
    location,
    status: 'scheduled',
    createdAt: now(),
  }
  db().meetings.push(meeting)
  commit()
  return withPeople(meeting)
}

/** Either participant can cancel. Frees the slot so someone else can book it. */
export async function cancelMeeting(meetingId) {
  await delay()
  const meeting = db().meetings.find((m) => m.id === meetingId)
  if (!meeting) throw new ApiError('Meeting not found', 404)
  meeting.status = 'cancelled'
  const slot = db().availability.find((s) => s.id === meeting.slotId)
  if (slot) slot.isBooked = false
  commit()
  return withPeople(meeting)
}
