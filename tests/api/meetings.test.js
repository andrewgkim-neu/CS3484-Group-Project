// NOTE: these tests cover the original slot-booking API (students book an alum's open
// slot). After prototype testing (TF2) the design changed so that only alumni send
// coffee-chat invites and students accept or decline (requirements F-G1–F-G5, DR6).
// The invite API and its tests will replace the booking tests below. Cancelling a
// meeting (F-H3) stays the same.
import { describe, expect, it } from 'vitest'
import {
  addAvailabilitySlot,
  cancelMeeting,
  createMeeting,
  getAvailability,
  getMeetings,
  removeAvailabilitySlot,
} from '../../src/api'

describe('availability', () => {
  it('lists an alum’s open, upcoming slots soonest first', async () => {
    const slots = await getAvailability('a1')
    expect(slots.map((s) => s.id)).toEqual(['slot1', 'slot2', 'slot3'])
  })

  it('hides booked slots unless asked', async () => {
    expect(await getAvailability('a5')).toHaveLength(1)
    expect(await getAvailability('a5', { includeBooked: true })).toHaveLength(2)
  })

  it('lets an alum add and remove a slot', async () => {
    const slot = await addAvailabilitySlot({
      alumniId: 'a1',
      start: '2026-12-10T15:00:00.000Z',
      end: '2026-12-10T15:30:00.000Z',
    })
    expect((await getAvailability('a1')).map((s) => s.id)).toContain(slot.id)
    await removeAvailabilitySlot(slot.id)
    expect((await getAvailability('a1')).map((s) => s.id)).not.toContain(slot.id)
  })

  it('rejects slots that end before they start', async () => {
    await expect(
      addAvailabilitySlot({
        alumniId: 'a1',
        start: '2026-12-10T15:00:00Z',
        end: '2026-12-10T14:00:00Z',
      }),
    ).rejects.toThrow(/after start/)
  })

  it('rejects overlapping slots', async () => {
    await expect(
      addAvailabilitySlot({
        alumniId: 'a1',
        start: '2026-11-24T14:15:00Z',
        end: '2026-11-24T14:45:00Z',
      }),
    ).rejects.toThrow(/overlaps/)
  })

  it('only lets alumni set availability', async () => {
    await expect(
      addAvailabilitySlot({
        alumniId: 's1',
        start: '2026-12-10T15:00:00Z',
        end: '2026-12-10T15:30:00Z',
      }),
    ).rejects.toMatchObject({ status: 403 })
  })
})

describe('scheduling coffee', () => {
  it('books a slot and puts the meeting on both calendars', async () => {
    const meeting = await createMeeting({ slotId: 'slot1', studentId: 's1', topic: 'Google SWE' })
    expect(meeting).toMatchObject({ alumniId: 'a1', studentId: 's1', status: 'scheduled' })
    expect((await getMeetings('s1')).map((m) => m.id)).toContain(meeting.id)
    expect((await getMeetings('a1')).map((m) => m.id)).toContain(meeting.id)
    expect((await getAvailability('a1')).map((s) => s.id)).not.toContain('slot1')
  })

  it('prevents double-booking a slot', async () => {
    await createMeeting({ slotId: 'slot1', studentId: 's1' })
    await expect(createMeeting({ slotId: 'slot1', studentId: 's2' })).rejects.toMatchObject({
      status: 409,
    })
  })

  it('only lets students book', async () => {
    await expect(createMeeting({ slotId: 'slot1', studentId: 'a2' })).rejects.toMatchObject({
      status: 403,
    })
  })

  it('F-H3: cancelling frees the slot and hides the meeting', async () => {
    const meeting = await createMeeting({ slotId: 'slot1', studentId: 's1' })
    await cancelMeeting(meeting.id)
    expect((await getAvailability('a1')).map((s) => s.id)).toContain('slot1')
    expect((await getMeetings('s1')).map((m) => m.id)).not.toContain(meeting.id)
    expect((await getMeetings('s1', { includeCancelled: true })).map((m) => m.id)).toContain(
      meeting.id,
    )
  })

  it('cannot remove a slot that is booked', async () => {
    await expect(removeAvailabilitySlot('slot4')).rejects.toThrow(/Cancel the meeting/)
  })
})
