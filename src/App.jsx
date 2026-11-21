// All routes in one place. Path strings come from src/routes.js.
// To add a page: create it in your folder under src/pages, then add a <Route> here.

import { Route, Routes } from 'react-router'
import { RedirectIfLoggedIn, RequireAuth } from './components'
import Layout from './components/Layout/Layout'
import { ROLES } from './constants'
import { paths } from './routes'

import NotFoundPage from './pages/NotFoundPage'
import StyleguidePage from './pages/StyleguidePage'
// Aidan: auth + onboarding
import AlumniOnboardingPage from './pages/auth/AlumniOnboardingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import StudentOnboardingPage from './pages/auth/StudentOnboardingPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
// Kevin: home + posts
import CreatePostPage from './pages/home/CreatePostPage'
import HomePage from './pages/home/HomePage'
import LandingPage from './pages/landing/LandingPage'
// Lok Ye: search + profiles
import EditProfilePage from './pages/profile/EditProfilePage'
import MyProfilePage from './pages/profile/MyProfilePage'
import ProfilePage from './pages/profile/ProfilePage'
import SearchPage from './pages/search/SearchPage'
// Christina: messaging + calendar
import CalendarPage from './pages/calendar/CalendarPage'
import ScheduleCoffeePage from './pages/calendar/ScheduleCoffeePage'
import ChatPage from './pages/chat/ChatPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Logged-out only */}
        <Route element={<RedirectIfLoggedIn />}>
          <Route path={paths.landing} element={<LandingPage />} />
          <Route path={paths.login} element={<LoginPage />} />
          <Route path={paths.signup} element={<SignupPage />} />
        </Route>

        {/* Logged in, but not verified/onboarded yet */}
        <Route element={<RequireAuth allowIncomplete />}>
          <Route path={paths.verify} element={<VerifyEmailPage />} />
          <Route path={paths.onboardingStudent} element={<StudentOnboardingPage />} />
          <Route path={paths.onboardingAlumni} element={<AlumniOnboardingPage />} />
        </Route>

        {/* Any logged-in, onboarded user */}
        <Route element={<RequireAuth />}>
          <Route path={paths.home} element={<HomePage />} />
          <Route path={paths.profile()} element={<ProfilePage />} />
          <Route path={paths.myProfile} element={<MyProfilePage />} />
          <Route path={paths.editProfile} element={<EditProfilePage />} />
          <Route path={paths.chatList} element={<ChatPage />} />
          <Route path={paths.chat()} element={<ChatPage />} />
          <Route path={paths.calendar} element={<CalendarPage />} />
        </Route>

        {/* Students only */}
        <Route element={<RequireAuth role={ROLES.STUDENT} />}>
          <Route path={paths.search} element={<SearchPage />} />
        </Route>

        {/* Alumni only. Only alumni send coffee-chat invites (requirement F-G5). */}
        <Route element={<RequireAuth role={ROLES.ALUMNI} />}>
          <Route path={paths.newPost} element={<CreatePostPage />} />
          <Route path={paths.schedule()} element={<ScheduleCoffeePage />} />
        </Route>

        <Route path={paths.styleguide} element={<StyleguidePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
