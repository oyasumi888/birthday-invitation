import { useRef, useState, type FormEvent } from 'react'
import type { RsvpPayload } from '../services/api'

type Props = {
  onSubmit: (data: RsvpPayload) => Promise<void>
}

export function RSVPForm({ onSubmit }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [plusOnes, setPlusOnes] = useState(0)
  const [message, setMessage] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const inFlightRef = useRef(false)

  function validate(): string | null {
    if (!name.trim()) return 'Name is required.'
    if (phone.length > 20) return 'Phone is too long.'
    if (plusOnes < 0 || plusOnes > 5) return 'Plus ones must be between 0 and 5.'
    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (inFlightRef.current || submitting) return

    const err = validate()
    if (err) {
      setFieldError(err)
      return
    }

    setFieldError(null)
    inFlightRef.current = true
    setSubmitting(true)
    try {
      const payload: RsvpPayload = {
        name: name.trim(),
        plus_ones: plusOnes,
      }
      if (phone.trim()) payload.phone = phone.trim()
      if (message.trim()) payload.message = message.trim()
      await onSubmit(payload)
      setName('')
      setPhone('')
      setPlusOnes(0)
      setMessage('')
    } finally {
      inFlightRef.current = false
      setSubmitting(false)
    }
  }

  const inputClass =
    'mt-2 w-full rounded-[2px] border border-poster-white bg-poster-bg px-3 py-3 font-body text-sm text-poster-white outline-none focus:border-2 focus:border-poster-white disabled:opacity-50'

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="mx-auto max-w-xl rounded-[2px] border border-poster-white bg-poster-surface p-6 sm:p-8"
      aria-busy={submitting}
    >
      <h3 className="font-display text-4xl uppercase tracking-normal text-poster-text">RSVP</h3>
      <p className="mt-3 font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
        Attending only · Name required
      </p>

      <fieldset disabled={submitting} className="min-w-0 border-0 p-0">
        <label className="mt-10 block font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
          Name *
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            maxLength={100}
          />
        </label>

        <label className="mt-6 block font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
          Phone
          <input
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            maxLength={20}
          />
        </label>

        <label className="mt-6 block font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
          Plus ones (0–5)
          <select
            className={inputClass}
            value={plusOnes}
            onChange={(e) => setPlusOnes(Number(e.target.value))}
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n} className="bg-poster-bg">
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-6 block font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
          Message
          <textarea
            className={`${inputClass} min-h-[100px] resize-y`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
          />
        </label>
      </fieldset>

      {fieldError ? (
        <p className="mt-4 border-l-2 border-poster-white pl-3 font-body text-sm text-poster-muted">
          {fieldError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-10 w-full rounded-[2px] border border-poster-white bg-poster-white py-4 font-display text-xl uppercase tracking-normal text-poster-bg transition-colors hover:bg-poster-bg hover:text-poster-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Sending…' : 'Submit RSVP'}
      </button>
    </form>
  )
}
