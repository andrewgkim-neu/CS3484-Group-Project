import { describe, expect, it } from 'vitest'
import { createPost, deletePost, getPosts } from '../../src/api'

describe('posts', () => {
  it('lists posts newest first with their author attached', async () => {
    const posts = await getPosts()
    const dates = posts.map((p) => p.createdAt)
    expect(dates).toEqual([...dates].sort().reverse())
    expect(posts[0].author).toMatchObject({ id: posts[0].authorId })
    expect(posts[0].author).not.toHaveProperty('password')
  })

  it('filters by author and type', async () => {
    expect((await getPosts({ authorId: 'a1' })).every((p) => p.authorId === 'a1')).toBe(true)
    expect((await getPosts({ type: 'referral' })).every((p) => p.type === 'referral')).toBe(true)
  })

  it('lets an alum create a post that appears at the top of the feed', async () => {
    const post = await createPost({ authorId: 'a1', type: 'advice', title: 'Hi', body: 'Hello' })
    expect(post.company).toBe('Google') // defaults to the author's company
    expect((await getPosts())[0].id).toBe(post.id)
  })

  it('does not let a student create a post', async () => {
    await expect(
      createPost({ authorId: 's1', type: 'advice', title: 'Hi', body: 'Hello' }),
    ).rejects.toMatchObject({ status: 403 })
  })

  it('requires a title and body', async () => {
    await expect(
      createPost({ authorId: 'a1', type: 'advice', title: ' ', body: '' }),
    ).rejects.toThrow()
  })

  it('deletes a post', async () => {
    await deletePost('p1')
    expect((await getPosts()).some((p) => p.id === 'p1')).toBe(false)
  })
})
