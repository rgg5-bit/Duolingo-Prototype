import { course, courseKey } from "./courses.js";

// Beginner lesson topics the user can choose to start with. lessonSample() is a
// phrase from that lesson in the course language, so users get a taste of it.
export const LESSONS = [
  {
    id: "intro",
    emoji: "👋",
    label: "Introducing yourself",
    short: "introducing yourself",
  },
  {
    id: "greetings",
    emoji: "🙋",
    label: "Greetings & goodbyes",
    short: "greetings",
  },
  {
    id: "cafe",
    emoji: "☕",
    label: "Ordering at a café",
    short: "ordering at a café",
  },
  {
    id: "restaurant",
    emoji: "🍝",
    label: "Eating at a restaurant",
    short: "eating out",
  },
  {
    id: "directions",
    emoji: "🧭",
    label: "Asking for directions",
    short: "asking for directions",
  },
  {
    id: "transport",
    emoji: "🚇",
    label: "Getting around",
    short: "getting around",
  },
  {
    id: "hotel",
    emoji: "🏨",
    label: "Checking into a hotel",
    short: "checking into a hotel",
  },
  {
    id: "shopping",
    emoji: "🛍️",
    label: "Shopping",
    short: "shopping",
  },
  {
    id: "numbers",
    emoji: "🔢",
    label: "Numbers & prices",
    short: "numbers",
  },
  {
    id: "time",
    emoji: "🕒",
    label: "Days & telling time",
    short: "telling time",
  },
  {
    id: "family",
    emoji: "👨‍👩‍👧",
    label: "Talking about family",
    short: "talking about family",
  },
  {
    id: "hobbies",
    emoji: "⚽",
    label: "Hobbies & small talk",
    short: "small talk",
  },
];

export const MAX_LESSONS = 3;

// Which lessons to suggest for each "why are you learning" reason.
const SUGGESTED_BY_REASON = {
  business: ["intro", "numbers", "hobbies"],
  fun: ["cafe", "restaurant", "hobbies"],
  heritage: ["family", "greetings", "intro"],
  travel: ["cafe", "transport", "directions", "hotel"],
  school: ["intro", "numbers", "time"],
  family: ["family", "intro", "greetings"],
  brain: ["numbers", "time", "intro"],
  other: ["intro", "greetings"],
};

const byId = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

export function getLesson(id) {
  return byId[id];
}

export function lessonSample(id) {
  return course().samples[id];
}

// Suggested lesson ids for the user's reasons, in priority order, no repeats.
export function suggestedLessons(reasonIds = []) {
  const out = [];
  for (const reason of reasonIds) {
    for (const id of SUGGESTED_BY_REASON[reason] ?? []) {
      if (!out.includes(id)) out.push(id);
    }
  }
  return out;
}

// Duo's line when the user picked lessons but hasn't said why they're learning.
export function lessonLine(ids) {
  return `Great! We'll start with ${byId[ids[0]].short}!`;
}

const STORAGE_KEY = () => courseKey("duo-prototype:first-lessons");

export function loadLessons() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY()));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id) => byId[id]).slice(0, MAX_LESSONS);
  } catch {
    return [];
  }
}

export function saveLessons(ids) {
  try {
    if (ids.length) localStorage.setItem(STORAGE_KEY(), JSON.stringify(ids));
    else localStorage.removeItem(STORAGE_KEY());
  } catch {
    // Storage can be blocked (private mode); the in-memory state still works.
  }
}
