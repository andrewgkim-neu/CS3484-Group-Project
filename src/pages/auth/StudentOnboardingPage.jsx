import { Placeholder } from '../../components'

export default function StudentOnboardingPage() {
  return (
    <Placeholder
      title="Student onboarding"
      owner="Person 2"
      todo={[
        'Grad year, major',
        'Work history',
        'Resume upload (FileInput)',
        'Save with completeOnboarding(user.id, data), then go to /home',
      ]}
    />
  )
}
