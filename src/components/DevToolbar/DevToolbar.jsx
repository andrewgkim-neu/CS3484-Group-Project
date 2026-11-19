import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getAlumni, getStudents, resetMockData } from '../../api'
import { useSession } from '../../context/SessionContext'
import { paths } from '../../routes'
import './DevToolbar.css'

/**
 * Floating panel (dev mode only) for testing without the real login flow:
 * switch to any mock user, or reset all mock data back to the JSON seeds.
 * Shown when running `npm run dev`, or when VITE_SHOW_DEV_TOOLS=true.
 */
export default function DevToolbar() {
  const { user, switchUser, logout } = useSession()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [people, setPeople] = useState({ students: [], alumni: [] })

  useEffect(() => {
    if (!open) return
    Promise.all([getStudents(), getAlumni()]).then(([students, alumni]) =>
      setPeople({ students, alumni }),
    )
  }, [open])

  const handleSwitch = async (e) => {
    const id = e.target.value
    if (!id) {
      await logout()
      navigate(paths.landing)
    } else {
      await switchUser(id)
      navigate(paths.home)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Reset all mock data to the original JSON seed files?')) return
    resetMockData()
  }

  return (
    <aside
      className={`dev-toolbar ${open ? 'dev-toolbar--open' : ''}`}
      aria-label="Developer tools"
    >
      <button
        type="button"
        className="dev-toolbar__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        🛠 Dev
      </button>
      {open && (
        <div className="dev-toolbar__panel">
          <label className="dev-toolbar__label">
            Logged in as
            <select value={user?.id ?? ''} onChange={handleSwitch}>
              <option value="">(logged out)</option>
              <optgroup label="Students">
                {people.students.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.id})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Alumni">
                {people.alumni.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.id})
                  </option>
                ))}
              </optgroup>
              {user && !people.students.concat(people.alumni).some((u) => u.id === user.id) && (
                <option value={user.id}>
                  {user.firstName} {user.lastName} ({user.id}, not onboarded)
                </option>
              )}
            </select>
          </label>
          <button type="button" onClick={handleReset}>
            Reset mock data
          </button>
          <button type="button" onClick={() => navigate(paths.styleguide)}>
            Component styleguide
          </button>
        </div>
      )}
    </aside>
  )
}
