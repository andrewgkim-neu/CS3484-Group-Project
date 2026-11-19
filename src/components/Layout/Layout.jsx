import { Outlet } from 'react-router'
import DevToolbar from '../DevToolbar/DevToolbar'
import NavBar from '../NavBar/NavBar'

const SHOW_DEV_TOOLS = import.meta.env.DEV || import.meta.env.VITE_SHOW_DEV_TOOLS === 'true'

/** Wraps every page: skip link, nav bar, main content area, dev toolbar. */
export default function Layout() {
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <NavBar />
      <main id="main" className="app-main container" tabIndex={-1}>
        <Outlet />
      </main>
      {SHOW_DEV_TOOLS && <DevToolbar />}
    </div>
  )
}
