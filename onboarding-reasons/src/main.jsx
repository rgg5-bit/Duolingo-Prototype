import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Home from "../../traveler-mode/src/Home.jsx";
import { DESTINATIONS, loadCourse, loadTrip, saveCourse, saveTrip } from "../../traveler-mode/src/homeData.js";
import App from "./App.jsx";
import BranchTrail from "./BranchTrail.jsx";
import CoursePicker from "./CoursePicker.jsx";
import { setCourse } from "./courses.js";
import { factCountry, factsFor } from "./facts.js";
import { getCountry } from "./speakers.js";
import HomeStreak from "./HomeStreak.jsx";
import { loadLessons, saveLessons } from "./lessons.js";
import OnboardingQuestions, { EMPTY_DRAFT, daysUntil, loadLevel, saveLevel, todayIso } from "./OnboardingQuestions.jsx";
import { loadSelection, saveSelection } from "./reasons.js";
import { evaluate, loadStreak, saveStreak } from "./streak.js";
import { StreakLost, StreakOnHold } from "./StreakScreens.jsx";
import { buildTrail, markPracticed } from "./trail.js";
import TripCountdown from "./TripCountdown.jsx";
import "./index.css";

// One app for both prototypes (team draft, phase 1 → phase 2):
//   1. "What would you like to learn?" (pick a language)
//   2. step-by-step questions: why → (if Travel: where, when, how long) →
//      how much you know → what to learn first
//   3. the homepage trail, which branches into one path per picked lesson
//      (Lesson → Practice → Reward) so users choose where to go next.

// The homepage's Traveler mode expects a rough "flight" bucket; derive it from the date.
function flightBucket(date) {
  if (!date) return "unbooked";
  const days = daysUntil(date);
  if (days <= 7) return "week";
  if (days <= 14) return "2w";
  if (days <= 31) return "month";
  if (days <= 92) return "3m";
  return "later";
}

function saveAnswers({ reasons, trip, level, lessons }) {
  saveSelection({ ids: reasons, other: "", trips: [] });
  saveLessons(lessons);
  saveLevel(level);
  // Turning Traveler mode on (or off) for the homepage. setOn lets the countdown's
  // plane start at the beginning of its path on the day the trip was planned.
  saveTrip(trip ? { ...trip, flight: flightBucket(trip.date), setOn: todayIso() } : null);
}

// Rebuild the question answers from what's saved (e.g. to jump to "When is your trip?").
function draftFromSaved() {
  const trip = loadTrip();
  const reasons = loadSelection()?.ids ?? [];
  const dest = trip && DESTINATIONS.find((d) => d.id === trip.destination);
  return {
    ...EMPTY_DRAFT,
    reasons: reasons.includes("travel") ? reasons : [...reasons, "travel"],
    destination: trip?.destination ?? null,
    destCity: trip?.city ?? dest?.city ?? "",
    destCountry: trip?.country ?? dest?.country ?? "",
    date: trip?.date ?? "",
    length: trip?.length ?? null,
    level: loadLevel(),
    lessons: loadLessons(),
  };
}
const START = { screen: "courses", step: 0, launch: null, depth: 0 };

function Root() {
  // Where we are. Every screen (and every question step) is a browser history
  // entry, so in-app back buttons and the phone's back gesture both backtrack.
  const [nav, setNav] = useState(START);
  const { screen, step, launch } = nav; // launch: { id, mode: "lesson" | "practice" } from the trail
  const [draft, setDraft] = useState(EMPTY_DRAFT); // question answers, kept while going back and forth
  const [courseId, setCourseId] = useState(() => {
    const id = loadCourse();
    setCourse(id);
    return id;
  });

  useEffect(() => {
    window.history.replaceState(START, "");
    const onPop = (e) => setNav(e.state ?? START);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function go(next) {
    const entry = { step: 0, launch: null, ...next, depth: nav.depth + 1 };
    window.history.pushState(entry, "");
    setNav(entry);
  }

  function back() {
    if (nav.depth > 0) window.history.back();
  }

  // The homepage is light; the course picker and onboarding are dark.
  useEffect(() => {
    document.body.classList.toggle("light-page", screen === "home");
    window.scrollTo(0, 0);
  }, [screen, step]);

  function chooseCourse(id) {
    if (id !== courseId) setDraft(EMPTY_DRAFT); // cities and lessons differ per language
    setCourse(id);
    saveCourse(id);
    setCourseId(id);
  }

  // First-time visitors start with nothing selected.
  const hasChosen = (() => {
    try {
      return localStorage.getItem("duo-prototype:course") !== null;
    } catch {
      return false;
    }
  })();

  function openOnboarding(next = null) {
    go({ screen: "onboarding", launch: next });
  }

  // A lesson opened from the trail (or the lessons screen) returns to the trail.
  function backToTrail(finished) {
    if (finished && launch?.mode === "practice") markPracticed(launch.id);
    back();
  }

  // Streak on the homepage: check for a missed day whenever the homepage opens.
  // A broken 7+ day streak goes on hold here too (same rules as onboarding).
  const [streakAlert, setStreakAlert] = useState(null); // "hold" | lost/expired event
  const [, redraw] = useState(0);
  useEffect(() => {
    if (screen !== "home") return;
    const { state, event } = evaluate(loadStreak());
    saveStreak(state);
    redraw((n) => n + 1); // show the checked streak in the top bar
    if (event?.type === "hold") setStreakAlert("hold");
    else if (event?.type === "lost" || event?.type === "expired") setStreakAlert(event);
  }, [screen]);

  // "Start a lesson" from the streak panel: the next open lesson on the trail.
  function startNextLesson(trail) {
    const next =
      trail?.branches.find((b) => b.steps[0].state === "open") ??
      trail?.branches.find((b) => b.steps[1].state === "open");
    if (!next) return openOnboarding();
    openOnboarding({ id: next.id, mode: next.steps[0].state === "open" ? "lesson" : "practice" });
  }

  function saveStreakFromHome() {
    setStreakAlert(null);
    go({ screen: "onboarding", rescue: true });
  }

  if (screen === "courses") {
    return (
      <CoursePicker
        initial={hasChosen ? courseId : null}
        onContinue={(id) => {
          chooseCourse(id);
          go({ screen: "questions", step: 0 });
        }}
        // First screen: back is shown only if there's somewhere to go back to.
        onBack={nav.depth > 0 ? back : undefined}
        onClose={() => go({ screen: "home" })}
      />
    );
  }

  if (screen === "questions") {
    return (
      <OnboardingQuestions
        key={courseId}
        draft={draft}
        onDraft={setDraft}
        step={step}
        onStep={(n) => go({ screen: "questions", step: n })}
        onBack={back}
        onDone={(answers) => {
          saveAnswers(answers);
          go({ screen: "home" });
        }}
      />
    );
  }

  if (screen === "onboarding") {
    return (
      <App
        // Remount per course and per launch so saved answers reload for that course.
        key={`${courseId}-${launch ? `${launch.id}-${launch.mode}` : nav.rescue ? "rescue" : "onboarding"}`}
        startLesson={launch?.id ?? null}
        openStreak={nav.rescue ? "rescue" : null}
        onBack={back}
        onLessonsDone={backToTrail}
      />
    );
  }

  const trail = buildTrail();
  const streak = loadStreak();
  const trip = loadTrip();
  return (
    <>
    <Home
      streakSlot={
        <HomeStreak
          streak={streak}
          onAction={() => (streak.hold ? saveStreakFromHome() : startNextLesson(trail))}
        />
      }
      travelSlot={
        trip && (
          <TripCountdown
            trip={trip}
            lessonsDone={trail?.finishedLessons ?? 0}
            lessonsTotal={trail?.branches.length ?? 0}
            onSetDate={() => {
              // Jump straight to "When is your trip?" with everything else filled in.
              setDraft(draftFromSaved());
              go({ screen: "questions", step: 2 });
            }}
          />
        )
      }
      renderPath={
        trail
          ? ({ showToast }) => (
              <BranchTrail
                trail={trail}
                facts={factsFor()}
                factPlace={getCountry(factCountry())?.name}
                showToast={showToast}
                onPlay={(id, mode) => openOnboarding({ id, mode })}
                onPickMore={() => openOnboarding()}
              />
            )
          : undefined
      }
      onBack={back}
      onCourseChange={chooseCourse}
      onStartOnboarding={(id) => {
        // The homepage's ✈️ button: go through the questions to set up a trip,
        // with Travel already ticked.
        chooseCourse(id);
        setDraft((d) => (d.reasons.includes("travel") ? d : { ...d, reasons: [...d.reasons, "travel"] }));
        go({ screen: "questions", step: 0 });
      }}
    />
    {streakAlert === "hold" && streak.hold && (
      <StreakOnHold streak={streak} onSave={saveStreakFromHome} onClose={() => setStreakAlert(null)} />
    )}
    {streakAlert && streakAlert !== "hold" && (
      <StreakLost event={streakAlert} onClose={() => setStreakAlert(null)} />
    )}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
