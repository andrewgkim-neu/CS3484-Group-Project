import { Placeholder } from '../../components'

export default function LandingPage() {
  return (
    <Placeholder
      title="Welcome"
      owner="Kevin"
      todo={[
        'Landing hero for logged-out visitors',
        'Explain the value for students and alumni',
        'Calls to action: Log in / Sign up',
      ]}
    />
  )
}
