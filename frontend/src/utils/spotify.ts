/** Normalize Spotify share or embed URLs to an iframe-ready embed src. */
export function spotifyEmbedSrc(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.includes('open.spotify.com/embed/')) {
    return trimmed.includes('?') ? trimmed : `${trimmed}?utm_source=generator`
  }

  const playlist = trimmed.match(/playlist\/([a-zA-Z0-9]+)/)
  if (playlist) {
    return `https://open.spotify.com/embed/playlist/${playlist[1]}?utm_source=generator`
  }

  const album = trimmed.match(/album\/([a-zA-Z0-9]+)/)
  if (album) {
    return `https://open.spotify.com/embed/album/${album[1]}?utm_source=generator`
  }

  return trimmed
}
