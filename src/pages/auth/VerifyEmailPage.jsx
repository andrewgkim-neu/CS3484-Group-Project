import { Placeholder } from '../../components'

export default function VerifyEmailPage() {
  return (
    <Placeholder
      title="Verify your email"
      owner="Aidan"
      todo={[
        'Call sendVerificationCode(user.email)',
        'Accept the fake code (MOCK_VERIFICATION_CODE = 123456) via verifyEmail',
        'Then go to onboardingPathFor(user.role)',
      ]}
    />
  )
}
