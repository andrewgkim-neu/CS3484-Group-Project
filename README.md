# CS3484-Group-Project
Northeastern Alumni Connection: a site that connects Northeastern students with alumni for referrals, advice, and coffee chats.

Built with **React 19 + Vite + React Router 7**, in plain JavaScript and plain CSS. There is no real backend: all data comes from a fake API (`src/api`) backed by JSON files and saved in your browser's localStorage.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command          | What it does                       |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Dev server with hot reload         |
| `npm run build`  | Production build into `dist/`      |
| `npm run lint`   | Lint with oxlint                   |
| `npm run format` | Auto-format `src/` with Prettier   |

### Testing without a login page

While the login page is still a placeholder, use the **🛠 Dev** button in the bottom-right corner (dev mode only). It lets you:

- **Switch users:** log in as any student or alum instantly.
- **Reset mock data:** throw away your local changes and reload the JSON seeds.
- **Open the component styleguide** at `/styleguide`.

Demo accounts (all passwords are `password`):

| Role    | Email                             | Notes                                   |
| ------- | --------------------------------- | --------------------------------------- |
| Student | `alex.chen@northeastern.edu`      | CS '27, has conversations + a meeting   |
| Student | `priya.patel@northeastern.edu`    | Data Science, has an accepted referral  |
| Alum    | `maria.gonzalez@northeastern.edu` | Google, has a pending referral request  |
| Alum    | `rachel.levine@northeastern.edu`  | Datadog, has a meeting with Alex        |

The fake email verification code is always **`123456`**.

## Who owns what

Every person builds their own pages inside their own folder, so you'll rarely edit the same files as someone else.

| Person | Area                              | Your folder(s)                         | Routes                                                                                        |
| ------ | --------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1      | Foundation, mock data, integration | `src/api`, `src/components`, `src/data`, `src/context`, `App.jsx`, `routes.js` | `/styleguide`                                                                      |
| 2      | Sign up, sign in, onboarding      | `src/pages/auth`                       | `/login`, `/signup`, `/verify`, `/onboarding/student`, `/onboarding/alumni`                    |
| 3      | Home page and alumni posts        | `src/pages/home`, `src/pages/landing`  | `/`, `/home`, `/posts/new`                                                                     |
| 4      | Search and profiles               | `src/pages/search`, `src/pages/profile`| `/search`, `/profile/:userId`, `/me`, `/me/edit`                                               |
| 5      | Messaging, referrals, calendar    | `src/pages/chat`, `src/pages/calendar` | `/chat`, `/chat/:userId`, `/calendar`, `/schedule/:userId`                                     |

Each page starts out as a `<Placeholder>` listing what it should contain. Replace it with your real page.

Put components that only your pages use in your own folder (e.g. `src/pages/chat/MessageBubble.jsx`). If you need something shared, or a change to a shared component or the API, ask Person 1 or open a small separate PR for it.

## Project structure

```
src/
  api/            Fake API. The ONLY way pages get or change data.
  data/           JSON seed data (students, alumni, posts, conversations, availability, meetings)
  components/     Shared building blocks: Button, ProfileCard, Tag, form inputs, NavBar...
  context/        SessionContext: who's logged in
  hooks/          useApi: loading/error handling for API calls
  pages/          One folder per owner (see table above)
  styles/         tokens.css (colors, spacing) + global.css
  utils/          Small helpers (fullName, formatDateTime, timeAgo...)
  constants.js    MAJORS, NETWORKING_STATUSES, POST_TYPES, ROLES...
  routes.js       Every URL in the app, plus helpers like paths.chat(id)
  App.jsx         The route table
```

## The rules

1. **Never import from `src/data` directly.** Always use the functions in `src/api`, the way you would call a real backend.
2. **Use `paths` from `src/routes.js` for links**, not hand-typed strings: `<Button to={paths.chat(alum.id)}>`.
3. **Use the shared components** (see `/styleguide`) instead of making your own buttons, cards, or inputs.
4. **Use the CSS variables** from `src/styles/tokens.css` (`var(--color-brand)`, `var(--space-4)`) instead of raw hex colors and pixel values.
5. **One `<h1>` per page.** `<PageHeader title="..." />` adds it for you.

## How-to

### Who's logged in?

```jsx
import { useSession } from '../../context/SessionContext'

const { user, isStudent, isAlumni, login, logout, signup, refreshUser } = useSession()
```

`user` is `null` when logged out. Pages under `RequireAuth` (most of them) can assume `user` exists.

### Loading data

```jsx
import { getAlumni } from '../../api'
import { useApi } from '../../hooks/useApi'
import { Spinner, ErrorMessage, ProfileCard } from '../../components'

const { data: alumni, loading, error, reload } = useApi(() => getAlumni(), [])

if (loading) return <Spinner />
if (error) return <ErrorMessage error={error} onRetry={reload} />
return alumni.map((a) => <ProfileCard key={a.id} user={a} />)
```

Pass `{ live: true }` as the third argument to refetch automatically whenever mock data changes (useful for chat threads and calendars).

### Changing data

```jsx
import { sendMessage, ApiError } from '../../api'

try {
  await sendMessage({ conversationId, senderId: user.id, body })
} catch (err) {
  setError(err.message) // ApiError has a friendly .message and an HTTP-like .status
}
```

## Fake API reference

Every function is `async` and throws an `ApiError` on failure. Returned objects are copies, and user objects never include passwords. See the JSDoc in each file for full details.

| Area | Functions (`src/api/…`) |
| ---- | ----------------------- |
| **Auth** (`auth.js`) | `getCurrentUser()`, `login(email, password)`, `logout()`, `signup({ email, password, firstName, lastName, role })`, `isNortheasternEmail(email)`, `sendVerificationCode(email)`, `verifyEmail(userId, code)`, `completeOnboarding(userId, profile)` |
| **Users** (`users.js`) | `getUser(id)`, `getAlumni()`, `getStudents()`, `searchAlumni({ query, major, company, role, networkingStatus })`, `getSuggestedAlumni(studentId, limit)`, `updateUser(id, patch)` |
| **Posts** (`posts.js`) | `getPosts({ authorId, type })`, `createPost({ authorId, type, title, body, company, tags })`, `deletePost(id)` |
| **Chat** (`conversations.js`) | `getConversations(userId)`, `getConversation(conversationId, viewerId)`, `getOrCreateConversation(userId, otherUserId)`, `sendMessage({ conversationId, senderId, body })`, `sendReferralRequest({ conversationId, senderId, company, role, jobLink, resumeFileName, body })`, `respondToReferral({ conversationId, messageId, responderId, status })`, `getPendingReferralRequests(alumniId)` |
| **Calendar** (`meetings.js`) | `getAvailability(alumniId, { includeBooked, includePast })`, `addAvailabilitySlot({ alumniId, start, end })`, `removeAvailabilitySlot(slotId)`, `getMeetings(userId, { includeCancelled })`, `createMeeting({ slotId, studentId, topic, location })`, `cancelMeeting(meetingId)` |
| **Misc** | `resetMockData()`, `subscribe(fn)` |

All dates are ISO strings in UTC. Display them with `formatDateTime()` / `timeAgo()` from `src/utils/format.js`.

### Data shapes

Look at the JSON files in `src/data` for full examples.

- **Student:** `id, role: 'student', email, firstName, lastName, pronouns, gradYear, major, minor, bio, targetCompanies[], targetRoles[], skills[], workHistory[{ company, title, startDate, endDate, description }], resume{ fileName, uploadedAt } | null, links{ linkedin, github }, emailVerified, onboarded`
- **Alum:** `id, role: 'alumni', email, firstName, lastName, pronouns, gradYear, major, currentTitle, currentCompany, location, bio, jobHistory[{ company, title, startDate, endDate }], skills[], networkingStatus ('open_to_referrals' | 'open_to_chat' | 'not_available'), links{ linkedin, github, website }, emailVerified, onboarded`
- **Post:** `id, authorId, type ('referral' | 'hiring' | 'advice' | 'event'), title, body, company, tags[], createdAt`, plus `author` when returned from the API
- **Conversation:** `id, participantIds[2], messages[]`, where a message is `{ id, senderId, type: 'text', body, createdAt }` or `{ ..., type: 'referral_request', referral: { company, role, jobLink, resumeFileName, status: 'pending' | 'accepted' | 'declined', respondedAt } }`
- **Availability slot:** `id, alumniId, start, end, isBooked`
- **Meeting:** `id, slotId, alumniId, studentId, start, end, topic, location, status ('scheduled' | 'cancelled')`, plus `alumni` and `student` when returned from the API

Edited a JSON seed file? The app notices and re-seeds automatically on the next page load.

## Handoff contracts

- **Profile → Chat (Person 4 → 5):** the Message button links to `paths.chat(userId)` (`/chat/a1`). The chat page reads `userId` with `useParams()` and calls `getOrCreateConversation(user.id, userId)`.
- **Profile → Schedule (Person 4 → 5):** the Schedule Coffee button (alumni profiles only, students viewing) links to `paths.schedule(alumniId)` (`/schedule/a1`).
- **Onboarding → Profile editing (Person 2 → 4):** Person 2 builds onboarding form sections (e.g. `WorkHistoryFields`) as components in `src/pages/auth/` that take `value` + `onChange` props, so Person 4's `/me/edit` page can reuse them.
- **Sign up → Verify → Onboarding (Person 2):** `RequireAuth` automatically redirects unverified users to `/verify` and users who haven't finished onboarding to `/onboarding/<role>`.

## Git workflow

1. Branch off `main`: `git checkout -b person3/student-home`
2. Commit often, and keep PRs focused on your area.
3. `npm run lint && npm run build` before opening a PR.
4. Open a PR into `main`. Person 1 reviews and merges.
5. Pull `main` often (`git pull origin main`) to stay up to date.
