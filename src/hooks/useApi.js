// Load data from the fake API with loading/error state handled for you.
//
//   const { data: alumni, loading, error, reload } = useApi(() => getAlumni(), [])
//   const { data: convo } = useApi(() => getConversation(id, user.id), [id, user.id])
//
// Pass the values your call depends on in `deps` (like useEffect).
// Set `live: true` to automatically reload whenever mock data changes
// (handy for chat threads and calendars).

import { useCallback, useEffect, useRef, useState } from 'react'
import { subscribe } from '../api'

export function useApi(fetcher, deps = [], { live = false } = {}) {
  const [data, setData] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const requestId = useRef(0)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const run = useCallback(async ({ silent = false } = {}) => {
    const id = ++requestId.current
    if (!silent) setLoading(true)
    setError(null)
    try {
      const result = await fetcherRef.current()
      if (id === requestId.current) setData(result)
    } catch (err) {
      if (id === requestId.current) setError(err)
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    if (!live) return undefined
    return subscribe(() => run({ silent: true }))
  }, [live, run])

  return { data, loading, error, reload: run, setData }
}
