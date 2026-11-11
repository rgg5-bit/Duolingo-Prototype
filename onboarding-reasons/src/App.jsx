import { useEffect, useRef, useState } from "react";
import {
  BackArrow,
  BookIcon,
  CheckIcon,
  CompassIcon,
  DuoOwl,
  FlameIcon,
  LessonIcon,
  ReasonIcon,
} from "./Icons.jsx";
import {
  COMEBACK_DAYS,
  FRIENDS_NEEDED,
  daysLeft,
  demoState,
  evaluate,
  friendsDone,
  loadStreak,
  nextDay,
  practice,
  practicedToday,
  saveStreak,
  updateFriend,
} from "./streak.js";
import { StreakLost, StreakOnHold, StreakRescue, StreakRestored } from "./StreakScreens.jsx";
import { getDestination, languagesFor } from "./destinations.js";
import { getLesson, lessonLine, loadLessons, saveLessons } from "./lessons.js";
import { loadCompleted, saveCompleted } from "./lessonContent.js";
import LessonPlayer from "./LessonPlayer.jsx";
import LessonsSheet from "./LessonsSheet.jsx";
import ReasonsSheet from "./ReasonsSheet.jsx";
import { duoLine, getReason, loadSelection, saveSelection } from "./reasons.js";
import { PRESSABLE } from "./styles.js";

const START_OPTIONS = [
  {
    id: "scratch",
    title: "Learning Italian for the first time?",
    subtitle: "Start from scratch!",
    Icon: BookIcon,
    badge: "RECOMMENDED",
    toast: "Starting Unit 1 from scratch…",
  },
  {
    id: "placement",
    title: "Already know some Italian?",
    subtitle: "Let's find your starting point!",
    Icon: CompassIcon,
    toast: "Loading your placement test…",
  },
];

// Which streak screen (if any) a streak event should open.
function screenFor(event) {
  if (!event) return null;
  if (event.type === "hold") return "hold";
  if (event.type === "restored" || event.type === "lost" || event.type === "expired") return event;
  return null; // "extended" shows up on the lesson's finish screen instead
}

export default function App() {
  const [selection, setSelection] = useState(loadSelection);
  const [startChoice, setStartChoice] = useState("scratch");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [lessons, setLessons] = useState(loadLessons);
  const [lessonsOpen, setLessonsOpen] = useState(false);
  const [completed, setCompleted] = useState(loadCompleted);
  const [playing, setPlaying] = useState(null); // lesson id being played
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  // Streak: check for a missed day as soon as the app opens.
  const [initialStreak] = useState(() => evaluate(loadStreak()));
  const [streak, setStreak] = useState(initialStreak.state);
  const [streakScreen, setStreakScreen] = useState(() => screenFor(initialStreak.event));

  function applyStreak({ state, event }) {
    setStreak(state);
    saveStreak(state);
    const screen = screenFor(event);
    if (screen) setStreakScreen(screen);
  }
  useEffect(() => saveStreak(initialStreak.state), [initialStreak]);

  // The reason line wins; picked lessons speak up when there's no reason yet.
  const line = !selection && lessons.length ? lessonLine(lessons) : duoLine(selection);
  // "Start from scratch" picks up at the first picked lesson not yet finished.
  const upNextId = lessons.find((id) => !completed.includes(id)) ?? lessons[0];
  const firstLesson = upNextId ? getLesson(upNextId) : null;

  function handleLessonComplete(id) {
    applyStreak(practice(streak));
    if (completed.includes(id)) return;
    const next = [...completed, id];
    setCompleted(next);
    saveCompleted(next);
  }

  // The lesson after `id` in the user's picks, if any.
  const nextAfter = (id) => (lessons.includes(id) ? lessons[lessons.indexOf(id) + 1] ?? null : null);

  // Line shown under "Lesson complete!".
  const streakNote = streak.hold
    ? `💪 Comeback challenge: ${streak.hold.practiceDays}/${COMEBACK_DAYS} days`
    : `🔥 ${streak.count}-day streak!`;

  function practiceForRescue() {
    setStreakScreen(null);
    setPlaying(upNextId ?? "intro");
  }

  function showToast(message) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function handleSave(next) {
    setSelection(next);
    saveSelection(next);
    setSheetOpen(false);
  }

  function handleLessonsSave(next) {
    setLessons(next);
    saveLessons(next);
    setLessonsOpen(false);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col px-4 pb-8 sm:border-x-2 sm:border-line">
      <header className="flex h-16 items-center justify-between">
        <button
          type="button"
          aria-label="Back"
          onClick={() => showToast("Back isn't part of this demo")}
          className="-ml-2 rounded-xl p-2 text-fog hover:text-snow focus-visible:ring-4 focus-visible:ring-sky/40 outline-none"
        >
          <BackArrow className="h-7 w-7" />
        </button>

        <button
          type="button"
          onClick={() =>
            streak.hold
              ? setStreakScreen("rescue")
              : showToast(
                  practicedToday(streak)
                    ? `🔥 ${streak.count}-day streak! You practiced today.`
                    : `Do a lesson today to keep your ${streak.count}-day streak!`,
                )
          }
          aria-label={
            streak.hold ? `${streak.hold.lost}-day streak on hold` : `${streak.count}-day streak`
          }
          className="flex items-center gap-1.5 rounded-xl px-2 py-1.5 outline-none hover:bg-panel focus-visible:ring-4 focus-visible:ring-sky/40"
        >
          <FlameIcon
            variant={streak.hold ? "frozen" : practicedToday(streak) ? "lit" : "off"}
            className="h-7 w-auto"
          />
          <span
            className={`text-[18px] font-black ${
              streak.hold ? "text-sky" : practicedToday(streak) ? "text-[#ff9600]" : "text-fog"
            }`}
          >
            {streak.hold ? streak.hold.lost : streak.count}
          </span>
        </button>
      </header>

      {/* Duo + speech bubble */}
      <section className="mt-4 flex items-center gap-4">
        <div key={`owl-${line}`} className="w-[104px] shrink-0 animate-hop">
          <DuoOwl className="h-auto w-full" />
        </div>
        <div
          key={line}
          role="status"
          aria-live="polite"
          className="relative flex-1 animate-pop rounded-2xl border-2 border-line px-4 py-3 text-[17px] font-bold leading-snug text-snow"
        >
          <span
            aria-hidden="true"
            className="absolute top-1/2 -left-[9px] h-4 w-4 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-line bg-ink"
          />
          {line}
        </div>
      </section>

      {/* Options */}
      <section className="mt-auto flex flex-col gap-4 pt-10">
        {/* New feature: a broken streak goes on hold and can be saved */}
        {streak.hold && (
          <button
            type="button"
            onClick={() => setStreakScreen("rescue")}
            className={`relative mb-2 flex items-center gap-4 rounded-2xl px-4 py-4 text-left ${PRESSABLE} border-sky-line bg-sky/10 hover:bg-sky/15`}
          >
            <span className="absolute -top-3.5 -right-1.5 rounded-lg bg-sky px-2.5 py-1 text-[13px] font-black tracking-[0.08em] text-ink">
              {daysLeft(streak)} {daysLeft(streak) === 1 ? "DAY" : "DAYS"} LEFT
            </span>
            <FlameIcon variant="frozen" className="h-14 w-auto shrink-0" />
            <span className="flex min-w-0 flex-col gap-1">
              <span className="text-[18px] font-black leading-tight text-snow">
                Your {streak.hold.lost}-day streak is on hold
              </span>
              <span className="text-[14px] font-bold text-fog">
                Friends: {friendsDone(streak.hold)}/{FRIENDS_NEEDED} · Comeback:{" "}
                {streak.hold.practiceDays}/{COMEBACK_DAYS} days
              </span>
              <span className="text-[13px] font-extrabold uppercase tracking-wide text-sky">
                Save my streak →
              </span>
            </span>
          </button>
        )}

        {/* New feature: choose your first lessons, then play them */}
        {lessons.length ? (
          <div className="relative mb-2 rounded-2xl border-2 border-b-4 border-owl/70 bg-owl/10 px-4 pt-4 pb-3">
            <span className="absolute -top-3.5 -right-1.5 rounded-lg bg-owl px-2.5 py-1 text-[13px] font-black tracking-[0.08em] text-ink">
              YOUR LESSONS
            </span>
            <div className="flex items-center gap-3">
              <LessonIcon className="h-12 w-12 shrink-0" />
              <span className="flex-1 text-[18px] font-black leading-tight text-snow">
                What do you want to learn first?
              </span>
            </div>

            <ol className="mt-3 flex flex-col gap-2">
              {lessons.map((id, i) => {
                const l = getLesson(id);
                const done = completed.includes(id);
                const isNext = id === upNextId && !done;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setPlaying(id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${PRESSABLE} ${
                        isNext ? "border-owl border-b-owl-dark bg-ink" : "border-line bg-ink hover:bg-panel/50"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[13px] font-black ${
                          done ? "bg-bee text-ink" : "bg-owl text-ink"
                        }`}
                      >
                        {done ? <CheckIcon className="h-4 w-4" /> : i + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[15px] font-extrabold text-snow">
                        {l.emoji} {l.label}
                      </span>
                      <span
                        className={`shrink-0 text-[13px] font-black uppercase tracking-wide ${
                          isNext ? "text-owl" : "text-fog"
                        }`}
                      >
                        {done ? "Practice" : "Start"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <button
              type="button"
              onClick={() => setLessonsOpen(true)}
              aria-haspopup="dialog"
              className="mt-2 w-full rounded-xl py-1.5 text-[13px] font-extrabold uppercase tracking-wide text-owl outline-none hover:brightness-110 focus-visible:ring-4 focus-visible:ring-sky/40"
            >
              Change lessons
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setLessonsOpen(true)}
            aria-haspopup="dialog"
            className={`relative mb-2 flex items-center gap-5 rounded-2xl border-dashed border-owl/70 px-5 py-4 text-left hover:bg-owl/10 ${PRESSABLE}`}
          >
            <span className="absolute -top-3.5 -right-1.5 rounded-lg bg-owl px-2.5 py-1 text-[13px] font-black tracking-[0.08em] text-ink">
              NEW
            </span>
            <LessonIcon className="h-14 w-14 shrink-0" />
            <span className="flex min-w-0 flex-col gap-1.5">
              <span className="text-[18px] font-black leading-tight text-snow">
                What do you want to learn first?
              </span>
              <span className="text-[15px] font-bold text-fog">
                Pick topics like ordering at a café or introducing yourself
              </span>
            </span>
          </button>
        )}

        {START_OPTIONS.map(({ id, title, subtitle: baseSubtitle, Icon, badge, toast: baseToast }) => {
          const selected = startChoice === id;
          // Starting from scratch begins with the user's first picked lesson.
          const custom = id === "scratch" && firstLesson;
          const subtitle = custom ? `Start with ${firstLesson.emoji} ${firstLesson.label}!` : baseSubtitle;
          const message = custom ? `Starting with ${firstLesson.emoji} ${firstLesson.label}…` : baseToast;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setStartChoice(id);
                if (custom) setPlaying(upNextId);
                else showToast(message);
              }}
              className={`relative flex items-center gap-5 rounded-2xl px-5 py-5 text-left ${PRESSABLE} ${
                selected ? "border-sky-line bg-panel" : "border-line hover:bg-panel/50"
              }`}
            >
              {badge && (
                <span className="absolute -top-3.5 -right-1.5 rounded-lg bg-sky px-2.5 py-1 text-[13px] font-black tracking-[0.08em] text-ink">
                  {badge}
                </span>
              )}
              <Icon className="h-16 w-16 shrink-0" />
              <span className="flex flex-col gap-1.5">
                <span className={`text-[19px] font-black leading-tight ${selected ? "text-sky" : "text-snow"}`}>
                  {title}
                </span>
                <span className={`text-[15px] font-bold ${selected ? "text-sky" : "text-snow/90"}`}>
                  {subtitle}
                </span>
              </span>
            </button>
          );
        })}

        {/* New feature: why are you learning? */}
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-haspopup="dialog"
          className={`relative mt-2 flex items-center gap-5 rounded-2xl border-dashed px-5 py-4 text-left ${PRESSABLE} ${
            selection ? "border-solid border-grape/70 bg-grape/10" : "border-line hover:bg-panel/50"
          }`}
        >
          <span className="absolute -top-3.5 -right-1.5 rounded-lg bg-grape px-2.5 py-1 text-[13px] font-black tracking-[0.08em] text-ink">
            {selection ? "SAVED" : "NEW"}
          </span>
          <ReasonIcon className="h-14 w-14 shrink-0" />
          <span className="flex min-w-0 flex-col gap-1.5">
            <span className="text-[18px] font-black leading-tight text-snow">
              Why are you learning Italian?
            </span>
            {selection ? (
              <>
                <span className="flex flex-wrap gap-1.5">
                  {selection.ids.map((id) => {
                    const r = getReason(id);
                    const label = id === "other" && selection.other ? selection.other : r.chip;
                    return (
                      <span
                        key={id}
                        className="max-w-full truncate rounded-full border-2 border-line bg-ink px-2.5 py-0.5 text-[13px] font-extrabold text-snow"
                      >
                        {r.emoji} {label}
                      </span>
                    );
                  })}
                </span>
                {selection.trips?.length > 0 && (
                  <span className="text-[13px] font-bold leading-snug text-fog">
                    📍 {selection.trips.map((t) => getDestination(t).name).join(", ")}
                    <br />
                    🗣️ Travel lessons in {languagesFor(selection.trips).join(", ")}
                  </span>
                )}
                <span className="text-[13px] font-extrabold uppercase tracking-wide text-grape">
                  Tap to edit
                </span>
              </>
            ) : (
              <span className="text-[15px] font-bold text-fog">
                Tell Duo so we can personalize your lessons
              </span>
            )}
          </span>
        </button>
      </section>

      {/* Prototype-only controls for testing the streak without waiting days */}
      <section
        aria-label="Demo controls"
        className="mt-8 rounded-2xl border-2 border-dashed border-line px-4 py-3"
      >
        <p className="text-[12px] font-black uppercase tracking-[0.08em] text-muted">
          Demo controls · {streak.offset === 0 ? "today" : `day +${streak.offset}`}
        </p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => {
              const missed = !practicedToday(streak);
              applyStreak(nextDay(streak));
              showToast(missed ? "Skipped a day without practicing…" : "Good morning! It's a new day.");
            }}
            className="flex-1 rounded-xl border-2 border-line py-2 text-[13px] font-extrabold text-snow outline-none hover:bg-panel focus-visible:ring-4 focus-visible:ring-sky/40"
          >
            Skip to tomorrow ⏭
          </button>
          <button
            type="button"
            onClick={() => {
              applyStreak({ state: demoState(), event: null });
              setStreakScreen(null);
              showToast("Streak reset to 45 days");
            }}
            className="flex-1 rounded-xl border-2 border-line py-2 text-[13px] font-extrabold text-fog outline-none hover:bg-panel focus-visible:ring-4 focus-visible:ring-sky/40"
          >
            Reset to 45-day streak
          </button>
        </div>
      </section>

      {lessonsOpen && (
        <LessonsSheet
          initial={lessons}
          reasonIds={selection?.ids}
          onSave={handleLessonsSave}
          onClose={() => setLessonsOpen(false)}
        />
      )}

      {playing && (
        <LessonPlayer
          key={playing}
          lessonId={playing}
          nextId={nextAfter(playing)}
          streakNote={streakNote}
          onComplete={handleLessonComplete}
          onNext={(id) => setPlaying(id)}
          onClose={() => setPlaying(null)}
        />
      )}

      {/* Streak screens wait until any lesson is closed. */}
      {!playing && streakScreen === "hold" && streak.hold && (
        <StreakOnHold
          streak={streak}
          onSave={() => setStreakScreen("rescue")}
          onClose={() => setStreakScreen(null)}
        />
      )}
      {!playing && streakScreen === "rescue" && streak.hold && (
        <StreakRescue
          streak={streak}
          onFriend={(i, changes) => applyStreak(updateFriend(streak, i, changes))}
          onPractice={practiceForRescue}
          onClose={() => setStreakScreen(null)}
        />
      )}
      {!playing && streakScreen?.type === "restored" && (
        <StreakRestored event={streakScreen} onClose={() => setStreakScreen(null)} />
      )}
      {!playing && (streakScreen?.type === "lost" || streakScreen?.type === "expired") && (
        <StreakLost event={streakScreen} onClose={() => setStreakScreen(null)} />
      )}

      {sheetOpen && (
        <ReasonsSheet
          initial={selection}
          onSave={handleSave}
          onClose={() => setSheetOpen(false)}
        />
      )}

      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed inset-x-0 bottom-6 z-40 mx-auto w-fit max-w-[calc(100%-32px)] animate-pop rounded-2xl border-2 border-line bg-panel px-4 py-2.5 text-[15px] font-extrabold text-snow shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
