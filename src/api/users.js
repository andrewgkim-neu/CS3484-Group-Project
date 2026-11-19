// Users: students and alumni share one table, distinguished by `role`.

import { ROLES } from '../constants'
import { commit, db, delay, requireUser, toPublicUser, ApiError, findUser } from './db'

const includes = (haystack, needle) =>
  String(haystack ?? '')
    .toLowerCase()
    .includes(String(needle ?? '').toLowerCase())

export async function getUser(id) {
  await delay()
  const user = findUser(id)
  if (!user) throw new ApiError(`User ${id} not found`, 404)
  return toPublicUser(user)
}

export async function getAlumni() {
  await delay()
  return db()
    .users.filter((u) => u.role === ROLES.ALUMNI && u.onboarded)
    .map(toPublicUser)
}

export async function getStudents() {
  await delay()
  return db()
    .users.filter((u) => u.role === ROLES.STUDENT && u.onboarded)
    .map(toPublicUser)
}

/**
 * Search alumni. Every filter is optional; empty filters are ignored.
 * (Person 4 owns the search UI and may change this filtering.)
 * @param {{ query?: string, major?: string, company?: string, role?: string, networkingStatus?: string }} filters
 *   query   – free text matched against name, title, company, bio, skills
 *   company – matches current company or any past company
 *   role    – matches current title or any past title
 */
export async function searchAlumni(filters = {}) {
  await delay()
  const { query, major, company, role, networkingStatus } = filters
  return db()
    .users.filter((u) => u.role === ROLES.ALUMNI && u.onboarded)
    .filter((u) => !major || u.major === major)
    .filter((u) => !networkingStatus || u.networkingStatus === networkingStatus)
    .filter(
      (u) =>
        !company ||
        includes(u.currentCompany, company) ||
        u.jobHistory?.some((j) => includes(j.company, company)),
    )
    .filter(
      (u) =>
        !role ||
        includes(u.currentTitle, role) ||
        u.jobHistory?.some((j) => includes(j.title, role)),
    )
    .filter((u) => {
      if (!query) return true
      const fields = [
        `${u.firstName} ${u.lastName}`,
        u.currentTitle,
        u.currentCompany,
        u.major,
        u.bio,
        ...(u.skills ?? []),
      ]
      return fields.some((f) => includes(f, query))
    })
    .map(toPublicUser)
}

/**
 * Basic "suggested alumni" for a student: scores alumni by shared major,
 * target companies, and target roles. (Person 3 owns the home page and may
 * change this scoring.)
 * Each result has an extra `matchReasons: string[]` field.
 */
export async function getSuggestedAlumni(studentId, limit = 6) {
  await delay()
  const student = requireUser(studentId)
  const targetCompanies = student.targetCompanies ?? []
  const targetRoles = student.targetRoles ?? []

  return db()
    .users.filter((u) => u.role === ROLES.ALUMNI && u.onboarded)
    .map((alum) => {
      const matchReasons = []
      if (student.major && alum.major === student.major)
        matchReasons.push(`Also majored in ${alum.major}`)
      const company = targetCompanies.find((c) => includes(alum.currentCompany, c))
      if (company) matchReasons.push(`Works at ${alum.currentCompany}`)
      const role = targetRoles.find((r) => includes(alum.currentTitle, r))
      if (role) matchReasons.push(`Works as ${alum.currentTitle}`)
      return { alum, matchReasons }
    })
    .filter((x) => x.matchReasons.length > 0)
    .sort((a, b) => b.matchReasons.length - a.matchReasons.length)
    .slice(0, limit)
    .map(({ alum, matchReasons }) => ({ ...toPublicUser(alum), matchReasons }))
}

/**
 * Update profile fields. id, role, email and password can't be changed here.
 * Returns the updated user.
 */
export async function updateUser(id, patch) {
  await delay()
  const user = requireUser(id)
  // eslint-disable-next-line no-unused-vars
  const { id: _id, role, email, password, ...safe } = patch ?? {}
  Object.assign(user, safe)
  commit()
  return toPublicUser(user)
}
