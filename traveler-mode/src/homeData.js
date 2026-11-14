// Courses shown in the flag dropdown. The selected one is saved (loadCourse).
export const COURSES = [
  { id: "fr", name: "French", flag: ["#1cb0f6", "#ffffff", "#ff4b4b"], xp: 6 },
  { id: "es", name: "Spanish", flag: ["#ff4b4b", "#ffc800", "#ff4b4b"], horizontal: true },
  { id: "it", name: "Italian", flag: ["#58cc02", "#ffffff", "#ff4b4b"] },
  { id: "de", name: "German", flag: ["#4b4b4b", "#ff4b4b", "#ffc800"], horizontal: true },
  { id: "ja", name: "Japanese", flag: ["#ffffff"], dot: "#ff4b4b" },
];

// Unit banner text for the regular course. In Traveler mode the banner is built
// from the trip (see travelUnit).
export const STANDARD_UNIT = { section: "SECTION 1, UNIT 3", title: "Talk about your family" };

// Traveler mode onboarding, step 1: "Where is your next destination?"
export const DESTINATIONS = [
  { id: "paris", city: "Paris", country: "France", flag: "🇫🇷", language: "French", cheer: "Bon voyage !" },
  { id: "barcelona", city: "Barcelona", country: "Spain", flag: "🇪🇸", language: "Spanish", cheer: "¡Buen viaje!" },
  { id: "mexico", city: "Mexico City", country: "Mexico", flag: "🇲🇽", language: "Spanish", cheer: "¡Buen viaje!" },
  { id: "rome", city: "Rome", country: "Italy", flag: "🇮🇹", language: "Italian", cheer: "Buon viaggio!" },
  { id: "tokyo", city: "Tokyo", country: "Japan", flag: "🇯🇵", language: "Japanese", cheer: "いってらっしゃい!" },
  { id: "berlin", city: "Berlin", country: "Germany", flag: "🇩🇪", language: "German", cheer: "Gute Reise!" },
  { id: "lisbon", city: "Lisbon", country: "Portugal", flag: "🇵🇹", language: "Portuguese", cheer: "Boa viagem!" },
  { id: "seoul", city: "Seoul", country: "South Korea", flag: "🇰🇷", language: "Korean", cheer: "즐거운 여행 되세요!" },
  // More cities per language, so the combined onboarding's "Where are you going?" has real choices.
  { id: "montreal", city: "Montréal", country: "Canada", flag: "🇨🇦", language: "French", cheer: "Bon voyage !" },
  { id: "nice", city: "Nice", country: "France", flag: "🇫🇷", language: "French", cheer: "Bon voyage !" },
  { id: "madrid", city: "Madrid", country: "Spain", flag: "🇪🇸", language: "Spanish", cheer: "¡Buen viaje!" },
  { id: "buenosaires", city: "Buenos Aires", country: "Argentina", flag: "🇦🇷", language: "Spanish", cheer: "¡Buen viaje!" },
  { id: "florence", city: "Florence", country: "Italy", flag: "🇮🇹", language: "Italian", cheer: "Buon viaggio!" },
  { id: "milan", city: "Milan", country: "Italy", flag: "🇮🇹", language: "Italian", cheer: "Buon viaggio!" },
  { id: "kyoto", city: "Kyoto", country: "Japan", flag: "🇯🇵", language: "Japanese", cheer: "いってらっしゃい!" },
  { id: "osaka", city: "Osaka", country: "Japan", flag: "🇯🇵", language: "Japanese", cheer: "いってらっしゃい!" },
  { id: "munich", city: "Munich", country: "Germany", flag: "🇩🇪", language: "German", cheer: "Gute Reise!" },
  { id: "vienna", city: "Vienna", country: "Austria", flag: "🇦🇹", language: "German", cheer: "Gute Reise!" },
];

// Step 2: "When is your flight?"
export const FLIGHT_TIMES = [
  { id: "week", emoji: "⏰", label: "This week", short: "this week" },
  { id: "2w", emoji: "📅", label: "In 1–2 weeks", short: "in 2 weeks" },
  { id: "month", emoji: "🗓️", label: "In 3–4 weeks", short: "in a month" },
  { id: "3m", emoji: "🧳", label: "In 1–3 months", short: "in a few months" },
  { id: "later", emoji: "🌍", label: "More than 3 months away", short: "later this year" },
  { id: "unbooked", emoji: "🤔", label: "I haven't booked yet", short: "someday soon" },
];

export function travelUnit(trip) {
  // Trips from the combined app's map can be any city; they carry their own names.
  const dest =
    DESTINATIONS.find((d) => d.id === trip.destination) ??
    (trip.city ? { city: trip.city, country: trip.country } : DESTINATIONS[0]);
  return {
    section: `TRAVELER MODE · ${dest.country.toUpperCase()}`,
    title: `Survive your first day in ${dest.city}`,
  };
}

// Node "kind" drives styling: done → gold coin, current → practice node with a
// progress ring, locked → grey.
export const NODES = [
  { kind: "done", label: "Completed lesson" },
  { kind: "current", label: "Practice" },
  { kind: "locked", label: "Lesson" },
  { kind: "locked", label: "Lesson" },
  { kind: "locked", label: "Lesson" },
  { kind: "chest", label: "Reward chest" },
  { kind: "locked", label: "Unit review" },
];

// Zig-zag offsets (px) for the winding lesson path, matching the real app.
export const PATH_OFFSETS = [0, -44, -66, -44, 0, 44, 66];

const COURSE_KEY = "duo-prototype:course";

export function loadCourse() {
  try {
    const id = localStorage.getItem(COURSE_KEY);
    return COURSES.some((c) => c.id === id) ? id : COURSES[0].id;
  } catch {
    return COURSES[0].id;
  }
}

export function saveCourse(id) {
  try {
    localStorage.setItem(COURSE_KEY, id);
  } catch {
    // Storage can be blocked (private mode); the in-memory state still works.
  }
}

const TRAVEL_KEY = "duo-prototype:travel-mode";

// The saved trip ({ destination, flight }) doubles as the on/off flag: null means off.
export function loadTrip() {
  try {
    const trip = JSON.parse(localStorage.getItem(TRAVEL_KEY));
    return trip?.destination ? trip : null;
  } catch {
    return null;
  }
}

export function saveTrip(trip) {
  try {
    if (trip) localStorage.setItem(TRAVEL_KEY, JSON.stringify(trip));
    else localStorage.removeItem(TRAVEL_KEY);
  } catch {
    // Storage can be blocked (private mode); the in-memory state still works.
  }
}
