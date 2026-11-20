import { Placeholder } from '../../components'

export default function AlumniOnboardingPage() {
  return (
    <Placeholder
      title="Alumni onboarding"
      owner="Aidan"
      todo={[
        'Job titles, major, skills (TagInput)',
        'Networking status (NETWORKING_STATUSES)',
        'LinkedIn and social links',
        'Save with completeOnboarding(user.id, data), then go to /home',
      ]}
    />
  )
}
