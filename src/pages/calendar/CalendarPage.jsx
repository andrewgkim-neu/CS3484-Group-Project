import { Placeholder } from '../../components'

export default function CalendarPage() {
  return (
    <Placeholder
      title="Calendar"
      owner="Christina"
      todo={[
        'Show meetings (getMeetings)',
        'Alumni: manage availability slots (getAvailability, addAvailabilitySlot, removeAvailabilitySlot)',
        'Cancel meetings (cancelMeeting)',
      ]}
    />
  )
}
