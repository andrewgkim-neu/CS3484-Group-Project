// Alumni posts shown in the student feed.

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

function withAuthor(post) {
  return { ...clone(post), author: toPublicUser(findUser(post.authorId)) }
}

/**
 * Newest first. Each post includes an `author` object.
 * @param {{ authorId?: string, type?: string }} filters
 */
export async function getPosts({ authorId, type } = {}) {
  await delay()
  return db()
    .posts.filter((p) => !authorId || p.authorId === authorId)
    .filter((p) => !type || p.type === type)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(withAuthor)
}

/**
 * @param {{ authorId: string, type: string, title: string, body: string, company?: string, tags?: string[] }} input
 */
export async function createPost({ authorId, type, title, body, company = '', tags = [] }) {
  await delay()
  const author = requireUser(authorId)
  if (author.role !== ROLES.ALUMNI) throw new ApiError('Only alumni can create posts', 403)
  if (!title?.trim() || !body?.trim()) throw new ApiError('Title and body are required')

  const post = {
    id: newId('p'),
    authorId,
    type,
    title: title.trim(),
    body: body.trim(),
    company: company || author.currentCompany || '',
    tags,
    createdAt: now(),
  }
  db().posts.push(post)
  commit()
  return withAuthor(post)
}

export async function deletePost(postId) {
  await delay()
  const tables = db()
  const before = tables.posts.length
  tables.posts = tables.posts.filter((p) => p.id !== postId)
  if (tables.posts.length === before) throw new ApiError('Post not found', 404)
  commit()
}
