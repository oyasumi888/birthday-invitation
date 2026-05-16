function decodeJwtExp(token: string): number | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const payload = JSON.parse(atob(part)) as { exp?: number }
    return typeof payload.exp === 'number' ? payload.exp : null
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const exp = decodeJwtExp(token)
  if (exp === null) return false
  return exp * 1000 <= Date.now()
}
