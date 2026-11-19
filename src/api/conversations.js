// Conversations and messages (including structured referral requests).
//
// A conversation is always between exactly two users. Messages live inside
// their conversation. A message is either:
//   { type: 'text', body }
//   { type: 'referral_request', body, referral: { company, role, jobLink, resumeFileName, status, respondedAt } }

import { MESSAGE_TYPES, REFERRAL_STATUSES, ROLES } from '../constants'
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

function findConversation(id) {
  const convo = db().conversations.find((c) => c.id === id)
  if (!convo) throw new ApiError('Conversation not found', 404)
  return convo
}

function assertParticipant(convo, userId) {
  if (!convo.participantIds.includes(userId)) {
    throw new ApiError('You are not part of this conversation', 403)
  }
}

function summarize(convo, viewerId) {
  const otherId = convo.participantIds.find((id) => id !== viewerId)
  const lastMessage = convo.messages[convo.messages.length - 1] ?? null
  return {
    id: convo.id,
    participantIds: [...convo.participantIds],
    otherUser: toPublicUser(findUser(otherId)),
    lastMessage: clone(lastMessage),
    updatedAt: lastMessage?.createdAt ?? null,
  }
}

/**
 * Conversation list for the sidebar, most recent first.
 * Each item: { id, participantIds, otherUser, lastMessage, updatedAt }
 */
export async function getConversations(userId) {
  await delay()
  return db()
    .conversations.filter((c) => c.participantIds.includes(userId))
    .map((c) => summarize(c, userId))
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
}

/** Full conversation with all messages, plus `otherUser`. */
export async function getConversation(conversationId, viewerId) {
  await delay()
  const convo = findConversation(conversationId)
  assertParticipant(convo, viewerId)
  return { ...summarize(convo, viewerId), messages: clone(convo.messages) }
}

/**
 * Find the conversation between two users, creating an empty one if needed.
 * This is what /chat/:userId uses. Returns the same shape as getConversation.
 */
export async function getOrCreateConversation(userId, otherUserId) {
  await delay()
  requireUser(userId)
  requireUser(otherUserId)
  if (userId === otherUserId) throw new ApiError("You can't message yourself")

  let convo = db().conversations.find(
    (c) => c.participantIds.includes(userId) && c.participantIds.includes(otherUserId),
  )
  if (!convo) {
    convo = { id: newId('c'), participantIds: [userId, otherUserId], messages: [] }
    db().conversations.push(convo)
    commit()
  }
  return { ...summarize(convo, userId), messages: clone(convo.messages) }
}

/** Send a plain text message. Returns the new message. */
export async function sendMessage({ conversationId, senderId, body }) {
  await delay()
  const convo = findConversation(conversationId)
  assertParticipant(convo, senderId)
  if (!body?.trim()) throw new ApiError('Message cannot be empty')

  const message = {
    id: newId('m'),
    senderId,
    type: MESSAGE_TYPES.TEXT,
    body: body.trim(),
    createdAt: now(),
  }
  convo.messages.push(message)
  commit()
  return clone(message)
}

/**
 * Student → alum referral request, sent as a special message.
 * @param {{ conversationId: string, senderId: string, company: string, role: string, jobLink?: string, resumeFileName?: string, body?: string }} input
 */
export async function sendReferralRequest({
  conversationId,
  senderId,
  company,
  role,
  jobLink = '',
  resumeFileName = '',
  body = '',
}) {
  await delay()
  const convo = findConversation(conversationId)
  assertParticipant(convo, senderId)
  if (requireUser(senderId).role !== ROLES.STUDENT) {
    throw new ApiError('Only students can request referrals', 403)
  }
  if (!company?.trim() || !role?.trim()) throw new ApiError('Company and role are required')

  const message = {
    id: newId('m'),
    senderId,
    type: MESSAGE_TYPES.REFERRAL_REQUEST,
    body: body.trim(),
    referral: {
      company: company.trim(),
      role: role.trim(),
      jobLink: jobLink.trim(),
      resumeFileName,
      status: REFERRAL_STATUSES.PENDING,
      respondedAt: null,
    },
    createdAt: now(),
  }
  convo.messages.push(message)
  commit()
  return clone(message)
}

/**
 * Alum accepts or declines a referral request.
 * @param {{ conversationId: string, messageId: string, responderId: string, status: 'accepted'|'declined' }} input
 */
export async function respondToReferral({ conversationId, messageId, responderId, status }) {
  await delay()
  const convo = findConversation(conversationId)
  assertParticipant(convo, responderId)
  if (![REFERRAL_STATUSES.ACCEPTED, REFERRAL_STATUSES.DECLINED].includes(status)) {
    throw new ApiError('Status must be accepted or declined')
  }
  const message = convo.messages.find((m) => m.id === messageId)
  if (!message || message.type !== MESSAGE_TYPES.REFERRAL_REQUEST) {
    throw new ApiError('Referral request not found', 404)
  }
  if (message.senderId === responderId)
    throw new ApiError("You can't respond to your own request", 403)

  message.referral.status = status
  message.referral.respondedAt = now()
  commit()
  return clone(message)
}

/**
 * Pending referral requests sent to an alum, newest first.
 * Each item: { conversationId, message, student }
 */
export async function getPendingReferralRequests(alumniId) {
  await delay()
  return db()
    .conversations.filter((c) => c.participantIds.includes(alumniId))
    .flatMap((c) =>
      c.messages
        .filter(
          (m) =>
            m.type === MESSAGE_TYPES.REFERRAL_REQUEST &&
            m.senderId !== alumniId &&
            m.referral.status === REFERRAL_STATUSES.PENDING,
        )
        .map((m) => ({
          conversationId: c.id,
          message: clone(m),
          student: toPublicUser(findUser(m.senderId)),
        })),
    )
    .sort((a, b) => b.message.createdAt.localeCompare(a.message.createdAt))
}
