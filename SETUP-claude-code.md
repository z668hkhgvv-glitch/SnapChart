# SnapChart on Claude Code — Mac setup (one time)

Goal: edit SnapChart on your Mac with Claude Code, then push to GitHub so the
iPad app updates by itself. Your repo: https://github.com/z668hkhgvv-glitch/SnapChart
Your live app: https://z668hkhgvv-glitch.github.io/SnapChart/

## 1. Things you need
- A paid Claude plan (Pro, Max, Team, or API). The free plan can't run Claude Code.
- Git. Check in Terminal: `git --version`. If missing, run `xcode-select --install`.

## 2. Install Claude Code (about a minute)
Open Terminal (Applications → Utilities → Terminal) and paste:
```
curl -fsSL https://claude.ai/install.sh | bash
```
Close Terminal, open it again, then confirm:
```
claude --version
```
Prefer no terminal? Download the Claude Code desktop app for macOS instead and
skip to step 4. Docs: https://docs.claude.com/en/docs/claude-code/overview

## 3. Get the project onto your Mac
```
cd ~/Documents
git clone https://github.com/z668hkhgvv-glitch/SnapChart.git
cd SnapChart
```
Make sure these files sit at the top level of the folder (not inside a subfolder):
`index.html`, `sw.js`, `manifest.json`, `icon-180.png`, `icon-192.png`,
`icon-512.png`, `README.txt`. Add `CLAUDE.md` (the project guide) to this folder
too — Claude Code reads it automatically and will know the whole project.

If the repo is missing the latest files, copy them in from the play-chart-app
zip, then commit:
```
git add -A && git commit -m "Add latest app files + project guide" && git push
```

## 4. Start working
From inside the folder:
```
claude
```
First run opens your browser to sign in. After that, just talk to it, e.g.:
- "Add a kicking game mode."
- "Make the splash tagline letters fly in one at a time."
- "Bump the cache and push."

Claude Code edits the real files, and can commit and push for you. Because
GitHub Pages builds from `main`, your live link updates about a minute after
each push.

## 5. Preview before you push (optional)
```
python3 -m http.server 8000
```
Open http://localhost:8000 in Safari on the Mac. To test on the iPad, find your
Mac's IP (System Settings → Wi-Fi → Details) and open
`http://<that-ip>:8000` on the iPad while on the same Wi-Fi.

## 6. See the update on the iPad
Open the live URL online once so it pulls the new version. If you changed the
icon or name, delete the home-screen icon and add it again from Safari.

## Reminder
After any change, bump the cache version in `sw.js` (`var CACHE = "play-chart-vN"`)
so installed copies refresh. CLAUDE.md tells Claude Code to do this for you.
