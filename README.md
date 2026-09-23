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

When you tap Update the app reopens itself with a versioned address
(`index.html?v=…`), so no cache on the phone can hand it the old copy —
no reinstall, no login, progress and profile untouched.

You → Backup → "Check now" forces an immediate check. The build tag shown
there comes from the line `const BUILD = '…'` near the top of the script
in `index.html`; give every new upload a new tag.

## What is in build b11 (23 sep)

- Six tabs: Today · Words · Grammar · Listen · Speak · You.
- Grammar: 41 lessons in one A1→B2 order (nothing out of sequence any
  more), every lesson with 7+ examples (audio on each) and 7+ practice
  questions. A new grammar lesson unlocks for every two vocabulary
  lessons; reviews only come when nothing new is due and never repeat
  something seen in the last two days. The Grammar tab lets you reread
  and practise any unlocked lesson.
- Listening in the daily session is now the dialogue of *today's* lesson,
  heard blind (two voices), followed by two comprehension questions.
  Every one of the 220 lessons has its own questions. The "Bij de bakker"
  style passages remain in the Listen tab.
- All 220 lesson dialogues are 6 lines long. At the end of a dialogue
  you can "test yourself" on it.
- Fill-the-blank: every option is conjugated for the subject of the
  sentence and shows the infinitive — "wil (willen)", "ga (gaan)".
- Voice: high-quality voices (Claire / Xander "Enhanced") are preferred
  automatically; the You tab lists every Dutch voice on the phone with a
  ✨ mark for the enhanced ones and explains how to download Claire.
  Speech is queued sentence by sentence for cleaner phrasing.
- About 75 word emojis corrected; the picture exercise only uses words
  whose picture is unambiguous.
- New-word card redesigned as a "scene" with a lesson progress trail.

## b12 (24 sep) — Claire (Enhanced)

Safari on iOS hides voices you download yourself from web apps, so Claire
can never be listed by name. b12 adds a "📱 iPhone's Dutch voice" option:
the app asks iOS for Dutch without naming a voice and iOS uses whatever is
selected under Settings → Accessibility → Spoken Content → Voices → Dutch.
Select Claire (Enhanced) there, then tap that button in You → Dutch voice.

## b13 (24 sep) — stability

- The page behind a session or dialogue is now hard-locked (iOS could
  otherwise scroll it and drag the overlay along, so taps landed beside
  the buttons).
- An update is only offered when it is a newer build number, and the
  versioned address is cleaned after loading — no more reload loops when
  GitHub's cache is briefly behind.
- You → Backup shows "diagnostics": the last errors, if any, with a Show
  button. Screenshot that if the app ever misbehaves.
- With "📱 iPhone's Dutch voice" selected, both dialogue speakers use the
  iPhone voice (Claire), told apart by pitch, instead of the built-in
  Xander.

## What "B2" means here, honestly

The app covers: 2,648 words A1→B2 in 35 topic units with spaced
repetition; 41 grammar lessons in CEFR order with examples and drills;
220 lesson dialogues plus passages for listening comprehension; sounds
and shadowing for pronunciation; typing exercises for spelling. That is
the full receptive core of B2 and most of the productive vocabulary.
What no app can give you on its own, and what a B2 exam (Staatsexamen
NT2 II) tests: writing longer texts with correction, and free
conversation with real people at natural speed. Plan those alongside
the app from B1 onwards.
