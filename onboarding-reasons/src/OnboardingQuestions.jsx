import { useMemo } from "react";
import { BackArrow, CheckIcon, DuoOwl } from "./Icons.jsx";
import TripMap from "./TripMap.jsx";
import { course, courseKey } from "./courses.js";
import { LESSONS, MAX_LESSONS, lessonSample, suggestedLessons } from "./lessons.js";
import { REASONS } from "./reasons.js";
import { PRESSABLE } from "./styles.js";

// Step-by-step onboarding for the combined app (team draft, phase 1):
//   why → [travel only: where → when → how long] → how much you know → what first.

export const TRIP_LENGTHS = [
  { id: "weekend", emoji: "🧳", label: "A weekend" },
  { id: "week", emoji: "📅", label: "About a week" },
  { id: "2weeks", emoji: "🗓️", label: "Two weeks" },
  { id: "month", emoji: "🌙", label: "A month or more" },
  { id: "moving", emoji: "🏡", label: "I'm moving there" },
];

const LEVELS = [
  { id: 0, label: "I'm new to {lang}", hint: "This is my first time learning it" },
  { id: 1, label: "I know some common words", hint: "Hello, thank you, yes, no…" },
  { id: 2, label: "I can have basic conversations", hint: "Introductions, ordering food" },
  { id: 3, label: "I can talk about various topics", hint: "Plans, opinions, stories" },
  { id: 4, label: "I can discuss most topics in detail", hint: "I'm fairly confident" },
];

const LEVEL_KEY = () => courseKey("duo-prototype:level");

export function loadLevel() {
  try {
    const v = localStorage.getItem(LEVEL_KEY());
    return v === null ? null : Number(v);
  } catch {
    return null;
  }
}

export function saveLevel(level) {
  try {
    localStorage.setItem(LEVEL_KEY(), String(level));
  } catch {
    // Storage blocked: fine for a demo.
  }
}

// Days from today until an ISO date (yyyy-mm-dd), in local time.
export function daysUntil(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const trip = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((trip - today) / 86400000);
}

export const todayIso = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
};

function Bars({ level }) {
  return (
    <span className="flex h-7 items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-[6px] rounded-sm ${i < level ? "bg-sky" : "bg-line"}`}
          style={{ height: `${8 + i * 6}px` }}
        />
      ))}
    </span>
  );
}

function Option({ selected, onClick, role = "radio", children, className = "" }) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left ${PRESSABLE} ${
        selected ? "border-sky-line bg-panel" : "border-line hover:bg-panel/50"
      } ${className}`}
    >
      {children}
    </button>
  );
}

const optionText = (selected) => `text-[17px] font-extrabold leading-snug ${selected ? "text-sky" : "text-snow"}`;

export const EMPTY_DRAFT = {
  reasons: [],
  destination: null, // city id from speakers.js
  destCity: "",
  destCountry: "",
  date: "",
  unbooked: false,
  length: null,
  level: null,
  lessons: [],
};

// Answers (`draft`) and the current step live in main.jsx, so going back to
// this screen, or back a step with the phone's back button, keeps them.
export default function OnboardingQuestions({ draft, onDraft, step: rawStep, onStep, onBack, onDone }) {
  const lang = course().name;

  const { reasons, destination, destCity, destCountry, date, unbooked, length, level, lessons } = draft;
  const update = (changes) => onDraft({ ...draft, ...changes });
  const setLength = (v) => update({ length: v });
  const setLevel = (v) => update({ level: v });

  const traveling = reasons.includes("travel");
  const steps = ["why", ...(traveling ? ["where", "when", "length"] : []), "level", "first"];
  const step = Math.min(rawStep, steps.length - 1);
  const current = steps[step];

  const suggested = useMemo(() => suggestedLessons(reasons), [reasons]);
  const lessonList = useMemo(
    () => [
      ...suggested.map((id) => LESSONS.find((l) => l.id === id)),
      ...LESSONS.filter((l) => !suggested.includes(l.id)),
    ],
    [suggested],
  );

  const days = date ? daysUntil(date) : null;

  const QUESTIONS = {
    why: `Why are you learning ${lang}?`,
    where: "Where are you going?",
    when: destCity ? `When is your trip to ${destCity}?` : "When is your trip?",
    length: "How long will you stay?",
    level: `How much ${lang} do you know?`,
    first: "What do you want to learn first?",
  };

  const ready = {
    why: reasons.length > 0,
    where: Boolean(destination),
    when: unbooked || (date && days >= 0),
    length: Boolean(length),
    level: level !== null,
    first: lessons.length > 0,
  }[current];

  function toggleReason(id) {
    update({ reasons: reasons.includes(id) ? reasons.filter((x) => x !== id) : [...reasons, id] });
  }

  function toggleLesson(id) {
    if (lessons.includes(id)) update({ lessons: lessons.filter((x) => x !== id) });
    else if (lessons.length < MAX_LESSONS) update({ lessons: [...lessons, id] });
  }

  function next() {
    if (!ready) return;
    if (step < steps.length - 1) {
      onStep(step + 1);
      window.scrollTo(0, 0);
      return;
    }
    onDone({
      reasons: REASONS.map((r) => r.id).filter((id) => reasons.includes(id)),
      trip: traveling
        ? { destination, city: destCity, country: destCountry, date: unbooked ? null : date, length }
        : null,
      level,
      lessons,
    });
  }

  // Every step is its own history entry (see main.jsx), so back just goes back.
  const back = onBack;

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[420px] flex-col bg-ink sm:border-x-2 sm:border-line">
      {/* Back + progress */}
      <header className="flex h-16 shrink-0 items-center gap-4 px-4">
        <button
          type="button"
          aria-label="Back"
          onClick={back}
          className="-ml-1 rounded-xl p-1.5 text-fog outline-none hover:text-snow focus-visible:ring-4 focus-visible:ring-sky/40"
        >
          <BackArrow className="h-7 w-7" />
        </button>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
          className="h-4 flex-1 overflow-hidden rounded-full bg-line"
        >
          <div
            className="h-full rounded-full bg-owl transition-[width] duration-500 ease-out"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          >
            <div className="mx-2 mt-[3px] h-[4px] rounded-full bg-white/30" />
          </div>
        </div>
      </header>

      {/* Duo asks */}
      <section key={`q-${current}`} className="flex shrink-0 animate-pop items-center gap-4 px-4 pb-4">
        <div className="w-[84px] shrink-0">
          <DuoOwl className="h-auto w-full" />
        </div>
        <div className="relative flex-1 rounded-2xl border-2 border-line px-4 py-3 text-[18px] font-bold leading-snug text-snow">
          <span
            aria-hidden="true"
            className="absolute top-1/2 -left-[9px] h-4 w-4 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-line bg-ink"
          />
          <h1>{QUESTIONS[current]}</h1>
        </div>
      </section>

      <main key={current} className="flex-1 animate-pop overflow-y-auto border-t-2 border-line px-4 pt-5 pb-6">
        {current === "why" && (
          <ul className="flex flex-col gap-2.5" aria-label={QUESTIONS.why}>
            {REASONS.map((r) => {
              const selected = reasons.includes(r.id);
              const travel = r.id === "travel";
              return (
                <li key={r.id}>
                  <Option
                    role="checkbox"
                    selected={selected}
                    onClick={() => toggleReason(r.id)}
                    className={travel && !selected ? "border-sky-line/60" : ""}
                  >
                    <span className="text-[24px]" aria-hidden="true">
                      {r.emoji}
                    </span>
                    <span className="flex-1">
                      <span className={optionText(selected)}>{r.label}</span>
                      {travel && (
                        <span className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] font-bold text-fog">
                          <span className="whitespace-nowrap rounded-md bg-sky px-1.5 py-0.5 text-[11px] font-black tracking-[0.06em] text-ink">
                            ✈️ TRAVELER MODE
                          </span>
                          Lessons for your trip
                        </span>
                      )}
                    </span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 ${
                        selected ? "border-sky bg-sky text-ink" : "border-line text-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  </Option>
                </li>
              );
            })}
          </ul>
        )}

        {current === "where" && (
          <TripMap
            lang={course().id}
            langName={lang}
            value={destination}
            onChange={({ id, city, country }) => update({ destination: id, destCity: city, destCountry: country })}
          />
        )}

        {current === "when" && (
          <div className="flex flex-col gap-3">
            <label
              htmlFor="trip-date"
              className={`flex items-center gap-4 rounded-2xl border-2 border-b-4 px-4 py-3.5 ${
                date && !unbooked ? "border-sky-line bg-panel" : "border-line"
              }`}
            >
              <span className="text-[24px]" aria-hidden="true">
                🛫
              </span>
              <span className="flex-1">
                <span className="block text-[14px] font-extrabold text-fog">Travel date</span>
                <input
                  id="trip-date"
                  type="date"
                  min={todayIso()}
                  value={date}
                  onChange={(e) => update({ date: e.target.value, unbooked: false })}
                  className="mt-1 w-full bg-transparent text-[18px] font-extrabold text-snow outline-none [color-scheme:light]"
                />
              </span>
            </label>
            {date && !unbooked && days !== null && (
              <p className={`px-1 text-[15px] font-extrabold ${days >= 0 ? "text-owl" : "text-cardinal"}`}>
                {days < 0
                  ? "That date has already passed."
                  : days === 0
                    ? "That's today! Let's get you ready fast. ✈️"
                    : `That's ${days} day${days === 1 ? "" : "s"} away. We'll count down with you! ⏳`}
              </p>
            )}
            <Option
              selected={unbooked}
              onClick={() => update({ unbooked: true, date: "" })}
            >
              <span className="text-[24px]" aria-hidden="true">
                🤔
              </span>
              <span className={optionText(unbooked)}>I haven't booked yet</span>
            </Option>
          </div>
        )}

        {current === "length" && (
          <ul role="radiogroup" aria-label={QUESTIONS.length} className="flex flex-col gap-2.5">
            {TRIP_LENGTHS.map((l) => (
              <li key={l.id}>
                <Option selected={length === l.id} onClick={() => setLength(l.id)}>
                  <span className="text-[24px]" aria-hidden="true">
                    {l.emoji}
                  </span>
                  <span className={optionText(length === l.id)}>{l.label}</span>
                </Option>
              </li>
            ))}
          </ul>
        )}

        {current === "level" && (
          <ul role="radiogroup" aria-label={QUESTIONS.level} className="flex flex-col gap-2.5">
            {LEVELS.map((l) => (
              <li key={l.id}>
                <Option selected={level === l.id} onClick={() => setLevel(l.id)}>
                  <Bars level={l.id} />
                  <span>
                    <span className={`block ${optionText(level === l.id)}`}>{l.label.replace("{lang}", lang)}</span>
                    <span className="block text-[14px] font-bold text-fog">{l.hint}</span>
                  </span>
                </Option>
              </li>
            ))}
          </ul>
        )}

        {current === "first" && (
          <>
            <p className="mb-3 text-[15px] font-bold text-fog">
              Pick up to {MAX_LESSONS}. Each one becomes a path on your home screen.
            </p>
            <ul className="flex flex-col gap-2.5" aria-label={QUESTIONS.first}>
              {lessonList.map((l) => {
                const pos = lessons.indexOf(l.id);
                const selected = pos !== -1;
                const dimmed = lessons.length >= MAX_LESSONS && !selected;
                return (
                  <li key={l.id}>
                    <Option
                      role="checkbox"
                      selected={selected}
                      onClick={() => toggleLesson(l.id)}
                      className={dimmed ? "opacity-50" : ""}
                    >
                      <span className="text-[24px]" aria-hidden="true">
                        {l.emoji}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2">
                          <span className={optionText(selected)}>{l.label}</span>
                          {suggested.includes(l.id) && (
                            <span className="rounded-md bg-grape/20 px-1.5 py-0.5 text-[11px] font-black tracking-[0.06em] text-grape">
                              {traveling && suggestedLessons(["travel"]).includes(l.id) ? "FOR YOUR TRIP" : "FOR YOU"}
                            </span>
                          )}
                        </span>
                        <span className="block text-[14px] font-bold italic text-fog">“{lessonSample(l.id)}”</span>
                      </span>
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 text-[14px] font-black ${
                          selected ? "border-sky bg-sky text-ink" : "border-line text-transparent"
                        }`}
                        aria-hidden="true"
                      >
                        {selected ? pos + 1 : ""}
                      </span>
                    </Option>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </main>

      <footer className="shrink-0 border-t-2 border-line px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={!ready}
          onClick={next}
          className={`w-full rounded-2xl py-3.5 text-[16px] font-black uppercase tracking-[0.08em] ${
            ready
              ? `${PRESSABLE} border-owl border-b-owl-dark bg-owl text-ink hover:brightness-105`
              : "cursor-not-allowed border-2 border-b-4 border-line bg-line text-muted"
          }`}
        >
          {current === "first" ? "Start learning" : "Continue"}
        </button>
      </footer>
    </div>
  );
}
