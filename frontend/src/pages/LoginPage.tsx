import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ApiError, loginRequest } from '../services/api'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { token } = await loginRequest(username, password)
      login(token)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'mt-2 w-full rounded-[2px] border border-poster-white bg-poster-bg px-3 py-3 font-body text-sm text-poster-white outline-none focus:border-2 focus:border-poster-white'

  return (
    <div className="flex min-h-dvh items-center justify-center bg-poster-bg px-4 py-16">
      <div className="w-full max-w-md rounded-[2px] border border-poster-white bg-poster-surface p-8">
        <p className="font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
          Restricted
        </p>
        <h1 className="mt-4 font-display text-5xl uppercase tracking-normal text-poster-text">
          Admin login
        </h1>
        <form className="mt-10 space-y-6" onSubmit={(e) => void handleSubmit(e)}>
          <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
            Username
            <input
              className={inputClass}
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-poster-muted">
            Password
            <input
              type="password"
              className={inputClass}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error ? (
            <p className="border-l-2 border-poster-white pl-3 font-body text-sm text-poster-muted">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[2px] border border-poster-white bg-poster-white py-4 font-display text-xl uppercase tracking-normal text-poster-bg transition-colors hover:bg-poster-bg hover:text-poster-white disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Enter'}
          </button>
        </form>
        <p className="mt-8 text-center font-body text-xs text-poster-muted">
          <Link className="text-poster-white underline-offset-2 hover:underline" to="/">
            ← Back to invitation
          </Link>
        </p>
      </div>
    </div>
  )
}
