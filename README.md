# Nederlands — A0 naar B2

Private language-learning app for two learners. Everything runs in the
browser; no data is collected or sent anywhere — progress lives only on
each phone.

## Files to upload (all in the same folder as before)

- `index.html` and `nederlands.html` — the app (identical copies)
- `sw.js` — service worker: makes the app work offline and pulls new
  versions automatically
- `manifest.webmanifest`, `icon.svg` — app metadata and icon

## Installing / updating

First time: open the site in Safari on iPhone → Share → Add to Home Screen.

Updating: just upload the new files over the old ones. The next time the
app is opened while online it fetches the new version by itself (a small
"New version ready → Update" bar appears; it also checks each time you
return to the app). Nothing needs to be re-added to the home screen and
all progress, streaks and settings are kept — they are stored on the
phone under keys that never change between versions.

You → Backup → "Check now" forces an immediate check. The build tag shown
there comes from the line `const BUILD = '…'` near the top of the script
in `index.html`; give every new upload a new tag.
