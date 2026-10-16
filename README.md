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

## b14 (27 sep)

- 805 more words got a relevant emoji (1,796 of 2,648 now); the new-word
  card no longer falls back to the unit icon (the bread on every food
  word) but shows a coloured letter tile.
- Fixed the article spacing in answers ("het broodje", not "hetbroodje").
- Fixed the new-word card sometimes opening with a large empty area above
  the word (two decorative shapes were taking up layout space).
- Five speaking sentences per lesson (six on the 45-minute plan).
- Grammar path re-paced: each level's rules are spread over the first
  ~75% of that level's road, strictly in order; a lesson counts as learned
  after 3+ questions at 70%+, weaker ones come back as "again" before
  anything new; reviews only when everything unlocked is learned and
  never within three days. The Today card says when the next rule opens.
- Dialogues: with the iPhone voice, the first speaker is now a deep-pitched
  male voice (Claire pitched down, still clear). You → Dutch voice lets
  you pick the built-in Xander or Ellen instead.

## b15 (10 okt) — grammar every day, quick review

- Grammar is now part of every daily session (it was every other day) and
  comes right after the first new words, so it is reached even when a
  session is cut short. A rule now counts as "seen" the moment its
  explanation is shown, so leaving before the questions no longer makes
  the same rule come back as new the next day.
- Catch-up: when the road is three or more rules ahead of what you have
  learned, two new rules are taught per day until you are level.
- Every session also asks 3 review questions on rules already learned
  (5 when there is nothing new), oldest first.
- Quick review: a card on Today and in Words shows how many words you
  have met so far and how many are still to review. Each session is 30
  multiple-choice questions (Dutch→English and English→Dutch mixed). A
  word leaves the pool when you get it right; wrong ones return. Reset
  puts every word back. Quick review does not touch the spaced-repetition
  schedule of the daily session.

## b16 (10 okt) — smarter quick review

Each 30-word session now takes what you need most first: words missed in
the last week (in quick review or in the daily session), then
historically weak words, then the ones unseen longest. A word leaves the
pool only after two correct answers in a row, the second one on a later
day; any miss — anywhere — puts it back. The card shows how many words
are one answer away.

## b17 (16 okt) — iOS 27 speech, quick-review counting

- Speech hardened for iOS 27: the voice is resolved fresh from the engine
  at every utterance (a voice object kept from before an iOS update is
  stale and iOS 27 drops it silently); speak() no longer races a
  cancel(); any speech error is caught, logged, and the sentence is
  retried once with the system default voice. Voices that arrive late
  after launch are picked up. You → Dutch voice shows a "Voice check"
  line (voices found, last speech error) and ↻ now also plays a test
  sentence.
- Quick review: one correct answer now counts a word as reviewed (the
  two-answer rule hid progress); the card shows reviewed / to go, missed
  words coming back, and the last session's score. Smart ordering kept.

## b18 (16 okt) — no sound on iOS 27

Since iOS 26, web speech inside a home-screen app is routed like ambient
audio: muted by the ring/silent switch (or Action button) unless the page
requests a playback audio session. b18 requests that session, unlocks
audio on the first tap, and starts speech synchronously inside the tap.
Voices with the same name (iOS 27 lists two "Xander"s: basic and
enhanced) are told apart by their identifier, and the enhanced one is
preferred. Voice check shows each voice's quality, the last utterance's
start/end status and the audio session type.
