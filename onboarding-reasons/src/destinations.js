import { project } from "./worldShapes.js";

export const COURSE_LANGUAGE = "Italian";

// Each region's camera box is [x, y, width, height] in map units, all at the
// same 8:5 aspect as the map frame so zooming never distorts.
export const REGIONS = {
  world: { name: "World", vb: [-10, -104, 1020, 637.5] },
  europe: { name: "Europe", vb: [445, 65, 170, 106.25], label: [22, 60], fill: "#ce82ff", lip: "#a463d1" },
  asia: { name: "Asia", vb: [686, 98, 230, 143.75], label: [95, 52], fill: "#ff86d0", lip: "#d665aa" },
  africa: { name: "Africa", vb: [380, 145, 336, 210], label: [20, 6], fill: "#ff9600", lip: "#cc7800" },
  namerica: { name: "North America", short: "N. America", vb: [125, 79, 260, 162.5], label: [-102, 50], fill: "#ffc800", lip: "#d1a100" },
  samerica: { name: "South America", short: "S. America", vb: [170, 200, 320, 200], label: [-60, -10], fill: "#58cc02", lip: "#46a302" },
  oceania: { name: "Oceania", vb: [790, 253, 220, 137.5], label: [134, -24], fill: "#ff4b4b", lip: "#d13636" },
};

export const REGION_ORDER = ["europe", "asia", "africa", "namerica", "samerica", "oceania"];

// Pin positions are nudged apart where real cities would overlap at pin size.
const RAW = [
  { id: "italy", region: "europe", emoji: "🍕", name: "Italy", city: "Rome", at: [12.8, 42], languages: ["Italian"] },
  { id: "spain", region: "europe", emoji: "🥘", name: "Spain", city: "Madrid", at: [-3.7, 40], languages: ["Spanish"] },
  { id: "france", region: "europe", emoji: "🥐", name: "France", city: "Paris", at: [2.3, 48], languages: ["French"] },
  { id: "uk", region: "europe", emoji: "💂", name: "United Kingdom", city: "London", at: [-2, 53], languages: ["English"] },
  { id: "germany", region: "europe", emoji: "🥨", name: "Germany", city: "Berlin", at: [13.4, 52.5], languages: ["German"] },
  { id: "switzerland", region: "europe", emoji: "🏔️", name: "Switzerland", city: "Bern", at: [7.5, 46], languages: ["German", "French", "Italian"] },
  { id: "portugal", region: "europe", emoji: "🐓", name: "Portugal", city: "Lisbon", at: [-8.5, 39], languages: ["Portuguese"] },
  { id: "greece", region: "europe", emoji: "🏛️", name: "Greece", city: "Athens", at: [23.7, 38], languages: ["Greek"] },
  { id: "turkey", region: "europe", emoji: "🧿", name: "Türkiye", city: "Istanbul", at: [29, 41], languages: ["Turkish"] },

  { id: "japan", region: "asia", emoji: "🍣", name: "Japan", city: "Tokyo", at: [139.7, 35.7], languages: ["Japanese"] },
  { id: "korea", region: "asia", emoji: "🥢", name: "South Korea", city: "Seoul", at: [127, 37.5], languages: ["Korean"] },
  { id: "china", region: "asia", emoji: "🐼", name: "China", city: "Beijing", at: [116.4, 39.9], languages: ["Chinese"] },
  { id: "india", region: "asia", emoji: "🐘", name: "India", city: "New Delhi", at: [77, 28.6], languages: ["Hindi", "English"] },
  { id: "thailand", region: "asia", emoji: "🛕", name: "Thailand", city: "Bangkok", at: [100.5, 13.7], languages: ["Thai"] },
  { id: "vietnam", region: "asia", emoji: "🍜", name: "Vietnam", city: "Hanoi", at: [105.8, 21], languages: ["Vietnamese"] },

  { id: "egypt", region: "africa", emoji: "🐪", name: "Egypt", city: "Cairo", at: [31.2, 30], languages: ["Arabic"] },
  { id: "morocco", region: "africa", emoji: "🕌", name: "Morocco", city: "Marrakech", at: [-8, 31.6], languages: ["Arabic", "French"] },
  { id: "kenya", region: "africa", emoji: "🦁", name: "Kenya", city: "Nairobi", at: [36.8, -1.3], languages: ["Swahili", "English"] },
  { id: "south-africa", region: "africa", emoji: "🦓", name: "South Africa", city: "Cape Town", at: [18.4, -33.9], languages: ["Zulu", "Afrikaans", "English"] },

  { id: "canada", region: "namerica", emoji: "🍁", name: "Canada", city: "Montréal", at: [-72, 50], languages: ["English", "French"] },
  { id: "usa", region: "namerica", emoji: "🗽", name: "United States", city: "New York", at: [-76, 40], languages: ["English"] },
  { id: "mexico", region: "namerica", emoji: "🌮", name: "Mexico", city: "Mexico City", at: [-99, 19.4], languages: ["Spanish"] },
  { id: "cuba", region: "namerica", emoji: "🌴", name: "Cuba", city: "Havana", at: [-82.4, 23.1], languages: ["Spanish"] },
  { id: "costa-rica", region: "namerica", emoji: "🦥", name: "Costa Rica", city: "San José", at: [-84, 9.9], languages: ["Spanish"] },

  { id: "colombia", region: "samerica", emoji: "☕", name: "Colombia", city: "Bogotá", at: [-74, 4.7], languages: ["Spanish"] },
  { id: "peru", region: "samerica", emoji: "🦙", name: "Peru", city: "Cusco", at: [-72, -13.5], languages: ["Spanish", "Quechua"] },
  { id: "brazil", region: "samerica", emoji: "⚽", name: "Brazil", city: "Rio de Janeiro", at: [-43.2, -22.9], languages: ["Portuguese"] },
  { id: "argentina", region: "samerica", emoji: "💃", name: "Argentina", city: "Buenos Aires", at: [-58.4, -34.6], languages: ["Spanish"] },

  { id: "australia", region: "oceania", emoji: "🦘", name: "Australia", city: "Sydney", at: [151.2, -33.9], languages: ["English"] },
  { id: "new-zealand", region: "oceania", emoji: "🥝", name: "New Zealand", city: "Auckland", at: [174.8, -36.8], languages: ["English", "Māori"] },
];

export const DESTINATIONS = RAW.map((d) => {
  const [x, y] = project(d.at);
  return { ...d, x, y };
});

const byId = Object.fromEntries(DESTINATIONS.map((d) => [d.id, d]));

export function getDestination(id) {
  return byId[id];
}

export function isDestination(id) {
  return id in byId;
}

// Unique languages across the chosen trips, the course language first.
export function languagesFor(tripIds) {
  const set = new Set(tripIds.flatMap((id) => byId[id]?.languages ?? []));
  return [...set].sort((a, b) => (b === COURSE_LANGUAGE) - (a === COURSE_LANGUAGE));
}

export function tripPhrase(tripIds) {
  const names = tripIds.map((id) => byId[id].name);
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]}, ${names[1]}, and more`;
}
