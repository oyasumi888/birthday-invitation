const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

export class ApiError extends Error {
  code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

type ErrorBody = { error?: string; message?: string }

async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204) return null
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return { error: 'parse_error', message: text }
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, headers, ...rest } = options
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`

  const mergedHeaders = new Headers(headers)
  mergedHeaders.set('Content-Type', 'application/json')
  if (token) mergedHeaders.set('Authorization', `Bearer ${token}`)

  let res: Response
  try {
    res = await fetch(url, { ...rest, headers: mergedHeaders })
  } catch {
    const localhostHint =
      /localhost|127\.0\.0\.1/.test(url) || baseUrl === ''
        ? ' Start the API from the backend folder with npm run dev, or set VITE_API_URL to your API base URL.'
        : ''
    throw new ApiError(
      'network_error',
      `Cannot reach the server at ${url}.${localhostHint}`
    )
  }

  if (res.status === 204) {
    if (!res.ok) {
      throw new ApiError('request_failed', res.statusText || 'Request failed')
    }
    return undefined as T
  }

  const body = (await parseBody(res)) as T | ErrorBody | null

  if (!res.ok) {
    const err = body as ErrorBody | null
    throw new ApiError(
      typeof err?.error === 'string' ? err.error : 'request_failed',
      typeof err?.message === 'string' ? err.message : res.statusText || 'Request failed'
    )
  }

  return body as T
}

export type GuestStatus = 'going' | 'not_going' | 'cancelled'

export type Guest = {
  id: string
  name: string
  email: string | null
  phone: string | null
  status: GuestStatus
  plus_ones: number
  message: string | null
  created_at: string
  updated_at: string
}

export type RsvpPayload = {
  name: string
  email?: string
  phone?: string
  plus_ones?: number
  status: 'going' | 'not_going'
  message?: string
}

export type Stats = {
  total: number
  going: number
  not_going: number
  cancelled: number
}

export function submitRsvp(data: RsvpPayload): Promise<Guest> {
  return apiRequest<Guest>('/api/rsvp', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function loginRequest(username: string, password: string): Promise<{ token: string }> {
  return apiRequest<{ token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function fetchGuests(token: string): Promise<Guest[]> {
  return apiRequest<Guest[]>('/api/rsvp', { method: 'GET', token })
}

export function fetchStats(token: string): Promise<Stats> {
  return apiRequest<Stats>('/api/rsvp/stats', { method: 'GET', token })
}

export function patchGuest(token: string, id: string, status: GuestStatus): Promise<Guest> {
  return apiRequest<Guest>(`/api/rsvp/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ status }),
  })
}

export function deleteGuest(token: string, id: string): Promise<void> {
  return apiRequest<void>(`/api/rsvp/${id}`, {
    method: 'DELETE',
    token,
  })
}
