# End-to-end tests (planned)

Some requirements can't be checked in jsdom because they depend on real layout, viewport size, timing, or browser differences. These will be [Playwright](https://playwright.dev) tests that launch a real browser against `npm run preview`.

They are not set up yet. Vitest only runs `tests/**/*.test.{js,jsx}`, so files here won't interfere with `npm test`.

## Planned tests

| File (planned)            | Requirement        | What the test does                                                                                                                                                                                          |
| ------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `responsive.spec.js`      | **IR1** (Must)     | For every route, `page.setViewportSize({ width: 375, height: 812 })`, then assert `document.documentElement.scrollWidth <= 375` (no horizontal scroll) and that the nav menu button is visible below 768px. |
| `feedback-timing.spec.js` | **IR5** (Must)     | Click a primary button (e.g. Send in a chat) and assert it shows `aria-busy` or a pressed or disabled state within 100 ms.                                                                                  |
| `scenarios.spec.js`       | **IR10**, **TF7**  | As a student, go from `/home` to an alum's Send Message button in 3 clicks or fewer (Search → result card → Send Message).                                                                                  |
| `scenarios.spec.js`       | **F-G3**, **F-G4** | Two-user flow: as an alum, send a coffee-chat invite. Switch to the student with the dev toolbar and accept it. Assert the chat appears on both calendars.                                                  |
| `browsers` (config)       | **CR6** (Should)   | Run the whole suite in Playwright's `chromium`, `firefox`, and `webkit` projects.                                                                                                                           |

## Setting it up (when we get to it)

```bash
npm install -D @playwright/test
npx playwright install
```

Then add a `playwright.config.js` with `testDir: 'tests/e2e'` and `webServer: { command: 'npm run build && npm run preview', port: 4173 }`. Add an `"e2e": "playwright test"` script to `package.json`.

As with the other tests, name each test after the requirement it checks, e.g. `test('IR1: search page has no horizontal scroll at 375px', …)`.
