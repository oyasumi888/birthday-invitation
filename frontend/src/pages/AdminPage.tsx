import { Link } from 'react-router-dom'
import { GuestList } from '../components/GuestList'
import { StatsCards } from '../components/StatsCards'
import { useAuth } from '../hooks/useAuth'
import { useGuests } from '../hooks/useGuests'

export function AdminPage() {
  const { logout } = useAuth()
  const { guests, stats, loading, error, updateStatus, removeGuest } = useGuests()

  return (
    <div className="min-h-dvh bg-poster-bg px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-poster-white pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
              Operations
            </p>
            <h1 className="mt-2 font-display text-6xl uppercase tracking-normal text-poster-text">
              Guest ledger
            </h1>
            <p className="mt-2 font-body text-xs text-poster-muted">
              Attending RSVPs only on the invite · Auto-refresh every 30 seconds
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-[2px] border border-poster-white px-4 py-2 font-display text-sm uppercase tracking-normal text-poster-white hover:bg-poster-surface"
            >
              View invite
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-[2px] border border-poster-white bg-poster-bg px-4 py-2 font-display text-sm uppercase tracking-normal text-poster-muted hover:bg-poster-tint hover:text-poster-text"
            >
              Log out
            </button>
          </div>
        </header>

        <section className="mt-10">
          <StatsCards stats={stats} loading={loading} />
        </section>

        {error ? (
          <p className="mt-8 border-l-2 border-poster-white pl-4 font-body text-sm text-poster-muted">
            {error}
          </p>
        ) : null}

        <section className="mt-12 rounded-[2px] border border-poster-white bg-poster-bg p-4 sm:p-6">
          <h2 className="font-display text-3xl uppercase tracking-normal text-poster-text">
            Manifest
          </h2>
          <GuestList guests={guests} onStatusChange={updateStatus} onDelete={removeGuest} />
        </section>
      </div>
    </div>
  )
}
