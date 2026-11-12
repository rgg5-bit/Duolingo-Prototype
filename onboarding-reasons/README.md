# Duolingo Onboarding — "Why are you learning?" prototype

A recreation of Duolingo's *"Now let's find the best place to start!"* onboarding
screen (Italian course), plus a new feature: users can tell Duo **why** they're
learning, and Duo personalizes its message. Picking a start option (or
finishing a lesson) leads to a recreation of Duolingo's **home page** with a new
**Traveler mode** button.

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

1. Tap either start card to go to the home page (see **Home page and Traveler mode** below).
   The browser's back button returns to onboarding.
2. Tap **Why are you learning Italian?** to open the bottom sheet.
3. **Continue** stays disabled until you pick at least one reason. Pick several,
   and try **Other** to type a custom reason.
4. Press **Continue**: chips show up on the card and Duo's bubble changes
   (e.g. Business → "Let's get you ready for the boardroom!").
5. Reopen the sheet and pick **Travel**: a cartoon world map opens. Tap a
   continent (or a tab) to zoom in, then tap pins to choose destinations. The
   footer lists the languages spoken there, and Duo's line and the main card
   update to match (e.g. "Let's get you ready for your trip to Japan!").
6. Tap **What do you want to learn first?** (the top card) to pick up to 3 beginner lessons
   (introducing yourself, ordering at a café, asking for directions…). Each shows
   a sample Italian phrase. Lessons that fit your reasons are tagged **FOR YOU** and
   listed first (Travel → café, directions, hotel). The number on each pick is the
   order you'll learn them in.
7. Press **Continue**: the card lists your lessons in order, the "first time"
   card changes to "Start with 👋 Introducing yourself!", and if you haven't
   given a reason, Duo says which lesson you'll start with.
8. Tap **Start** on a lesson (or the "first time" card) to play it: 6 short
   exercises (pick the meaning, match pairs, build a sentence from a word bank).
   Italian is read aloud where the browser supports it. Missed answers come back
   at the end. The finish screen shows XP and accuracy, and offers the next lesson.
   Finished lessons get a ✓ and switch to **Practice**.
9. Refresh the page: your answers and finished lessons are still there (saved in `localStorage`).
10. Reopen either sheet and use **Clear my answers** / **Clear my picks** to reset the demo.

### Save your streak

The 🔥 in the top right is the streak. It starts at 45 days, practiced
yesterday but not yet today. Finishing a lesson lights the flame and adds a day.
The **Demo controls** at the bottom let you move time forward.

1. Press **Skip to tomorrow ⏭** without doing a lesson. Instead of resetting, the
   streak goes **on hold** (❄️ frozen flame) and you have **7 days** to save it.
2. Tap **Save my streak**. There are two ways back:
   - **Invite 3 friends:** type a name, tap **Invite**, then use the dashed
     **Demo:** buttons to have each friend join and finish a lesson. Each friend
     moves through *Invited → Joined → Finished a lesson*. Friends get a free
     Streak Freeze for joining. There's also a copyable invite link.
   - **Comeback challenge:** finish a lesson on 3 different days (do a lesson,
     skip to tomorrow, repeat).
3. Either way ends in **Streak restored!** The old streak comes back, plus any
   days practiced while it was on hold (45 + 3 = 48 via the comeback route).
4. Rules: only streaks of 7+ days can be saved, once every 90 days. Shorter
   streaks, or a hold that runs out, simply end. **Reset to 45-day streak**
   starts the demo over.

### Home page and Traveler mode

The home page uses Duolingo's light theme; onboarding stays dark. It opens at
`#home`, from either start card or from **Back home** on a lesson's finish screen.

1. If you picked **Travel** with a destination during onboarding, Traveler mode is
   already on for it ("Traveler mode · Peru / Survive your first day in Cusco").
2. Otherwise, the **✈️** button sits next to the course flag, with a **NEW! Traveler mode**
   banner pointing at it. Hover the button to see the iridescent sheen that signals
   you're about to enter Traveler mode.
3. Click it (or the banner) to start Traveler mode onboarding:
   - **Where is your next destination?** Pick a city; it moves straight on.
   - **When is your flight?** Pick a timeframe, then **Continue**.
   The back arrow goes back a step (or home from the first step).
4. Back on the homepage, a rainbow wash sweeps the screen and the unit banner turns
   iridescent with your trip ("Traveler mode · Japan / Survive your first day in Tokyo").
5. Click the ✈️ button again to go back to the regular course.
6. Tap the flag to see all courses.
7. Refresh the page: your trip stays saved (in `localStorage`).

## Files

- `src/App.jsx`: the onboarding screen; switches to the home page at `#home`

- `src/ReasonsSheet.jsx`: the multi-select bottom sheet
- `src/LessonsSheet.jsx`: the "what do you want to learn first?" lesson picker
- `src/LessonPlayer.jsx`: the lesson screen (exercises, feedback, finish screen)
- `src/lessonContent.js`: words and sentences for each lesson, exercise generator
- `src/lessons.js`: lesson topics, sample phrases, suggestions per reason, localStorage helpers
- `src/streak.js`: streak rules (on hold, friend invites, comeback challenge, restore)
- `src/StreakScreens.jsx`: streak on hold, save-your-streak, restored and ended screens
- `src/TravelMap.jsx`: the zoomable travel map
- `src/destinations.js`: destinations, their languages, and each continent's zoom area
- `src/worldShapes.js`: continent outlines, smoothed into cartoon shapes
- `src/reasons.js`: reason list, Duo's personalized lines, localStorage helpers
- `src/Icons.jsx`: hand-drawn SVGs (Duo, book, compass, etc.)
- `src/index.css`: both color themes, animations, and the iridescent Traveler mode effect
- `src/home/Home.jsx`: home/learning path with the Traveler mode button and course menu
- `src/home/TravelOnboarding.jsx`: the destination and flight-date onboarding screens
- `src/home/homeData.js`: courses, destinations, flight times, path nodes, localStorage helpers
- `src/home/Icons.jsx`: hand-drawn SVGs for the home page (flame, gem, path art, nav icons, etc.)
