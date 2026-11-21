import { useParams } from 'react-router'
import { Placeholder } from '../../components'

/** /profile/:userId */
export default function ProfilePage() {
  const { userId } = useParams()
  return (
    <Placeholder
      title="Profile"
      owner="Lok Ye"
      todo={[
        'Load the user with getUser(userId)',
        'Show their profile details',
        'Send Message button (with a one-line description) → paths.chat(userId)',
        'Schedule Coffee Chat button (alum viewing a student only) → paths.schedule(userId)',
      ]}
    >
      <p className="text-muted">
        URL param <code>userId</code> = <code>{userId}</code>
      </p>
    </Placeholder>
  )
}
