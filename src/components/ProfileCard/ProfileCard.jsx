import { Link } from 'react-router'
import { ROLES } from '../../constants'
import { fullName, userHeadline } from '../../utils/format'
import { paths } from '../../routes'
import Avatar from '../Avatar/Avatar'
import Card from '../Card/Card'
import { Tag, TagList } from '../Tag/Tag'
import StatusBadge from './StatusBadge'
import './ProfileCard.css'

/**
 * Card summarizing a student or alum. Used on home, search, chat sidebars...
 *
 * <ProfileCard user={alum} />
 * <ProfileCard user={alum} actions={<Button to={paths.chat(alum.id)}>Message</Button>} />
 * <ProfileCard user={alum} footer={<p>Also majored in CS</p>} />
 * <ProfileCard user={alum} compact />            (one-line version, no tags)
 *
 * The name links to the user's profile page unless linkToProfile={false}.
 */
export default function ProfileCard({
  user,
  actions,
  footer,
  compact = false,
  linkToProfile = true,
  maxSkills = 4,
}) {
  if (!user) return null
  const name = fullName(user)
  const isAlum = user.role === ROLES.ALUMNI

  return (
    <Card as="article" className={`profile-card ${compact ? 'profile-card--compact' : ''}`}>
      <div className="profile-card__header">
        <Avatar user={user} size={compact ? 'sm' : 'md'} />
        <div className="profile-card__identity">
          <h3 className="profile-card__name">
            {linkToProfile ? <Link to={paths.profile(user.id)}>{name}</Link> : name}
          </h3>
          <p className="profile-card__headline">{userHeadline(user)}</p>
        </div>
      </div>

      {!compact && (
        <>
          <div className="profile-card__tags">
            {isAlum && <StatusBadge status={user.networkingStatus} />}
            {user.major && <Tag variant="major">{user.major}</Tag>}
            {isAlum && user.gradYear && (
              <Tag tone="neutral">&rsquo;{String(user.gradYear).slice(-2)}</Tag>
            )}
          </div>
          <TagList items={user.skills} variant="skill" max={maxSkills} label="Skills" />
        </>
      )}

      {footer && <div className="profile-card__footer">{footer}</div>}
      {actions && <div className="profile-card__actions">{actions}</div>}
    </Card>
  )
}
