import { Placeholder } from '../../components'

export default function SignupPage() {
  return (
    <Placeholder
      title="Create account"
      owner="Person 2"
      todo={[
        'Choose student or alum',
        'Require an @northeastern.edu email (isNortheasternEmail)',
        'Call useSession().signup, then go to /verify',
      ]}
    />
  )
}
