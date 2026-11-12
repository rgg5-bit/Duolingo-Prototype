# Duolingo Home prototype

A recreation of Duolingo's home screen (light theme, French course): the stats
bar, the unit banner, the winding lesson path and the bottom navigation.

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

1. Scroll the lesson path: completed coin, current practice node, locked lessons,
   reward chest.
2. Tap the flag to see all courses.

## Files

- `src/Home.jsx`: home/learning path with the course menu
- `src/homeData.js`: courses, unit banner, path nodes
- `src/Icons.jsx`: hand-drawn SVGs (flame, gem, path art, nav icons, etc.)
- `src/index.css`: theme colors and animations
