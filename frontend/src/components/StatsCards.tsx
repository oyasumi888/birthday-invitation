import type { Stats } from '../services/api'

type Props = {
  stats: Stats | null
  loading?: boolean
}

export function StatsCards({ stats, loading }: Props) {
  const cards = [
    { label: 'Total RSVPs', value: stats?.total },
    { label: 'Attending', value: stats?.going },
    { label: 'Cancelled', value: stats?.cancelled },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-[2px] border border-poster-white bg-poster-surface p-4"
        >
          <p className="font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
            {c.label}
          </p>
          <p className="mt-3 font-display text-5xl uppercase tracking-normal text-poster-text">
            {loading && stats == null ? '—' : (c.value ?? 0)}
          </p>
        </div>
      ))}
    </div>
  )
}
