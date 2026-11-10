// Beginner lesson topics the user can choose to start with. `sample` is a
// phrase from that lesson, shown so users get a taste of what they'll learn.
export const LESSONS = [
  {
    id: "intro",
    emoji: "👋",
    label: "Introducing yourself",
    short: "introducing yourself",
    sample: "Ciao, mi chiamo…",
  },
  {
    id: "greetings",
    emoji: "🙋",
    label: "Greetings & goodbyes",
    short: "greetings",
    sample: "Buongiorno! Arrivederci!",
  },
  {
    id: "cafe",
    emoji: "☕",
    label: "Ordering at a café",
    short: "ordering at a café",
    sample: "Un cappuccino, per favore.",
  },
  {
    id: "restaurant",
    emoji: "🍝",
    label: "Eating at a restaurant",
    short: "eating out",
    sample: "Il conto, per favore.",
  },
  {
    id: "directions",
    emoji: "🧭",
    label: "Asking for directions",
    short: "asking for directions",
    sample: "Dov'è la stazione?",
  },
  {
    id: "hotel",
    emoji: "🏨",
    label: "Checking into a hotel",
    short: "checking into a hotel",
    sample: "Ho una prenotazione.",
  },
  {
    id: "shopping",
    emoji: "🛍️",
    label: "Shopping",
    short: "shopping",
    sample: "Quanto costa?",
  },
  {
    id: "numbers",
    emoji: "🔢",
    label: "Numbers & prices",
    short: "numbers",
    sample: "Uno, due, tre…",
  },
  {
    id: "time",
    emoji: "🕒",
    label: "Days & telling time",
    short: "telling time",
    sample: "Che ore sono?",
  },
  {
    id: "family",
    emoji: "👨‍👩‍👧",
    label: "Talking about family",
    short: "talking about family",
    sample: "Questa è mia madre.",
  },
  {
    id: "hobbies",
    emoji: "⚽",
    label: "Hobbies & small talk",
    short: "small talk",
    sample: "Mi piace il calcio.",
  },
];

export const MAX_LESSONS = 3;

// Which lessons to suggest for each "why are you learning" reason.
const SUGGESTED_BY_REASON = {
  business: ["intro", "numbers", "hobbies"],
  fun: ["cafe", "restaurant", "hobbies"],
  heritage: ["family", "greetings", "intro"],
  travel: ["cafe", "directions", "hotel"],
  school: ["intro", "numbers", "time"],
  family: ["family", "intro", "greetings"],
  brain: ["numbers", "time", "intro"],
  other: ["intro", "greetings"],
};

const byId = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

export function getLesson(id) {
  return byId[id];
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

const STORAGE_KEY = "duo-prototype:first-lessons";

export function loadLessons() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id) => byId[id]).slice(0, MAX_LESSONS);
  } catch {
    return [];
  }
}

export function saveLessons(ids) {
  try {
    if (ids.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be blocked (private mode); the in-memory state still works.
  }
}
