type Props = {
  open: boolean
  title: string
  body: string
  onClose: () => void
}

export function ConfirmationModal({ open, title, body, onClose }: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-poster-bg/90 px-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="max-w-md rounded-[2px] border border-poster-white bg-poster-surface p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-title"
          className="font-display text-4xl uppercase tracking-normal text-poster-white"
        >
          {title}
        </h2>
        <p className="mt-4 font-body text-sm leading-relaxed text-poster-text">{body}</p>
        <button
          type="button"
          className="mt-8 w-full rounded-[2px] border border-poster-white bg-poster-white py-3 font-display text-lg uppercase tracking-normal text-poster-bg hover:bg-poster-bg hover:text-poster-white"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}
