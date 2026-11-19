import { Button, EmptyState } from '../components'
import { paths } from '../routes'

export default function NotFoundPage() {
  return (
    <EmptyState title="Page not found" action={<Button to={paths.landing}>Go home</Button>}>
      The page you were looking for doesn&rsquo;t exist.
    </EmptyState>
  )
}
