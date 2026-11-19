import { Placeholder } from '../../components'

export default function CreatePostPage() {
  return (
    <Placeholder
      title="Create a post"
      owner="Person 3"
      todo={[
        'Post form: type, title, body, company, tags',
        'Save with createPost, then go to /home',
      ]}
    />
  )
}
