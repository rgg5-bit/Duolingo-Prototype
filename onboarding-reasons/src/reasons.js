import { isDestination, tripPhrase } from "./destinations.js";

// Each reason has a short chip label, a solo speech-bubble line, and a
// fragment used when several reasons are combined ("ready for X and Y").
export const REASONS = [
  {
    id: "business",
    emoji: "💼",
    label: "Business / career",
    chip: "Career",
    line: "Let's get you ready for the boardroom!",
    fragment: "the boardroom",
  },
  {
    id: "fun",
    emoji: "🎉",
    label: "For fun",
    chip: "Fun",
    line: "Let's make Italian your new favorite hobby!",
    fragment: "some fun",
  },
  {
    id: "heritage",
    emoji: "🔄",
    label: "Refreshing my native/heritage language",
    chip: "Heritage",
    line: "Let's reconnect you with your roots!",
    fragment: "reconnecting with your roots",
  },
  {
    id: "travel",
    emoji: "✈️",
    label: "Travel",
    chip: "Travel",
    line: "Let's get you ready for your trip to Italy!",
    fragment: "travel",
  },
  {
    id: "school",
    emoji: "🎓",
    label: "School / education",
    chip: "School",
    line: "Let's help you ace your Italian class!",
    fragment: "the classroom",
  },
  {
    id: "family",
    emoji: "❤️",
    label: "Connecting with family, friends, or a partner",
    chip: "Loved ones",
    line: "Let's help you connect with the people you love!",
    fragment: "chatting with loved ones",
  },
  {
    id: "brain",
    emoji: "🧠",
    label: "Brain training / personal growth",
    chip: "Brain training",
    line: "Let's give your brain a great workout!",
    fragment: "a brain workout",
  },
  {
    id: "other",
    emoji: "✨",
    label: "Other",
    chip: "Other",
    line: "Let's build a path that fits your goals!",
    fragment: "your goals",
  },
];

export const DEFAULT_LINE = "Now let's find the best place to start!";

const byId = Object.fromEntries(REASONS.map((r) => [r.id, r]));

export function getReason(id) {
  return byId[id];
}

export function duoLine(selection) {
  const ids = selection?.ids ?? [];
  const trips = selection?.trips ?? [];
  if (ids.length === 0) return DEFAULT_LINE;

  // Travel gets specific once the user has picked destinations on the map.
  const lineFor = (id) =>
    id === "travel" && trips.length
      ? `Let's get you ready for your trip to ${tripPhrase(trips)}!`
      : byId[id].line;
  const fragmentFor = (id) =>
    id === "travel" && trips.length ? `your trip to ${tripPhrase(trips)}` : byId[id].fragment;

  if (ids.length === 1) return `Great! ${lineFor(ids[0])}`;

  const parts = ids.slice(0, 2).map(fragmentFor);
  const tail = ids.length > 2 ? `, ${parts[1]}, and more` : ` and ${parts[1]}`;
  return `Great choices! Let's get you ready for ${parts[0]}${tail}!`;
}

const STORAGE_KEY = "duo-prototype:learning-reasons";

export function loadSelection() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!parsed || !Array.isArray(parsed.ids)) return null;
    const ids = parsed.ids.filter((id) => byId[id]);
    const trips = Array.isArray(parsed.trips) ? parsed.trips.filter(isDestination) : [];
    return ids.length ? { ids, other: String(parsed.other ?? ""), trips } : null;
  } catch {
    return null;
  }
}

export function saveSelection(selection) {
  try {
    if (selection) localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be blocked (private mode); the in-memory state still works.
  }
}
