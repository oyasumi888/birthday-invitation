import { spotifyEmbedSrc } from '../utils/spotify'

const env = import.meta.env

function envTrim(key: keyof ImportMetaEnv): string | undefined {
  const v = env[key]
  if (typeof v !== 'string') return undefined
  const t = v.trim()
  return t.length > 0 ? t : undefined
}

export const partyConfig = {
  title: env.VITE_PARTY_TITLE ?? 'ONE NIGHT // COLLECTOR CUT',
  /** Bebas Neue watermark in hero (~20vw), subtle */
  heroWatermark: env.VITE_HERO_WATERMARK ?? '25',
  date: env.VITE_PARTY_DATE ?? 'SATURDAY — NOV 29',
  time: env.VITE_PARTY_TIME ?? '20:00 — LATE',
  description:
    env.VITE_PARTY_DESCRIPTION ??
    'Editorial spread energy — minimal type, maximum intent. One night. You know why you are here.',
  venueName: env.VITE_VENUE_NAME ?? 'THE UNDERGROUND LOFT',
  venueAddress:
    env.VITE_VENUE_ADDRESS ??
    '14 Warehouse Row, Arts District — replace with your address',
  dressCode: env.VITE_DRESS_CODE ?? 'Street / editorial / come loud.',
  specialNotes:
    env.VITE_SPECIAL_NOTES ??
    'Bring ID. Secret theme dropped at the door. Late arrivals welcome.',
  mapsEmbedUrl:
    env.VITE_MAPS_EMBED_URL ??
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.95373631531666!3d-37.81732767975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349049%3A0xb6899234e561db11!2sFlinders%20St%20Railway%20Station!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau',

  /** Paths are served from `public/` — e.g. `/invite/photo.jpg` */
  inviteImageHero: envTrim('VITE_INVITE_IMAGE_HERO'),
  inviteImageHeroAlt: envTrim('VITE_INVITE_IMAGE_HERO_ALT') ?? '',
  inviteImageHeroCaption: envTrim('VITE_INVITE_IMAGE_HERO_CAPTION'),
  inviteImageMid: envTrim('VITE_INVITE_IMAGE_MID'),
  inviteImageMidAlt: envTrim('VITE_INVITE_IMAGE_MID_ALT') ?? '',
  inviteImageMidCaption: envTrim('VITE_INVITE_IMAGE_MID_CAPTION'),

  /** Spotify playlist/album embed — paste embed src or open.spotify.com playlist URL */
  spotifyEmbedUrl: (() => {
    const raw = envTrim('VITE_SPOTIFY_EMBED_URL')
    if (!raw) return undefined
    return spotifyEmbedSrc(raw)
  })(),
  spotifyTitle: envTrim('VITE_SPOTIFY_TITLE') ?? 'Party playlist',
  spotifyDescription: envTrim('VITE_SPOTIFY_DESCRIPTION'),
  /** Invite link from Spotify → Invite collaborators → Copy link */
  spotifyCollabUrl: envTrim('VITE_SPOTIFY_COLLAB_URL'),
  spotifyCollabLabel:
    envTrim('VITE_SPOTIFY_COLLAB_LABEL') ?? 'Add songs — join as collaborator',
}
