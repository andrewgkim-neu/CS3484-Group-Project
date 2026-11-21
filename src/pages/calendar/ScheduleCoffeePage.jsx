import { useParams } from 'react-router'
import { Placeholder } from '../../components'

/** /schedule/:userId: an alum invites the student :userId to a coffee chat (alumni only). */
export default function ScheduleCoffeePage() {
  const { userId } = useParams()
  return (
    <Placeholder
      title="Schedule coffee"
      owner="Christina"
      todo={[
        'Form: date, start time, duration, description, meeting link (F-G1)',
        'Reject missing, past, or overlapping times with an Invite Error (F-G2)',
        'Send → Request Pending card in both chat threads; alum can cancel (F-G3)',
        'Student accepts → meeting on both calendars; declines → no meeting (F-G4)',
      ]}
    >
      <p className="text-muted">
        URL param <code>userId</code> = <code>{userId}</code>
      </p>
    </Placeholder>
  )
}
