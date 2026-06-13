# SnapChart — project guide for Claude Code

SnapChart is a football sideline play-charting app. A coach taps every snap into
an iPad; the app grades each play, shows live tendencies, suggests calls, and
exports data. It is a **single-file web app (PWA)** that runs offline once added
to the home screen. SnapChart is a product of **SidelineLabz**.

## Where it lives / how it ships
- GitHub repo: `z668hkhgvv-glitch/SnapChart`
- Hosting: GitHub Pages, built from the `main` branch, `/ (root)` folder.
- Live URL: https://z668hkhgvv-glitch.github.io/SnapChart/  (case-sensitive)
- **Deploy = commit + push to `main`.** Pages rebuilds automatically in ~1 min.
- `index.html` MUST sit at the repo root, or Pages serves a 404.

## File layout (all at repo root)
- `index.html` — the entire app: HTML + CSS (in one `<style>`) + JS (in one
  `<script>`). Everything lives here. Edit in place.
- `sw.js` — service worker (offline cache).
- `manifest.json` — PWA manifest (name "SnapChart", standalone, landscape).
- `icon-180.png`, `icon-192.png`, `icon-512.png` — home-screen icons (royal
  tile, white chart bars, green check).
- `README.txt` — coach-facing instructions.
- `/marketing` (optional) — logos, brand sheet, sell sheet, source assets.

## NON-NEGOTIABLE: bump the cache on every change
After ANY edit to `index.html`, `sw.js`, `manifest.json`, or an icon, increment
the cache version in `sw.js`:
```
var CACHE = "play-chart-vN";   // bump N every release
```
The SW serves navigation network-first and falls back to cache offline, but the
version bump guarantees installed apps replace the old cached shell. Skipping
this is the #1 reason "my change isn't showing up."

## Verify before pushing
The app is plain static files — no build step. Before committing changes to
`index.html`, sanity-check the JS:
```
# pull the <script> out and lint it
node --check <(python3 - <<'PY'
import re;print(re.search(r"<script>(.*)</script>",open("index.html").read(),re.S).group(1))
PY
)
```
Then open `index.html` locally (`python3 -m http.server 8000`) and click through
once. For icons/PDFs, regenerate from the source assets in `/marketing`.

## Data & persistence
- All state is in `localStorage` under key `bulldogs_play_chart_v1`
  (`{plays, meta, suggest, games, currentGameId, currentMode}`). No backend.

## Brand
- Colors: Deep Royal `#16317F`, Bright Blue `#1E44C4`, Field Green `#2ECC71`,
  Ink `#0F1830`, Slate `#6B7280`, white.
- Fonts: **Oswald** (display, headers, numbers) + **Inter** (body), via Google
  Fonts. CSS var `--num` = Oswald.
- Logo motif: royal tile, white rising chart bars, green check (SnapChart);
  white "SL" + green field-line (SidelineLabz). Keep the green as the only
  accent.

## What the app does (so changes stay consistent)
- **Three game modes**, chosen on New game:
  - Standard: full down/distance. Effective = 1st down 5+ yds, 2nd down half
    the distance, 3rd/4th converts; reaching the line always counts.
  - 7v7: pass-only, no quarter, ball-driven series 40→20→5→score, 4 plays each;
    coverage only (no defensive front).
  - Scrimmage: 10 plays per series, no downs; effective = 5+ yards; both
    defensive front and coverage.
- One-tap logging: quarter, down, distance, hash, ball-on, run/pass, formation,
  play call, motion, defensive front, coverage, yards.
- Yards use a green +/− toggle (no minus key needed); losses store negative.
- Entry text fields auto-capitalize each word and clear after each play.
- Effective checkbox auto-grades by mode; tap to override.
- Suggest Play: best calls for the chosen situation, current game only.
- Quick Report: most/least effective, by play call, by hash, best by down,
  by series (scrimmage only).
- Season: saved games, season top calls, CSV export.
- Export CSV (raw) and **Export for Hudl** (one row per play, in order, with a
  Play # column and Hudl breakdown headers, for Import Breakdown Data).
- Startup splash: animated chart mark + "SnapChart" + "MOVE THE BALL" tagline +
  Continue button + SidelineLabz logo. Dismisses on Continue (no auto-advance).

## House style
- Keep code in the single file; don't split into a framework or build system
  unless asked.
- Plain, readable JS (ES5-ish, no bundler). Match existing helpers: `esc`,
  `titleCaseWords`, `dnDist`, `getYards`, `autoEffective`, `applyMode`.
- UI tone: clean, minimal, royal + green, Oswald + Inter, iPad landscape first.

## Typical task loop
1. Edit `index.html` (and assets if needed).
2. Bump `CACHE` in `sw.js`.
3. `node --check` the script; preview locally.
4. `git add -A && git commit -m "..." && git push` → Pages redeploys.
5. On the iPad, open the live URL online once to pick up the update; re-add to
   the home screen if the icon/name changed.
