import { Navigate, Outlet, useLocation } from 'react-router'
import { useSession } from '../../context/SessionContext'
import { onboardingPathFor, paths } from '../../routes'
import { Spinner } from '../Feedback/Feedback'

/**
 * Route guard. Wrap routes that need a logged-in user.
 *
 *   <Route element={<RequireAuth />}>                 any logged-in, onboarded user
 *   <Route element={<RequireAuth role="alumni" />}>   alumni only
 *   <Route element={<RequireAuth allowIncomplete />}> logged in, but may not be verified/onboarded yet
 *
 * Redirects:
 *   not logged in        → /login   (with state.from so login can send them back)
 *   email not verified   → /verify
 *   not onboarded        → /onboarding/student or /onboarding/alumni
 *   wrong role           → /home
 */
export default function RequireAuth({ role, allowIncomplete = false }) {
  const { user, loading } = useSession()
  const location = useLocation()

  if (loading) return <Spinner />
  if (!user) return <Navigate to={paths.login} replace state={{ from: location }} />

  if (!allowIncomplete) {
    if (!user.emailVerified) return <Navigate to={paths.verify} replace />
    if (!user.onboarded) return <Navigate to={onboardingPathFor(user.role)} replace />
  }
  if (role && user.role !== role) return <Navigate to={paths.home} replace />

  return <Outlet />
}

/** Opposite of RequireAuth: for login/signup/landing. Sends logged-in users to /home. */
export function RedirectIfLoggedIn() {
  const { user, loading } = useSession()
  if (loading) return <Spinner />
  if (user) return <Navigate to={paths.home} replace />
  return <Outlet />
}
