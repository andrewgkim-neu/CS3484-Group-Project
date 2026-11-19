import { useParams } from 'react-router'
import { Placeholder } from '../../components'

/** /profile/:userId */
export default function ProfilePage() {
  const { userId } = useParams()
  return (
    <Placeholder
      title="Profile"
      owner="Person 4"
      todo={[
        'Load the user with getUser(userId)',
        'Show their profile details',
        'Message button → paths.chat(userId)',
        'Schedule Coffee button (alumni only) → paths.schedule(userId)',
      ]}
    >
      <p className="text-muted">
        URL param <code>userId</code> = <code>{userId}</code>
      </p>
    </Placeholder>
  )
}
