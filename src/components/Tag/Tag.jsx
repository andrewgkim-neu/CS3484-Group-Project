import './Tag.css'

/**
 * Small pill for majors, skills, companies, statuses.
 *
 * <Tag>Python</Tag>
 * <Tag variant="major">Computer Science</Tag>
 * <Tag tone="success">Open to referrals</Tag>
 * <Tag onRemove={() => removeSkill('Python')}>Python</Tag>   (shows an × button)
 *
 * variant: 'default' | 'major' | 'skill' | 'company'
 * tone:    overrides color: 'success' | 'info' | 'warning' | 'danger' | 'neutral'
 */
export function Tag({ variant = 'default', tone, onRemove, children, className = '' }) {
  const classes = ['tag', `tag--${variant}`, tone && `tag--tone-${tone}`, className]
    .filter(Boolean)
    .join(' ')
  return (
    <span className={classes}>
      {children}
      {onRemove && (
        <button
          type="button"
          className="tag__remove"
          onClick={onRemove}
          aria-label={`Remove ${children}`}
        >
          ×
        </button>
      )}
    </span>
  )
}

/**
 * A row of tags. Shows "+N more" past `max`.
 * <TagList items={user.skills} variant="skill" max={4} />
 */
export function TagList({ items = [], variant, max, label }) {
  if (!items.length) return null
  const shown = max ? items.slice(0, max) : items
  const hidden = items.length - shown.length
  return (
    <ul className="tag-list" aria-label={label}>
      {shown.map((item) => (
        <li key={item}>
          <Tag variant={variant}>{item}</Tag>
        </li>
      ))}
      {hidden > 0 && (
        <li>
          <Tag tone="neutral">+{hidden} more</Tag>
        </li>
      )}
    </ul>
  )
}

export default Tag
