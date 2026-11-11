// Streak + "save your streak" logic. Pure functions: each takes the streak
// state and returns { state, event } so the UI can react (show a screen).
//
// Days are whole numbers (days since 1970 in local time) plus a demo offset,
// so the prototype can "skip to tomorrow" without waiting a real day.

export const HOLD_DAYS = 7; // time to save a streak once it's on hold
export const MIN_STREAK = 7; // shorter streaks just reset
export const COOLDOWN_DAYS = 90; // one rescue per 90 days
export const FRIENDS_NEEDED = 3;
export const COMEBACK_DAYS = 3; // solo route: practice on 3 days

// Friend invite statuses, in order.
export const FRIEND_STEPS = ["empty", "invited", "joined", "done"];

const DEMO_STREAK = 45;
const STORAGE_KEY = "duo-prototype:streak";

function realDay() {
  const now = new Date();
  return Math.floor((now.getTime() - now.getTimezoneOffset() * 60000) / 86400000);
}

export function today(state) {
  return realDay() + state.offset;
}

// Fresh demo: a 45-day streak, last practiced yesterday (not yet today).
export function demoState(offset = 0) {
  const s = { count: DEMO_STREAK, lastDay: null, offset, hold: null, lastRescue: null };
  s.lastDay = today(s) - 1;
  return s;
}

export const practicedToday = (state) => state.lastDay === today(state);
export const daysLeft = (state) => (state.hold ? state.hold.deadline - today(state) + 1 : 0);
export const friendsDone = (hold) => hold.friends.filter((f) => f.status === "done").length;

function newHold(lost, day) {
  return {
    lost,
    start: day,
    deadline: day + HOLD_DAYS - 1,
    practiceDays: 0,
    friends: Array.from({ length: FRIENDS_NEEDED }, () => ({ name: "", status: "empty" })),
  };
}

// Check for a broken streak or an expired hold. Run on load and each new day.
export function evaluate(state) {
  const t = today(state);
  let s = state;
  let event = null;

  if (s.hold && t > s.hold.deadline) {
    event = { type: "expired", lost: s.hold.lost };
    s = { ...s, hold: null };
  }

  const missed = s.lastDay !== null && t - s.lastDay > 1 && s.count > 0;
  if (missed) {
    const canRescue =
      !s.hold &&
      s.count >= MIN_STREAK &&
      (s.lastRescue === null || t - s.lastRescue >= COOLDOWN_DAYS);
    if (canRescue) {
      event = { type: "hold", lost: s.count };
      s = { ...s, count: 0, hold: newHold(s.count, t) };
    } else {
      // During a hold the new streak can still break; it just restarts.
      event = event ?? { type: "lost", lost: s.count };
      s = { ...s, count: 0 };
    }
  }
  return { state: s, event };
}

function restore(state, via) {
  const { hold } = state;
  const count = hold.lost + state.count;
  const t = today(state);
  // Fill in the missed days: the streak continues as if they practiced yesterday,
  // so it stays alive today and grows with the next lesson.
  const lastDay = Math.max(state.lastDay ?? t - 1, t - 1);
  return {
    state: { ...state, count, lastDay, hold: null, lastRescue: t },
    event: { type: "restored", via, lost: hold.lost, count, friends: hold.friends.map((f) => f.name) },
  };
}

// Record a finished lesson.
export function practice(state) {
  const t = today(state);
  if (state.lastDay === t) return { state, event: null };

  const count = state.lastDay === t - 1 ? state.count + 1 : 1;
  let s = { ...state, count, lastDay: t };
  if (s.hold) {
    s = { ...s, hold: { ...s.hold, practiceDays: s.hold.practiceDays + 1 } };
    if (s.hold.practiceDays >= COMEBACK_DAYS) return restore(s, "comeback");
  }
  return { state: s, event: { type: "extended", count } };
}

// Update one friend slot; restores the streak when the last friend finishes a lesson.
export function updateFriend(state, index, changes) {
  if (!state.hold) return { state, event: null };
  const friends = state.hold.friends.map((f, i) => (i === index ? { ...f, ...changes } : f));
  const s = { ...state, hold: { ...state.hold, friends } };
  if (friendsDone(s.hold) >= FRIENDS_NEEDED) return restore(s, "friends");
  return { state: s, event: null };
}

// Demo: jump to tomorrow.
export function nextDay(state) {
  return evaluate({ ...state, offset: state.offset + 1 });
}

// A shareable code for the invite link, e.g. "SAVE45-K3QZ".
export function inviteCode(hold) {
  const rand = Math.abs((hold.start * 9301 + hold.lost * 49297) % 233280)
    .toString(36)
    .toUpperCase()
    .padStart(4, "X")
    .slice(0, 4);
  return `SAVE${hold.lost}-${rand}`;
}

export function loadStreak() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && typeof parsed.count === "number" && typeof parsed.offset === "number") {
      return { hold: null, lastRescue: null, lastDay: null, ...parsed };
    }
  } catch {
    // fall through to a fresh demo streak
  }
  return demoState();
}

export function saveStreak(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be blocked (private mode); the in-memory state still works.
  }
}
