import { DESTINATIONS } from "../../traveler-mode/src/homeData.js";
import { daysUntil, TRIP_LENGTHS } from "./OnboardingQuestions.jsx";

// Days a "how long will you stay?" answer roughly covers, for "You're in X — day 3".
const STAY_DAYS = { weekend: 3, week: 7, "2weeks": 14, month: 30, moving: 3650 };

const fmtDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

// Homepage card in Traveler mode: how long until the trip, and how ready you are.
export default function TripCountdown({ trip, lessonsDone, lessonsTotal, onSetDate }) {
  const dest = DESTINATIONS.find((d) => d.id === trip.destination);
  const city = trip.city || dest?.city || "your trip";
  const stay = TRIP_LENGTHS.find((l) => l.id === trip.length);
  const days = trip.date ? daysUntil(trip.date) : null;

  // Headline + big number for each stage of the trip.
  let big;
  let title;
  let sub;
  if (days === null) {
    big = "✈️";
    title = `Trip to ${city}`;
    sub = "Add your travel date to start the countdown.";
  } else if (days > 1) {
    big = days;
    title = `days until ${city}`;
    sub = `${fmtDate(trip.date)}${stay ? ` · ${stay.label.toLowerCase()}` : ""}`;
  } else if (days === 1) {
    big = 1;
    title = `day until ${city}!`;
    sub = "Tomorrow! One more lesson before you pack? 🧳";
  } else if (days === 0) {
    big = "🛫";
    title = `Today's the day!`;
    sub = `Have an amazing trip to ${city}!`;
  } else if (-days < (STAY_DAYS[trip.length] ?? 7)) {
    big = `Day ${-days + 1}`;
    title = `in ${city}`;
    sub = "You're there! Practice a phrase before heading out.";
  } else {
    big = "🏠";
    title = `Welcome back from ${city}!`;
    sub = "Keep your streak going, or plan your next trip.";
  }

  // The little plane flies from "today" toward the destination as the date gets closer
  // (measured from when the trip was planned; 30 days if we don't know).
  const sincePlanned = trip.setOn ? -daysUntil(trip.setOn) : null;
  const total = days > 0 ? (sincePlanned !== null ? Math.max(days + sincePlanned, 1) : Math.max(days, 30)) : 1;
  const progress = days === null ? 0 : days <= 0 ? 1 : 1 - days / total;
  const ready = lessonsTotal ? Math.round((lessonsDone / lessonsTotal) * 100) : 0;

  return (
    <section
      aria-label="Trip countdown"
      className="mt-2 mb-3 animate-pop overflow-hidden rounded-2xl border-2 border-b-4 border-swan bg-paper"
    >
      <div className="flex items-center gap-3 px-4 pt-3.5">
        <span
          className={`shrink-0 font-black leading-none text-macaw ${typeof big === "number" ? "text-[44px]" : "text-[30px]"}`}
        >
          {big}
        </span>
        <div className="min-w-0">
          <p className="text-[17px] font-black leading-tight text-eel">{title}</p>
          <p className="mt-0.5 text-[13px] font-bold text-wolf">{sub}</p>
        </div>
      </div>

      {/* Flight path: today → destination */}
      {days !== null && days > 0 && (
        <div className="relative mx-4 mt-3 h-6" aria-hidden="true">
          <span className="absolute top-1/2 right-3 left-1 border-t-[3px] border-dotted border-swan" />
          <span className="absolute top-1/2 left-0 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-macaw" />
          <span className="absolute top-1/2 right-0 -translate-y-1/2 text-[16px]">📍</span>
          <span
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-[18px] transition-[left] duration-700"
            style={{ left: `calc(${Math.min(0.92, Math.max(0.06, progress)) * 100}%)` }}
          >
            ✈️
          </span>
        </div>
      )}

      <div className="mt-3 flex items-center gap-3 border-t-2 border-swan bg-polar px-4 py-2.5">
        {days === null ? (
          <button
            type="button"
            onClick={onSetDate}
            className="w-full rounded-xl border-2 border-b-4 border-whale bg-macaw py-2 text-[14px] font-black uppercase tracking-wide text-white outline-none active:translate-y-[2px] active:border-b-2 focus-visible:ring-4 focus-visible:ring-macaw/30"
          >
            📅 Add travel date
          </button>
        ) : (
          <>
            <span className="text-[13px] font-extrabold whitespace-nowrap text-wolf">Trip-ready</span>
            <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-swan">
              <span
                className="block h-full rounded-full bg-[#58cc02] transition-[width] duration-500"
                style={{ width: `${Math.max(ready, 3)}%` }}
              />
            </span>
            <span className="text-[13px] font-black whitespace-nowrap text-eel">
              {lessonsDone}/{lessonsTotal} lessons
            </span>
          </>
        )}
      </div>
    </section>
  );
}
