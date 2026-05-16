import type { Stats } from '../services/api'

type Props = {
  stats: Stats | null
  loading?: boolean
}

export function StatsCards({ stats, loading }: Props) {
  const items: { key: keyof Stats; label: string }[] = [
    { key: 'total', label: 'Total RSVPs' },
    { key: 'going', label: 'Going' },
    { key: 'not_going', label: 'Not going' },
    { key: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((c) => (
        <div
          key={c.key}
          className="rounded-[2px] border border-poster-white bg-poster-surface p-4"
        >
          <p className="font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">{c.label}</p>
          <p className="mt-3 font-display text-5xl uppercase tracking-normal text-poster-text">
            {loading && !stats ? '—' : stats?.[c.key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  )
}
