import { useEffect, useRef } from "react";
import { FlameIcon } from "./Icons.jsx";
import { daysLeft, practicedToday, today } from "./streak.js";
import { PRESSABLE } from "./styles.js";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Whether `day` falls inside the current run of practiced days.
const practicedOn = (streak, day) =>
  streak.lastDay !== null && day <= streak.lastDay && day > streak.lastDay - streak.count;

// What the user should know right now, and what to do about it.
function status(streak) {
  if (streak.hold) {
    const left = daysLeft(streak);
    return {
      tone: "text-sky",
      icon: "❄️",
      title: `Your ${streak.hold.lost}-day streak is on hold`,
      body: `You missed a day, but you have ${left} ${left === 1 ? "day" : "days"} left to bring it back.`,
      action: "Save my streak",
    };
  }
  if (practicedToday(streak)) {
    return {
      tone: "text-owl",
      icon: "✅",
      title: "You practiced today",
      body: "Your streak is safe. Come back tomorrow to keep it going.",
      action: null,
    };
  }
  if (streak.count === 0) {
    return {
      tone: "text-fog",
      icon: "🌱",
      title: "No streak yet",
      body: "Finish a lesson today to start one.",
      action: "Start a lesson",
    };
  }
  return {
    tone: "text-bee",
    icon: "⏰",
    title: "You haven't practiced today",
    body: `Finish a lesson before midnight to keep your ${streak.count}-day streak.`,
    action: "Start a lesson",
  };
}

// Dropdown under the streak flame: count, this week, today's status, next step.
export default function StreakPopover({ streak, onAction, onClose }) {
  const ref = useRef(null);
  const s = status(streak);
  const t = today(streak);
  const week = Array.from({ length: 7 }, (_, i) => t - 6 + i);
  const shown = streak.hold ? streak.hold.lost : streak.count;
  const variant = streak.hold ? "frozen" : practicedToday(streak) ? "lit" : "off";

  useEffect(() => {
    ref.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Click anywhere else to close */}
      <div className="fixed inset-0 z-30" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-label="Your streak"
        className="absolute top-14 right-0 z-40 w-[min(320px,calc(100vw-32px))] animate-pop rounded-2xl border-2 border-line bg-ink p-4 shadow-2xl outline-none"
      >
        <span
          aria-hidden="true"
          className="absolute -top-[9px] right-6 h-4 w-4 rotate-45 border-t-2 border-l-2 border-line bg-ink"
        />

        <div className="flex items-center gap-3">
          <FlameIcon variant={variant} className="h-12 w-auto shrink-0" />
          <div>
            <p
              className={`text-[24px] leading-none font-black ${
                variant === "lit" ? "text-[#ff9600]" : variant === "frozen" ? "text-sky" : "text-snow"
              }`}
            >
              {shown} day streak
            </p>
            <p className="mt-1 text-[13px] font-bold text-fog">
              {streak.hold ? "Frozen while you save it" : "Days in a row with at least one lesson"}
            </p>
          </div>
        </div>

        {/* This week */}
        <ol className="mt-4 grid grid-cols-7 gap-1 rounded-xl bg-panel px-2 py-2.5" aria-label="This week">
          {week.map((day) => {
            const done = practicedOn(streak, day);
            const isToday = day === t;
            const label = WEEKDAYS[new Date(day * 86400000).getUTCDay()];
            return (
              <li key={day} className="flex flex-col items-center gap-1">
                <span className={`text-[11px] font-black ${isToday ? "text-snow" : "text-muted"}`}>{label}</span>
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] ${
                    done
                      ? "bg-[#ff9600] text-ink"
                      : isToday
                        ? "border-2 border-dashed border-fog"
                        : "bg-line"
                  }`}
                  aria-label={`${label}: ${done ? "practiced" : "not practiced"}`}
                >
                  {done ? "🔥" : ""}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Today */}
        <div className="mt-3 rounded-xl border-2 border-line px-3 py-2.5">
          <p className={`text-[15px] font-black ${s.tone}`}>
            <span aria-hidden="true">{s.icon}</span> {s.title}
          </p>
          <p className="mt-0.5 text-[14px] font-bold leading-snug text-fog">{s.body}</p>
        </div>

        {s.action && (
          <button
            type="button"
            onClick={onAction}
            className={`mt-3 w-full rounded-2xl py-3 text-[15px] font-black uppercase tracking-[0.08em] text-ink hover:brightness-105 ${PRESSABLE} ${
              streak.hold ? "border-sky-line bg-sky" : "border-owl border-b-owl-dark bg-owl"
            }`}
          >
            {s.action}
          </button>
        )}
      </div>
    </>
  );
}
