import { useSession } from '../../context/SessionContext'
import AlumniHomePage from './AlumniHomePage'
import StudentHomePage from './StudentHomePage'

/** /home shows a different page depending on who is logged in. */
export default function HomePage() {
  const { isAlumni } = useSession()
  return isAlumni ? <AlumniHomePage /> : <StudentHomePage />
}
