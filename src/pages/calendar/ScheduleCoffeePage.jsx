import { useParams } from 'react-router'
import { Placeholder } from '../../components'

/** /schedule/:userId: student picks one of the alum's open slots. */
export default function ScheduleCoffeePage() {
  const { userId } = useParams()
  return (
    <Placeholder
      title="Schedule coffee"
      owner="Christina"
      todo={[
        "Show the alum's open slots (getAvailability(userId))",
        'Student picks one → createMeeting({ slotId, studentId })',
        'Meeting then shows up on both calendars',
      ]}
    >
      <p className="text-muted">
        URL param <code>userId</code> = <code>{userId}</code>
      </p>
    </Placeholder>
  )
}
