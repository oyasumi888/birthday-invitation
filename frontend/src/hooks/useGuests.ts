import { useCallback, useEffect, useState } from 'react'
import {
  deleteGuest as deleteGuestApi,
  fetchGuests,
  fetchStats,
  patchGuest as patchGuestApi,
  type Guest,
  type GuestStatus,
  type Stats,
} from '../services/api'
import { useAuth } from './useAuth'

const POLL_MS = 30_000

export function useGuests() {
  const { token } = useAuth()
  const [guests, setGuests] = useState<Guest[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const [g, s] = await Promise.all([fetchGuests(token), fetchStats(token)])
      setGuests(g)
      setStats(s)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!token) return
    const id = window.setInterval(() => {
      void load()
    }, POLL_MS)
    return () => window.clearInterval(id)
  }, [token, load])

  const updateStatus = useCallback(
    async (id: string, status: GuestStatus) => {
      if (!token) return
      await patchGuestApi(token, id, status)
      await load()
    },
    [token, load]
  )

  const removeGuest = useCallback(
    async (id: string) => {
      if (!token) return
      await deleteGuestApi(token, id)
      await load()
    },
    [token, load]
  )

  return {
    guests,
    stats,
    loading,
    error,
    reload: load,
    updateStatus,
    removeGuest,
  }
}
