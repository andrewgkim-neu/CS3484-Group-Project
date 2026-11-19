import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { APP_NAME } from '../../constants'
import { useSession } from '../../context/SessionContext'
import { paths } from '../../routes'
import Avatar from '../Avatar/Avatar'
import Button from '../Button/Button'
import './NavBar.css'

function linksFor({ isStudent, isAlumni }) {
  if (isStudent) {
    return [
      { to: paths.home, label: 'Home' },
      { to: paths.search, label: 'Find alumni' },
      { to: paths.chatList, label: 'Messages' },
      { to: paths.calendar, label: 'Calendar' },
    ]
  }
  if (isAlumni) {
    return [
      { to: paths.home, label: 'Home' },
      { to: paths.newPost, label: 'New post' },
      { to: paths.chatList, label: 'Messages' },
      { to: paths.calendar, label: 'Calendar' },
    ]
  }
  return []
}

export default function NavBar() {
  const session = useSession()
  const { user, isLoggedIn, logout } = session
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = user?.onboarded ? linksFor(session) : []

  const handleLogout = async () => {
    await logout()
    navigate(paths.landing)
  }

  return (
    <header className="navbar">
      <nav className="navbar__inner container" aria-label="Main">
        <Link to={isLoggedIn ? paths.home : paths.landing} className="navbar__brand">
          <span className="navbar__logo" aria-hidden="true">
            HC
          </span>
          {APP_NAME}
        </Link>

        {links.length > 0 && (
          <button
            type="button"
            className="navbar__toggle"
            aria-expanded={menuOpen}
            aria-controls="navbar-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span className="navbar__toggle-bar" aria-hidden="true" />
          </button>
        )}

        {/* Clicking any link inside the menu closes it on mobile. */}
        <div
          id="navbar-menu"
          className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`}
          onClick={(e) => e.target.closest('a, button') && setMenuOpen(false)}
        >
          <ul className="navbar__links">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className="navbar__link">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar__account">
            {isLoggedIn ? (
              <>
                <NavLink to={paths.myProfile} className="navbar__me">
                  <Avatar user={user} size="sm" />
                  <span>{user.firstName}</span>
                  <span className="visually-hidden">, view my profile</span>
                </NavLink>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" to={paths.login}>
                  Log in
                </Button>
                <Button size="sm" to={paths.signup}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
