Invite images (optional)
------------------------
These env vars drive full-bleed BACKGROUNDS (not inline frames):

  VITE_INVITE_IMAGE_HERO  — behind the entire hero (title, date, grain). Flat #0A0A0A scrim (~70%) keeps type readable.
  VITE_INVITE_IMAGE_MID   — behind the Intel / Details section. Hunter-green translucent layer on top.

1. Put files here, e.g. hero.jpg, spread.png
2. In frontend/.env set paths from site root:
   VITE_INVITE_IMAGE_HERO=/invite/hero.jpg
   VITE_INVITE_IMAGE_MID=/invite/spread.png
3. Restart Vite (npm run dev) after changing .env

Use JPG or WEBP for photos; PNG if you need transparency.
Alt text: VITE_INVITE_IMAGE_HERO_ALT and VITE_INVITE_IMAGE_MID_ALT
Optional captions: VITE_INVITE_IMAGE_HERO_CAPTION, VITE_INVITE_IMAGE_MID_CAPTION
