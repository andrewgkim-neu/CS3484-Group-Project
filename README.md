# AlumNU: Northeastern Alumni Connection

A web app that connects Northeastern students with alumni for referrals, career advice, and coffee chats. Students build a profile, find alumni by major, company, or role, message them, and request referrals. Alumni post referral and hiring opportunities, respond to requests, and invite students to coffee chats at a date and time they choose.

Built with **React 19 + Vite + React Router 7**, in plain JavaScript and plain CSS. There is no real backend: all data comes from a fake API (`src/api`) backed by JSON files and saved in your browser's localStorage.

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for the system design: components, how they connect, and key design decisions. See **[docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)** for the testable requirements the interface is built and validated against.

## Team

**Andrew Kim: foundation, mock data, and integration**
- Set up the project in React + Vite, including routing and the nav bar.
- Build shared components: profile cards, buttons, tag/chip components for majors and skills, and form inputs.
- Create mock data JSON files for students, alumni, posts, conversations, and meetings.
- Write a "fake API" module (`getAlumni()`, `sendMessage()`, `createMeeting()`, etc.) that everyone calls instead of reading the JSON directly.
- Handle mock session state: who's logged in and whether they're a student or an alum.
- Later, act as integration and QA lead: merge branches, run an accessibility and usability pass, and handle deployment.

**Aidan: sign up, sign in, and onboarding**
- Build the login and account creation pages.
- Add mock Northeastern email verification (require an `@northeastern.edu` address and accept a fake code).
- Build the student onboarding flow: grad year, major, work history, and resume upload.
- Build the alumni onboarding flow: job titles, major, skills, networking status, and LinkedIn and social links.
- Make the form components reusable so Lok Ye can use them for profile editing.

**Kevin: home page and alumni posts**
- Build the student home page with suggested alumni, matched on major, target company, or role.
- Build the feed of alumni posts (e.g., "Open to giving referrals at X").
- Build the alumni home view showing incoming requests and recent messages.
- Build the "create post" form for alumni.
- Lead visual polish on the landing experience.

**Lok Ye: search and profiles**
- Build alumni search with filters for major, keywords, company, and job role.
- Build the search results list.
- Build the page for viewing someone else's profile: Send Message for everyone, plus Schedule Coffee Chat when an alum views a student.
- Build the page for viewing and editing your own profile, reusing Aidan's form components.
- Agree with Christina on how the profile buttons hand off to chat and scheduling (e.g., Message goes to `/chat/:userId`).

**Christina: messaging, referral requests, and calendar**
- Build the chat page: conversation list, message thread, and sending messages.
- Build referral requests as a structured message type (company, role, job link, attached resume) that alumni can accept or decline.
- Build the calendar page.
- Build the "schedule coffee chat" flow: an alum picks a date and time and sends an invite, the student accepts or declines, and accepted chats appear on both calendars.

## Getting started

**Prerequisite:** [Node.js](https://nodejs.org) 20 or newer (`node -v` to check).

```bash
git clone https://github.com/andrewgkim-neu/CS3484-Group-Project.git
cd CS3484-Group-Project
npm install
npm run dev        # open http://localhost:5173
```

| Command            | What it does                                    |
| ------------------ | ----------------------------------------------- |
| `npm run dev`      | Dev server with hot reload                      |
| `npm test`         | Run tests in watch mode (reruns on save)        |
| `npm run test:run` | Run all tests once                              |
| `npm run build`    | Production build into `dist/`                   |
| `npm run preview`  | Serve the production build locally              |
| `npm run lint`     | Lint with oxlint                                |
| `npm run format`   | Auto-format `src/` and `tests/` with Prettier   |

## Testing

Tests live in [`tests/`](tests/) and use Vitest + React Testing Library. They currently cover the fake API, shared components, route guards, and the nav bar. Each team member's pages have a placeholder test file (`tests/pages/`) listing the tests to write, as `it.todo` entries. See [tests/README.md](tests/README.md) for how to write tests.

GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs lint, tests, and the build on every push and pull request.

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

| Owner  | Area                              | Your folder(s)                         | Routes                                                                                        |
| ------ | --------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| Andrew | Foundation, mock data, integration | `src/api`, `src/components`, `src/data`, `src/context`, `App.jsx`, `routes.js` | `/styleguide`                                                                      |
| Aidan | Sign up, sign in, onboarding      | `src/pages/auth`                       | `/login`, `/signup`, `/verify`, `/onboarding/student`, `/onboarding/alumni`                    |
| Kevin | Home page and alumni posts        | `src/pages/home`, `src/pages/landing`  | `/`, `/home`, `/posts/new`                                                                     |
| Lok Ye | Search and profiles               | `src/pages/search`, `src/pages/profile`| `/search`, `/profile/:userId`, `/me`, `/me/edit`                                               |
| Christina | Messaging, referrals, calendar    | `src/pages/chat`, `src/pages/calendar` | `/chat`, `/chat/:userId`, `/calendar`, `/schedule/:userId`                                     |

Each page starts out as a `<Placeholder>` listing what it should contain. Replace it with your real page.

Put components that only your pages use in your own folder (e.g. `src/pages/chat/MessageBubble.jsx`). If you need something shared, or a change to a shared component or the API, ask Andrew or open a small separate PR for it.

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
tests/            Automated tests (see tests/README.md)
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

- **Profile → Chat (Lok Ye → Christina):** the Message button links to `paths.chat(userId)` (`/chat/a1`). The chat page reads `userId` with `useParams()` and calls `getOrCreateConversation(user.id, userId)`.
- **Profile → Schedule (Lok Ye → Christina):** the Schedule Coffee Chat button (student profiles only, alumni viewing) links to `paths.schedule(studentId)` (`/schedule/s1`). Only alumni can open this route. This changed after prototype testing (requirement F-G5).
- **Onboarding → Profile editing (Aidan → Lok Ye):** Aidan builds onboarding form sections (e.g. `WorkHistoryFields`) as components in `src/pages/auth/` that take `value` + `onChange` props, so Lok Ye's `/me/edit` page can reuse them.
- **Sign up → Verify → Onboarding (Aidan):** `RequireAuth` automatically redirects unverified users to `/verify` and users who haven't finished onboarding to `/onboarding/<role>`.

## Git workflow

1. Branch off `main`: `git checkout -b person3/student-home`
2. Commit often, and keep PRs focused on your area.
3. `npm run lint && npm run test:run && npm run build` before opening a PR. CI runs the same checks.
4. Open a PR into `main`. Andrew reviews and merges.
5. Pull `main` often (`git pull origin main`) to stay up to date.
