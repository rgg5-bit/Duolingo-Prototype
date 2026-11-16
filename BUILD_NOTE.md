# Duolingo Travel Mode — Build Note

**Live prototype:** https://rgg5-bit.github.io/Duolingo-Prototype/
**Code:** https://github.com/rgg5-bit/Duolingo-Prototype
**AI chat transcripts:** [paste link to the uploaded transcript zip(s) here]

## Core user flow

**Task: Set up Travel Mode for an upcoming trip and complete your first trip lesson.**

The user picks a language and tells Duo why they're learning (Travel). They choose a destination on an interactive map that shows roughly how many people speak the language there, then enter their trip date and length, rate their current level, and pick up to 3 lesson topics (e.g., ordering at a café, getting around). They land on the Travel Mode homepage: a trip countdown, a traveler guide, and a branching path for each chosen topic that they can take in any order. Each path has 20 beginner-friendly steps across 4 levels (lesson, typing, grammar, listening, speaking, challenges and reward chests).

## How to start (happy path)

1. Open the URL → pick **Spanish** → **Continue**.
2. Tick **Travel** → **Continue** → on the map tap **Europe → Spain → Barcelona** → **Continue**.
3. Pick a travel date → answer the remaining questions → **Start learning**.
4. On the homepage, tap a **START** lesson on any path and complete it.

Between testers, tap **Start over** (top right of the first screen, or the "For testers" panel at the bottom of the homepage).

## What's real vs. stubbed

- **Real:** onboarding questions, destination map, homepage paths and progress, lessons with graded answers (typing, listening, word order, matching), trip countdown, streak, the 📖 traveler guide (etiquette and slang), and the streak-rescue flow.
- **Stubbed or simulated:**
  - Sign-in is skipped; Travel Mode is meant for both new and existing users.
  - Progress is saved only in the tester's browser (no accounts or database).
  - Friends accepting a streak-rescue invite are simulated with "Demo" buttons, and a missed day is simulated with the "Skip to tomorrow" tester button.
  - Speech recognition works only in supporting browsers; "I said it" and "Can't speak right now" are fallbacks.
  - Speaker percentages, fun facts and guide content are sample data.
  - Other tabs, gems and non-language courses aren't built.
- **Not built yet (next steps):** AI conversations with locals, group chat and group streaks, a friend locator, and in-person destination challenges.

## AI tools

Claude Code was our primary build tool, with GitHub and GitHub Desktop to save work and deploy to GitHub Pages.

- **What worked:** turning plain-language requests into working, Duolingo-styled screens quickly, and having Claude test the whole flow end to end and fix dead ends before user testing.
- **What fought us:** two teammates built separate prototypes and then edited the same files at the same time, which caused merge conflicts when combining them. We fixed it by always pulling before working and having Claude merge both versions.
