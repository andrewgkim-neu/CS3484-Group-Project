// Every URL in the app lives here. Use these helpers instead of typing paths
// by hand, so a route can be renamed in one place.
//
//   <Button to={paths.chat(alum.id)}>Message</Button>
//   navigate(paths.profile(user.id))
//
// HANDOFF CONTRACT (Lok Ye → Christina):
//   Message button        → paths.chat(otherUserId)      e.g. /chat/a1
//   Schedule Coffee button → paths.schedule(alumniId)    e.g. /schedule/a1
// The chat/schedule pages read :userId from the URL with useParams().

export const paths = {
  landing: '/',
  login: '/login',
  signup: '/signup',
  verify: '/verify',
  onboardingStudent: '/onboarding/student',
  onboardingAlumni: '/onboarding/alumni',

  home: '/home',
  newPost: '/posts/new',

  search: '/search',
  profile: (userId = ':userId') => `/profile/${userId}`,
  myProfile: '/me',
  editProfile: '/me/edit',

  chatList: '/chat',
  chat: (userId = ':userId') => `/chat/${userId}`,
  calendar: '/calendar',
  schedule: (alumniId = ':userId') => `/schedule/${alumniId}`,

  styleguide: '/styleguide',
}

export function onboardingPathFor(role) {
  return role === 'alumni' ? paths.onboardingAlumni : paths.onboardingStudent
}
