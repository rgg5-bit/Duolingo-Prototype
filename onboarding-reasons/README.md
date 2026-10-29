# Duolingo Onboarding — "Why are you learning?" prototype

A recreation of Duolingo's *"Now let's find the best place to start!"* onboarding
screen (Italian course), plus a new feature: users can tell Duo **why** they're
learning, and Duo personalizes its message.

Built with React 18 + Vite + Tailwind CSS v4.

**Live demo:** https://rgg5-bit.github.io/Duolingo-Prototype/. This is rebuilt
automatically by `.github/workflows/deploy-pages.yml` on every push to `main`.

## Run it

Requires Node.js 18+.

```bash
cd onboarding-reasons
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). For the phone look on a
laptop, open DevTools → device toolbar (Ctrl+Shift+M) and pick an iPhone size.

## Demo script

1. Tap either start card: the blue selection moves, and a toast shows what would happen next.
2. Tap **Why are you learning Italian?** to open the bottom sheet.
3. **Continue** stays disabled until you pick at least one reason. Pick several,
   and try **Other** to type a custom reason.
4. Press **Continue**: chips show up on the card and Duo's bubble changes
   (e.g. Business → "Let's get you ready for the boardroom!").
5. Reopen the sheet and pick **Travel**: a cartoon world map opens. Tap a
   continent (or a tab) to zoom in, then tap pins to choose destinations. The
   footer lists the languages spoken there, and Duo's line and the main card
   update to match (e.g. "Let's get you ready for your trip to Japan!").
6. Refresh the page: the selection is still there (saved in `localStorage`).
7. Reopen the sheet and use **Clear my answers** to reset the demo.

## Files

- `src/App.jsx`: the onboarding screen
- `src/ReasonsSheet.jsx`: the multi-select bottom sheet
- `src/TravelMap.jsx`: the zoomable travel map
- `src/destinations.js`: destinations, their languages, and each continent's zoom area
- `src/worldShapes.js`: continent outlines, smoothed into cartoon shapes
- `src/reasons.js`: reason list, Duo's personalized lines, localStorage helpers
- `src/Icons.jsx`: hand-drawn SVGs (Duo, book, compass, etc.)
