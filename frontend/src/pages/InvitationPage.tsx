import { useState } from 'react'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { PartyDetails } from '../components/PartyDetails'
import { RSVPForm } from '../components/RSVPForm'
import { partyConfig } from '../config/party'
import { submitRsvp, ApiError } from '../services/api'

export function InvitationPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalBody, setModalBody] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const titleLines = partyConfig.title
    .split(/\s*\/\/\s*/)
    .map((s) => s.trim())
    .filter(Boolean)

  const heroImg = partyConfig.inviteImageHero
  const midImg = partyConfig.inviteImageMid

  return (
    <div className="relative overflow-hidden bg-poster-bg">
      <header
        className={`group relative isolate min-h-dvh border-b border-poster-white ${heroImg ? '' : 'bg-poster-bg'}`}
      >
        {heroImg ? (
          <>
            <img
              src={heroImg}
              alt={partyConfig.inviteImageHeroAlt}
              className="absolute inset-0 h-full w-full object-cover object-center"
              decoding="async"
              fetchPriority="high"
            />
            <div className="pointer-events-none absolute inset-0 bg-poster-bg/70" aria-hidden />
          </>
        ) : null}

        <div className="hero-grain pointer-events-none absolute inset-0 opacity-[0.55]" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
          aria-hidden
        >
          <span className="font-display text-[20vw] uppercase leading-none tracking-normal text-poster-white opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.07] select-none sm:text-[min(20vw,14rem)]">
            {partyConfig.heroWatermark}
          </span>
        </div>

        <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16">
          <div className="flex flex-1 flex-col justify-center gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <div className="max-w-full lg:max-w-[58%]">
              <p className="font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
                Invitation
              </p>
              <h1 className="mt-4 font-display uppercase leading-[0.88] tracking-normal text-poster-text">
                <span className="block rotate-[-2deg]">
                  {titleLines.map((line, i) => (
                    <span key={i} className="block text-[clamp(2.75rem,10vw,7.5rem)]">
                      {line}
                    </span>
                  ))}
                </span>
              </h1>
              <p className="mt-10 max-w-md font-body text-sm leading-relaxed text-poster-text">
                {partyConfig.description}
              </p>
            </div>

            <div className="lg:max-w-xs lg:text-right">
              <p className="font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
                When
              </p>
              <p className="mt-3 font-display text-4xl uppercase tracking-normal text-poster-white sm:text-5xl">
                {partyConfig.date}
              </p>
              <p className="mt-2 font-body text-sm uppercase tracking-[0.15em] text-poster-text">
                {partyConfig.time}
              </p>
            </div>
          </div>

          {partyConfig.inviteImageHeroCaption ? (
            <p className="mt-10 font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
              {partyConfig.inviteImageHeroCaption}
            </p>
          ) : null}
        </div>
      </header>

      <div className="rule" />

      <div className="relative isolate overflow-hidden">
        {midImg ? (
          <img
            src={midImg}
            alt={partyConfig.inviteImageMidAlt}
            className="absolute inset-0 h-full w-full object-cover object-center"
            decoding="async"
          />
        ) : null}
        <PartyDetails
          variant={midImg ? 'over-image' : 'solid'}
          caption={partyConfig.inviteImageMidCaption}
        />
      </div>

      <div className="rule" />

      <section className="bg-poster-bg px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
            Location
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase tracking-normal text-poster-text">
            Map
          </h2>
          <div className="rule my-8" />
          <div className="overflow-hidden rounded-[2px] border border-poster-white bg-poster-bg">
            <iframe
              title="Party location map"
              src={partyConfig.mapsEmbedUrl}
              className="aspect-video h-[280px] w-full sm:h-[380px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <div className="rule" />

      <section className="bg-poster-bg px-4 py-16 sm:px-8">
        <RSVPForm
          onSubmit={async (payload) => {
            setFormError(null)
            try {
              await submitRsvp(payload)
              const going = payload.status === 'going'
              setModalTitle(going ? 'CONFIRMED' : 'RECORDED')
              setModalBody(
                going
                  ? 'Your RSVP is on file. See you at the door.'
                  : 'Thanks — we have your response on record.'
              )
              setModalOpen(true)
            } catch (e) {
              const msg =
                e instanceof ApiError ? e.message : 'Something went wrong. Try again later.'
              setFormError(msg)
            }
          }}
        />
        {formError ? (
          <p className="mx-auto mt-6 max-w-xl border-l-2 border-poster-white pl-4 font-body text-sm text-poster-muted">
            {formError}
          </p>
        ) : null}
      </section>

      <ConfirmationModal
        open={modalOpen}
        title={modalTitle}
        body={modalBody}
        onClose={() => setModalOpen(false)}
      />

      <footer className="border-t border-poster-white px-4 py-8 text-center font-body text-[10px] uppercase tracking-[0.2em] text-poster-muted">
        Admin →{' '}
        <a className="text-poster-white underline-offset-2 hover:underline" href="/admin/login">
          /admin/login
        </a>
      </footer>
    </div>
  )
}
