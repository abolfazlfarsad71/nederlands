# Nederlands — A0 naar B2 · project handover (build 9 nov · b30)

Private Dutch-learning web app for two learners (Emre & Aylin, Volendam), hosted on GitHub Pages
(repository `abolfazlfarsad71/nederlands`, site `https://abolfazlfarsad71.github.io/nederlands/`),
added to the iPhone home screen as a web app. Everything is in ONE file: `index.html`
(`nederlands.html` is an identical copy kept for an old link).

## Files in this package
- `index.html` / `nederlands.html` — the whole app (CSS + data + JS), build string `const BUILD = '9 nov · b30'`.
- `sw.js` — service worker: app files network-first with offline fallback; `*.mp3` cache-first with
  byte-range support and an in-memory buffer so clips seek instantly, online or offline.
- `manifest.webmanifest`, `icon.svg` — home-screen app metadata.
- `audio/A1…A6.mp3, B1.mp3, B2.mp3, audio/index.json` — built-in recordings (see below). In the live
  repository these currently sit in the ROOT (GitHub's uploader flattened the folder); the app looks in
  `audio/` first and then next to `index.html`, so both layouts work.
- `README.md` — change log of every build (b9 → b30), update mechanism, upload steps.

## How updates reach the phones (must be preserved)
- Bump `BUILD` on every upload. The app fetches its own file with `cache: no-store`, compares the BUILD string
  (only a HIGHER `bNN` number is offered), shows a "New version ready → Update" bar, and reloads itself with
  `index.html?v=<build>` to bypass every cache, then cleans the URL. No reinstall, no login.
- Learner progress lives in localStorage under stable keys that must never change:
  `nl.profiles`, `nl.primary`, `nl.<id>.state` (ST), `nl.<id>.bak`, `nl.voice`, `nl.vsrc`, `nl.vgender`, `nl.spk2`, `nl.errlog`.
  `FRESH()` migrates old state additively (`ST.v`). You → Backup has Export/Import.

## Data in index.html (top of the script)
- `VOCAB` (2,648 words, 35 units; word fields id,w,m,a,nl,en,e,u,lv), `GRAMMAR` (41 lessons g01–g41 in
  A1→B2 order, each with `n`, rules `r`, 7+ examples `ex`, 7+ drills `d`, memory tip `mem`),
  `LISTEN` (20 passages), `SOUNDS`, `ROLEPLAY` (24), `CONV` (35 unit dialogues),
  `LC` (220 lesson dialogues: `{t, s, sp[2], l:[[speaker, nl, en]×6], q:[{q, o:[correct, wrong, wrong]}×2]}`).
- Road: core units split into 220 lessons of 12 words (`LESSONS`, `LESSON`, `lessonOfWord`).

## Main mechanics
- Daily session (`buildDaily`): warm-up reviews → new words in groups (intro "scene" card + checks) →
  grammar (every day, right after the first new words: next rule(s) on the path, 2 when behind, 4 drills each,
  plus 3 review drills on learned rules) → mid reviews → production pass (cloze with conjugated options
  "wil (willen)", en→nl) → remaining reviews → listening (today's lesson dialogue heard blind, 2 questions) →
  5 speaking sentences. Spaced repetition in `grade()`; cards hold b,d,n,c,w,lw,ls.
- Grammar pacing: `grammarReachAt(done)` spreads each level's rules over the first ~75 % of that level's road;
  `gramLearned` = 3+ drills at 70 %+; `nextGrammar` = first unlearned in order ("again" if seen), else spaced
  review ≥3 days old; Today card shows when the next rule opens. b29: when nothing is due the daily session still
  opens with `nextGrammar(true)` as a review block + 4 drills, and `grammarReviewDrills(nRules, perRule, exclude)`
  returns recap cards (`grammarBlock(g, true)`) followed by drills. Review cards/drills update `ST.gram[id].rt`,
  teaching and new drills update `.t` (the clock `nextGrammar` uses) — before b29 review drills reset `.t` daily and
  reviews never came due, so learners saw bare questions without text for days.
- Session runner (`step`): ‹ button (`#bk`) steps back; `sess.reached` = cards already answered; a card with
  `sess.i < sess.reached` is a revisit: rendered normally, but `advance` grades/counts nothing and just moves on.
- Cloze: `clozeGapPhrase` blanks a whole multi-word entry when its words stand together in the sentence; verbs keep
  the single-token gap with conjugated options; otherwise `en2nl` (which uses `likeDistractors` for phrases).
- Quick review (`qr*`): all words met so far, 30 MCQ per session, missed-first ordering, one correct answer
  clears a word, misses anywhere put it back, Reset restarts.
- Conjugation helper for cloze: `conjNL`, `verbStemNL`, `CONJ_IRR`, `SEP_BASES`, `UNSTRESSED_ER`.
- Picture exercise only for words whose emoji is unambiguous (`picOK`).

## Audio (the hard-won part)
- iOS 27 broke web speech on Emre's phone (speechSynthesis never starts; Safari also refuses clips from
  Google/Polly). Diagnostics in You → Dutch voice (Tone A/B, reachability, error log in You → Backup).
- Solution: recordings shipped with the app. Generated with Piper (rhasspy) neural voices
  `nl_BE-nathalie-medium` (woman) and `nl_NL-pim-medium` (man), both from
  `https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-<voice>.tar.bz2`,
  piper binary from `https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz`.
  Every word and sentence in both voices, dialogue lines in the speaker's own voice (gender by name),
  grammar examples, passages, role-plays, test sentences → 13,120 clips.
- Layout: 8 MP3 sprites (22.05 kHz mono 40 kbps CBR), ≤25 MB each (GitHub web-upload limit), with 260 ms gaps;
  `index.json` = `{file: {normalizedText: {f:[startMs,endMs], m:[startMs,endMs]}}}`; key = text trimmed,
  whitespace-collapsed, lower-cased (`anorm`). A1–A6 = lessons in road order, B1 = grammar + extra units,
  B2 = conversations, role-plays, passages. Regeneration script was `gen.py` (per-group synthesis with
  `--json-input`, PCM concat, ffmpeg libmp3lame) and a bundling step; both are easy to rewrite from this description.
- Playback (b29, `playClip`): NO seeking inside the bundles any more (iOS seeks in a half-loaded 25 MB MP3 landed
  late/wrong/never → cut-off words, 6 s waits, and the top of the file playing aloud after a failed seek). Each clip
  is fetched as its own byte range: `byte = head + seconds × bytesPerSecond` (bundles are CBR 40 kbps MPEG-2 L3,
  5000 B/s; `head` = 227 in all 8 files = 45-byte ID3 + 182-byte Info frame, detected at runtime by `fileHead()` from
  bytes 0–1023), taken from 110 ms before `start` to 60 ms after `end` (clips sit in 260 ms gaps), cut at the first
  MP3 frame sync (`mp3Sync`), and played as a Blob URL on the one reusable `<audio>` element (unlocked by a silent
  clip on the first tap) from 0 to `ended`; a safety timer only. In-page LRU `CLIP_MEM` (500 clips); `prefetchClip`
  runs for every `[data-say]` on a card, the card's word+sentence, all dialogue lines (`ex.pre`), and the whole
  lesson at session start. `playbackRate` with `preservesPitch` (🐢 = ×0.72); profiles below 1× were moved to 1×
  once (`ST.r29`). `say(text, opt)` → recordings → phone voice → online voice fallbacks. `sayDialogue` chains on the
  real `onend`; the length estimate is a long safety net (est×2+5 s), never a cut-off. Auto-play runs synchronously
  inside the tap that opened the card (`autoSay`). The service worker (unchanged) still caches whole bundles for
  offline use after the first range request. If the audio is ever regenerated, keep CBR and the same `index.json`
  layout; the header offset and bitrate are read from the file, nothing is hard-coded except the 227 fallback.
- Voice settings: source `nl.vsrc` = app | phone | online (default app); main voice `nl.vgender` = f | m.

## Known state / open points (1 Nov 2026, after b29)
- Learners were at road lesson ~47 of 220, A1 ≈ 54 %, using built-in recordings at 0.8× (recommend 1×: the
  phone time-stretches recordings; 🐢 for slow).
- Possible next step offered: regenerate recordings ~10 % slower natural pace with 500 ms gaps (needs a new
  ~150 MB audio upload, 8 files, one commit).
- B2 honesty note in README: app covers vocabulary, grammar, listening, pronunciation; free conversation and
  corrected writing must come from real people.

## Upload procedure (GitHub web UI)
Add file → Upload files → drag files → commit `bNN`. App-only changes: `index.html`, `nederlands.html`
(+ `sw.js` when it changed). Audio: the 8 MP3s + `index.json` (≤100 files and ≤25 MB per file per commit).
Wait ~10 min, open the app → Update.

## Added in b30 (9 Nov 2026)
- Pictures: word field `e` is an exact emoji, or `@name` = a drawing in `PIC` (64×64 SVG markup, fills from CSS classes
  under `svg.pic`, gradients in the hidden `<svg><defs>` right after `<body>`), `@sw:#hex` colour swatch,
  `@room:🛋️` room with furniture, `@body:knee` body part. `picOf(e)` renders all of them; never print `w.e` raw.
  728 of 2,648 words have a picture (655 emoji, 73 drawn); the rest deliberately have none. New-word card:
  `.scene-stage > .scene-pic` floats in 3-D (CSS `float3d`), drag sets `--rx/--ry`.
- Listening speed: `ST.lsp` (1 / .85 / .7 / .55), `speedBar()`, `[data-lsp]` click handler, `LS_REPLAY` (the current
  card's replay function, cleared in `step`). Players take `opt.mul`; `[data-say][data-ls]` buttons use it.
- Mistakes: `ST.miss[key] = {n, s, t}` with keys `w:<wordId>`, `g:<grammarId>:<drill>`, `l:<lessonId>:<q>`,
  `p:<passageId>:<q>`; `missNote` (a right answer counts only in a session other than the one of the miss; two
  needed), `missItems(limit)` opens `buildDaily` (8 per session), `missCard()` / `practiseMistakes()` on Today.
  In-session: `queueRetry` inserts `retryItem(orig, {need, c})` 3 cards later (7 for the confirmation), capped at
  half the session; retry cards are not graded again (`ex.retry` branch in `advance`). `noRetry` for tests.
  Exercises that are plain objects carry `remake()` so a retry is reshuffled.
- Corrected dialogue lines are recorded with the same Piper voices and embedded as base64 MP3 in `XCLIP`
  (`localClip` checks it first; clip id `@<voice><normalised text>`). If the audio bundles are ever regenerated,
  include these six lines and empty `XCLIP`.
- Not re-checked in b30: the 35 unit conversations (`CONV`), 24 role-plays and 20 passages; B1/B2 lesson dialogues
  were checked for errors and roles but some remain vocabulary-driven rather than natural (e.g. money-8).
- localStorage keys unchanged; `ST.miss` and `ST.lsp` are added by the additive migration.
