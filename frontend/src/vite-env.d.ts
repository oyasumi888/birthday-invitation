/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_MAPS_EMBED_URL?: string
  readonly VITE_PARTY_TITLE?: string
  readonly VITE_PARTY_DATE?: string
  readonly VITE_PARTY_TIME?: string
  readonly VITE_PARTY_DESCRIPTION?: string
  readonly VITE_VENUE_NAME?: string
  readonly VITE_VENUE_ADDRESS?: string
  readonly VITE_DRESS_CODE?: string
  readonly VITE_SPECIAL_NOTES?: string
  /** Large ghost watermark in hero (e.g. age or name) */
  readonly VITE_HERO_WATERMARK?: string
  /** Full-width image below hero type — URL from site root, e.g. /invite/hero.jpg */
  readonly VITE_INVITE_IMAGE_HERO?: string
  readonly VITE_INVITE_IMAGE_HERO_ALT?: string
  readonly VITE_INVITE_IMAGE_HERO_CAPTION?: string
  /** Image between Intel and Map sections */
  readonly VITE_INVITE_IMAGE_MID?: string
  readonly VITE_INVITE_IMAGE_MID_ALT?: string
  readonly VITE_INVITE_IMAGE_MID_CAPTION?: string
  /** Spotify embed src or open.spotify.com playlist/album URL */
  readonly VITE_SPOTIFY_EMBED_URL?: string
  readonly VITE_SPOTIFY_TITLE?: string
  readonly VITE_SPOTIFY_DESCRIPTION?: string
  /** Spotify collaborator invite link (Share → Invite collaborators in Spotify) */
  readonly VITE_SPOTIFY_COLLAB_URL?: string
  readonly VITE_SPOTIFY_COLLAB_LABEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
