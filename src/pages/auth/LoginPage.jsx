import { Placeholder } from '../../components'

export default function LoginPage() {
  return (
    <Placeholder
      title="Log in"
      owner="Person 2"
      todo={[
        'Email + password form (use useSession().login)',
        'Show API errors',
        'After login, go to location.state?.from or /home',
      ]}
    />
  )
}
