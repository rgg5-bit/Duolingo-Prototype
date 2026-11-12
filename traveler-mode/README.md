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
2. Click it (or the banner) to start Traveler mode onboarding:
   - **Where is your next destination?** Pick a city; it moves straight on.
   - **When is your flight?** Pick a timeframe, then **Continue**.
   The back arrow goes back a step (or home from the first step).
3. Back on the homepage, a rainbow wash sweeps the screen and the unit banner turns
   iridescent with your trip ("Traveler mode · Japan / Survive your first day in Tokyo").
   The rest of the homepage stays the same.
4. Click the ✈️ button again to go back to the regular course.
5. Tap the flag to see all courses.
6. Refresh the page: your trip stays saved (in `localStorage`).

## Files

- `src/Home.jsx`: home/learning path with the Traveler mode button and course menu
- `src/TravelOnboarding.jsx`: the destination and flight-date onboarding screens
- `src/homeData.js`: courses, destinations, flight times, path nodes, localStorage helpers
- `src/Icons.jsx`: hand-drawn SVGs (Duo, flame, gem, path art, nav icons, etc.)
- `src/index.css`: theme colors and the iridescent effect
