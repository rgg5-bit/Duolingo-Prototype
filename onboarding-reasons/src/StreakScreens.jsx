import { useEffect, useRef, useState } from "react";
import { CheckIcon, CloseIcon, FlameIcon } from "./Icons.jsx";
import {
  COMEBACK_DAYS,
  COOLDOWN_DAYS,
  FRIENDS_NEEDED,
  daysLeft,
  friendsDone,
  inviteCode,
  practicedToday,
} from "./streak.js";
import { PRESSABLE } from "./styles.js";

const PRIMARY = `${PRESSABLE} border-owl border-b-owl-dark bg-owl text-ink hover:brightness-105`;
const SECONDARY = `${PRESSABLE} border-line bg-ink text-sky hover:bg-panel/50`;
const BIG_BUTTON = "w-full rounded-2xl py-3.5 text-[16px] font-black uppercase tracking-[0.08em]";

// Full-screen layer shared by all streak screens.
function Screen({ label, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onKeyDown={(e) => e.key === "Escape" && onClose?.()}
      className="fixed inset-0 z-[60] flex justify-center overflow-y-auto bg-ink outline-none animate-fade-in"
    >
      <div className="flex min-h-full w-full max-w-[420px] flex-col px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:border-x-2 sm:border-line">
        {onClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-ml-1 w-fit rounded-xl p-1.5 text-fog outline-none hover:text-snow focus-visible:ring-4 focus-visible:ring-sky/40"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

function BigFlame({ variant, value }) {
  return (
    <div className="relative mx-auto mt-6 w-[132px] animate-pop">
      <FlameIcon variant={variant} className="h-auto w-full" />
      <span
        className={`absolute inset-x-0 bottom-[-6px] text-center text-[40px] font-black ${
          variant === "frozen" ? "text-sky" : variant === "lit" ? "text-bee" : "text-fog"
        }`}
        style={{ WebkitTextStroke: "6px var(--color-ink)", paintOrder: "stroke" }}
      >
        {value}
      </span>
    </div>
  );
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// The moment the streak breaks: it's on hold, not gone.
export function StreakOnHold({ streak, onSave, onClose }) {
  const { hold } = streak;
  return (
    <Screen label="Your streak is on hold" onClose={onClose}>
      <BigFlame variant="frozen" value={hold.lost} />
      <h2 className="mt-8 text-center text-[26px] font-black leading-tight text-snow">
        Your {hold.lost}-day streak is on hold
      </h2>
      <p className="mt-3 text-center text-[16px] font-bold leading-snug text-fog">
        Missing a day happens. We froze your streak instead of resetting it. You have{" "}
        <span className="text-sky">{plural(daysLeft(streak), "day")}</span> to bring it back.
      </p>

      <ul className="mt-7 flex flex-col gap-3">
        <li className="flex items-center gap-3 rounded-2xl border-2 border-line px-4 py-3">
          <span className="text-[26px]" aria-hidden="true">
            👯
          </span>
          <span className="text-[15px] font-extrabold leading-snug text-snow">
            Invite {FRIENDS_NEEDED} friends. Once they each finish a lesson, your streak is back.
          </span>
        </li>
        <li className="flex items-center gap-3 rounded-2xl border-2 border-line px-4 py-3">
          <span className="text-[26px]" aria-hidden="true">
            💪
          </span>
          <span className="text-[15px] font-extrabold leading-snug text-snow">
            Or do the comeback challenge: practice on {COMEBACK_DAYS} days.
          </span>
        </li>
      </ul>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <button type="button" autoFocus onClick={onSave} className={`${BIG_BUTTON} ${PRIMARY}`}>
          Save my streak
        </button>
        <button type="button" onClick={onClose} className={`${BIG_BUTTON} ${SECONDARY}`}>
          Not now
        </button>
      </div>
    </Screen>
  );
}

const STATUS = {
  invited: { text: "Invite sent · waiting for them to join", demo: "joins Duolingo", next: "joined" },
  joined: { text: "Joined! · waiting for their first lesson", demo: "finishes a lesson", next: "done" },
  done: { text: "Finished a lesson", demo: null, next: null },
};

function FriendSlot({ index, friend, onUpdate }) {
  const [name, setName] = useState("");

  if (friend.status === "empty") {
    return (
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onUpdate({ name: name.trim() || `Friend ${index + 1}`, status: "invited" });
        }}
      >
        <label htmlFor={`friend-${index}`} className="sr-only">
          Friend {index + 1} name
        </label>
        <input
          id={`friend-${index}`}
          value={name}
          maxLength={20}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Friend ${index + 1}'s name`}
          className="min-w-0 flex-1 rounded-xl border-2 border-line bg-panel px-3 py-2.5 text-[15px] font-bold text-snow placeholder:text-muted outline-none focus:border-sky-line"
        />
        <button
          type="submit"
          className={`shrink-0 rounded-xl px-4 text-[14px] font-black uppercase tracking-wide ${PRESSABLE} border-sky-line bg-sky text-ink`}
        >
          Invite
        </button>
      </form>
    );
  }

  const s = STATUS[friend.status];
  const done = friend.status === "done";
  return (
    <div className={`rounded-xl border-2 px-3 py-2.5 ${done ? "border-owl/70 bg-owl/10" : "border-line"}`}>
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[16px] font-black ${
            done ? "bg-owl text-ink" : "bg-panel text-snow"
          }`}
          aria-hidden="true"
        >
          {done ? <CheckIcon className="h-5 w-5" /> : friend.name.charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-extrabold text-snow">{friend.name}</span>
          <span className={`block text-[13px] font-bold ${done ? "text-owl" : "text-fog"}`}>{s.text}</span>
        </span>
      </div>
      {/* Steps: invited → joined → finished a lesson */}
      <div className="mt-2 flex gap-1.5" aria-hidden="true">
        {["invited", "joined", "done"].map((step, i) => (
          <span
            key={step}
            className={`h-1.5 flex-1 rounded-full ${
              ["invited", "joined", "done"].indexOf(friend.status) >= i ? "bg-owl" : "bg-line"
            }`}
          />
        ))}
      </div>
      {s.demo && (
        <button
          type="button"
          onClick={() => onUpdate({ status: s.next })}
          className="mt-2 w-full rounded-lg border-2 border-dashed border-line py-1.5 text-[12px] font-extrabold uppercase tracking-wide text-fog outline-none hover:text-snow focus-visible:ring-4 focus-visible:ring-sky/40"
        >
          Demo: {friend.name} {s.demo}
        </button>
      )}
    </div>
  );
}

// Where the user works on saving their streak.
export function StreakRescue({ streak, onFriend, onPractice, onClose }) {
  const { hold } = streak;
  const [copied, setCopied] = useState(false);
  const link = `${location.origin}${location.pathname}?invite=${inviteCode(hold)}`;
  const doneCount = friendsDone(hold);
  const left = daysLeft(streak);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Clipboard blocked: the link is still visible to copy by hand.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Screen label="Save your streak" onClose={onClose}>
      <div className="mt-2 flex items-center gap-4">
        <div className="relative w-[64px] shrink-0">
          <FlameIcon variant="frozen" className="h-auto w-full" />
        </div>
        <div>
          <h2 className="text-[24px] font-black leading-tight text-snow">Save your {hold.lost}-day streak</h2>
          <p className={`mt-1 text-[15px] font-extrabold ${left <= 2 ? "text-cardinal" : "text-sky"}`}>
            ⏳ {plural(left, "day")} left
          </p>
        </div>
      </div>

      {/* Route 1: friends */}
      <section className="mt-6 rounded-2xl border-2 border-line p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[18px] font-black text-snow">👯 Invite {FRIENDS_NEEDED} friends</h3>
          <span className="text-[14px] font-black text-owl">
            {doneCount}/{FRIENDS_NEEDED}
          </span>
        </div>
        <p className="mt-1 text-[14px] font-bold leading-snug text-fog">
          Your streak comes back when all {FRIENDS_NEEDED} join and finish their first lesson.
        </p>
        <p className="mt-2 rounded-xl bg-bee/10 px-3 py-2 text-[13px] font-extrabold text-bee">
          🎁 Friends who join get a free Streak Freeze.
        </p>

        <div className="mt-3 flex items-center gap-2 rounded-xl border-2 border-line bg-panel py-1.5 pr-1.5 pl-3">
          <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-fog">{link}</span>
          <button
            type="button"
            onClick={copyLink}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-black uppercase tracking-wide ${PRESSABLE} ${
              copied ? "border-owl bg-owl text-ink" : "border-sky-line bg-sky text-ink"
            }`}
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>

        <ul className="mt-3 flex flex-col gap-2.5">
          {hold.friends.map((f, i) => (
            <li key={i}>
              <FriendSlot index={i} friend={f} onUpdate={(changes) => onFriend(i, changes)} />
            </li>
          ))}
        </ul>
      </section>

      {/* Route 2: solo */}
      <section className="mt-4 rounded-2xl border-2 border-line p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[18px] font-black text-snow">💪 Comeback challenge</h3>
          <span className="text-[14px] font-black text-owl">
            {hold.practiceDays}/{COMEBACK_DAYS}
          </span>
        </div>
        <p className="mt-1 text-[14px] font-bold leading-snug text-fog">
          No friends handy? Finish a lesson on {COMEBACK_DAYS} different days before time runs out.
        </p>
        <div className="mt-3 flex gap-2" aria-hidden="true">
          {Array.from({ length: COMEBACK_DAYS }, (_, i) => (
            <span
              key={i}
              className={`flex h-10 flex-1 items-center justify-center rounded-xl border-2 text-[13px] font-black ${
                i < hold.practiceDays ? "border-owl bg-owl/15 text-owl" : "border-line text-muted"
              }`}
            >
              {i < hold.practiceDays ? "✓" : `Day ${i + 1}`}
            </span>
          ))}
        </div>
        {practicedToday(streak) ? (
          <p className="mt-3 rounded-xl bg-owl/10 py-2.5 text-center text-[14px] font-extrabold text-owl">
            ✓ Today counts! Come back tomorrow for the next day.
          </p>
        ) : (
          <button type="button" onClick={onPractice} className={`mt-3 ${BIG_BUTTON} ${PRIMARY}`}>
            Start today's lesson
          </button>
        )}
      </section>

      <p className="mt-4 text-center text-[12px] font-bold text-muted">
        You can save a streak once every {COOLDOWN_DAYS} days.
      </p>
    </Screen>
  );
}

const CONFETTI = ["#58cc02", "#ffc800", "#1cb0f6", "#ff4b4b", "#ce82ff", "#ff9600"];

// Celebration once the streak is back.
export function StreakRestored({ event, onClose }) {
  const names = event.friends.filter(Boolean);
  const thanks =
    event.via === "friends"
      ? `Thanks to ${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}!`
      : "You crushed the comeback challenge!";
  return (
    <Screen label="Streak restored">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 28 }, (_, i) => (
          <span
            key={i}
            className="confetti absolute top-[-20px] h-3 w-2 rounded-sm"
            style={{
              left: `${(i * 37) % 100}%`,
              background: CONFETTI[i % CONFETTI.length],
              animationDelay: `${(i % 7) * 120}ms`,
              animationDuration: `${1600 + (i % 5) * 300}ms`,
            }}
          />
        ))}
      </div>
      <div className="mt-10">
        <BigFlame variant="lit" value={event.count} />
      </div>
      <h2 className="mt-8 text-center text-[30px] font-black text-bee">Streak restored!</h2>
      <p className="mt-2 text-center text-[17px] font-extrabold text-snow">{thanks}</p>
      <p className="mt-3 text-center text-[15px] font-bold text-fog">
        Your {event.lost}-day streak is back
        {event.count > event.lost ? `, plus the ${plural(event.count - event.lost, "day")} you practiced since` : ""}.
        Keep it going today!
      </p>
      <div className="mt-auto pt-10">
        <button type="button" autoFocus onClick={onClose} className={`${BIG_BUTTON} ${PRIMARY}`}>
          Continue
        </button>
      </div>
    </Screen>
  );
}

// A short streak that reset, or a hold that ran out.
export function StreakLost({ event, onClose }) {
  const expired = event.type === "expired";
  return (
    <Screen label="Streak ended" onClose={onClose}>
      <BigFlame variant="off" value={0} />
      <h2 className="mt-8 text-center text-[26px] font-black leading-tight text-snow">
        {expired ? `Time ran out on your ${event.lost}-day streak` : `Your ${event.lost}-day streak ended`}
      </h2>
      <p className="mt-3 text-center text-[16px] font-bold leading-snug text-fog">
        Every streak starts with day one. Do a lesson today to start a new one.
      </p>
      <div className="mt-auto pt-10">
        <button type="button" autoFocus onClick={onClose} className={`${BIG_BUTTON} ${PRIMARY}`}>
          Start a new streak
        </button>
      </div>
    </Screen>
  );
}
