import { describe, expect, it } from 'vitest'
import {
  getAlumni,
  getSuggestedAlumni,
  getUser,
  searchAlumni,
  updateUser,
  login,
} from '../../src/api'

const ids = (users) => users.map((u) => u.id).sort()

describe('getUser / getAlumni', () => {
  it('DR2: returns a user without the password', async () => {
    const user = await getUser('a1')
    expect(user.firstName).toBe('Maria')
    expect(user).not.toHaveProperty('password')
  })

  it('F-E5: 404s for an unknown id', async () => {
    await expect(getUser('nope')).rejects.toMatchObject({ status: 404 })
  })

  it('lists only alumni', async () => {
    const alumni = await getAlumni()
    expect(alumni.length).toBeGreaterThan(0)
    expect(alumni.every((u) => u.role === 'alumni')).toBe(true)
  })
})

describe('searchAlumni', () => {
  it('F-D7: returns every alum when no filters are given', async () => {
    expect(ids(await searchAlumni())).toEqual(ids(await getAlumni()))
  })

  it('F-D2: filters by major', async () => {
    const results = await searchAlumni({ major: 'Data Science' })
    expect(ids(results)).toEqual(['a3', 'a7'])
  })

  it('F-D4: filters by company, including past companies, case-insensitively', async () => {
    expect(ids(await searchAlumni({ company: 'hubspot' }))).toEqual(['a2', 'a8'])
    // Maria used to work at Wayfair
    expect(ids(await searchAlumni({ company: 'Wayfair' }))).toEqual(['a1'])
  })

  it('F-D4: filters by job role', async () => {
    expect(ids(await searchAlumni({ role: 'product' }))).toEqual(['a2', 'a6'])
  })

  it('F-D1: matches keywords against name, title, and skills', async () => {
    expect(ids(await searchAlumni({ query: 'maria' }))).toEqual(['a1'])
    expect(ids(await searchAlumni({ query: 'kubernetes' }))).toEqual(['a1'])
  })

  it('F-D5: combines filters with AND', async () => {
    const results = await searchAlumni({ major: 'Computer Science', company: 'HubSpot' })
    expect(ids(results)).toEqual(['a8'])
  })

  it('F-D6: returns an empty list when nothing matches', async () => {
    expect(await searchAlumni({ company: 'No Such Company' })).toEqual([])
  })
})

describe('getSuggestedAlumni', () => {
  it('F-C1: suggests alumni who match major, target company, or target role, best first', async () => {
    const suggestions = await getSuggestedAlumni('s1')
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions.every((s) => s.matchReasons.length > 0)).toBe(true)
    const counts = suggestions.map((s) => s.matchReasons.length)
    expect(counts).toEqual([...counts].sort((a, b) => b - a))
  })

  it('F-C1: respects the limit', async () => {
    expect((await getSuggestedAlumni('s1', 2)).length).toBe(2)
  })
})

describe('updateUser', () => {
  it('F-E8: updates profile fields', async () => {
    const user = await updateUser('s1', { bio: 'Updated bio', skills: ['Rust'] })
    expect(user).toMatchObject({ bio: 'Updated bio', skills: ['Rust'] })
    expect((await getUser('s1')).bio).toBe('Updated bio')
  })

  it('cannot change id, role, email, or password', async () => {
    await updateUser('s1', { id: 'x', role: 'alumni', email: 'x@x.com', password: 'hacked' })
    const user = await getUser('s1')
    expect(user).toMatchObject({ id: 's1', role: 'student', email: 'alex.chen@northeastern.edu' })
    expect((await login('alex.chen@northeastern.edu', 'password')).id).toBe('s1')
  })
})
