import { partyConfig } from '../config/party'

export function SpotifyEmbed() {
  const src = partyConfig.spotifyEmbedUrl
  if (!src) return null

  return (
    <section className="bg-poster-bg px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
          Soundtrack
        </p>
        <h2 className="mt-3 font-display text-4xl uppercase tracking-normal text-poster-text">
          {partyConfig.spotifyTitle}
        </h2>
        {partyConfig.spotifyDescription ? (
          <p className="mt-3 max-w-prose font-body text-sm text-poster-muted">
            {partyConfig.spotifyDescription}
          </p>
        ) : null}
        <div className="rule my-8" />
        <div className="overflow-hidden rounded-[2px] border border-poster-white bg-poster-bg">
          <iframe
            title={partyConfig.spotifyTitle}
            src={src}
            className="h-[352px] w-full"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        {partyConfig.spotifyCollabUrl ? (
          <p className="mt-6 font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
            <a
              href={partyConfig.spotifyCollabUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full rounded-[2px] border border-poster-white bg-poster-white py-3 text-center font-display text-lg uppercase tracking-normal text-poster-bg transition-colors hover:bg-poster-bg hover:text-poster-white sm:w-auto sm:px-8"
            >
              {partyConfig.spotifyCollabLabel}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  )
}
