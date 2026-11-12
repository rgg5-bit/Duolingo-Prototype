# Duolingo Home — Traveler mode prototype

A recreation of Duolingo's home screen (light theme, French course), plus a new
feature: a **Traveler mode** button next to the course flag, announced by a
**NEW! Traveler mode** banner.

Built with React 18 + Vite + Tailwind CSS v4.

## Run it

Requires Node.js 18+.

```bash
cd traveler-mode
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). For the phone look on a
laptop, open DevTools → device toolbar (Ctrl+Shift+M) and pick an iPhone size.

## Demo script

1. The **✈️** Travel button sits next to the course flag, with a **NEW! Traveler mode**
   banner pointing at it. Hover the button to see the iridescent sheen that signals
   you're about to enter Traveler mode.
2. Click it (or the banner): a rainbow wash sweeps the screen and the unit banner
   turns iridescent ("Traveler mode · France"). The rest of the homepage stays the same.
3. Click it again to go back to the regular course.
4. Tap the flag to see all courses.
5. Refresh the page: Traveler mode stays on (saved in `localStorage`).

## Files

- `src/Home.jsx`: home/learning path with the Traveler mode button and course menu
- `src/homeData.js`: courses, unit banners, path nodes, localStorage helpers
- `src/Icons.jsx`: hand-drawn SVGs (Duo, flame, gem, path art, nav icons, etc.)
- `src/index.css`: theme colors and the iridescent effect
