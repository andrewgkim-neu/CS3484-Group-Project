import './Avatar.css'

const PALETTE = ['#c8102e', '#1d5fa8', '#1e7a46', '#8a5a00', '#6b3fa0', '#0f6e74']

function colorFor(id = '') {
  let h = 0
  for (const ch of id) h = (h + ch.charCodeAt(0)) % PALETTE.length
  return PALETTE[h]
}

/**
 * Circle with the user's photo, or their initials if there's no photo.
 * <Avatar user={user} size="lg" />
 * size: 'sm' (32px) | 'md' (48px) | 'lg' (80px)
 */
export default function Avatar({ user, size = 'md' }) {
  const name = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : ''
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'

  if (user?.avatarUrl) {
    return <img className={`avatar avatar--${size}`} src={user.avatarUrl} alt="" />
  }
  return (
    <span
      className={`avatar avatar--${size}`}
      style={{ backgroundColor: colorFor(user?.id) }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}
