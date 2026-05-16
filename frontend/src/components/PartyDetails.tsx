import { partyConfig } from '../config/party'

type Props = {
  /** When an image sits behind this section, use a translucent surface */
  variant?: 'solid' | 'over-image'
  /** Optional caption under details (e.g. photo credit) when using a background image */
  caption?: string
}

export function PartyDetails({ variant = 'solid', caption }: Props) {
  const surface =
    variant === 'over-image' ? 'bg-poster-surface/88' : 'bg-poster-surface'

  return (
    <section className={`relative z-10 ${surface} px-4 py-14 sm:px-8`}>
      <div className="mx-auto max-w-3xl">
        <p className="font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
          Intel
        </p>
        <h2 className="mt-3 font-display text-5xl uppercase tracking-normal text-poster-text sm:text-6xl">
          Details
        </h2>

        <div className="rule my-10" />

        <div className="grid gap-12">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
              Venue
            </p>
            <p className="mt-3 font-display text-3xl uppercase tracking-normal text-poster-white">
              {partyConfig.venueName}
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-poster-text">
              {partyConfig.venueAddress}
            </p>
          </div>

          <div className="rule" />

          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
              Dress code
            </p>
            <p className="mt-3 font-body text-sm leading-relaxed text-poster-text">
              {partyConfig.dressCode}
            </p>
          </div>

          <div className="rule" />

          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
              Notes
            </p>
            <p className="mt-3 font-body text-sm leading-relaxed text-poster-text">
              {partyConfig.specialNotes}
            </p>
          </div>
        </div>

        {caption ? (
          <p className="mt-12 font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
            {caption}
          </p>
        ) : null}
      </div>
    </section>
  )
}
