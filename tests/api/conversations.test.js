import { describe, expect, it } from 'vitest'
import {
  getConversation,
  getConversations,
  getOrCreateConversation,
  getPendingReferralRequests,
  respondToReferral,
  sendMessage,
  sendReferralRequest,
} from '../../src/api'

describe('conversations', () => {
  it('lists a user’s conversations, most recent first, with the other person attached', async () => {
    const convos = await getConversations('s1')
    expect(convos.map((c) => c.otherUser.id)).toEqual(['a1', 'a5'])
    expect(convos[0].lastMessage).toBeTruthy()
  })

  it('creates a conversation once and finds the same one from either side', async () => {
    const a = await getOrCreateConversation('s1', 'a2')
    const b = await getOrCreateConversation('a2', 's1')
    expect(a.id).toBe(b.id)
    expect(a.messages).toEqual([])
  })

  it('does not let you message yourself', async () => {
    await expect(getOrCreateConversation('s1', 's1')).rejects.toThrow()
  })

  it('does not let outsiders read a conversation', async () => {
    await expect(getConversation('c1', 's2')).rejects.toMatchObject({ status: 403 })
  })
})

describe('sendMessage', () => {
  it('adds a text message to the thread', async () => {
    const { id } = await getOrCreateConversation('s1', 'a2')
    await sendMessage({ conversationId: id, senderId: 's1', body: '  Hello!  ' })
    const convo = await getConversation(id, 'a2')
    expect(convo.messages).toHaveLength(1)
    expect(convo.messages[0]).toMatchObject({ senderId: 's1', type: 'text', body: 'Hello!' })
  })

  it('rejects empty messages', async () => {
    await expect(
      sendMessage({ conversationId: 'c1', senderId: 's1', body: '   ' }),
    ).rejects.toThrow()
  })

  it('rejects senders who are not in the conversation', async () => {
    await expect(
      sendMessage({ conversationId: 'c1', senderId: 's2', body: 'hi' }),
    ).rejects.toMatchObject({ status: 403 })
  })
})

describe('referral requests', () => {
  const request = (overrides = {}) => ({
    conversationId: 'c2',
    senderId: 's1',
    company: 'Datadog',
    role: 'SWE Intern',
    jobLink: 'https://example.com/job',
    resumeFileName: 'alex_chen_resume.pdf',
    ...overrides,
  })

  it('sends a structured, pending referral request', async () => {
    const msg = await sendReferralRequest(request())
    expect(msg.type).toBe('referral_request')
    expect(msg.referral).toMatchObject({
      company: 'Datadog',
      role: 'SWE Intern',
      status: 'pending',
    })
    const pending = await getPendingReferralRequests('a5')
    expect(pending.map((p) => p.message.id)).toContain(msg.id)
  })

  it('requires company and role', async () => {
    await expect(sendReferralRequest(request({ company: '' }))).rejects.toThrow()
  })

  it('only lets students request referrals', async () => {
    await expect(sendReferralRequest(request({ senderId: 'a5' }))).rejects.toMatchObject({
      status: 403,
    })
  })

  it.each(['accepted', 'declined'])('lets the alum mark a request %s', async (status) => {
    const msg = await sendReferralRequest(request())
    const updated = await respondToReferral({
      conversationId: 'c2',
      messageId: msg.id,
      responderId: 'a5',
      status,
    })
    expect(updated.referral.status).toBe(status)
    expect(updated.referral.respondedAt).toBeTruthy()
    expect((await getPendingReferralRequests('a5')).some((p) => p.message.id === msg.id)).toBe(
      false,
    )
  })

  it('does not let the student answer their own request', async () => {
    const msg = await sendReferralRequest(request())
    await expect(
      respondToReferral({
        conversationId: 'c2',
        messageId: msg.id,
        responderId: 's1',
        status: 'accepted',
      }),
    ).rejects.toMatchObject({ status: 403 })
  })
})
