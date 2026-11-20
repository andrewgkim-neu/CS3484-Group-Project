// Test helpers for rendering the real app (router + session + all routes).

import { render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import App from '../../src/App'
import { SessionProvider } from '../../src/context/SessionContext'

function LocationProbe() {
  const location = useLocation()
  return <output data-testid="location">{location.pathname}</output>
}

/**
 * Render the full app at a URL, optionally already logged in.
 *
 *   renderApp('/home', { as: 's1' })     // student Alex Chen
 *   renderApp('/home', { as: 'a1' })     // alum Maria Gonzalez
 *   renderApp('/home')                   // logged out
 *
 * Use currentPath() to check where the router ended up after redirects.
 */
export function renderApp(route = '/', { as } = {}) {
  if (as) localStorage.setItem('hc:session', as)
  return render(
    <MemoryRouter initialEntries={[route]}>
      <SessionProvider>
        <App />
        <LocationProbe />
      </SessionProvider>
    </MemoryRouter>,
  )
}

/** The router's current pathname (waits are up to the caller). */
export function currentPath() {
  return screen.getByTestId('location').textContent
}

/**
 * Render a single component inside a router (for components that use <Link>).
 *   renderWithRouter(<Button to="/search">Go</Button>)
 */
export function renderWithRouter(ui, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)
}
