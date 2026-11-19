import { NETWORKING_STATUSES } from '../../constants'
import { Tag } from '../Tag/Tag'

/** Shows an alum's networking status, e.g. "Open to referrals". */
export default function StatusBadge({ status }) {
  const s = NETWORKING_STATUSES.find((x) => x.value === status)
  if (!s) return null
  return <Tag tone={s.tone}>{s.label}</Tag>
}
