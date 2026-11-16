import { practicedToday } from "./streak.js";

// Shown on the homepage instead of the sample path when the current language
// hasn't been set up yet (e.g. after switching course with the flag menu).
export function SetupCard({ langName, onSetUp }) {
  return (
    <section className="mt-6 animate-pop rounded-2xl border-2 border-b-4 border-swan bg-paper px-5 py-6 text-center">
      <p className="text-[34px] leading-none" aria-hidden="true">
        🗺️
      </p>
      <h2 className="mt-3 text-[20px] font-black text-eel">Set up {langName}</h2>
      <p className="mt-1.5 text-[15px] font-bold leading-snug text-wolf">
        Answer a few quick questions and pick your first lessons. They'll become your paths here.
      </p>
      <button
        type="button"
        onClick={onSetUp}
        className="mt-5 w-full rounded-2xl border-2 border-b-4 border-[#58a700] bg-[#58cc02] py-3.5 text-[15px] font-black uppercase tracking-[0.08em] text-white outline-none active:translate-y-[2px] active:border-b-2 focus-visible:ring-4 focus-visible:ring-macaw/30"
      >
        Get started
      </button>
    </section>
  );
}

// After the level question: explains why paths don't start at step 1.
export function PlacementNote({ text, onDismiss }) {
  return (
    <section
      role="status"
      className="mt-6 flex animate-pop items-start gap-3 rounded-2xl border-2 border-b-4 border-[#84d8ff] bg-[#ddf4ff] px-4 py-3"
    >
      <span className="text-[24px] leading-none" aria-hidden="true">
        🎯
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-black text-eel">Placed by your level</p>
        <p className="mt-0.5 text-[14px] font-bold leading-snug text-wolf">
          {text} The steps before it are marked done, but you can tap them to review anytime.
        </p>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onDismiss}
        className="rounded-lg px-1.5 text-[18px] font-black text-hare outline-none hover:text-wolf focus-visible:ring-4 focus-visible:ring-macaw/30"
      >
        ✕
      </button>
    </section>
  );
}

// Clearly labeled helpers for user-testing sessions, at the very bottom of the
// homepage: wipe everything for the next tester, or fast-forward a day to try
// the streak features.
export function TesterTools({ streak, onSkipDay, onStartOver }) {
  const practiced = practicedToday(streak);
  return (
    <section
      aria-label="Tools for testers"
      className="mt-10 mb-4 rounded-2xl border-2 border-dashed border-swan px-4 py-3"
    >
      <p className="text-[12px] font-black uppercase tracking-[0.08em] text-hare">🧪 For testers · not part of the app</p>
      <p className={`mt-1 text-[13px] font-extrabold ${practiced ? "text-[#58a700]" : "text-[#cd7900]"}`}>
        {practiced ? "✓ Practiced today: skipping keeps the streak" : "✗ Not practiced today: skipping misses a day"}
      </p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={onSkipDay}
          className="flex-1 rounded-xl border-2 border-swan py-2 text-[13px] font-extrabold text-eel outline-none hover:bg-polar focus-visible:ring-4 focus-visible:ring-macaw/30"
        >
          Skip to tomorrow ⏭
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="flex-1 rounded-xl border-2 border-swan py-2 text-[13px] font-extrabold text-[#ea2b2b] outline-none hover:bg-polar focus-visible:ring-4 focus-visible:ring-macaw/30"
        >
          Start over ↺
        </button>
      </div>
    </section>
  );
}

// Wipe every saved answer, lesson, trip and streak for the next tester.
export function startOver() {
  if (!window.confirm("Start over? This clears every answer, lesson, trip and streak on this device.")) return;
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("duo-prototype:"))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // Storage blocked: nothing saved to clear.
  }
  window.location.replace(window.location.pathname);
}
