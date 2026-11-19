import { Placeholder } from '../../components'

export default function MyProfilePage() {
  return (
    <Placeholder
      title="My profile"
      owner="Person 4"
      todo={["Show the logged-in user's profile (useSession().user)", 'Link to /me/edit']}
    />
  )
}
