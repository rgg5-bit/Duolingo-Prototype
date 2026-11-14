import { project } from "./worldShapes.js";

// Rough share of people (native + fluent/conversational speakers) who speak each
// course language, per country and per city. These are approximate figures for
// the prototype, gathered from census and survey estimates; check them before
// presenting them as facts. Languages: es, fr, de, it, ja (see courses.js).
// A city inherits its country's numbers for any language it doesn't list.
//
// City ids match traveler-mode's DESTINATIONS where the city exists there, so
// the homepage's Traveler mode banner names the right place.

const RAW = [
  // ---------- Europe ----------
  {
    id: "spain", name: "Spain", emoji: "🥘", region: "europe", at: [-3.7, 40.2],
    speak: { es: 99, fr: 12, de: 2, it: 2, ja: 0.1 },
    cities: [
      { id: "madrid", name: "Madrid", at: [-3.7, 40.4], speak: { fr: 14 } },
      { id: "barcelona", name: "Barcelona", at: [2.17, 41.39], speak: { es: 98, fr: 14 } },
      { id: "seville", name: "Seville", at: [-5.98, 37.39], speak: { fr: 9 } },
    ],
  },
  {
    id: "france", name: "France", emoji: "🥐", region: "europe", at: [2.5, 46.6],
    speak: { fr: 98, es: 13, de: 6, it: 5, ja: 0.2 },
    cities: [
      { id: "paris", name: "Paris", at: [2.35, 48.86], speak: { es: 15, de: 7, ja: 0.5 } },
      { id: "lyon", name: "Lyon", at: [4.84, 45.76], speak: { it: 6 } },
      { id: "nice", name: "Nice", at: [7.27, 43.7], speak: { fr: 97, it: 9 } },
    ],
  },
  {
    id: "germany", name: "Germany", emoji: "🥨", region: "europe", at: [10.4, 51.1],
    speak: { de: 96, fr: 14, es: 4, it: 3, ja: 0.1 },
    cities: [
      { id: "berlin", name: "Berlin", at: [13.4, 52.52], speak: { de: 93, es: 6, ja: 0.3 } },
      { id: "munich", name: "Munich", at: [11.58, 48.14], speak: { de: 95, it: 5 } },
      { id: "hamburg", name: "Hamburg", at: [9.99, 53.55], speak: { de: 95 } },
    ],
  },
  {
    id: "italy", name: "Italy", emoji: "🍕", region: "europe", at: [12.6, 42.8],
    speak: { it: 97, fr: 11, es: 6, de: 5, ja: 0.1 },
    cities: [
      { id: "rome", name: "Rome", at: [12.5, 41.9], speak: { it: 98 } },
      { id: "milan", name: "Milan", at: [9.19, 45.46], speak: { fr: 14 } },
      { id: "florence", name: "Florence", at: [11.26, 43.77] },
    ],
  },
  {
    id: "switzerland", name: "Switzerland", emoji: "🏔️", region: "europe", at: [8.2, 46.8],
    speak: { de: 62, fr: 23, it: 8, es: 3, ja: 0.1 },
    cities: [
      { id: "zurich", name: "Zurich", at: [8.54, 47.37], speak: { de: 85, fr: 20 } },
      { id: "geneva", name: "Geneva", at: [6.14, 46.2], speak: { fr: 80, de: 10 } },
      { id: "lugano", name: "Lugano", at: [8.95, 46.0], speak: { it: 85, de: 20 } },
    ],
  },
  {
    id: "austria", name: "Austria", emoji: "🎻", region: "europe", at: [14.5, 47.5],
    speak: { de: 98, fr: 10, it: 8, es: 3, ja: 0.1 },
    cities: [
      { id: "vienna", name: "Vienna", at: [16.37, 48.21], speak: { de: 92 } },
      { id: "salzburg", name: "Salzburg", at: [13.05, 47.81], speak: { de: 97 } },
    ],
  },
  {
    id: "belgium", name: "Belgium", emoji: "🧇", region: "europe", at: [4.5, 50.6],
    speak: { fr: 45, de: 20, es: 4, it: 3, ja: 0.1 },
    cities: [
      { id: "brussels", name: "Brussels", at: [4.35, 50.85], speak: { fr: 88, de: 8 } },
      { id: "liege", name: "Liège", at: [5.57, 50.63], speak: { fr: 98, de: 15 } },
    ],
  },
  {
    id: "portugal", name: "Portugal", emoji: "🐓", region: "europe", at: [-8.2, 39.6],
    speak: { es: 10, fr: 15, de: 3, it: 2, ja: 0.1 },
    cities: [
      { id: "lisbon", name: "Lisbon", at: [-9.14, 38.72], speak: { es: 12, fr: 17 } },
      { id: "porto", name: "Porto", at: [-8.61, 41.15], speak: { es: 9 } },
    ],
  },
  {
    id: "uk", name: "United Kingdom", emoji: "💂", region: "europe", at: [-2, 53],
    speak: { fr: 15, es: 6, de: 6, it: 2, ja: 0.2 },
    cities: [
      { id: "london", name: "London", at: [-0.13, 51.51], speak: { es: 8, it: 3, ja: 0.5 } },
      { id: "edinburgh", name: "Edinburgh", at: [-3.19, 55.95], speak: { fr: 13 } },
    ],
  },

  // ---------- Asia ----------
  {
    id: "japan", name: "Japan", emoji: "🍣", region: "asia", at: [138, 36.5],
    speak: { ja: 99, es: 0.2, fr: 0.3, de: 0.2, it: 0.1 },
    cities: [
      { id: "tokyo", name: "Tokyo", at: [139.69, 35.69] },
      { id: "kyoto", name: "Kyoto", at: [135.77, 35.01] },
      { id: "osaka", name: "Osaka", at: [135.5, 34.69] },
      { id: "sapporo", name: "Sapporo", at: [141.35, 43.06] },
    ],
  },
  {
    id: "korea", name: "South Korea", emoji: "🥢", region: "asia", at: [127.8, 36.3],
    speak: { ja: 3, fr: 0.3, de: 0.3, es: 0.3, it: 0.1 },
    cities: [
      { id: "seoul", name: "Seoul", at: [126.98, 37.57], speak: { ja: 4 } },
      { id: "busan", name: "Busan", at: [129.08, 35.18], speak: { ja: 4 } },
    ],
  },
  {
    id: "china", name: "China", emoji: "🐼", region: "asia", at: [108, 34],
    speak: { ja: 0.5, fr: 0.1, de: 0.1, es: 0.1, it: 0.1 },
    cities: [
      { id: "beijing", name: "Beijing", at: [116.4, 39.9] },
      { id: "shanghai", name: "Shanghai", at: [121.47, 31.23], speak: { ja: 1 } },
    ],
  },
  {
    id: "thailand", name: "Thailand", emoji: "🛕", region: "asia", at: [101, 15],
    speak: { ja: 0.5, fr: 0.2, de: 0.2, es: 0.1, it: 0.1 },
    cities: [{ id: "bangkok", name: "Bangkok", at: [100.5, 13.75], speak: { ja: 1 } }],
  },

  // ---------- Africa ----------
  {
    id: "morocco", name: "Morocco", emoji: "🕌", region: "africa", at: [-7, 31.8],
    speak: { fr: 35, es: 5, de: 0.5, it: 0.5, ja: 0.1 },
    cities: [
      { id: "casablanca", name: "Casablanca", at: [-7.59, 33.57], speak: { fr: 50 } },
      { id: "marrakech", name: "Marrakech", at: [-7.99, 31.63] },
      { id: "tangier", name: "Tangier", at: [-5.81, 35.76], speak: { es: 20 } },
    ],
  },
  {
    id: "senegal", name: "Senegal", emoji: "🥁", region: "africa", at: [-14.5, 14.5],
    speak: { fr: 26, es: 0.2, de: 0.1, it: 0.3, ja: 0.1 },
    cities: [{ id: "dakar", name: "Dakar", at: [-17.44, 14.69], speak: { fr: 45 } }],
  },

  // ---------- North America ----------
  {
    id: "canada", name: "Canada", emoji: "🍁", region: "namerica", at: [-80, 50],
    speak: { fr: 29, es: 2, de: 1, it: 1, ja: 0.2 },
    cities: [
      { id: "montreal", name: "Montréal", at: [-73.57, 45.5], speak: { fr: 93 } },
      { id: "quebec", name: "Québec City", at: [-71.21, 46.81], speak: { fr: 99 } },
      { id: "toronto", name: "Toronto", at: [-79.38, 43.65], speak: { fr: 9, it: 3 } },
      { id: "vancouver", name: "Vancouver", at: [-123.12, 49.28], speak: { fr: 7, ja: 1 } },
    ],
  },
  {
    id: "usa", name: "United States", emoji: "🗽", region: "namerica", at: [-98, 39],
    speak: { es: 13, fr: 1, de: 0.4, it: 0.2, ja: 0.1 },
    cities: [
      { id: "newyork", name: "New York", at: [-74, 40.71], speak: { es: 24, fr: 2, it: 0.8 } },
      { id: "miami", name: "Miami", at: [-80.19, 25.76], speak: { es: 70 } },
      { id: "losangeles", name: "Los Angeles", at: [-118.24, 34.05], speak: { es: 42, ja: 0.4 } },
    ],
  },
  {
    id: "mexico", name: "Mexico", emoji: "🌮", region: "namerica", at: [-102, 23.6],
    speak: { es: 98, fr: 0.5, de: 0.2, it: 0.2, ja: 0.1 },
    cities: [
      { id: "mexico", name: "Mexico City", at: [-99.13, 19.43], speak: { es: 99 } },
      { id: "cancun", name: "Cancún", at: [-86.85, 21.16], speak: { es: 99 } },
      { id: "guadalajara", name: "Guadalajara", at: [-103.35, 20.66], speak: { es: 99 } },
    ],
  },
  {
    id: "cuba", name: "Cuba", emoji: "🌴", region: "namerica", at: [-79, 21.5],
    speak: { es: 99, fr: 0.2, de: 0.1, it: 0.2, ja: 0.1 },
    cities: [{ id: "havana", name: "Havana", at: [-82.37, 23.11] }],
  },
  {
    id: "costarica", name: "Costa Rica", emoji: "🦥", region: "namerica", at: [-84, 9.9],
    speak: { es: 99, fr: 0.3, de: 0.3, it: 0.2, ja: 0.1 },
    cities: [{ id: "sanjose", name: "San José", at: [-84.09, 9.93] }],
  },

  // ---------- South America ----------
  {
    id: "colombia", name: "Colombia", emoji: "☕", region: "samerica", at: [-73, 4],
    speak: { es: 99, fr: 0.3, de: 0.1, it: 0.1, ja: 0.1 },
    cities: [
      { id: "bogota", name: "Bogotá", at: [-74.07, 4.71] },
      { id: "medellin", name: "Medellín", at: [-75.56, 6.25] },
      { id: "cartagena", name: "Cartagena", at: [-75.51, 10.39] },
    ],
  },
  {
    id: "peru", name: "Peru", emoji: "🦙", region: "samerica", at: [-75, -9.2],
    speak: { es: 84, fr: 0.2, de: 0.1, it: 0.1, ja: 0.1 },
    cities: [
      { id: "lima", name: "Lima", at: [-77.04, -12.05], speak: { es: 95 } },
      { id: "cusco", name: "Cusco", at: [-71.97, -13.53], speak: { es: 70 } },
    ],
  },
  {
    id: "argentina", name: "Argentina", emoji: "💃", region: "samerica", at: [-64, -34],
    speak: { es: 99, it: 1, fr: 0.3, de: 0.3, ja: 0.1 },
    cities: [
      { id: "buenosaires", name: "Buenos Aires", at: [-58.38, -34.6], speak: { it: 2 } },
      { id: "mendoza", name: "Mendoza", at: [-68.84, -32.89] },
    ],
  },
  {
    id: "chile", name: "Chile", emoji: "🌶️", region: "samerica", at: [-71, -35],
    speak: { es: 99, fr: 0.3, de: 0.3, it: 0.1, ja: 0.1 },
    cities: [{ id: "santiago", name: "Santiago", at: [-70.67, -33.45] }],
  },
  {
    id: "brazil", name: "Brazil", emoji: "⚽", region: "samerica", at: [-51, -10],
    speak: { es: 3, fr: 0.5, de: 0.3, it: 0.3, ja: 0.2 },
    cities: [
      { id: "saopaulo", name: "São Paulo", at: [-46.63, -23.55], speak: { ja: 1, it: 0.5 } },
      { id: "rio", name: "Rio de Janeiro", at: [-43.2, -22.9], speak: { es: 4 } },
    ],
  },

  // ---------- Oceania ----------
  {
    id: "australia", name: "Australia", emoji: "🦘", region: "oceania", at: [134, -25],
    speak: { it: 1, es: 0.6, ja: 0.4, de: 0.4, fr: 0.3 },
    cities: [
      { id: "sydney", name: "Sydney", at: [151.2, -33.87], speak: { ja: 0.7 } },
      { id: "melbourne", name: "Melbourne", at: [144.96, -37.81], speak: { it: 2 } },
    ],
  },
  {
    id: "newzealand", name: "New Zealand", emoji: "🥝", region: "oceania", at: [172, -41],
    speak: { fr: 0.5, de: 0.4, ja: 0.3, es: 0.3, it: 0.1 },
    cities: [{ id: "auckland", name: "Auckland", at: [174.76, -36.85] }],
  },
  {
    id: "newcaledonia", name: "New Caledonia", emoji: "🐠", region: "oceania", at: [165.6, -21.3],
    speak: { fr: 97, ja: 0.3, es: 0.1, de: 0.1, it: 0.1 },
    cities: [{ id: "noumea", name: "Nouméa", at: [166.46, -22.27], speak: { fr: 99 } }],
  },
];

const withXY = (o) => {
  const [x, y] = project(o.at);
  return { ...o, x, y };
};

export const COUNTRIES = RAW.map((c) => ({
  ...withXY(c),
  cities: c.cities.map((city) => ({ ...withXY(city), speak: { ...c.speak, ...city.speak }, country: c.id })),
}));

const byId = Object.fromEntries(COUNTRIES.map((c) => [c.id, c]));
const cityById = Object.fromEntries(COUNTRIES.flatMap((c) => c.cities.map((city) => [city.id, city])));

export const getCountry = (id) => byId[id];
export const getCity = (id) => cityById[id];

// "97%", or "<1%" for tiny numbers.
export function percent(value) {
  if (value == null) return "<1%";
  if (value < 1) return "<1%";
  return `${Math.round(value)}%`;
}

// Color for a speaker share: lots, some, few, very few.
export function heat(value = 0) {
  if (value >= 50) return { fill: "#58cc02", lip: "#46a302", text: "#fff", label: "Most people" };
  if (value >= 10) return { fill: "#ffc800", lip: "#d1a100", text: "#4b4b4b", label: "Many people" };
  if (value >= 1) return { fill: "#ff9600", lip: "#cc7800", text: "#fff", label: "Some people" };
  return { fill: "#e5e5e5", lip: "#b9c8cf", text: "#777", label: "Very few people" };
}

// Camera box [x, y, w, h] around a country and its cities, at the map's 8:5 aspect.
export function countryBox(country) {
  const pts = [country, ...country.cities];
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const w = Math.max((Math.max(...xs) - Math.min(...xs)) * 1.9, (Math.max(...ys) - Math.min(...ys)) * 1.9 * 1.6, 44);
  const h = w / 1.6;
  // Nudge up a little: pins and labels stand above their point.
  return [cx - w / 2, cy - h / 2 - h * 0.08, w, h];
}
