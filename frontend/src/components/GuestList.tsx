import { useMemo, useState } from 'react'
import type { Guest, GuestStatus } from '../services/api'

type Props = {
  guests: Guest[]
  onStatusChange: (id: string, status: GuestStatus) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const statusLabels: Record<GuestStatus, string> = {
  going: 'Going',
  not_going: 'Not going',
  cancelled: 'Cancelled',
}

function StatusBadge({ status }: { status: GuestStatus }) {
  const base =
    'inline-block rounded-none border px-2 py-1 font-body text-[10px] font-bold uppercase tracking-wider'
  if (status === 'going') {
    return (
      <span className={`${base} border-poster-white text-poster-white`}>{statusLabels.going}</span>
    )
  }
  if (status === 'not_going') {
    return (
      <span className={`${base} border-poster-muted text-poster-muted`}>
        {statusLabels.not_going}
      </span>
    )
  }
  return (
    <span
      className={`${base} border-poster-white text-poster-muted line-through decoration-poster-white`}
    >
      {statusLabels.cancelled}
    </span>
  )
}

const fieldClass =
  'mt-2 w-full rounded-[2px] border border-poster-white bg-poster-bg px-3 py-2 font-body text-sm text-poster-white outline-none focus:border-2 focus:border-poster-white'

export function GuestList({ guests, onStatusChange, onDelete }: Props) {
  const [filter, setFilter] = useState<GuestStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return guests.filter((g) => {
      if (filter !== 'all' && g.status !== filter) return false
      if (!q) return true
      return g.name.toLowerCase().includes(q)
    })
  }, [guests, filter, search])

  async function handleStatus(id: string, status: GuestStatus) {
    setBusyId(id)
    try {
      await onStatusChange(id, status)
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this RSVP permanently?')) return
    setBusyId(id)
    try {
      await onDelete(id)
    } finally {
      setBusyId(null)
    }
  }

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    } catch {
      return iso
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 border-b border-poster-white pb-4 sm:flex-row sm:items-end sm:justify-between">
        <label className="block flex-1 font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
          Search by name
          <input
            className={fieldClass}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a name…"
          />
        </label>
        <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted sm:w-52">
          Filter status
          <select
            className={fieldClass}
            value={filter}
            onChange={(e) => setFilter(e.target.value as GuestStatus | 'all')}
          >
            <option value="all" className="bg-poster-bg">
              All
            </option>
            <option value="going" className="bg-poster-bg">
              Going
            </option>
            <option value="not_going" className="bg-poster-bg">
              Not going
            </option>
            <option value="cancelled" className="bg-poster-bg">
              Cancelled
            </option>
          </select>
        </label>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-left font-body text-sm text-poster-white">
          <thead>
            <tr className="border-b border-poster-white text-[11px] uppercase tracking-[0.2em] text-poster-muted">
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Contact</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">+1s</th>
              <th className="py-3 pr-4">Message</th>
              <th className="py-3 pr-4">Submitted</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr
                key={g.id}
                className="border-b border-poster-white/15 transition-colors hover:bg-poster-surface"
              >
                <td className="py-3 pr-4 font-medium">{g.name}</td>
                <td className="max-w-[14rem] truncate py-3 pr-4 text-poster-muted">
                  {[g.email, g.phone].filter(Boolean).join(' · ') || '—'}
                </td>
                <td className="py-3 pr-4">
                  <StatusBadge status={g.status} />
                </td>
                <td className="py-3 pr-4">{g.plus_ones}</td>
                <td className="max-w-[12rem] truncate py-3 pr-4 text-poster-muted">
                  {g.message ?? '—'}
                </td>
                <td className="whitespace-nowrap py-3 pr-4 text-xs text-poster-muted">
                  {formatDate(g.created_at)}
                </td>
                <td className="py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      className="rounded-[2px] border border-poster-white bg-poster-bg px-2 py-1 font-body text-xs uppercase text-poster-white outline-none focus:border-2 focus:border-poster-white"
                      value={g.status}
                      disabled={busyId === g.id}
                      onChange={(e) =>
                        void handleStatus(g.id, e.target.value as GuestStatus)
                      }
                    >
                      <option value="going" className="bg-poster-bg">
                        Going
                      </option>
                      <option value="not_going" className="bg-poster-bg">
                        Not going
                      </option>
                      <option value="cancelled" className="bg-poster-bg">
                        Cancelled
                      </option>
                    </select>
                    <button
                      type="button"
                      className="rounded-[2px] border border-poster-white px-2 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-poster-muted hover:bg-poster-tint hover:text-poster-text"
                      disabled={busyId === g.id}
                      onClick={() => void handleDelete(g.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 lg:hidden">
        {filtered.map((g) => (
          <article
            key={g.id}
            className="rounded-[2px] border border-poster-white bg-poster-bg p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl uppercase tracking-normal text-poster-white">
                  {g.name}
                </h3>
                <p className="mt-1 font-body text-xs text-poster-muted">
                  {[g.email, g.phone].filter(Boolean).join(' · ') || 'No contact'}
                </p>
              </div>
              <StatusBadge status={g.status} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 font-body text-[11px] uppercase tracking-[0.15em] text-poster-muted">
              <div>
                <dt>Plus ones</dt>
                <dd className="mt-1 font-body text-lg normal-case tracking-normal text-poster-white">
                  {g.plus_ones}
                </dd>
              </div>
              <div>
                <dt>Submitted</dt>
                <dd className="mt-1 font-body text-xs normal-case tracking-normal text-poster-muted">
                  {formatDate(g.created_at)}
                </dd>
              </div>
            </dl>
            {g.message ? (
              <p className="mt-3 border-l border-poster-white pl-3 font-body text-sm text-poster-muted">
                {g.message}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <select
                className="flex-1 rounded-[2px] border border-poster-white bg-poster-bg px-2 py-2 font-body text-xs uppercase text-poster-white outline-none focus:border-2 focus:border-poster-white"
                value={g.status}
                disabled={busyId === g.id}
                onChange={(e) => void handleStatus(g.id, e.target.value as GuestStatus)}
              >
                <option value="going" className="bg-poster-bg">
                  Going
                </option>
                <option value="not_going" className="bg-poster-bg">
                  Not going
                </option>
                <option value="cancelled" className="bg-poster-bg">
                  Cancelled
                </option>
              </select>
              <button
                type="button"
                className="rounded-[2px] border border-poster-white px-4 py-2 font-body text-xs font-bold uppercase text-poster-muted hover:bg-poster-tint hover:text-poster-text"
                disabled={busyId === g.id}
                onClick={() => void handleDelete(g.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center font-body text-sm text-poster-muted">
          No guests match this view.
        </p>
      ) : null}
    </div>
  )
}
