# Tests

Automated tests use **[Vitest](https://vitest.dev)** (test runner, built into Vite) and
**[React Testing Library](https://testing-library.com/docs/react-testing-library/intro)**
(renders components and interacts with them the way a user would).

```bash
npm test            # watch mode: reruns tests when you save
npm run test:run    # run once (what CI runs)
```

## Layout

| Folder        | What's tested                                                                                                             | Status                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `api/`        | The fake API: auth, users/search, posts, conversations/referrals, meetings/availability                                   | Implemented                                           |
| `components/` | Shared components: Button, form inputs, ProfileCard                                                                       | Implemented                                           |
| `routing/`    | Route guards (login, verification, onboarding, role checks) and the role-aware nav bar                                    | Implemented                                           |
| `pages/`      | One file per team member's pages                                                                                          | `it.todo` placeholders, to be filled in by each owner |
| `e2e/`        | Planned Playwright tests for layout, timing, and cross-browser requirements (IR1, IR5, IR10, CR6)                         | Planned, see `e2e/README.md`                          |
| `helpers/`    | `renderApp(route, { as })` renders the whole app logged in as any mock user; `renderWithRouter(ui)` for single components |                                                       |
| `setup.js`    | Runs before every test: resets mock data, logs out, and freezes the clock at `2026-11-19T12:00Z`                          |                                                       |

Every test starts from the original JSON seed data, so tests can't affect each other.

## Naming tests after requirements

Every test name starts with the ID of the requirement it verifies, from [docs/REQUIREMENTS.md](../docs/REQUIREMENTS.md), e.g. `it('F-D2: filters by major', …)` or `describe('F-D1–F-D9 Alumni search', …)`. To find every test for a requirement, search the repo for its ID (`grep -rn "F-D6" tests`). Tests with no ID cover internal rules that aren't user-facing requirements.

## Writing a test

```jsx
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { it, expect } from 'vitest'
import { currentPath, renderApp } from '../helpers/renderApp'

it('F-E2: Send Message opens a chat with that alum', async () => {
  renderApp('/profile/a1', { as: 's1' }) // logged in as student Alex
  await userEvent.click(await screen.findByRole('link', { name: 'Send Message' }))
  await waitFor(() => expect(currentPath()).toBe('/chat/a1'))
})
```

Tips:

- Find elements the way a user would: `getByRole`, `getByLabelText`, `getByText`. If you can't find an element by role or label, it is probably not accessible either.
- Use `findBy…` (async) for anything that appears after data loads.
- Each test should map to a requirement from our spec, and its name should start with that ID. If a requirement is hard to test, it probably needs to be more specific.
